"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "../../lib/supabase/client";

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signOut = async () => {
    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await createClient().auth.signOut();
      if (signOutError) throw signOutError;
      window.location.assign("/login");
    } catch {
      setError("تعذر تسجيل الخروج. حاول مرة أخرى.");
      setBusy(false);
    }
  };

  return (
    <div className="signout-wrap">
      <button className="btn signout-btn" onClick={signOut} disabled={busy} title="تسجيل الخروج">
        <LogOut size={15}/><span>{busy ? "جارٍ الخروج..." : "خروج"}</span>
      </button>
      {error && <span className="signout-error" role="alert">{error}</span>}
    </div>
  );
}
