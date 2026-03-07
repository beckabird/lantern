#!/usr/bin/env node
// Seed script for Lantern — creates fake users, profiles, auctions, and bids.
// Run from the repo root: node scripts/seed.cjs
// Requires in .env (or environment): EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Fake users ───────────────────────────────────────────────────────────────

const DEMO_USERS = [
  {
    email: "maya@lantern.demo",
    password: "demo1234",
    username: "maya",
    city: "Brooklyn",
    bio: "Vintage finds and good vibes.",
  },
  {
    email: "james@lantern.demo",
    password: "demo1234",
    username: "james",
    city: "Austin",
    bio: "Collector of rare records and hot sauce.",
  },
  {
    email: "priya@lantern.demo",
    password: "demo1234",
    username: "priya",
    city: "Chicago",
    bio: "Art lover, avid baker.",
  },
  {
    email: "leo@lantern.demo",
    password: "demo1234",
    username: "leo",
    city: "Portland",
    bio: "Plant dad and coffee snob.",
  },
  {
    email: "dana@lantern.demo",
    password: "demo1234",
    username: "dana",
    city: "Seattle",
    bio: "Outdoor adventurer, board game fanatic.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hoursFromNow(h) {
  return new Date(Date.now() + h * 60 * 60 * 1000).toISOString();
}

function hoursAgo(h) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

async function ensureUser(userData) {
  // List existing users to find by email (admin API)
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) throw new Error(`listUsers: ${listErr.message}`);

  const existing = list.users.find((u) => u.email === userData.email);
  if (existing) {
    console.log(`  ↩  user already exists: ${userData.email}`);
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
  });
  if (error) throw new Error(`createUser ${userData.email}: ${error.message}`);
  console.log(`  ✓  created user: ${userData.email}`);
  return data.user.id;
}

