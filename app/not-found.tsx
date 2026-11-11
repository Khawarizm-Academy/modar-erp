import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-shell" dir="rtl">
      <section className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>الصفحة مش موجودة</h1>
        <p>ممكن يكون الرابط اتغير أو الصفحة لسه مش متاحة. ارجع للوحة التحكم وكمّل شغلك.</p>
        <Link className="btn btn-primary not-found-link" href="/">
          <LayoutDashboard size={17}/> العودة إلى لوحة التحكم <ArrowRight size={16}/>
        </Link>
        <small>مدار ERP</small>
      </section>
    </main>
  );
}
