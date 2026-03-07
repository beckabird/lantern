-- Lantern auction app schema
-- Run this in the Supabase SQL Editor before starting the app.

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  username       text not null,
  wicks_balance  integer not null default 50 check (wicks_balance >= 0),
  city           text,
  bio            text,
  avatar_url     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─── auctions ────────────────────────────────────────────────────────────────
create table if not exists public.auctions (
  id             uuid primary key default gen_random_uuid(),
  host_id        uuid not null references public.profiles(user_id) on delete cascade,
  title          text not null,
  description    text,
  starting_bid   integer not null default 1 check (starting_bid >= 1),
  current_bid    integer not null default 0,
  winner_id      uuid references public.profiles(user_id),
  ends_at        timestamptz not null,
  vibe           text,
  created_at     timestamptz not null default now()
);

-- ─── bids ────────────────────────────────────────────────────────────────────
create table if not exists public.bids (
  id             uuid primary key default gen_random_uuid(),
  auction_id     uuid not null references public.auctions(id) on delete cascade,
  bidder_id      uuid not null references public.profiles(user_id) on delete cascade,
  amount         integer not null check (amount >= 1),
  created_at     timestamptz not null default now()
);

create index if not exists bids_auction_id_idx on public.bids(auction_id);
create index if not exists bids_bidder_id_idx  on public.bids(bidder_id);

-- ─── wick_transactions ───────────────────────────────────────────────────────
create table if not exists public.wick_transactions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(user_id) on delete cascade,
  amount         integer not null,   -- positive = credit, negative = debit
  type           text not null check (type in ('bid_placed','bid_refunded','bid_won','purchase','admin_adjust')),
  reference_id   uuid,               -- auction_id or bid_id
  created_at     timestamptz not null default now()
);

create index if not exists wick_tx_user_id_idx on public.wick_transactions(user_id, created_at desc);

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.auctions        enable row level security;
alter table public.bids            enable row level security;
alter table public.wick_transactions enable row level security;

-- profiles
create policy "profiles_select" on public.profiles
  for select using (true);

create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = user_id);

-- auctions
create policy "auctions_select" on public.auctions
  for select using (true);

create policy "auctions_insert" on public.auctions
  for insert with check (auth.uid() = host_id);

create policy "auctions_update_host" on public.auctions
  for update using (auth.uid() = host_id);

-- bids
create policy "bids_select" on public.bids
  for select using (true);

-- bids are only placed via the place_bid_atomic RPC (security definer)

-- wick_transactions
create policy "wick_transactions_select" on public.wick_transactions
  for select using (auth.uid() = user_id);

-- ─── place_bid_atomic RPC ────────────────────────────────────────────────────
-- Atomically:
--   1. Validates the auction is still open and the bid is higher than current.
--   2. Refunds the previous high bidder.
--   3. Deducts wicks from the new bidder.
--   4. Inserts the new bid and updates auctions.current_bid.
--   5. Records wick_transactions for both the debit and the refund.
create or replace function public.place_bid_atomic(
  p_auction_id uuid,
  p_bidder_id  uuid,
  p_amount     integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auction        auctions%rowtype;
  v_prev_bid_id    uuid;
  v_prev_bidder_id uuid;
  v_prev_amount    integer;
begin
  -- Lock the auction row
  select * into v_auction
  from public.auctions
  where id = p_auction_id
  for update;

  if not found then
    raise exception 'Auction not found';
  end if;

  if v_auction.ends_at <= now() then
    raise exception 'Auction has ended';
  end if;

  if p_amount <= v_auction.current_bid then
    raise exception 'Bid must be higher than current bid of %', v_auction.current_bid;
  end if;

  if p_amount < v_auction.starting_bid then
    raise exception 'Bid must be at least the starting bid of %', v_auction.starting_bid;
  end if;

  -- Check bidder has enough wicks
  if (select wicks_balance from public.profiles where user_id = p_bidder_id) < p_amount then
    raise exception 'Insufficient wicks balance';
  end if;

  -- Find the current highest bid (to refund)
  select id, bidder_id, amount
  into v_prev_bid_id, v_prev_bidder_id, v_prev_amount
  from public.bids
  where auction_id = p_auction_id
  order by amount desc
  limit 1;

  -- Refund the previous high bidder
  if v_prev_bidder_id is not null and v_prev_bidder_id <> p_bidder_id then
    update public.profiles
    set wicks_balance = wicks_balance + v_prev_amount
    where user_id = v_prev_bidder_id;

    insert into public.wick_transactions(user_id, amount, type, reference_id)
    values (v_prev_bidder_id, v_prev_amount, 'bid_refunded', p_auction_id);
  end if;

  -- Deduct wicks from new bidder
  update public.profiles
  set wicks_balance = wicks_balance - p_amount
  where user_id = p_bidder_id;

  insert into public.wick_transactions(user_id, amount, type, reference_id)
  values (p_bidder_id, -p_amount, 'bid_placed', p_auction_id);

  -- Insert the new bid
  insert into public.bids(auction_id, bidder_id, amount)
  values (p_auction_id, p_bidder_id, p_amount);

  -- Update auction's current bid
  update public.auctions
  set current_bid = p_amount
  where id = p_auction_id;
end;
$$;

-- Grant execute on the RPC to authenticated users
grant execute on function public.place_bid_atomic(uuid, uuid, integer)
  to authenticated;
