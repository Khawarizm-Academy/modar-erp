import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer the modern publishable key; keep the old variable name working
  // so existing Vercel deployments do not break during the transition.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("إعدادات Supabase غير مكتملة. راجع رابط المشروع ومفتاح Publishable في Vercel.");
  }

  return createBrowserClient(url, key);
}
