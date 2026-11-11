"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { Chrome, ShieldCheck } from "lucide-react";
export default function LoginPage() {
  const [notice, setNotice] = useState("");
  useEffect(() => { const q = new URLSearchParams(window.location.search); if (q.has("setup")) setNotice("إعدادات المصادقة غير مكتملة. راجع متغيرات البيئة."); else if (q.has("error")) setNotice("لم يكتمل تسجيل الدخول. تأكد من إعداد Google OAuth وحاول مجدداً."); }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const signIn = async () => {
    setError("");
    if (!configured) { setError("إعداد تسجيل الدخول غير مكتمل. أضف مفاتيح Supabase في إعدادات Vercel."); return; }
    setBusy(true);
    try {
      const { error: authError } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/auth/callback", queryParams: { prompt: "select_account" } } });
      if (authError) throw authError;
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر بدء تسجيل الدخول. حاول مرة أخرى."); setBusy(false); }
  };
  return <main className="login-shell" dir="rtl"><section className="login-card"><div className="login-brand"><div className="login-mark">م</div><div><strong>مدار</strong><span>ERP · إدارة أعمالك بوضوح</span></div></div><div className="login-intro"><span className="login-eyebrow">مساحة عملك، في مكان واحد</span><h1>أهلاً بعودتك</h1><p>سجّل الدخول بأمان للوصول إلى لوحة إدارة منشأتك.</p></div><button className="google-login" onClick={signIn} disabled={busy || !configured}><Chrome size={19}/>{busy ? "جارٍ تحويلك إلى Google..." : "المتابعة باستخدام Google"}</button>{!configured && <p className="login-hint">يلزم ربط مشروع Supabase وإضافة متغيرات البيئة قبل تفعيل الزر.</p>}{notice && <p className="login-error">{notice}</p>}{error && <p className="login-error">{error}</p>}<div className="login-security"><ShieldCheck size={16}/><span>جلسة آمنة عبر Supabase Auth وGoogle OAuth</span></div><small className="login-footer">© {new Date().getFullYear()} مدار ERP</small></section></main>;
}
