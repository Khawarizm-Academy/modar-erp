"use client";

import { useEffect, useMemo, useState } from "react";
import SignOutButton from "./components/SignOutButton";
import { createClient } from "../lib/supabase/client";
import { LayoutDashboard, Wallet, ShoppingCart, Package, Users, ChartNoAxesCombined, Settings, Search, Bell, Plus, Menu, X, Download, Pencil, Trash2, Printer, FileText, UserRound, TrendingUp, Boxes, Receipt, Save, Eye } from "lucide-react";

type Kind = "sales" | "inventory" | "customers" | "expenses" | "hr";
type RecordItem = { id:string; name:string; detail:string; amount:number; qty:number; status:string; date:string };
type Store = Record<Kind, RecordItem[]>;
const STORAGE_KEY = "modar-erp-store-v2";
const today = () => new Date().toISOString().slice(0,10);
const seed:Store = {
  sales:[
    {id:"INV-1001",name:"شركة النخبة",detail:"خدمات استشارية",amount:12500,qty:1,status:"مدفوعة",date:today()},
    {id:"INV-1002",name:"مؤسسة الرواد",detail:"توريد أجهزة",amount:8750,qty:1,status:"بانتظار الدفع",date:today()},
    {id:"INV-1003",name:"شركة المسار",detail:"اشتراك سنوي",amount:16200,qty:1,status:"مدفوعة",date:today()}
  ],
  inventory:[
    {id:"PRD-001",name:"لابتوب أعمال Pro 15",detail:"أجهزة إلكترونية",amount:4200,qty:24,status:"متوفر",date:today()},
    {id:"PRD-002",name:"شاشة مكتبية 27 بوصة",detail:"أجهزة إلكترونية",amount:1150,qty:8,status:"مخزون منخفض",date:today()},
    {id:"PRD-003",name:"كرسي مكتبي مريح",detail:"أثاث مكتبي",amount:680,qty:42,status:"متوفر",date:today()}
  ],
  customers:[
    {id:"CUS-001",name:"شركة النخبة",detail:"contact@elite.example",amount:0,qty:0,status:"نشط",date:today()},
    {id:"CUS-002",name:"مؤسسة الرواد",detail:"hello@rowad.example",amount:0,qty:0,status:"نشط",date:today()}
  ],
  expenses:[
    {id:"EXP-001",name:"إيجار المكتب",detail:"إيجار وتشغيل",amount:8500,qty:1,status:"مسجل",date:today()},
    {id:"EXP-002",name:"إنترنت واتصالات",detail:"مرافق",amount:1200,qty:1,status:"مسجل",date:today()}
  ],
  hr:[
    {id:"EMP-001",name:"محمد العتيبي",detail:"الإدارة • مدير تنفيذي",amount:0,qty:1,status:"على رأس العمل",date:today()},
    {id:"EMP-002",name:"سارة أحمد",detail:"المالية • محاسبة",amount:0,qty:1,status:"على رأس العمل",date:today()}
  ]
};
const nav = [
  {id:"overview",label:"نظرة عامة",icon:LayoutDashboard},
  {id:"sales",label:"المبيعات والفواتير",icon:ShoppingCart},
  {id:"customers",label:"العملاء",icon:UserRound},
  {id:"inventory",label:"المنتجات والمخزون",icon:Package},
  {id:"expenses",label:"المصروفات",icon:Wallet},
  {id:"hr",label:"الموظفون",icon:Users},
  {id:"reports",label:"التقارير",icon:ChartNoAxesCombined}
];
const titles:Record<string,string>={overview:"نظرة عامة",sales:"المبيعات والفواتير",customers:"العملاء",inventory:"المنتجات والمخزون",expenses:"المصروفات",hr:"الموظفون",reports:"التقارير"};
const labels:Record<Kind,{singular:string;id:string;detail:string;amount:string;qty:string}> = {
 sales:{singular:"فاتورة",id:"رقم الفاتورة",detail:"العميل / البيان",amount:"الإجمالي",qty:"الكمية"},
 inventory:{singular:"منتج",id:"كود المنتج",detail:"التصنيف",amount:"سعر الوحدة",qty:"الكمية"},
 customers:{singular:"عميل",id:"كود العميل",detail:"البريد أو الهاتف",amount:"الرصيد",qty:"—"},
 expenses:{singular:"مصروف",id:"رقم المصروف",detail:"التصنيف / البيان",amount:"القيمة",qty:"—"},
 hr:{singular:"موظف",id:"الرقم الوظيفي",detail:"القسم / الوظيفة",amount:"الراتب",qty:"—"}
};
const money=(n:number)=>new Intl.NumberFormat("ar-EG",{style:"currency",currency:"EGP",maximumFractionDigits:2}).format(n||0);
const makeId=(kind:Kind)=>({sales:"INV",inventory:"PRD",customers:"CUS",expenses:"EXP",hr:"EMP"}[kind])+"-"+Date.now().toString().slice(-6);
function downloadCsv(filename:string, rows:Record<string,string|number>[]) {
 const keys=Object.keys(rows[0]||{});
 const csv=[keys.join(","),...rows.map(r=>keys.map(k=>'"'+String(r[k]??"").replace(/"/g,'""')+'"').join(","))].join("\n");
 const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
}
function Status({value}:{value:string}) {const cls=["مدفوعة","نشط","متوفر","مسجل","على رأس العمل"].includes(value)?"paid":value==="متأخرة"?"late":"pending";return <span className={"status "+cls}>{value}</span>;}
export default function Home(){
 const [page,setPage]=useState("overview");
 const [store,setStore]=useState<Store>(seed);
 const [ready,setReady]=useState(false);
 const [query,setQuery]=useState("");
 const [mobileOpen,setMobileOpen]=useState(false);
 const [toast,setToast]=useState("");
 const [modal,setModal]=useState(false);
 const [editing,setEditing]=useState<string|null>(null);
 const [selected,setSelected]=useState<RecordItem|null>(null);
 const [form,setForm]=useState({name:"",detail:"",amount:"",qty:"1",status:"مدفوعة",date:today()});
 const [filter,setFilter]=useState("الكل");
 const [userEmail,setUserEmail]=useState("");
 useEffect(()=>{let active=true;try{createClient().auth.getUser().then(({data})=>{if(active)setUserEmail(data.user?.email||"");}).catch(()=>{});}catch{}return()=>{active=false;};},[]);
 useEffect(()=>{try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)setStore(JSON.parse(saved) as Store);}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)localStorage.setItem(STORAGE_KEY,JSON.stringify(store));},[store,ready]);
 const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),2600);};
 const kind:Kind|undefined=["sales","inventory","customers","expenses","hr"].includes(page)?page as Kind:undefined;
 const rows=useMemo(()=>kind?(store[kind]||[]).filter(r=>(r.id+" "+r.name+" "+r.detail+" "+r.status).toLowerCase().includes(query.toLowerCase())&&(filter==="الكل"||r.status===filter)):[],[kind,store,query,filter]);
 const totals=useMemo(()=>({sales:store.sales.reduce((s,r)=>s+r.amount,0),expenses:store.expenses.reduce((s,r)=>s+r.amount,0),stock:store.inventory.reduce((s,r)=>s+r.amount*r.qty,0),low:store.inventory.filter(r=>r.qty<=10).length}),[store]);
 const openCreate=(item?:RecordItem)=>{setEditing(item?.id||null);setForm(item?{name:item.name,detail:item.detail,amount:String(item.amount),qty:String(item.qty||1),status:item.status,date:item.date}:{name:"",detail:"",amount:"",qty:"1",status:kind==="sales"?"بانتظار الدفع":kind==="inventory"?"متوفر":kind==="customers"?"نشط":kind==="expenses"?"مسجل":"على رأس العمل",date:today()});setModal(true);};
 const saveRecord=(e:React.FormEvent)=>{e.preventDefault();if(!kind)return;const item:RecordItem={id:editing||makeId(kind),name:form.name.trim(),detail:form.detail.trim(),amount:Number(form.amount)||0,qty:Number(form.qty)||1,status:form.status,date:form.date};setStore(old=>({...old,[kind]:editing?old[kind].map(r=>r.id===editing?item:r):[item,...old[kind]]}));setModal(false);notify(editing?"تم تحديث البيانات وحفظها":"تمت الإضافة وحفظ البيانات");};
 const removeRecord=(id:string)=>{if(!kind||!confirm("هل أنت متأكد من حذف هذا السجل؟"))return;setStore(old=>({...old,[kind]:old[kind].filter(r=>r.id!==id)}));notify("تم حذف السجل");};
 const exportCurrent=()=>{if(!kind)return;downloadCsv(titles[page]+".csv",rows.map(r=>({code:r.id,name:r.name,details:r.detail,amount:r.amount,quantity:r.qty,status:r.status,date:r.date})));notify("تم تصدير الملف بصيغة CSV المتوافقة مع Excel");};
 const printInvoice=(r:RecordItem)=>{setSelected(r);window.setTimeout(()=>window.print(),150);};
 const createInvoice=()=>{setPage("sales");setTimeout(()=>openCreate(),0);};
 const metricCards=[{label:"إجمالي المبيعات",value:money(totals.sales),note:store.sales.length+" فاتورة مسجلة",icon:TrendingUp},{label:"المصروفات",value:money(totals.expenses),note:store.expenses.length+" مصروف مسجل",icon:Wallet},{label:"قيمة المخزون",value:money(totals.stock),note:store.inventory.length+" منتج",icon:Boxes},{label:"العملاء",value:String(store.customers.length),note:"عميل مسجل",icon:Users}];
 return <div className="app-shell">
  <aside className={"sidebar "+(mobileOpen?"open":"")}><div className="brand"><strong>مدار</strong><span>نظام إدارة الأعمال</span></div><div className="company"><b>منشأتي</b><small>المساحة الرئيسية　⌄</small></div><div className="nav-label">إدارة المنشأة</div><nav className="nav-list">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} className={"nav-item "+(page===item.id?"active":"")} onClick={()=>{setPage(item.id);setMobileOpen(false);setQuery("");setFilter("الكل");}}><Icon/><span>{item.label}</span></button>})}</nav><div className="sidebar-bottom"><div className="support"><b>بياناتك تحت سيطرتك</b><p>تُحفظ محلياً على هذا المتصفح.</p><a href="mailto:support@example.com">الدعم الفني ←</a></div><button className="nav-item" onClick={()=>{if(confirm("سيتم استعادة بيانات العرض التجريبية وحذف بياناتك الحالية من هذا المتصفح. متابعة؟"))setStore(seed);}}><Settings/><span>استعادة بيانات العرض</span></button><div className="sidebar-foot">مدار ERP • نسخة تجريبية تفاعلية</div></div></aside>
  <main className="main"><header className="topbar"><div style={{display:"flex",alignItems:"center",gap:12}}><button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="القائمة">{mobileOpen?<X/>:<Menu/>}</button><span className="crumb">إدارة المنشأة　/　{titles[page]}</span></div><div className="top-actions"><label className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث في السجلات الحالية..."/></label><button className="icon-btn" onClick={()=>notify("كل شيء محدث")} aria-label="الإشعارات"><Bell size={19}/></button><div className="profile"><b>مدير المنشأة</b><small title={userEmail}>{userEmail || "مساحة العمل"}</small></div><SignOutButton/></div></header>
  <div className="content"><div className="page-heading"><div><h1>{titles[page]}</h1><p>{page==="overview"?"تابع أعمالك وأرقام منشأتك من مكان واحد.":page==="reports"?"تقارير مبنية على البيانات المسجلة في النظام.":"أضف وعدّل وتابع بياناتك بسهولة."}</p></div><div className="actions">{kind&&<button className="btn" onClick={exportCurrent}><Download size={15}/> تصدير Excel / CSV</button>}{kind&&<button className="btn btn-primary" onClick={()=>openCreate()}><Plus size={17}/> إضافة {labels[kind].singular}</button>}{page==="overview"&&<button className="btn btn-primary" onClick={createInvoice}><Plus size={17}/> إنشاء فاتورة</button>}</div></div>
  {page==="overview"&&<><section className="metrics">{metricCards.map(m=>{const Icon=m.icon;return <article className="metric" key={m.label}><div className="metric-label">{m.label}</div><div className="metric-value">{m.value}</div><div className="metric-note neutral">{m.note}</div><Icon size={18} color="#087f70"/></article>})}</section><section className="lower-grid"><article className="panel"><div className="panel-head"><div><h2>آخر الفواتير</h2><p>أحدث عمليات البيع المسجلة</p></div><button className="btn" onClick={()=>setPage("sales")}>عرض الكل</button></div><div className="table-wrap"><table><thead><tr><th>رقم الفاتورة</th><th>العميل</th><th>الإجمالي</th><th>الحالة</th><th></th></tr></thead><tbody>{store.sales.slice(0,6).map(r=><tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{money(r.amount)}</td><td><Status value={r.status}/></td><td><button className="icon-btn" onClick={()=>printInvoice(r)} title="طباعة الفاتورة"><Printer size={16}/></button></td></tr>)}</tbody></table></div></article><article className="panel"><div className="panel-head"><h2>تنبيهات المخزون</h2></div>{store.inventory.filter(r=>r.qty<=10).length?store.inventory.filter(r=>r.qty<=10).map(r=><div className="alert-item" key={r.id}><b>{r.name}</b><span>المتبقي: {r.qty} — راجع إعادة الطلب</span></div>):<div className="empty">لا توجد منتجات منخفضة المخزون</div>}</article></section><section className="metrics" style={{marginTop:18}}><article className="panel"><h2>اختصارات سريعة</h2><div className="actions" style={{marginTop:12,flexWrap:"wrap"}}><button className="btn" onClick={()=>setPage("customers")}>إدارة العملاء</button><button className="btn" onClick={()=>setPage("inventory")}>إدارة المنتجات</button><button className="btn" onClick={()=>setPage("expenses")}>تسجيل مصروف</button><button className="btn" onClick={()=>setPage("reports")}>عرض التقارير</button></div></article></section></>}
  {kind&&<section className="panel section-panel"><div className="panel-head"><div><h2>{labels[kind].singular==="فاتورة"?"سجل الفواتير":"سجل "+(titles[page])}</h2><p>{rows.length} سجل ظاهر • التغييرات تحفظ تلقائياً على هذا الجهاز</p></div><div className="actions"><select className="btn" value={filter} onChange={e=>setFilter(e.target.value)}><option>الكل</option>{(kind==="sales"?["مدفوعة","بانتظار الدفع","متأخرة"]:kind==="inventory"?["متوفر","مخزون منخفض","نفد"]:kind==="customers"?["نشط","غير نشط"]:kind==="expenses"?["مسجل","معلق"]:["على رأس العمل","إجازة"]).map(s=><option key={s}>{s}</option>)}</select></div></div><div className="table-wrap page-table"><table><thead><tr><th>{labels[kind].id}</th><th>الاسم</th><th>{labels[kind].detail}</th><th>{labels[kind].amount} (ج.م)</th><th>{labels[kind].qty}</th><th>الحالة</th><th>التاريخ</th><th>إجراءات</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.detail}</td><td>{money(r.amount)}</td><td>{r.qty}</td><td><Status value={r.status}/></td><td>{r.date}</td><td><div style={{display:"flex",gap:4}}>{kind==="sales"&&<button className="icon-btn" title="طباعة" onClick={()=>printInvoice(r)}><Printer size={16}/></button>}<button className="icon-btn" title="تعديل" onClick={()=>openCreate(r)}><Pencil size={16}/></button><button className="icon-btn" title="حذف" onClick={()=>removeRecord(r.id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{rows.length===0&&<div className="empty">لا توجد سجلات. ابدأ بإضافة سجل جديد.</div>}</div></section>}
  {page==="reports"&&<><section className="metrics">{metricCards.map(m=><article className="metric" key={m.label}><div className="metric-label">{m.label}</div><div className="metric-value">{m.value}</div><div className="metric-note neutral">{m.note}</div></article>)}</section><section className="panel section-panel"><div className="panel-head"><div><h2>ملخص الأداء المالي</h2><p>حسب البيانات المسجلة حالياً</p></div><button className="btn btn-primary" onClick={()=>downloadCsv("modar-financial-report.csv",[{metric:"المبيعات",value:totals.sales},{metric:"المصروفات",value:totals.expenses},{metric:"صافي الفرق",value:totals.sales-totals.expenses},{metric:"قيمة المخزون",value:totals.stock}])}><Download size={15}/> تصدير التقرير</button></div><div className="report-grid"><div><span>إجمالي المبيعات</span><b>{money(totals.sales)}</b></div><div><span>إجمالي المصروفات</span><b>{money(totals.expenses)}</b></div><div><span>صافي الفرق (قبل الضرائب)</span><b>{money(totals.sales-totals.expenses)}</b></div><div><span>قيمة المخزون الحالية</span><b>{money(totals.stock)}</b></div></div></section></>}
  <div style={{display:"flex",justifyContent:"space-between",color:"#819196",fontSize:11,marginTop:18}}><span>مدار ERP • نظام إدارة المنشأة</span><span>{ready?"الحفظ التلقائي مفعل":"جارٍ تحميل البيانات..."}</span></div></div></main>
  {modal&&kind&&<div className="modal-backdrop" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>{editing?"تعديل "+labels[kind].singular:"إضافة "+labels[kind].singular}</h2><form onSubmit={saveRecord}><label>الاسم<input autoFocus required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="اكتب الاسم"/></label><label>{labels[kind].detail}<input value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})} placeholder="بيانات إضافية"/></label>{kind!=="customers"&&<label>{labels[kind].amount} بالجنيه المصري<input type="number" min="0" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label>}{["inventory","hr"].includes(kind)&&<label>الكمية / العدد<input type="number" min="0" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})}/></label>}<label>الحالة<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{(kind==="sales"?["مدفوعة","بانتظار الدفع","متأخرة"]:kind==="inventory"?["متوفر","مخزون منخفض","نفد"]:kind==="customers"?["نشط","غير نشط"]:kind==="expenses"?["مسجل","معلق"]:["على رأس العمل","إجازة"]).map(s=><option key={s}>{s}</option>)}</select></label><label>التاريخ<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><div className="modal-actions"><button className="btn btn-primary" type="submit"><Save size={15}/> حفظ</button><button className="btn" type="button" onClick={()=>setModal(false)}>إلغاء</button></div></form></div></div>}
  {selected&&<div className="print-only invoice-paper"><h1>مدار ERP</h1><h2>فاتورة مبيعات</h2><p>رقم الفاتورة: {selected.id}</p><p>التاريخ: {selected.date}</p><hr/><p>العميل: {selected.name}</p><p>البيان: {selected.detail}</p><h2>الإجمالي: {money(selected.amount)}</h2><p>الحالة: {selected.status}</p><p>شكراً لتعاملكم معنا</p><button className="btn no-print" onClick={()=>setSelected(null)}>إغلاق</button></div>}
  {toast&&<div className="toast" role="status">{toast}</div>}
 </div>;
}
