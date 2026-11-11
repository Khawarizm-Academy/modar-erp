import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("إعدادات Supabase غير مكتملة. أضف متغيرات البيئة المطلوبة.");
  return createBrowserClient(url, key);
}
