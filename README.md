# مدار ERP

واجهة عربية RTL لإدارة المنشآت مبنية باستخدام Next.js وTypeScript.

## التشغيل محلياً
```bash
npm install
npm run dev
```
ثم افتح http://localhost:3000

## الوظائف الحالية
- لوحة مؤشرات تحسب المبيعات والمصروفات وقيمة المخزون من السجلات.
- إدارة الفواتير والعملاء والمنتجات والمخزون والمصروفات والموظفين.
- إضافة وتعديل وحذف وبحث وتصفية السجلات.
- حفظ تلقائي محلي في المتصفح عبر localStorage.
- تصدير الجداول والتقارير بصيغة CSV المتوافقة مع Excel.
- طباعة الفاتورة من المتصفح، ويمكن اختيار Save as PDF من نافذة الطباعة.

## إعداد تسجيل الدخول باستخدام Google
1. أنشئ مشروعاً في Supabase من https://supabase.com/dashboard.
2. من Project Settings انسخ Project URL وPublishable/anon key.
3. أضف في Vercel Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. من Supabase → Authentication → Providers → Google فعّل Google وأدخل OAuth Client ID وClient Secret من Google Cloud Console.
5. في Google Cloud Console أنشئ OAuth Client من نوع Web application. أضف رابط موقع مدار إلى Authorized JavaScript origins، وأضف رابط Supabase callback الظاهر في صفحة Google provider إلى Authorized redirect URIs.
6. في Supabase → Authentication → URL Configuration أضف إلى Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - رابط Vercel production متبوعاً بـ `/auth/callback`
7. أعد نشر المشروع بعد إضافة متغيرات البيئة.

## حدود النسخة الحالية
هذه نسخة MVP تفاعلية. تم تجهيز تسجيل الدخول عبر Google باستخدام Supabase Auth وحماية صفحات النظام بالجلسة، لكن يلزم إدخال مفاتيح Supabase وإعداد Google OAuth في لوحات التحكم حتى يعمل فعلياً. التخزين التشغيلي للبيانات ما زال محلياً على نفس المتصفح والجهاز عبر localStorage؛ تسجيل الدخول لا يجعل البيانات مشتركة بين المستخدمين ولا يضيف قاعدة بيانات أو نسخاً احتياطياً سحابياً. الفاتورة الحالية مبسطة ولا تشمل بعد بنود أصناف متعددة أو ضريبة قيمة مضافة أو ترقيم محاسبي متكامل. لا تستخدمها كسجل مالي رسمي قبل استكمال هذه الأجزاء ومراجعتها محاسبياً.
