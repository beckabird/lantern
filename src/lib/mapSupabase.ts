// ─── DB row types (snake_case, matches Supabase schema) ──────────────────────

export interface ProfileRow {
  user_id: string;
  username: string;
  wicks_balance: number;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuctionRow {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  starting_bid: number;
  current_bid: number;
  winner_id: string | null;
  ends_at: string;
  vibe: string | null;
  created_at: string;
  // joined
  host?: ProfileRow | null;
  winner?: ProfileRow | null;
}

export interface BidRow {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  // joined
  bidder?: ProfileRow | null;
}

// ─── App types (camelCase) ────────────────────────────────────────────────────

export interface Profile {
  userId: string;
  username: string;
  wicksBalance: number;
  city: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Auction {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  startingBid: number;
  currentBid: number;
  winnerId: string | null;
  endsAt: string;
  vibe: string | null;
  createdAt: string;
  host?: Profile | null;
  winner?: Profile | null;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  createdAt: string;
  bidder?: Profile | null;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

export function mapProfile(row: ProfileRow): Profile {
  return {
    userId: row.user_id,
    username: row.username,
    wicksBalance: row.wicks_balance,
    city: row.city,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAuction(row: AuctionRow): Auction {
  return {
    id: row.id,
    hostId: row.host_id,
    title: row.title,
    description: row.description,
    startingBid: row.starting_bid,
    currentBid: row.current_bid,
    winnerId: row.winner_id,
    endsAt: row.ends_at,
    vibe: row.vibe,
    createdAt: row.created_at,
    host: row.host ? mapProfile(row.host) : null,
    winner: row.winner ? mapProfile(row.winner) : null,
  };
}

export function mapBid(row: BidRow): Bid {
  return {
    id: row.id,
    auctionId: row.auction_id,
    bidderId: row.bidder_id,
    amount: row.amount,
    createdAt: row.created_at,
    bidder: row.bidder ? mapProfile(row.bidder) : null,
  };
}

/** Convert a partial camelCase profile update back to snake_case for DB writes */
export function profileToRow(
  update: Partial<Omit<Profile, "userId" | "createdAt" | "updatedAt">>
): Partial<Omit<ProfileRow, "user_id" | "created_at" | "updated_at">> {
  const row: Partial<Omit<ProfileRow, "user_id" | "created_at" | "updated_at">> =
    {};
  if (update.username !== undefined) row.username = update.username;
  if (update.wicksBalance !== undefined) row.wicks_balance = update.wicksBalance;
  if (update.city !== undefined) row.city = update.city;
  if (update.bio !== undefined) row.bio = update.bio;
  if (update.avatarUrl !== undefined) row.avatar_url = update.avatarUrl;
  return row;
}
