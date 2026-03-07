import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  type Profile,
  type ProfileRow,
  mapProfile,
  profileToRow,
} from "../lib/mapSupabase";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrCreate = useCallback(async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Try to fetch existing profile
    const { data: existing, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single<ProfileRow>();

    if (existing) {
      setProfile(mapProfile(existing));
      setLoading(false);
      return;
    }

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    // No profile yet — create one with defaults
    const rawName: string =
      (user.user_metadata?.name as string | undefined) ?? user.email ?? "user";
    const prefix = rawName.includes("@") ? rawName.split("@")[0] : rawName;
    const suffix = Math.random().toString(36).slice(2, 6);
    const username = `${prefix}_${suffix}`;

    const { data: created, error: insertError } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        username,
        wicks_balance: 50,
      })
      .select()
      .single<ProfileRow>();

    if (insertError) {
      setError(insertError.message);
    } else if (created) {
      setProfile(mapProfile(created));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrCreate();

    const { data: listener } = supabase.auth.onAuthStateChange((_event) => {
      fetchOrCreate();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [fetchOrCreate]);

  const updateProfile = useCallback(
    async (
      update: Partial<Omit<Profile, "userId" | "createdAt" | "updatedAt">>
    ) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const row = profileToRow(update);

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(row)
        .eq("user_id", user.id)
        .select()
        .single<ProfileRow>();

      if (updateError) {
        setError(updateError.message);
      } else if (data) {
        setProfile(mapProfile(data));
      }
    },
    []
  );

  return { profile, loading, error, updateProfile, refresh: fetchOrCreate };
}
