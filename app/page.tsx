"use client";

import { useMemo, useState } from "react";
import { LayoutDashboard, Wallet, ShoppingCart, Package, Users, ChartNoAxesCombined, Settings, Search, Bell, Plus, Menu, X, ArrowUpRight, ChevronDown, Download, MoreHorizontal, CircleHelp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = { id: string; name: string; amount: string; status: string };
const nav = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "finance", label: "الحسابات والمالية", icon: Wallet },
  { id: "sales", label: "المبيعات والفواتير", icon: ShoppingCart },
  { id: "inventory", label: "المخزون والمنتجات", icon: Package },
  { id: "hr", label: "الموارد البشرية", icon: Users },
  { id: "reports", label: "التقارير والتحليلات", icon: ChartNoAxesCombined },
];
const invoices: Row[] = [
  { id: "INV-0126", name: "شركة النخبة", amount: "12,500 ر.س", status: "مدفوعة" },
  { id: "INV-0125", name: "مؤسسة الرواد", amount: "8,750 ر.س", status: "بانتظار الدفع" },
  { id: "INV-0124", name: "شركة المسار", amount: "16,200 ر.س", status: "مدفوعة" },
  { id: "INV-0123", name: "متجر البيان", amount: "4,800 ر.س", status: "متأخرة" },
];
const products = [
  { sku:"PRD-001",name:"لابتوب أعمال Pro 15",category:"أجهزة إلكترونية",qty:24,price:"4,200 ر.س",status:"متوفر" },
  { sku:"PRD-002",name:"شاشة مكتبية 27 بوصة",category:"أجهزة إلكترونية",qty:8,price:"1,150 ر.س",status:"مخزون منخفض" },
  { sku:"PRD-003",name:"كرسي مكتبي مريح",category:"أثاث مكتبي",qty:42,price:"680 ر.س",status:"متوفر" },
  { sku:"PRD-004",name:"طابعة ليزر متعددة",category:"معدات",qty:5,price:"950 ر.س",status:"مخزون منخفض" },
  { sku:"PRD-005",name:"لوحة مفاتيح لاسلكية",category:"ملحقات",qty:110,price:"120 ر.س",status:"متوفر" },
];
const employees = [
  { id:"EMP-001",name:"محمد العتيبي",dept:"الإدارة",role:"المدير التنفيذي",status:"حاضر" },
  { id:"EMP-002",name:"سارة أحمد",dept:"المالية",role:"مديرة الحسابات",status:"حاضر" },
  { id:"EMP-003",name:"خالد الحربي",dept:"المبيعات",role:"مسؤول مبيعات",status:"حاضر" },
  { id:"EMP-004",name:"نورة القحطاني",dept:"الموارد البشرية",role:"أخصائية موارد بشرية",status:"في إجازة" },
  { id:"EMP-005",name:"عبدالله سالم",dept:"المخزون",role:"أمين مستودع",status:"حاضر" },
  { id:"EMP-006",name:"ريم محمد",dept:"المالية",role:"محاسبة",status:"حاضر" },
  { id:"EMP-007",name:"فهد الدوسري",dept:"المبيعات",role:"مدير المبيعات",status:"حاضر" },
];
const chartData = [
  {month:"يونيو",revenue:190,expense:120},{month:"يوليو",revenue:225,expense:135},{month:"أغسطس",revenue:210,expense:145},{month:"سبتمبر",revenue:260,expense:155},{month:"أكتوبر",revenue:265,expense:175},{month:"نوفمبر",revenue:295,expense:185},
];
const titles: Record<string,string> = { overview:"نظرة عامة",finance:"الحسابات والمالية",sales:"المبيعات والفواتير",inventory:"المخزون والمنتجات",hr:"الموارد البشرية",reports:"التقارير والتحليلات" };
const subtitles: Record<string,string> = { overview:"كل ما تحتاجه لاتخاذ قرارات أفضل، في مكان واحد.",finance:"تابع التدفقات النقدية والإيرادات والمصروفات.",sales:"أدر فواتيرك ومبيعاتك وعلاقاتك مع العملاء.",inventory:"تحكم في منتجاتك وكميات المخزون والمستودعات.",hr:"فريقك أولاً. تابع الموظفين والحضور والرواتب بسهولة.",reports:"رؤية أوضح لأداء أعمالك واتجاهاتها." };
function Status({value}:{value:string}) { const cls = value==="مدفوعة"||value==="حاضر"||value==="متوفر" ? "paid" : value==="متأخرة" ? "late" : "pending"; return <span className={"status "+cls}>{value}</span>; }
export default function Home() {
  const [page,setPage] = useState("overview");
  const [query,setQuery] = useState("");
  const [modal,setModal] = useState(false);
  const [mobileOpen,setMobileOpen] = useState(false);
  const [toast,setToast] = useState("");
  const [tab,setTab] = useState("all");
  const [newName,setNewName] = useState("");
  const [newAmount,setNewAmount] = useState("");
  const filteredInvoices = useMemo(()=>invoices.filter(r=>(r.id+" "+r.name+" "+r.status).toLowerCase().includes(query.toLowerCase())),[query]);
  const filteredProducts = useMemo(()=>products.filter(r=>(r.sku+" "+r.name+" "+r.category).toLowerCase().includes(query.toLowerCase())),[query]);
  const filteredEmployees = useMemo(()=>employees.filter(r=>(r.id+" "+r.name+" "+r.dept).toLowerCase().includes(query.toLowerCase()) && (tab==="all" || (tab==="present" ? r.status==="حاضر" : r.status==="في إجازة"))),[query,tab]);
  const notify = (message:string)=>{setToast(message);window.setTimeout(()=>setToast(""),2600);};
  const openCreate = ()=>{setNewName("");setNewAmount("");setModal(true);};
  const submitCreate = (e:React.FormEvent)=>{e.preventDefault();setModal(false);notify(newName ? "تم تسجيل "+newName+" بنجاح (بيانات تجريبية)." : "تم إنشاء العنصر بنجاح (بيانات تجريبية).");};
  const metrics = page==="hr" ? [["إجمالي الموظفين","48","↑ موظفان هذا الشهر"],["حاضرون اليوم","44","نسبة الحضور 91.7%"],["في إجازة","04","3 سنوية · 1 مرضية"],["رواتب الشهر","96,000","موعد الصرف 28 نوفمبر"]] : page==="inventory" ? [["إجمالي المنتجات","1,248","في 3 مستودعات"],["قيمة المخزون","186,400","ر.س"],["مخزون منخفض","12","تحتاج إعادة طلب"],["طلبات التوريد","08","3 شحنات قادمة"]] : page==="sales" ? [["إجمالي المبيعات","248,500","↑ 12.8% عن الشهر السابق"],["الفواتير","126","خلال هذا الشهر"],["بانتظار التحصيل","8","34,000 ر.س مستحق"],["متوسط الفاتورة","1,972","ر.س"]] : [["إجمالي المبيعات","248,500","↑ 12.8% عن الشهر السابق"],["صافي الأرباح","68,240","↑ 8.2% عن الشهر السابق"],["قيمة المخزون","186,400","1,248 منتج في 3 مستودعات"],["الموظفون النشطون","48","44 حاضر اليوم · 4 في إجازة"]];
  return <div className="app-shell">
    <aside className={"sidebar "+(mobileOpen?"open":"")}>
      <div className="brand"><strong>مدار</strong><span>نظام إدارة الأعمال</span></div>
      <div className="company"><b>شركة الأفق للتجارة</b><small>المقر الرئيسي　⌄</small></div>
      <div className="nav-label">مساحة العمل</div>
      <nav className="nav-list">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} className={"nav-item "+(page===item.id?"active":"")} onClick={()=>{setPage(item.id);setMobileOpen(false);setQuery("");}}><Icon/><span>{item.label}</span></button>})}</nav>
      <div className="sidebar-bottom"><div className="support"><b>نحن هنا لمساعدتك</b><p>مركز المساعدة والدعم</p><a href="mailto:support@modar.example">تواصل معنا ←</a></div><button className="nav-item" onClick={()=>notify("الإعدادات ستكون متاحة قريباً.")}><Settings/><span>الإعدادات</span></button><div className="sidebar-foot">مدار ERP　•　الإصدار 2.0</div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div style={{display:"flex",alignItems:"center",gap:12}}><button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="القائمة">{mobileOpen?<X/>:<Menu/>}</button><span className="crumb">مساحة العمل　/　{titles[page]}</span></div><div className="top-actions"><label className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن فاتورة، منتج، أو موظف..."/></label><button className="icon-btn" onClick={()=>notify("لا توجد إشعارات جديدة")} aria-label="الإشعارات"><Bell size={19}/></button><div className="profile"><b>أحمد محمد</b><small>مدير النظام　⌄</small></div></div></header>
      <div className="content">
        <div className="page-heading"><div><h1>{titles[page]}</h1><p>{subtitles[page]}</p></div><div className="actions"><button className="btn" onClick={()=>notify("الفترة المحددة: نوفمبر 2026")}>نوفمبر 2026　<ChevronDown size={14}/></button><button className="btn btn-primary" onClick={openCreate}><Plus size={17}/>{page==="hr"?"إضافة موظف":page==="inventory"?"إضافة منتج":page==="sales"?"إنشاء فاتورة":"إنشاء جديد"}</button></div></div>
        <section className="metrics">{metrics.map(([label,value,note])=><article className="metric" key={label}><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className={"metric-note "+(note.includes("↑")?"":"neutral")}>{note}</div></article>)}</section>
        {page==="overview"||page==="finance"||page==="reports" ? <><section className="dashboard-grid"><article className="panel"><div className="panel-head"><div><h2>هدف المبيعات الشهري</h2><p>أنت على الطريق الصحيح</p></div></div><div className="target-wrap"><div className="target-ring"><div className="target-number"><b>83%</b><span>من الهدف الشهري</span></div></div></div><div className="target-foot">248,500 / 300,000 ر.س</div></article><article className="panel"><div className="panel-head"><div><h2>{page==="finance"?"التدفقات النقدية":page==="reports"?"الأداء المالي":"الإيرادات والمصروفات"}</h2><p>الأداء المالي خلال آخر 6 أشهر</p></div><div className="chart-legend"><span><i className="legend-dot" style={{background:"#087f70"}}/>الإيرادات</span><span><i className="legend-dot" style={{background:"#9cb7be"}}/>المصروفات</span></div></div><div style={{height:230,direction:"ltr"}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:8,right:8,left:-18,bottom:0}}><defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#087f70" stopOpacity={.2}/><stop offset="95%" stopColor="#087f70" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e8eef0" vertical={false}/><XAxis dataKey="month" tick={{fontSize:11,fill:"#64787d"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:"#64787d"}} axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="revenue" name="الإيرادات" stroke="#087f70" strokeWidth={2.5} fill="url(#rev)"/><Area type="monotone" dataKey="expense" name="المصروفات" stroke="#9cb7be" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer></div></article></section><section className="lower-grid"><article className="panel"><div className="panel-head"><h2>أحدث الفواتير</h2><button className="btn" onClick={()=>setPage("sales")}>عرض الكل ←</button></div><div className="table-wrap"><table><thead><tr><th>رقم الفاتورة</th><th>العميل</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>{filteredInvoices.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.amount}</td><td><Status value={r.status}/></td></tr>)}</tbody></table>{filteredInvoices.length===0&&<div className="empty">لا توجد نتائج مطابقة</div>}</div></article><article className="panel"><div className="panel-head"><h2>يحتاج انتباهك</h2></div><div className="alert-item"><b>12 منتجاً بمخزون منخفض</b><span>راجع المنتجات وأعد الطلب</span></div><div className="alert-item"><b>8 فواتير بانتظار التحصيل</b><span>إجمالي المستحقات 34,000 ر.س</span></div><div className="alert-item"><b>3 طلبات إجازة جديدة</b><span>طلبات تنتظر موافقتك</span></div></article></section></> : null}
        {page==="sales"&&<section className="panel section-panel"><div className="panel-head"><div><h2>الفواتير</h2><p>إدارة ومتابعة فواتير العملاء</p></div><button className="btn" onClick={()=>notify("تم تجهيز ملف التصدير التجريبي.")}><Download size={15}/> تصدير</button></div><div className="table-wrap page-table"><table><thead><tr><th>رقم الفاتورة</th><th>العميل</th><th>الإجمالي</th><th>الحالة</th><th>الإجراء</th></tr></thead><tbody>{filteredInvoices.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.amount}</td><td><Status value={r.status}/></td><td><button className="icon-btn" onClick={()=>notify("تفاصيل "+r.id)}><MoreHorizontal/></button></td></tr>)}</tbody></table></div></section>}
        {page==="inventory"&&<section className="panel section-panel"><div className="panel-head"><div><h2>قائمة المنتجات</h2><p>تابع كميات المنتجات وحالة المخزون</p></div><button className="btn" onClick={()=>notify("تم تجهيز ملف المنتجات.")}><Download size={15}/> تصدير</button></div><div className="table-wrap page-table"><table><thead><tr><th>رمز المنتج</th><th>اسم المنتج</th><th>التصنيف</th><th>الكمية</th><th>السعر</th><th>الحالة</th></tr></thead><tbody>{filteredProducts.map(r=><tr key={r.sku}><td>{r.sku}</td><td>{r.name}</td><td>{r.category}</td><td>{r.qty}</td><td>{r.price}</td><td><Status value={r.status}/></td></tr>)}</tbody></table></div></section>}
        {page==="hr"&&<section className="panel section-panel"><div className="panel-head"><div><h2>دليل الموظفين</h2><p>جميع الموظفين ({employees.length})</p></div><button className="btn" onClick={()=>notify("تم تجهيز ملف الموظفين.")}><Download size={15}/> تصدير</button></div><div className="tabs"><button className={"tab "+(tab==="all"?"active":"")} onClick={()=>setTab("all")}>جميع الموظفين (48)</button><button className={"tab "+(tab==="present"?"active":"")} onClick={()=>setTab("present")}>حاضرون (44)</button><button className={"tab "+(tab==="leave"?"active":"")} onClick={()=>setTab("leave")}>في إجازة (4)</button></div><div className="table-wrap page-table"><table><thead><tr><th>الرقم الوظيفي</th><th>اسم الموظف</th><th>القسم</th><th>المسمى الوظيفي</th><th>الحالة</th><th></th></tr></thead><tbody>{filteredEmployees.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.dept}</td><td>{r.role}</td><td><Status value={r.status}/></td><td><button className="icon-btn" onClick={()=>notify("ملف "+r.name)}><MoreHorizontal/></button></td></tr>)}</tbody></table></div></section>}
        <div style={{display:"flex",justifyContent:"space-between",color:"#819196",fontSize:11,marginTop:18}}><span>مدار ERP / شركة الأفق للتجارة</span><span>بيانات توضيحية • آخر تحديث: اليوم، 10:30 ص</span></div>
      </div>
    </main>
    {modal&&<div className="modal-backdrop" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>{page==="hr"?"إضافة موظف":page==="inventory"?"إضافة منتج":page==="sales"?"إنشاء فاتورة":"إنشاء عنصر جديد"}</h2><form onSubmit={submitCreate}><label>الاسم أو الوصف<input autoFocus required value={newName} onChange={e=>setNewName(e.target.value)} placeholder="اكتب الاسم هنا"/></label><label>القيمة (اختياري)<input value={newAmount} onChange={e=>setNewAmount(e.target.value)} placeholder="0.00"/></label><div className="modal-actions"><button className="btn btn-primary" type="submit">حفظ</button><button className="btn" type="button" onClick={()=>setModal(false)}>إلغاء</button></div></form></div></div>}
    {toast&&<div className="toast" role="status">{toast}</div>}
  </div>;
}
