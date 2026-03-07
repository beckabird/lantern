import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { type Auction, type AuctionRow, mapAuction } from "../lib/mapSupabase";

const AUCTION_SELECT =
  "*, host:profiles!host_id(*), winner:profiles!winner_id(*)";

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("auctions")
      .select(AUCTION_SELECT)
      .order("ends_at", { ascending: true })
      .returns<AuctionRow[]>();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setAuctions((data ?? []).map(mapAuction));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAuctions();

    const channel = supabase
      .channel("auctions-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auctions" },
        () => {
          fetchAuctions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAuctions]);

  return { auctions, loading, error, refresh: fetchAuctions };
}
