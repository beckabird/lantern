import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { type Auction, type AuctionRow, mapAuction } from "../lib/mapSupabase";

const AUCTION_SELECT =
  "*, host:profiles!host_id(*), winner:profiles!winner_id(*)";

export function useAuction(auctionId: string | null) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuction = useCallback(async () => {
    if (!auctionId) {
      setAuction(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("auctions")
      .select(AUCTION_SELECT)
      .eq("id", auctionId)
      .single<AuctionRow>();

    if (fetchError) {
      setError(fetchError.message);
    } else if (data) {
      setAuction(mapAuction(data));
    }

    setLoading(false);
  }, [auctionId]);

  useEffect(() => {
    fetchAuction();

    if (!auctionId) return;

    const channel = supabase
      .channel(`auction-${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auctionId}`,
        },
        () => {
          fetchAuction();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId, fetchAuction]);

  return { auction, loading, error, refresh: fetchAuction };
}
