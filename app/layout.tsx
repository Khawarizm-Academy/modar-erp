import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مدار ERP | نظام إدارة الأعمال",
  description: "منصة مدار لإدارة أعمالك وعملياتك في مكان واحد",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
