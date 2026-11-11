# مدار ERP

**مدار** نظام عربي لإدارة الأعمال والمنشآت، بواجهة RTL مبنية باستخدام **Next.js 14** و**TypeScript** و**Supabase Auth**.

> مساحة عمل بسيطة لمتابعة المبيعات والفواتير والعملاء والمخزون والمصروفات والموظفين من لوحة واحدة.

## المزايا

- لوحة تحكم بمؤشرات المبيعات والمصروفات وقيمة المخزون وعدد العملاء.
- رسوم بيانية لحركة المبيعات والمصروفات خلال آخر 6 أشهر.
- رسم دائري لتوزيع حالات الفواتير.
- إدارة الفواتير والعملاء والمنتجات والمخزون والمصروفات والموظفين.
- إضافة السجلات وتعديلها وحذفها والبحث والتصفية.
- تصدير الجداول إلى CSV المتوافق مع Excel.
- إنشاء تقرير قابل للطباعة والحفظ بصيغة PDF من المتصفح، يتضمن ملخصاً مالياً ورسماً بيانياً وأحدث الفواتير.
- تسجيل الدخول باستخدام Google عبر Supabase Auth.
- واجهة عربية متجاوبة مع الهاتف وسطح المكتب.
- تخصيص اسم المنشأة وعرض اسم المستخدم وصورة حساب Google.

## معاينة

- **الموقع:** https://modar-erp.vercel.app
- **تسجيل الدخول:** https://modar-erp.vercel.app/login
- **الدعم الفني:** https://ahmedmubarak.vercel.app

## التقنيات

- Next.js 14 — App Router
- React 18 وTypeScript
- Supabase Auth و`@supabase/ssr`
- CSS مخصص للواجهة العربية
- Lucide Icons

## التشغيل محلياً

يتطلب Node.js 20 أو إصداراً متوافقاً مع Next.js 14.

```bash
git clone https://github.com/ahmedmubarak2010/modar-erp.git
cd modar-erp
npm install
```

أنشئ ملف `.env.local` في جذر المشروع:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

يمكن استخدام `NEXT_PUBLIC_SUPABASE_ANON_KEY` بدلاً من `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` إذا كان هذا هو اسم المتغير المعتمد في إعداد مشروعك.

ثم شغّل:

```bash
npm run dev
```

افتح http://localhost:3000.

## إعداد Supabase وGoogle OAuth

### 1. إعداد متغيرات البيئة

أضف المتغيرات التالية في إعدادات مشروع Vercel ضمن **Settings → Environment Variables**، وحدد بيئة Production (وPreview عند الحاجة):

- `NEXT_PUBLIC_SUPABASE_URL`: رابط مشروع Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: مفتاح Publishable الخاص بالمشروع.

بعد تغيير متغيرات البيئة، أعد نشر التطبيق حتى تُدمج القيم الجديدة في عملية البناء.

### 2. تفعيل Google Provider في Supabase

من **Supabase → Authentication → Sign In / Providers → Google**:

- فعّل Google.
- أدخل OAuth Client ID.
- أدخل OAuth Client Secret واحفظ الإعدادات.

### 3. إعداد Google Cloud

أنشئ OAuth Client من نوع **Web application**. أضف نطاق التطبيق المنشور إلى **Authorized JavaScript origins**:

```text
https://modar-erp.vercel.app
```

وأضف عنوان callback الظاهر في إعداد Google Provider داخل Supabase إلى **Authorized redirect URIs**. للمشروع الحالي:

```text
https://wlmojekkfawiozkpedoa.supabase.co/auth/v1/callback
```

لا تضع Client Secret في المستودع أو في ملفات الواجهة الأمامية أو في المحادثات العامة.

### 4. إعداد عناوين الرجوع في Supabase

من **Authentication → URL Configuration**:

- اجعل **Site URL** عنوان الموقع المنشور.
- أضف إلى **Redirect URLs**:
  - `https://modar-erp.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` للتطوير المحلي فقط.

## الأوامر

```bash
npm run dev     # تشغيل بيئة التطوير
npm run build   # بناء نسخة الإنتاج
npm run start   # تشغيل نسخة الإنتاج بعد البناء
npm run lint    # فحص TypeScript عبر tsc --noEmit
```

## ملاحظات مهمة وحدود النسخة الحالية

- هذه نسخة MVP؛ تسجيل الدخول يحمي الوصول إلى مساحة العمل، لكنه **لا يعني أن بيانات التشغيل مخزنة في قاعدة بيانات سحابية**.
- سجلات المنشأة تحفظ حالياً في `localStorage` على المتصفح والجهاز الحالي. قد لا تظهر على جهاز آخر، وقد تُفقد عند مسح بيانات المتصفح.
- اسم المنشأة يُحفظ محلياً على المتصفح.
- تصدير PDF يعتمد على نافذة الطباعة في المتصفح؛ اختر **Save as PDF** لحفظ التقرير.
- الفواتير الحالية مبسطة، ولا تمثل نظاماً محاسبياً متكاملاً لبنود الأصناف والضرائب والترقيم المحاسبي.
- لا تعتمد على النسخة الحالية كسجل مالي أو محاسبي رسمي قبل استكمال قاعدة البيانات والصلاحيات والمراجعة المحاسبية.

## خارطة الطريق

- [ ] تخزين سحابي باستخدام Supabase Database.
- [ ] سياسات Row Level Security لعزل بيانات كل منشأة ومستخدم.
- [ ] إدارة صلاحيات وأدوار أعضاء الفريق.
- [ ] فواتير متعددة البنود والضرائب والترقيم.
- [ ] نسخ احتياطي واستيراد وتصدير متقدم.
- [ ] اختبارات آلية وتغطية لمسارات الاستخدام الأساسية.

## المساهمة والإبلاغ عن مشكلة

الاقتراحات والأخطاء مرحب بها عبر [GitHub Issues](https://github.com/ahmedmubarak2010/modar-erp/issues).

## الترخيص

لم تتم إضافة ملف ترخيص مستقل حتى الآن؛ جميع الحقوق محفوظة لصاحب المستودع ما لم يُذكر خلاف ذلك.