async function ensureProfile(userId, userData) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    console.log(`  ↩  profile already exists: ${userData.username}`);
    return;
  }

  const { error } = await supabase.from("profiles").insert({
    user_id: userId,
    username: userData.username,
    wicks_balance: 50,
    city: userData.city,
    bio: userData.bio,
  });
  if (error) throw new Error(`insert profile ${userData.username}: ${error.message}`);
  console.log(`  ✓  created profile: ${userData.username}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱  Seeding Lantern…\n");

  // 1. Create auth users
  console.log("── Users ────────────────────────────────");
  const userIds = [];
  for (const u of DEMO_USERS) {
    const id = await ensureUser(u);
    userIds.push(id);
  }

  // 2. Create profiles
  console.log("\n── Profiles ─────────────────────────────");
  for (let i = 0; i < DEMO_USERS.length; i++) {
    await ensureProfile(userIds[i], DEMO_USERS[i]);
  }

  // 3. Create auctions (idempotent: skip if titles already exist)
  console.log("\n── Auctions ─────────────────────────────");

  const { data: existingAuctions } = await supabase
    .from("auctions")
    .select("title");
  const existingTitles = new Set((existingAuctions ?? []).map((a) => a.title));

  const [mayaId, jamesId, priyaId, leoId, danaId] = userIds;

  const AUCTIONS = [
    {
      host_id: mayaId,
      title: "1970s Levi's Denim Jacket",
      description: "Barely worn, original hardware, size M. The real deal.",
      starting_bid: 5,
      ends_at: hoursFromNow(24),
      vibe: "vintage",
    },
    {
      host_id: jamesId,
      title: "Signed Vinyl: Fleetwood Mac Rumours",
      description: "Original 1977 pressing, signed by Stevie Nicks.",
      starting_bid: 20,
      ends_at: hoursFromNow(48),
      vibe: "music",
    },
    {
      host_id: priyaId,
      title: "Homemade Sourdough Starter Kit",
      description: "7-year-old starter, recipe card, and a fresh loaf.",
      starting_bid: 3,
      ends_at: hoursFromNow(12),
      vibe: "food",
    },
    {
      host_id: leoId,
      title: "Monstera Deliciosa (large)",
      description: "3 ft tall, healthy, ready for a new home.",
      starting_bid: 5,
      ends_at: hoursFromNow(36),
      vibe: "plants",
    },
    {
      host_id: danaId,
      title: "Camping Weekend for 2 — Cascades",
      description: "Guide, gear, meals included. July availability.",
      starting_bid: 15,
      ends_at: hoursFromNow(72),
      vibe: "experience",
    },
    {
      host_id: mayaId,
      title: "Polaroid SX-70 Land Camera",
      description: "Fully refurbished, comes with two film packs.",
      starting_bid: 10,
      ends_at: hoursFromNow(18),
      vibe: "photography",
    },
    {
      host_id: jamesId,
      title: "Brooklyn Board Game Night (x4 seats)",
      description: "Host a game night at our place — snacks included.",
      starting_bid: 2,
      ends_at: hoursAgo(2),   // ended
      vibe: "experience",
    },
    {
      host_id: priyaId,
      title: "Original Watercolor: Chicago Skyline",
      description: "16×20 inches, framed, painted by me.",
      starting_bid: 8,
      ends_at: hoursAgo(6),   // ended
      vibe: "art",
    },
  ];

  const createdAuctionIds = {};

  for (const auction of AUCTIONS) {
    if (existingTitles.has(auction.title)) {
      console.log(`  ↩  auction already exists: "${auction.title}"`);
      // Fetch its id for use in bids
      const { data } = await supabase
        .from("auctions")
        .select("id")
        .eq("title", auction.title)
        .single();
      if (data) createdAuctionIds[auction.title] = data.id;
      continue;
    }

    const { data, error } = await supabase
      .from("auctions")
      .insert(auction)
      .select("id")
      .single();
    if (error) {
      console.error(`  ✗  ${auction.title}: ${error.message}`);
    } else {
      createdAuctionIds[auction.title] = data.id;
      console.log(`  ✓  created auction: "${auction.title}"`);
    }
  }

  // 4. Sample bids on active auctions via the atomic RPC
  console.log("\n── Bids ─────────────────────────────────");

  const sampleBids = [
    // Denim Jacket: priya bids 6, leo bids 8
    {
      title: "1970s Levi's Denim Jacket",
      bidder_id: priyaId,
      amount: 6,
    },
    {
      title: "1970s Levi's Denim Jacket",
      bidder_id: leoId,
      amount: 8,
    },
    // Signed Vinyl: dana bids 22, maya bids 25
    {
      title: "Signed Vinyl: Fleetwood Mac Rumours",
      bidder_id: danaId,
      amount: 22,
    },
    {
      title: "Signed Vinyl: Fleetwood Mac Rumours",
      bidder_id: mayaId,
      amount: 25,
    },
    // Sourdough: james bids 4
    {
      title: "Homemade Sourdough Starter Kit",
      bidder_id: jamesId,
      amount: 4,
    },
  ];

  for (const bid of sampleBids) {
    const auctionId = createdAuctionIds[bid.title];
    if (!auctionId) {
      console.log(`  ↩  skipping bid on missing auction: "${bid.title}"`);
      continue;
    }

    // Check if this bidder already has a bid on this auction at this amount
    const { data: existingBid } = await supabase
      .from("bids")
      .select("id")
      .eq("auction_id", auctionId)
      .eq("bidder_id", bid.bidder_id)
      .eq("amount", bid.amount)
      .maybeSingle();

    if (existingBid) {
      console.log(`  ↩  bid already exists (${bid.amount} wicks)`);
      continue;
    }

    const { error } = await supabase.rpc("place_bid_atomic", {
      p_auction_id: auctionId,
      p_bidder_id: bid.bidder_id,
      p_amount: bid.amount,
    });

    if (error) {
      console.error(
        `  ✗  bid ${bid.amount} on "${bid.title}": ${error.message}`
      );
    } else {
      console.log(`  ✓  bid ${bid.amount} wicks on "${bid.title}"`);
    }
  }

  console.log("\n✅  Seed complete!\n");
  console.log("Log in with e.g.  maya@lantern.demo / demo1234\n");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
