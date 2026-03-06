import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { type Bid, type BidRow, mapBid } from "../lib/mapSupabase";

const BID_SELECT = "*, bidder:profiles!bidder_id(*)";

export function useBids(auctionId: string | null) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBids = useCallback(async () => {
    if (!auctionId) {
      setBids([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("bids")
      .select(BID_SELECT)
      .eq("auction_id", auctionId)
      .order("amount", { ascending: false })
      .returns<BidRow[]>();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setBids((data ?? []).map(mapBid));
    }

    setLoading(false);
  }, [auctionId]);

  useEffect(() => {
    fetchBids();

    if (!auctionId) return;

    const channel = supabase
      .channel(`bids-${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        () => {
          // Re-fetch to get the joined bidder profile
          fetchBids();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId, fetchBids]);

  return { bids, loading, error, refresh: fetchBids };
}
