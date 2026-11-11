"use client";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
export default function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const signOut = async () => { setBusy(true); try { await createClient().auth.signOut(); window.location.href = "/login"; } catch { setBusy(false); } };
  return <button className="btn signout-btn" onClick={signOut} disabled={busy} title="تسجيل الخروج"><LogOut size={15}/><span>{busy ? "جارٍ الخروج..." : "خروج"}</span></button>;
}
