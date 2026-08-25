import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import avatarFemale from "@/assets/avatar-female.png";
import avatarMale from "@/assets/avatar-male.png";
import avatarNeutral from "@/assets/avatar-neutral.png";

export type Gender = "female" | "male" | "nonbinary" | "undisclosed";

export type Profile = {
  id: string;
  display_name: string | null;
  gender: Gender | null;
  country: string | null;
  xp: number;
  level: number;
  completed_phases: string[];
  onboarded: boolean;
};

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "undisclosed", label: "Prefer not to say" },
];

export const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Netherlands", "Spain", "Italy", "Switzerland", "Sweden", "Norway",
  "Denmark", "Finland", "Ireland", "Poland", "Portugal", "Austria", "Belgium",
  "Brazil", "Mexico", "Argentina", "Chile", "Colombia", "Japan", "China",
  "South Korea", "Singapore", "Indonesia", "Malaysia", "Philippines", "Vietnam",
  "Thailand", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "United Arab Emirates",
  "Saudi Arabia", "Israel", "Turkey", "Egypt", "Nigeria", "Kenya", "South Africa",
  "Ghana", "Morocco", "New Zealand", "Other",
];

export function avatarFor(gender: Gender | null | undefined) {
  if (gender === "female") return avatarFemale;
  if (gender === "male") return avatarMale;
  return avatarNeutral;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    });
    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return { session, user: session?.user ?? null, loading };
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, gender, country, xp, level, completed_phases, onboarded")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export const XP_PER_LEVEL = 300;

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;
  return { level, intoLevel, toNext: XP_PER_LEVEL - intoLevel, pct: (intoLevel / XP_PER_LEVEL) * 100 };
}

export const levelTitles = [
  "Qubit Novice",
  "Gate Apprentice",
  "Circuit Builder",
  "Variational Adept",
  "Kernel Engineer",
  "Quantum Architect",
];

export function levelTitle(level: number) {
  return levelTitles[Math.min(level - 1, levelTitles.length - 1)] ?? levelTitles[0]!;
}
