"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { Chrome, ShieldCheck, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("setup")) {
      setNotice("إعدادات الربط غير مكتملة. راجع متغيرات Supabase في Vercel.");
    } else if (q.has("error")) {
      setNotice("تعذر إكمال تسجيل الدخول. تأكد من إعداد Google OAuth وعناوين إعادة التوجيه في Supabase.");
    }
  }, []);

  const signIn = async () => {
    setError("");
    if (!configured) {
      setError("أضف رابط Supabase ومفتاح Publishable في إعدادات Vercel أولاً.");
      return;
    }

    setBusy(true);
    try {
      const { error: authError } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
          queryParams: { prompt: "select_account" },
        },
      });
      if (authError) throw authError;
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر بدء تسجيل الدخول. حاول مرة أخرى.");
      setBusy(false);
    }
  };

  return (
    <main className="login-shell" dir="rtl">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-mark">م</div>
          <div><strong>مدار</strong><span>ERP · إدارة أعمالك بوضوح</span></div>
        </div>
        <div className="login-intro">
          <span className="login-eyebrow">مساحة عملك، في مكان واحد</span>
          <h1>أهلاً بعودتك</h1>
          <p>سجّل الدخول بأمان للوصول إلى لوحة إدارة منشأتك.</p>
        </div>
        <button className="google-login" onClick={signIn} disabled={busy || !configured}>
          {busy ? <RefreshCw className="spin" size={18}/> : <Chrome size={19}/>}
          {busy ? "جارٍ تحويلك إلى Google..." : "المتابعة باستخدام Google"}
        </button>
        {!configured && <p className="login-hint">يلزم إضافة NEXT_PUBLIC_SUPABASE_URL ومفتاح Publishable في Vercel ثم إعادة النشر.</p>}
        {notice && <p className="login-error" role="alert">{notice}</p>}
        {error && <p className="login-error" role="alert">{error}</p>}
        <div className="login-security"><ShieldCheck size={16}/><span>جلسة آمنة عبر Supabase Auth وGoogle OAuth</span></div>
        <small className="login-footer">© {new Date().getFullYear()} مدار ERP</small>
      </section>
    </main>
  );
}
