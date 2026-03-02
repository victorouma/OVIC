
import { useState, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:    #0a1628;
    --navy2:   #0f2045;
    --blue:    #1a3a6b;
    --sky:     #0d84ff;
    --cyan:    #00c8e0;
    --teal:    #00e0b0;
    --green:   #00d084;
    --amber:   #ffb020;
    --red:     #ff4d6a;
    --purple:  #8b5cf6;
    --white:   #f0f4ff;
    --muted:   #7a8fb5;
    --border:  #1e3055;
    --card:    #0d1e38;
    --card2:   #112240;
    --glass:   rgba(13,26,56,0.7);
    --font:    'Sora', sans-serif;
    --mono:    'JetBrains Mono', monospace;
    --radius:  12px;
    --shadow:  0 8px 32px rgba(0,0,0,0.4);
  }

  html, body, #root { height: 100%; }

  body {
    font-family: var(--font);
    background: var(--navy);
    color: var(--white);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* Animations */
  @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:.5; } }
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes slideIn { from { transform: translateX(-20px); opacity:0; } to { transform: translateX(0); opacity:1; } }
  @keyframes scaleIn { from { transform: scale(0.92); opacity:0; } to { transform: scale(1); opacity:1; } }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }

  .fade-in  { animation: fadeIn  .4s ease forwards; }
  .scale-in { animation: scaleIn .3s ease forwards; }
  .slide-in { animation: slideIn .3s ease forwards; }

  /* Layout */
  .app        { display:flex; height:100vh; overflow:hidden; }
  .sidebar    { width:260px; min-width:260px; background:var(--navy2); border-right:1px solid var(--border); display:flex; flex-direction:column; transition:.3s; overflow:hidden; }
  .sidebar.collapsed { width:68px; min-width:68px; }
  .main       { flex:1; display:flex; flex-direction:column; overflow:hidden; }
  .topbar     { height:60px; background:var(--card); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 24px; gap:16px; flex-shrink:0; }
  .content    { flex:1; overflow-y:auto; padding:24px; }
  .page       { animation: fadeIn .4s ease; }

  /* Sidebar */
  .sidebar-logo {
    padding: 20px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items:center; gap:12px;
    overflow: hidden;
  }
  .logo-icon {
    width:38px; height:38px; border-radius:10px;
    background: linear-gradient(135deg, var(--sky), var(--cyan));
    display:flex; align-items:center; justify-content:center;
    font-size:18px; flex-shrink:0;
  }
  .logo-text { overflow:hidden; }
  .logo-text h2 { font-size:14px; font-weight:700; color:var(--white); white-space:nowrap; letter-spacing:.5px; }
  .logo-text p  { font-size:10px; color:var(--muted); white-space:nowrap; letter-spacing:1px; text-transform:uppercase; }

  .sidebar-nav { flex:1; padding:12px 8px; overflow-y:auto; }
  .nav-section { margin-bottom:20px; }
  .nav-section-label {
    font-size:10px; font-weight:600; color:var(--muted);
    text-transform:uppercase; letter-spacing:1.5px;
    padding:4px 10px 8px; overflow:hidden; white-space:nowrap;
  }
  .nav-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 10px; border-radius:var(--radius);
    cursor:pointer; transition:.2s; margin-bottom:2px;
    color:var(--muted); font-size:14px; font-weight:500;
    overflow:hidden; white-space:nowrap;
    border: 1px solid transparent;
  }
  .nav-item:hover { background:var(--blue); color:var(--white); }
  .nav-item.active {
    background: linear-gradient(90deg, rgba(13,132,255,.2), rgba(0,200,224,.1));
    color: var(--sky); border-color: rgba(13,132,255,.3);
  }
  .nav-item .icon { font-size:18px; flex-shrink:0; width:22px; text-align:center; }
  .nav-badge {
    margin-left:auto; background:var(--red); color:#fff;
    font-size:10px; padding:2px 7px; border-radius:10px; font-weight:600;
  }
  .sidebar-footer { padding:12px 8px; border-top:1px solid var(--border); }

  /* Topbar */
  .topbar-title { font-size:16px; font-weight:600; flex:1; }
  .topbar-actions { display:flex; align-items:center; gap:12px; }
  .topbar-btn {
    width:36px; height:36px; border-radius:10px;
    background:var(--card2); border:1px solid var(--border);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:.2s; font-size:16px; position:relative;
  }
  .topbar-btn:hover { background:var(--blue); }
  .notif-dot {
    position:absolute; top:6px; right:6px;
    width:8px; height:8px; background:var(--red);
    border-radius:50%; border:2px solid var(--card);
  }
  .avatar {
    width:36px; height:36px; border-radius:10px;
    background: linear-gradient(135deg, var(--sky), var(--purple));
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; cursor:pointer;
  }

  /* Cards */
  .card {
    background: var(--card); border:1px solid var(--border);
    border-radius: var(--radius); padding:20px;
  }
  .card-glass {
    background: var(--glass); backdrop-filter: blur(12px);
    border:1px solid var(--border); border-radius:var(--radius); padding:20px;
  }

  /* Stat Cards */
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:16px; margin-bottom:24px; }
  .stat-card {
    background: var(--card2); border:1px solid var(--border);
    border-radius: var(--radius); padding:20px;
    display:flex; flex-direction:column; gap:10px;
    transition:.2s; cursor:default;
    position:relative; overflow:hidden;
  }
  .stat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
  }
  .stat-card.blue::before  { background: linear-gradient(90deg, var(--sky), var(--cyan)); }
  .stat-card.green::before { background: linear-gradient(90deg, var(--green), var(--teal)); }
  .stat-card.amber::before { background: linear-gradient(90deg, var(--amber), #ff8c00); }
  .stat-card.red::before   { background: linear-gradient(90deg, var(--red), var(--purple)); }
  .stat-card.purple::before{ background: linear-gradient(90deg, var(--purple), var(--sky)); }
  .stat-card:hover { border-color: var(--sky); transform: translateY(-2px); }
  .stat-header { display:flex; justify-content:space-between; align-items:center; }
  .stat-icon { font-size:22px; }
  .stat-change { font-size:11px; padding:2px 8px; border-radius:20px; font-weight:600; }
  .stat-change.up   { background:rgba(0,208,132,.15); color:var(--green); }
  .stat-change.down { background:rgba(255,77,106,.15); color:var(--red); }
  .stat-value { font-size:28px; font-weight:800; font-family:var(--mono); }
  .stat-label { font-size:12px; color:var(--muted); font-weight:500; text-transform:uppercase; letter-spacing:.5px; }

  /* Tables */
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  thead th {
    text-align:left; padding:10px 14px;
    font-size:11px; font-weight:600; color:var(--muted);
    text-transform:uppercase; letter-spacing:.8px;
    border-bottom:1px solid var(--border);
    background: var(--navy2);
  }
  tbody tr { border-bottom:1px solid var(--border); transition:.15s; }
  tbody tr:hover { background: rgba(13,132,255,.05); }
  tbody td { padding:12px 14px; color:var(--white); }
  tbody tr:last-child { border-bottom:none; }

  /* Badges */
  .badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600;
  }
  .badge-green  { background:rgba(0,208,132,.15); color:var(--green); }
  .badge-blue   { background:rgba(13,132,255,.15); color:var(--sky); }
  .badge-amber  { background:rgba(255,176,32,.15); color:var(--amber); }
  .badge-red    { background:rgba(255,77,106,.15); color:var(--red); }
  .badge-purple { background:rgba(139,92,246,.15); color:var(--purple); }
  .badge-muted  { background:rgba(122,143,181,.15); color:var(--muted); }
  .badge-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }

  /* Buttons */
  .btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:9px 18px; border-radius:var(--radius); border:none;
    font-family:var(--font); font-size:13px; font-weight:600;
    cursor:pointer; transition:.2s; white-space:nowrap;
  }
  .btn-primary { background: linear-gradient(135deg, var(--sky), var(--cyan)); color:#fff; }
  .btn-primary:hover { opacity:.9; transform:translateY(-1px); }
  .btn-outline {
    background:transparent; color:var(--sky);
    border:1px solid var(--sky);
  }
  .btn-outline:hover { background:rgba(13,132,255,.1); }
  .btn-ghost { background:var(--card2); color:var(--muted); border:1px solid var(--border); }
  .btn-ghost:hover { color:var(--white); border-color:var(--muted); }
  .btn-danger { background:rgba(255,77,106,.15); color:var(--red); border:1px solid rgba(255,77,106,.3); }
  .btn-danger:hover { background:rgba(255,77,106,.25); }
  .btn-sm { padding:6px 12px; font-size:12px; }
  .btn-icon { padding:8px; border-radius:8px; }

  /* Inputs */
  .input, .select, textarea {
    width:100%; padding:10px 14px; background:var(--card2);
    border:1px solid var(--border); border-radius:var(--radius);
    color:var(--white); font-family:var(--font); font-size:14px;
    outline:none; transition:.2s;
  }
  .input:focus, .select:focus, textarea:focus { border-color:var(--sky); box-shadow:0 0 0 3px rgba(13,132,255,.15); }
  .input::placeholder { color:var(--muted); }
  .select option { background:var(--navy2); }
  .input-group { display:flex; align-items:center; position:relative; }
  .input-group .icon { position:absolute; left:12px; color:var(--muted); font-size:16px; pointer-events:none; }
  .input-group .input { padding-left:38px; }

  /* Search */
  .search-bar {
    display:flex; align-items:center; gap:8px;
    background:var(--card2); border:1px solid var(--border);
    border-radius:var(--radius); padding:8px 14px;
    flex:1; max-width:400px;
  }
  .search-bar input {
    background:none; border:none; outline:none;
    color:var(--white); font-family:var(--font); font-size:14px; flex:1;
  }
  .search-bar input::placeholder { color:var(--muted); }

  /* Grid Layouts */
  .grid-2  { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .grid-3  { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; }
  .grid-12 { display:grid; grid-template-columns:1fr 2fr; gap:20px; }
  .grid-21 { display:grid; grid-template-columns:2fr 1fr; gap:20px; }

  /* Flex utils */
  .flex    { display:flex; }
  .flex-1  { flex:1; }
  .items-center { align-items:center; }
  .justify-between { justify-content:space-between; }
  .gap-8  { gap:8px; }
  .gap-12 { gap:12px; }
  .gap-16 { gap:16px; }
  .mb-16  { margin-bottom:16px; }
  .mb-20  { margin-bottom:20px; }
  .mb-24  { margin-bottom:24px; }
  .mt-16  { margin-top:16px; }

  /* Typography */
  .page-title  { font-size:22px; font-weight:800; margin-bottom:4px; }
  .page-sub    { font-size:13px; color:var(--muted); }
  .section-title { font-size:15px; font-weight:700; margin-bottom:16px; }
  .text-muted  { color:var(--muted); }
  .text-sm     { font-size:12px; }
  .text-mono   { font-family:var(--mono); }
  .font-bold   { font-weight:700; }

  /* Modals */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; z-index:1000;
    animation: fadeIn .2s ease;
  }
  .modal {
    background:var(--card2); border:1px solid var(--border);
    border-radius:16px; padding:28px; width:90%; max-width:600px;
    max-height:90vh; overflow-y:auto;
    animation: scaleIn .25s ease;
  }
  .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
  .modal-title  { font-size:18px; font-weight:700; }
  .modal-close  { font-size:20px; cursor:pointer; color:var(--muted); line-height:1; }
  .modal-close:hover { color:var(--white); }
  .modal-footer { display:flex; justify-content:flex-end; gap:12px; margin-top:24px; }
  .form-row     { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
  .form-group   { margin-bottom:14px; }
  .form-label   { display:block; font-size:12px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }

  /* Charts */
  .chart-bar-wrap { display:flex; align-items:flex-end; gap:8px; height:120px; padding:0 4px; }
  .chart-bar-col  { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end; }
  .chart-bar      { width:100%; border-radius:6px 6px 0 0; transition:height .6s cubic-bezier(.4,0,.2,1); min-height:4px; }
  .chart-bar-label { font-size:10px; color:var(--muted); }

  /* Progress */
  .progress-wrap { background:var(--navy2); border-radius:20px; height:8px; overflow:hidden; }
  .progress-bar  { height:100%; border-radius:20px; transition: width .6s ease; }

  /* Login */
  .login-wrap {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background: radial-gradient(ellipse at 30% 40%, rgba(13,132,255,.12) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(0,200,224,.08) 0%, transparent 60%),
                var(--navy);
  }
  .login-box {
    background:var(--card); border:1px solid var(--border);
    border-radius:20px; padding:40px; width:420px;
    box-shadow: var(--shadow);
    animation: scaleIn .4s ease;
  }
  .login-logo { text-align:center; margin-bottom:32px; }
  .login-logo .big-icon {
    width:64px; height:64px; border-radius:18px;
    background: linear-gradient(135deg, var(--sky), var(--cyan));
    display:inline-flex; align-items:center; justify-content:center;
    font-size:30px; margin-bottom:14px;
    box-shadow: 0 8px 24px rgba(13,132,255,.4);
  }
  .login-logo h1 { font-size:20px; font-weight:800; }
  .login-logo p  { font-size:12px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; }

  /* Notifications panel */
  .notif-panel {
    position:absolute; top:52px; right:0; width:340px;
    background:var(--card2); border:1px solid var(--border);
    border-radius:var(--radius); box-shadow:var(--shadow); z-index:100;
    animation: scaleIn .2s ease;
  }
  .notif-item {
    padding:14px 16px; border-bottom:1px solid var(--border);
    display:flex; gap:12px; align-items:flex-start; cursor:pointer; transition:.15s;
  }
  .notif-item:hover { background:rgba(13,132,255,.05); }
  .notif-item:last-child { border-bottom:none; }
  .notif-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .notif-text { font-size:13px; }
  .notif-time { font-size:11px; color:var(--muted); margin-top:2px; }

  /* Patient profile */
  .patient-avatar {
    width:64px; height:64px; border-radius:16px;
    display:flex; align-items:center; justify-content:center;
    font-size:24px; font-weight:800; flex-shrink:0;
  }

  /* Timeline */
  .timeline { position:relative; padding-left:24px; }
  .timeline::before { content:''; position:absolute; left:7px; top:0; bottom:0; width:2px; background:var(--border); }
  .timeline-item { position:relative; margin-bottom:20px; }
  .timeline-dot {
    position:absolute; left:-20px; top:4px;
    width:14px; height:14px; border-radius:50%; border:2px solid var(--card2);
    flex-shrink:0;
  }
  .timeline-content { background:var(--card2); border:1px solid var(--border); border-radius:var(--radius); padding:14px; }
  .timeline-title { font-size:13px; font-weight:600; margin-bottom:4px; }
  .timeline-time  { font-size:11px; color:var(--muted); }

  /* Tabs */
  .tabs { display:flex; gap:4px; background:var(--navy2); padding:4px; border-radius:var(--radius); margin-bottom:24px; }
  .tab {
    flex:1; padding:8px 16px; border-radius:8px; text-align:center;
    font-size:13px; font-weight:600; cursor:pointer; transition:.2s; color:var(--muted);
  }
  .tab.active { background:var(--card); color:var(--white); }
  .tab:hover:not(.active) { color:var(--white); }

  /* Vitals */
  .vital-card {
    background:var(--card2); border:1px solid var(--border); border-radius:var(--radius);
    padding:16px; text-align:center;
  }
  .vital-value { font-size:24px; font-weight:800; font-family:var(--mono); }
  .vital-unit  { font-size:11px; color:var(--muted); }
  .vital-label { font-size:12px; color:var(--muted); margin-top:4px; }

  /* Alert */
  .alert {
    padding:14px 16px; border-radius:var(--radius); border-left:4px solid;
    margin-bottom:16px; font-size:13px; display:flex; gap:10px; align-items:flex-start;
  }
  .alert-info    { background:rgba(13,132,255,.08);  border-color:var(--sky);    color:#a8d4ff; }
  .alert-success { background:rgba(0,208,132,.08);   border-color:var(--green);  color:#a8ffdc; }
  .alert-warning { background:rgba(255,176,32,.08);  border-color:var(--amber);  color:#ffe0a8; }
  .alert-danger  { background:rgba(255,77,106,.08);  border-color:var(--red);    color:#ffa8b8; }

  /* Calendar */
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:6px; }
  .cal-cell {
    aspect-ratio:1; display:flex; flex-direction:column; align-items:center;
    justify-content:center; border-radius:8px; font-size:13px; cursor:pointer;
    transition:.15s; position:relative;
  }
  .cal-cell:hover { background:var(--blue); }
  .cal-cell.today { background: rgba(13,132,255,.2); color:var(--sky); font-weight:700; }
  .cal-cell.has-event::after {
    content:''; position:absolute; bottom:3px; width:4px; height:4px;
    background:var(--sky); border-radius:50%;
  }
  .cal-cell.empty { opacity:0; pointer-events:none; }

  /* Loading */
  .spinner { width:20px; height:20px; border:2px solid var(--border); border-top-color:var(--sky); border-radius:50%; animation:spin .7s linear infinite; }
  .skeleton { background: linear-gradient(90deg, var(--card2) 25%, var(--blue) 50%, var(--card2) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:var(--radius); }

  /* Responsive helpers */
  @media (max-width: 900px) {
    .grid-2, .grid-3, .grid-12, .grid-21 { grid-template-columns:1fr; }
    .form-row { grid-template-columns:1fr; }
    .sidebar { width:68px; min-width:68px; }
    .sidebar .nav-section-label,
    .sidebar .nav-item span,
    .sidebar .logo-text { display:none; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const USERS = [
  { id:1, name:"Dr. Sarah Ovic",    role:"admin",     email:"admin@ohms.ke",   pass:"admin123",  dept:"Administration",   avatar:"SA" },
  { id:2, name:"Dr. James Mutua",   role:"doctor",    email:"doctor@ohms.ke",  pass:"doctor123", dept:"General Medicine", avatar:"JM" },
  { id:3, name:"Nurse Faith Wanjiku",role:"nurse",    email:"nurse@ohms.ke",   pass:"nurse123",  dept:"Pediatrics",       avatar:"FW" },
  { id:4, name:"Kevin Odhiambo",    role:"receptionist",email:"recept@ohms.ke",pass:"recept123",dept:"Front Desk",       avatar:"KO" },
  { id:5, name:"Patricia Atieno",   role:"pharmacist",email:"pharma@ohms.ke",  pass:"pharma123", dept:"Pharmacy",         avatar:"PA" },
  { id:6, name:"John Kamau",        role:"lab",       email:"lab@ohms.ke",     pass:"lab123",    dept:"Laboratory",       avatar:"JK" },
];

const initPatients = [
  { id:"P001", name:"Alice Njoroge",   age:34, gender:"Female", blood:"O+", phone:"0712345678", email:"alice@email.com",  ward:"General",   doctor:"Dr. James Mutua", status:"Admitted",    diagnosis:"Malaria",          admitted:"2024-01-10", address:"Nairobi, Kenya" },
  { id:"P002", name:"Brian Otieno",    age:28, gender:"Male",   blood:"A+", phone:"0723456789", email:"brian@email.com",  ward:"ICU",       doctor:"Dr. Sarah Ovic",  status:"Critical",    diagnosis:"Cardiac Arrest",   admitted:"2024-01-12", address:"Mombasa, Kenya" },
  { id:"P003", name:"Carol Wambui",    age:45, gender:"Female", blood:"B-", phone:"0734567890", email:"carol@email.com",  ward:"Maternity", doctor:"Dr. James Mutua", status:"Stable",      diagnosis:"Prenatal Care",    admitted:"2024-01-08", address:"Kisumu, Kenya" },
  { id:"P004", name:"David Kipchoge",  age:52, gender:"Male",   blood:"AB+",phone:"0745678901", email:"david@email.com",  ward:"Surgery",   doctor:"Dr. Sarah Ovic",  status:"Post-Op",     diagnosis:"Appendectomy",     admitted:"2024-01-14", address:"Nakuru, Kenya" },
  { id:"P005", name:"Eva Achieng",     age:19, gender:"Female", blood:"O-", phone:"0756789012", email:"eva@email.com",    ward:"Pediatrics",doctor:"Dr. James Mutua", status:"Recovering",  diagnosis:"Typhoid Fever",    admitted:"2024-01-11", address:"Eldoret, Kenya" },
  { id:"P006", name:"Frank Mwangi",    age:61, gender:"Male",   blood:"A-", phone:"0767890123", email:"frank@email.com",  ward:"General",   doctor:"Dr. Sarah Ovic",  status:"Discharged",  diagnosis:"Diabetes",         admitted:"2024-01-05", address:"Thika, Kenya" },
  { id:"P007", name:"Grace Chebet",    age:38, gender:"Female", blood:"B+", phone:"0778901234", email:"grace@email.com",  ward:"Orthopaedic",doctor:"Dr. James Mutua",status:"Admitted",   diagnosis:"Fractured Femur",  admitted:"2024-01-13", address:"Kericho, Kenya" },
  { id:"P008", name:"Henry Ouma",      age:44, gender:"Male",   blood:"O+", phone:"0789012345", email:"henry@email.com",  ward:"Cardiology",doctor:"Dr. Sarah Ovic",  status:"Monitoring",  diagnosis:"Hypertension",     admitted:"2024-01-09", address:"Nairobi, Kenya" },
];

const initDoctors = [
  { id:"D001", name:"Dr. James Mutua",    specialization:"General Medicine",  department:"General",    phone:"0711000001", email:"james@ohms.ke",   status:"Available",  schedule:"Mon-Fri 8am-5pm",  patients:24, experience:"12 years" },
  { id:"D002", name:"Dr. Sarah Ovic",     specialization:"Cardiology",        department:"Cardiology", phone:"0711000002", email:"sarah@ohms.ke",   status:"In Surgery", schedule:"Mon-Sat 7am-3pm",  patients:18, experience:"15 years" },
  { id:"D003", name:"Dr. Peter Kariuki",  specialization:"Pediatrics",        department:"Pediatrics", phone:"0711000003", email:"peter@ohms.ke",   status:"Available",  schedule:"Tue-Sat 9am-6pm",  patients:31, experience:"8 years"  },
  { id:"D004", name:"Dr. Mary Adhiambo",  specialization:"Obstetrics",        department:"Maternity",  phone:"0711000004", email:"mary@ohms.ke",    status:"On Call",    schedule:"Mon-Fri 8am-8pm",  patients:15, experience:"10 years" },
  { id:"D005", name:"Dr. Paul Kimani",    specialization:"Surgery",           department:"Surgery",    phone:"0711000005", email:"paul@ohms.ke",    status:"Available",  schedule:"Mon-Fri 7am-4pm",  patients:9,  experience:"20 years" },
];

const initAppointments = [
  { id:"A001", patient:"Alice Njoroge",   doctor:"Dr. James Mutua",   date:"2024-01-15", time:"09:00", type:"Consultation", status:"Confirmed",  notes:"Follow-up malaria treatment"   },
  { id:"A002", patient:"Brian Otieno",    doctor:"Dr. Sarah Ovic",    date:"2024-01-15", time:"10:30", type:"Emergency",    status:"Urgent",     notes:"Cardiac monitoring"             },
  { id:"A003", patient:"Carol Wambui",    doctor:"Dr. Mary Adhiambo", date:"2024-01-16", time:"11:00", type:"Prenatal",     status:"Confirmed",  notes:"Third trimester check"          },
  { id:"A004", patient:"David Kipchoge",  doctor:"Dr. Paul Kimani",   date:"2024-01-17", time:"08:00", type:"Surgery",      status:"Scheduled",  notes:"Pre-op assessment"              },
  { id:"A005", patient:"Eva Achieng",     doctor:"Dr. Peter Kariuki", date:"2024-01-18", time:"14:00", type:"Follow-up",    status:"Pending",    notes:"Typhoid recovery check"         },
  { id:"A006", patient:"Henry Ouma",      doctor:"Dr. Sarah Ovic",    date:"2024-01-19", time:"09:30", type:"Consultation", status:"Confirmed",  notes:"Blood pressure review"          },
];

const initInventory = [
  { id:"I001", name:"Paracetamol 500mg",  category:"Medicine",    qty:1240, unit:"tablets",  reorder:200, supplier:"Medisel",    price:0.5,   expiry:"2025-12-01", status:"In Stock"     },
  { id:"I002", name:"Amoxicillin 250mg",  category:"Medicine",    qty:85,   unit:"capsules", reorder:100, supplier:"Medisel",    price:1.2,   expiry:"2025-06-15", status:"Low Stock"    },
  { id:"I003", name:"Normal Saline 500ml",category:"IV Fluid",    qty:340,  unit:"bags",     reorder:50,  supplier:"Kenpharm",   price:3.8,   expiry:"2026-01-10", status:"In Stock"     },
  { id:"I004", name:"Surgical Gloves M",  category:"Consumables", qty:22,   unit:"boxes",    reorder:30,  supplier:"MedSupply",  price:8.5,   expiry:"2027-05-01", status:"Low Stock"    },
  { id:"I005", name:"Metformin 500mg",    category:"Medicine",    qty:560,  unit:"tablets",  reorder:100, supplier:"Medisel",    price:0.8,   expiry:"2025-09-20", status:"In Stock"     },
  { id:"I006", name:"Insulin 100IU",      category:"Medicine",    qty:0,    unit:"vials",    reorder:20,  supplier:"Kenpharm",   price:15.0,  expiry:"2024-12-31", status:"Out of Stock" },
  { id:"I007", name:"X-Ray Film 35x43",   category:"Radiology",   qty:144,  unit:"sheets",   reorder:50,  supplier:"RadioMed",   price:4.2,   expiry:"2026-03-01", status:"In Stock"     },
  { id:"I008", name:"Face Masks",         category:"PPE",         qty:1800, unit:"pieces",   reorder:500, supplier:"MedSupply",  price:0.3,   expiry:"2026-06-01", status:"In Stock"     },
];

const initBilling = [
  { id:"B001", patient:"Alice Njoroge",  date:"2024-01-10", service:"Consultation + Medication", amount:4500,  paid:4500,  balance:0,    status:"Paid",     method:"MPESA"  },
  { id:"B002", patient:"Brian Otieno",   date:"2024-01-12", service:"ICU Daily Charges",          amount:25000, paid:10000, balance:15000,status:"Partial",  method:"Cash"   },
  { id:"B003", patient:"Carol Wambui",   date:"2024-01-08", service:"Maternity Package",          amount:35000, paid:0,     balance:35000,status:"Unpaid",   method:"-"      },
  { id:"B004", patient:"David Kipchoge", date:"2024-01-14", service:"Appendectomy Surgery",       amount:80000, paid:80000, balance:0,    status:"Paid",     method:"Insurance" },
  { id:"B005", patient:"Eva Achieng",    date:"2024-01-11", service:"Lab Tests + Medication",     amount:7200,  paid:7200,  balance:0,    status:"Paid",     method:"MPESA"  },
  { id:"B006", patient:"Henry Ouma",     date:"2024-01-09", service:"Cardiology Consultation",    amount:12000, paid:6000,  balance:6000, status:"Partial",  method:"Card"   },
];

const labTests = [
  { id:"L001", patient:"Alice Njoroge",  test:"Malaria RDT",         requested:"Dr. James Mutua", date:"2024-01-10", result:"Positive", status:"Completed", priority:"Urgent" },
  { id:"L002", patient:"Brian Otieno",   test:"Cardiac Enzymes",     requested:"Dr. Sarah Ovic",  date:"2024-01-12", result:"Elevated", status:"Completed", priority:"Urgent" },
  { id:"L003", patient:"Eva Achieng",    test:"Widal Test",          requested:"Dr. Peter Kariuki",date:"2024-01-11", result:"1:160",    status:"Completed", priority:"Normal" },
  { id:"L004", patient:"Henry Ouma",     test:"Lipid Profile",       requested:"Dr. Sarah Ovic",  date:"2024-01-09", result:"Pending",  status:"Processing",priority:"Normal" },
  { id:"L005", patient:"Grace Chebet",   test:"X-Ray Femur",         requested:"Dr. James Mutua", date:"2024-01-13", result:"Fracture", status:"Completed", priority:"Urgent" },
  { id:"L006", patient:"Carol Wambui",   test:"CBC + Urinalysis",    requested:"Dr. Mary Adhiambo",date:"2024-01-08",result:"Normal",   status:"Completed", priority:"Normal" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const admissionsData = [45,58,72,61,89,95,78,102,88,115,97,134];
const revenueData    = [120,145,132,168,195,210,185,230,198,245,222,280];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const statusColor = s => {
  if (!s) return "badge-muted";
  const m = { "Admitted":"badge-blue","Critical":"badge-red","Stable":"badge-green","Recovering":"badge-green",
    "Post-Op":"badge-amber","Discharged":"badge-muted","Monitoring":"badge-purple","In Surgery":"badge-red",
    "Available":"badge-green","On Call":"badge-amber","Confirmed":"badge-green","Urgent":"badge-red",
    "Scheduled":"badge-blue","Pending":"badge-amber","Completed":"badge-green","Processing":"badge-amber",
    "Paid":"badge-green","Partial":"badge-amber","Unpaid":"badge-red","In Stock":"badge-green",
    "Low Stock":"badge-amber","Out of Stock":"badge-red","Partial":"badge-amber" };
  return m[s] || "badge-muted";
};

const fmtCurrency = n => `KSh ${Number(n).toLocaleString()}`;
const uid = () => Math.random().toString(36).slice(2,9).toUpperCase();
const today = () => new Date().toISOString().slice(0,10);

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function MiniBarChart({ data, color="#0d84ff" }) {
  const max = Math.max(...data);
  return (
    <div className="chart-bar-wrap">
      {data.map((v,i) => (
        <div className="chart-bar-col" key={i}>
          <div className="chart-bar"
            style={{ height:`${(v/max)*100}%`, background:`${color}`, opacity: i === data.length-1 ? 1 : 0.5 + (i/data.length)*0.5 }}/>
          <span className="chart-bar-label">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, max, color="var(--sky)" }) {
  return (
    <div className="progress-wrap">
      <div className="progress-bar" style={{ width:`${Math.min(100,(value/max)*100)}%`, background:color }}/>
    </div>
  );
}

function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <span className="modal-close" onClick={onClose}>✕</span>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input className="input" {...props}/>
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select className="select" {...props}>{children}</select>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.pass === pass);
      if (user) { onLogin(user); }
      else { setError("Invalid email or password. Please try again."); }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">
          <div className="big-icon">🏥</div>
          <h1>OVIC HOSPITALS</h1>
          <p>Management System — OHMS v2.0</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="input" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{position:"relative"}}>
            <input className="input" type={showPass?"text":"password"} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            <button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:16}}>{showPass?"🙈":"👁"}</button>
          </div>
        </div>

        <button className="btn btn-primary" style={{width:"100%",marginTop:8,padding:"13px"}} onClick={handleLogin} disabled={loading}>
          {loading ? <><span className="spinner"/>Signing in...</> : "🔐 Sign In to OHMS"}
        </button>

        <div style={{marginTop:24,padding:16,background:"var(--navy2)",borderRadius:10,border:"1px solid var(--border)"}}>
          <p style={{fontSize:11,color:"var(--muted)",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px"}}>Demo Accounts</p>
          {USERS.slice(0,4).map(u=>(
            <div key={u.id} onClick={()=>{setEmail(u.email);setPass(u.pass);}} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",cursor:"pointer",color:"var(--muted)",borderBottom:"1px solid var(--border)"}}>
              <span style={{color:"var(--sky)"}}>{u.email}</span>
              <span>{u.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, patients, appointments, billing }) {
  const totalRevenue = billing.reduce((s,b)=>s+b.paid,0);
  const admitted = patients.filter(p=>p.status!=="Discharged").length;
  const todayAppts = appointments.filter(a=>a.status!=="Cancelled").length;

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div>
          <h1 className="page-title">Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <p className="page-sub">{new Date().toLocaleDateString("en-KE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-outline btn-sm">📊 Generate Report</button>
          <button className="btn btn-primary btn-sm">➕ Quick Admit</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue fade-in">
          <div className="stat-header"><span className="stat-icon">🏥</span><span className="stat-change up">↑ 8%</span></div>
          <div className="stat-value">{admitted}</div>
          <div className="stat-label">Admitted Patients</div>
          <ProgressBar value={admitted} max={150} color="var(--sky)"/>
        </div>
        <div className="stat-card green fade-in" style={{animationDelay:".05s"}}>
          <div className="stat-header"><span className="stat-icon">📅</span><span className="stat-change up">↑ 12%</span></div>
          <div className="stat-value">{todayAppts}</div>
          <div className="stat-label">Appointments Today</div>
          <ProgressBar value={todayAppts} max={30} color="var(--green)"/>
        </div>
        <div className="stat-card amber fade-in" style={{animationDelay:".1s"}}>
          <div className="stat-header"><span className="stat-icon">👨‍⚕️</span><span className="stat-change up">↑ 3%</span></div>
          <div className="stat-value">{initDoctors.length}</div>
          <div className="stat-label">Active Doctors</div>
          <ProgressBar value={initDoctors.length} max={20} color="var(--amber)"/>
        </div>
        <div className="stat-card red fade-in" style={{animationDelay:".15s"}}>
          <div className="stat-header"><span className="stat-icon">💰</span><span className="stat-change up">↑ 18%</span></div>
          <div className="stat-value">{(totalRevenue/1000).toFixed(0)}K</div>
          <div className="stat-label">Revenue (KSh)</div>
          <ProgressBar value={totalRevenue} max={500000} color="var(--red)"/>
        </div>
        <div className="stat-card purple fade-in" style={{animationDelay:".2s"}}>
          <div className="stat-header"><span className="stat-icon">🔬</span><span className="stat-change down">↓ 2%</span></div>
          <div className="stat-value">{labTests.filter(l=>l.status==="Processing").length}</div>
          <div className="stat-label">Pending Lab Tests</div>
          <ProgressBar value={2} max={10} color="var(--purple)"/>
        </div>
        <div className="stat-card blue fade-in" style={{animationDelay:".25s"}}>
          <div className="stat-header"><span className="stat-icon">🏨</span><span className="stat-change up">↑ 5%</span></div>
          <div className="stat-value">78<span style={{fontSize:14}}>%</span></div>
          <div className="stat-label">Bed Occupancy</div>
          <ProgressBar value={78} max={100} color="var(--cyan)"/>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="flex items-center justify-between mb-16">
            <h3 className="section-title" style={{margin:0}}>📈 Monthly Admissions</h3>
            <span className="badge badge-green"><span className="badge-dot"/>+8% YoY</span>
          </div>
          <MiniBarChart data={admissionsData} color="var(--sky)"/>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-16">
            <h3 className="section-title" style={{margin:0}}>💹 Revenue Trend (KSh '000)</h3>
            <span className="badge badge-green"><span className="badge-dot"/>+18% YoY</span>
          </div>
          <MiniBarChart data={revenueData} color="var(--teal)"/>
        </div>
      </div>

      {/* Recent Patients + Alerts */}
      <div className="grid-21">
        <div className="card">
          <div className="flex items-center justify-between mb-16">
            <h3 className="section-title" style={{margin:0}}>Recent Patients</h3>
            <span className="badge badge-blue">{patients.length} total</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Ward</th><th>Status</th><th>Diagnosis</th></tr></thead>
              <tbody>
                {patients.slice(0,6).map(p=>(
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-8">
                        <div className="patient-avatar" style={{width:32,height:32,fontSize:13,background:"linear-gradient(135deg,var(--blue),var(--sky))"}}>
                          {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <div style={{fontWeight:600,fontSize:13}}>{p.name}</div>
                          <div style={{fontSize:11,color:"var(--muted)"}}>{p.id} · {p.age}y</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{fontSize:13}}>{p.ward}</span></td>
                    <td><span className={`badge ${statusColor(p.status)}`}><span className="badge-dot"/>{p.status}</span></td>
                    <td><span className="text-muted text-sm">{p.diagnosis}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card">
            <h3 className="section-title">🚨 Alerts</h3>
            <div className="alert alert-danger">🔴 <div><strong>ICU Full</strong><br/><span className="text-sm">ICU at 100% capacity</span></div></div>
            <div className="alert alert-warning">⚠️ <div><strong>Low Stock</strong><br/><span className="text-sm">Amoxicillin below reorder level</span></div></div>
            <div className="alert alert-info">ℹ️ <div><strong>Maintenance</strong><br/><span className="text-sm">MRI scheduled for service today</span></div></div>
          </div>

          <div className="card">
            <h3 className="section-title">🏥 Ward Overview</h3>
            {[{w:"General",used:18,total:30},{w:"ICU",used:8,total:8},{w:"Maternity",used:12,total:20},{w:"Surgery",used:6,total:15}].map(w=>(
              <div key={w.w} style={{marginBottom:12}}>
                <div className="flex items-center justify-between text-sm mb-16" style={{marginBottom:6}}>
                  <span>{w.w}</span>
                  <span className="text-muted">{w.used}/{w.total} beds</span>
                </div>
                <ProgressBar value={w.used} max={w.total} color={w.used===w.total?"var(--red)":w.used/w.total>0.7?"var(--amber)":"var(--green)"}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
function Patients({ patients, setPatients }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [modal,  setModal]    = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q);
    const matchF = filter === "All" || p.status === filter || p.ward === filter;
    return matchQ && matchF;
  });

  const openAdd = () => { setForm({ id:`P${String(patients.length+1).padStart(3,"0")}`, status:"Admitted", admitted:today() }); setSelected(null); setModal(true); };
  const openEdit = p => { setForm({...p}); setSelected(p); setModal(true); };

  const save = () => {
    if (!form.name || !form.age) return;
    if (selected) setPatients(ps => ps.map(p=>p.id===selected.id?{...p,...form}:p));
    else setPatients(ps=>[...ps,{...form}]);
    setModal(false);
  };

  const discharge = id => setPatients(ps=>ps.map(p=>p.id===id?{...p,status:"Discharged"}:p));

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div><h1 className="page-title">Patient Management</h1><p className="page-sub">{filtered.length} patients found</p></div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Admit Patient</button>
      </div>

      <div className="card mb-20">
        <div className="flex gap-12 items-center" style={{flexWrap:"wrap"}}>
          <div className="search-bar flex-1" style={{maxWidth:360}}>
            <span>🔍</span>
            <input placeholder="Search by name, ID, diagnosis…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {["All","Admitted","Critical","Stable","Recovering","Discharged"].map(f=>(
            <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-ghost"}`} onClick={()=>setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient</th><th>Blood</th><th>Ward</th><th>Doctor</th><th>Diagnosis</th><th>Status</th><th>Admitted</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-8">
                      <div className="patient-avatar" style={{background:"linear-gradient(135deg,var(--blue),var(--purple))"}}>
                        {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <div style={{fontWeight:600}}>{p.name}</div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{p.id} · {p.age}y · {p.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-red">{p.blood}</span></td>
                  <td>{p.ward}</td>
                  <td style={{fontSize:12,color:"var(--muted)"}}>{p.doctor}</td>
                  <td>{p.diagnosis}</td>
                  <td><span className={`badge ${statusColor(p.status)}`}><span className="badge-dot"/>{p.status}</span></td>
                  <td style={{fontSize:12}}>{p.admitted}</td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(p)} title="Edit">✏️</button>
                      {p.status!=="Discharged" && <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>discharge(p.id)} title="Discharge">🚪</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={selected?"Edit Patient":"Admit New Patient"} onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>💾 Save</button></>}>
          <div className="form-row">
            <Input label="Patient ID" value={form.id||""} readOnly/>
            <Input label="Full Name *" placeholder="Full name" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <div className="form-row">
            <Input label="Age" type="number" value={form.age||""} onChange={e=>setForm(f=>({...f,age:e.target.value}))}/>
            <Select label="Gender" value={form.gender||""} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}>
              <option value="">Select gender</option>
              {["Male","Female","Other"].map(g=><option key={g}>{g}</option>)}
            </Select>
          </div>
          <div className="form-row">
            <Select label="Blood Group" value={form.blood||""} onChange={e=>setForm(f=>({...f,blood:e.target.value}))}>
              <option value="">Blood group</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=><option key={b}>{b}</option>)}
            </Select>
            <Input label="Phone" placeholder="07XXXXXXXX" value={form.phone||""} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
          </div>
          <div className="form-row">
            <Select label="Ward" value={form.ward||""} onChange={e=>setForm(f=>({...f,ward:e.target.value}))}>
              <option value="">Select ward</option>
              {["General","ICU","Maternity","Surgery","Pediatrics","Cardiology","Orthopaedic"].map(w=><option key={w}>{w}</option>)}
            </Select>
            <Select label="Assigned Doctor" value={form.doctor||""} onChange={e=>setForm(f=>({...f,doctor:e.target.value}))}>
              <option value="">Select doctor</option>
              {initDoctors.map(d=><option key={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div className="form-row">
            <Input label="Diagnosis" placeholder="Primary diagnosis" value={form.diagnosis||""} onChange={e=>setForm(f=>({...f,diagnosis:e.target.value}))}/>
            <Select label="Status" value={form.status||""} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              {["Admitted","Critical","Stable","Recovering","Post-Op","Monitoring","Discharged"].map(s=><option key={s}>{s}</option>)}
            </Select>
          </div>
          <Input label="Address" placeholder="Patient address" value={form.address||""} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/>
        </Modal>
      )}
    </div>
  );
}

// ─── DOCTORS ──────────────────────────────────────────────────────────────────
function Doctors() {
  const [doctors] = useState(initDoctors);
  const [search, setSearch] = useState("");

  const filtered = doctors.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div><h1 className="page-title">Medical Staff</h1><p className="page-sub">{doctors.length} doctors on staff</p></div>
        <button className="btn btn-primary">➕ Add Doctor</button>
      </div>

      <div className="search-bar mb-20" style={{maxWidth:400}}>
        <span>🔍</span>
        <input placeholder="Search doctors…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {filtered.map(d=>(
          <div key={d.id} className="card fade-in" style={{transition:".2s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--sky)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
            <div className="flex gap-16 mb-16">
              <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,var(--sky),var(--purple))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,flexShrink:0}}>
                {d.name.split(" ")[1]?.[0]||"D"}{d.name.split(" ")[2]?.[0]||""}
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{d.name}</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{d.specialization}</div>
                <div style={{marginTop:4}}><span className={`badge badge-sm ${statusColor(d.status)}`}><span className="badge-dot"/>{d.status}</span></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:12}}>
              {[["🏥 Dept",d.department],["📞 Phone",d.phone],["👥 Patients",d.patients],["⏰ Experience",d.experience]].map(([k,v])=>(
                <div key={k} style={{background:"var(--navy2)",borderRadius:8,padding:"8px 10px"}}>
                  <div style={{color:"var(--muted)",fontSize:10,marginBottom:2}}>{k.split(" ")[0]} {k.split(" ").slice(1).join(" ")}</div>
                  <div style={{fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,fontSize:11,color:"var(--muted)",borderTop:"1px solid var(--border)",paddingTop:10}}>🗓 {d.schedule}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
function Appointments({ appointments, setAppointments }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({});
  const [view, setView]   = useState("list");

  const save = () => {
    if (!form.patient || !form.doctor || !form.date) return;
    setAppointments(a => [...a, { id:`A${String(a.length+1).padStart(3,"0")}`, status:"Pending", ...form }]);
    setModal(false);
  };

  const calDays = () => {
    const d = new Date(); const m = d.getMonth(); const y = d.getFullYear();
    const first = new Date(y,m,1).getDay(); const total = new Date(y,m+1,0).getDate();
    return { first, total, month: MONTHS[m], year: y };
  };
  const cal = calDays();
  const apptDates = new Set(appointments.map(a=>new Date(a.date).getDate()));

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div><h1 className="page-title">Appointments</h1><p className="page-sub">{appointments.length} scheduled</p></div>
        <div className="flex gap-8">
          <button className={`btn btn-sm ${view==="list"?"btn-primary":"btn-ghost"}`} onClick={()=>setView("list")}>📋 List</button>
          <button className={`btn btn-sm ${view==="cal"?"btn-primary":"btn-ghost"}`} onClick={()=>setView("cal")}>📅 Calendar</button>
          <button className="btn btn-primary btn-sm" onClick={()=>{setForm({date:today(),type:"Consultation",status:"Pending"});setModal(true);}}>➕ New Appointment</button>
        </div>
      </div>

      {view === "cal" ? (
        <div className="card">
          <h3 className="section-title">{cal.month} {cal.year}</h3>
          <div className="cal-grid" style={{marginBottom:12}}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
              <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:"var(--muted)",padding:"4px 0"}}>{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {Array(cal.first).fill(null).map((_,i)=><div key={`e${i}`} className="cal-cell empty"/>)}
            {Array(cal.total).fill(null).map((_,i)=>(
              <div key={i+1} className={`cal-cell ${i+1===new Date().getDate()?"today":""} ${apptDates.has(i+1)?"has-event":""}`}>
                {i+1}
              </div>
            ))}
          </div>
          <div style={{marginTop:16,fontSize:12,color:"var(--muted)"}}>🔵 Days with appointments</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Type</th><th>Status</th><th>Notes</th><th>Action</th></tr></thead>
              <tbody>
                {appointments.map(a=>(
                  <tr key={a.id}>
                    <td><span className="text-mono text-sm" style={{color:"var(--muted)"}}>{a.id}</span></td>
                    <td style={{fontWeight:600}}>{a.patient}</td>
                    <td style={{fontSize:12,color:"var(--muted)"}}>{a.doctor}</td>
                    <td><div style={{fontWeight:600,fontSize:13}}>{a.date}</div><div style={{fontSize:11,color:"var(--muted)"}}>{a.time}</div></td>
                    <td><span className="badge badge-blue">{a.type}</span></td>
                    <td><span className={`badge ${statusColor(a.status)}`}><span className="badge-dot"/>{a.status}</span></td>
                    <td style={{fontSize:12,color:"var(--muted)",maxWidth:180}}>{a.notes}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={()=>setAppointments(ap=>ap.map(x=>x.id===a.id?{...x,status:"Cancelled"}:x))}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <Modal title="Book Appointment" onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>📅 Book</button></>}>
          <div className="form-row">
            <Select label="Patient" value={form.patient||""} onChange={e=>setForm(f=>({...f,patient:e.target.value}))}>
              <option value="">Select patient</option>
              {initPatients.map(p=><option key={p.id}>{p.name}</option>)}
            </Select>
            <Select label="Doctor" value={form.doctor||""} onChange={e=>setForm(f=>({...f,doctor:e.target.value}))}>
              <option value="">Select doctor</option>
              {initDoctors.map(d=><option key={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div className="form-row">
            <Input label="Date" type="date" value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
            <Input label="Time" type="time" value={form.time||""} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/>
          </div>
          <div className="form-row">
            <Select label="Type" value={form.type||""} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              {["Consultation","Follow-up","Emergency","Surgery","Prenatal","Lab Test","Radiology"].map(t=><option key={t}>{t}</option>)}
            </Select>
            <Select label="Status" value={form.status||""} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              {["Pending","Confirmed","Urgent","Scheduled"].map(s=><option key={s}>{s}</option>)}
            </Select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="input" rows={3} placeholder="Additional notes…" value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{resize:"vertical"}}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PHARMACY / INVENTORY ─────────────────────────────────────────────────────
function Pharmacy() {
  const [items, setItems] = useState(initInventory);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({});

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));
  const lowStock  = items.filter(i=>i.qty>0 && i.qty<=i.reorder).length;
  const outStock  = items.filter(i=>i.qty===0).length;

  const save = () => {
    if (!form.name) return;
    const status = form.qty===0?"Out of Stock":form.qty<=form.reorder?"Low Stock":"In Stock";
    setItems(it=>[...it,{id:`I${String(it.length+1).padStart(3,"0")}`,status,...form,qty:Number(form.qty||0),reorder:Number(form.reorder||0),price:Number(form.price||0)}]);
    setModal(false);
  };

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div><h1 className="page-title">Pharmacy & Inventory</h1><p className="page-sub">{items.length} items · {lowStock} low · {outStock} out of stock</p></div>
        <button className="btn btn-primary" onClick={()=>{setForm({});setModal(true);}}>➕ Add Item</button>
      </div>

      <div className="stats-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[
          {label:"Total Items",val:items.length,icon:"📦",col:"blue"},
          {label:"In Stock",val:items.filter(i=>i.status==="In Stock").length,icon:"✅",col:"green"},
          {label:"Low Stock",val:lowStock,icon:"⚠️",col:"amber"},
          {label:"Out of Stock",val:outStock,icon:"❌",col:"red"},
        ].map(s=>(
          <div key={s.label} className={`stat-card ${s.col}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="search-bar mb-20" style={{maxWidth:400}}>
        <span>🔍</span>
        <input placeholder="Search medicines, supplies…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit</th><th>Reorder Level</th><th>Price (KSh)</th><th>Expiry</th><th>Supplier</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(item=>(
                <tr key={item.id}>
                  <td style={{fontWeight:600}}>{item.name}</td>
                  <td><span className="badge badge-blue">{item.category}</span></td>
                  <td>
                    <span className="text-mono" style={{color:item.qty===0?"var(--red)":item.qty<=item.reorder?"var(--amber)":"var(--green)",fontWeight:700}}>{item.qty}</span>
                  </td>
                  <td style={{color:"var(--muted)",fontSize:12}}>{item.unit}</td>
                  <td style={{fontSize:12}}>{item.reorder}</td>
                  <td style={{fontFamily:"var(--mono)"}}>{item.price}</td>
                  <td style={{fontSize:12,color:"var(--muted)"}}>{item.expiry}</td>
                  <td style={{fontSize:12}}>{item.supplier}</td>
                  <td><span className={`badge ${statusColor(item.status)}`}><span className="badge-dot"/>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Add Inventory Item" onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>💾 Save</button></>}>
          <div className="form-row">
            <Input label="Item Name *" placeholder="e.g. Paracetamol 500mg" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
            <Select label="Category" value={form.category||""} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              <option value="">Select category</option>
              {["Medicine","IV Fluid","Consumables","PPE","Radiology","Equipment","Other"].map(c=><option key={c}>{c}</option>)}
            </Select>
          </div>
          <div className="form-row">
            <Input label="Quantity" type="number" value={form.qty||""} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/>
            <Input label="Unit" placeholder="tablets, boxes, vials…" value={form.unit||""} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}/>
          </div>
          <div className="form-row">
            <Input label="Reorder Level" type="number" value={form.reorder||""} onChange={e=>setForm(f=>({...f,reorder:e.target.value}))}/>
            <Input label="Unit Price (KSh)" type="number" value={form.price||""} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
          </div>
          <div className="form-row">
            <Input label="Expiry Date" type="date" value={form.expiry||""} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))}/>
            <Input label="Supplier" placeholder="Supplier name" value={form.supplier||""} onChange={e=>setForm(f=>({...f,supplier:e.target.value}))}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── BILLING ──────────────────────────────────────────────────────────────────
function Billing({ billing, setBilling }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({});

  const totalRevenue  = billing.reduce((s,b)=>s+b.paid,0);
  const totalOutstand = billing.reduce((s,b)=>s+b.balance,0);
  const totalBilled   = billing.reduce((s,b)=>s+b.amount,0);

  const save = () => {
    if (!form.patient || !form.amount) return;
    const amt = Number(form.amount); const paid = Number(form.paid||0);
    const balance = amt - paid;
    const status = balance===0?"Paid":paid===0?"Unpaid":"Partial";
    setBilling(b=>[...b,{ id:`B${String(b.length+1).padStart(3,"0")}`, date:today(), ...form, amount:amt, paid, balance, status }]);
    setModal(false);
  };

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div><h1 className="page-title">Billing & Finance</h1><p className="page-sub">{billing.length} invoices</p></div>
        <button className="btn btn-primary" onClick={()=>{setForm({paid:0,method:"MPESA"});setModal(true);}}>➕ New Invoice</button>
      </div>

      <div className="stats-grid">
        {[
          {label:"Total Billed",val:fmtCurrency(totalBilled),icon:"🧾",col:"blue"},
          {label:"Revenue Collected",val:fmtCurrency(totalRevenue),icon:"💰",col:"green"},
          {label:"Outstanding",val:fmtCurrency(totalOutstand),icon:"⏳",col:"amber"},
          {label:"Collection Rate",val:`${Math.round((totalRevenue/totalBilled)*100)}%`,icon:"📊",col:"purple"},
        ].map(s=>(
          <div key={s.label} className={`stat-card ${s.col}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{fontSize:20}}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Service</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Method</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {billing.map(b=>(
                <tr key={b.id}>
                  <td><span className="text-mono text-sm" style={{color:"var(--muted)"}}>{b.id}</span></td>
                  <td style={{fontWeight:600}}>{b.patient}</td>
                  <td style={{fontSize:12}}>{b.date}</td>
                  <td style={{fontSize:12,maxWidth:180}}>{b.service}</td>
                  <td style={{fontFamily:"var(--mono)"}}>{fmtCurrency(b.amount)}</td>
                  <td style={{fontFamily:"var(--mono)",color:"var(--green)"}}>{fmtCurrency(b.paid)}</td>
                  <td style={{fontFamily:"var(--mono)",color:b.balance>0?"var(--amber)":"var(--muted)"}}>{fmtCurrency(b.balance)}</td>
                  <td><span className="badge badge-muted">{b.method}</span></td>
                  <td><span className={`badge ${statusColor(b.status)}`}><span className="badge-dot"/>{b.status}</span></td>
                  <td><button className="btn btn-ghost btn-sm">🖨️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="New Invoice" onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>💾 Save Invoice</button></>}>
          <div className="form-row">
            <Select label="Patient" value={form.patient||""} onChange={e=>setForm(f=>({...f,patient:e.target.value}))}>
              <option value="">Select patient</option>
              {initPatients.map(p=><option key={p.id}>{p.name}</option>)}
            </Select>
            <Input label="Service Description" placeholder="e.g. Consultation + Medication" value={form.service||""} onChange={e=>setForm(f=>({...f,service:e.target.value}))}/>
          </div>
          <div className="form-row">
            <Input label="Total Amount (KSh)" type="number" value={form.amount||""} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
            <Input label="Amount Paid (KSh)" type="number" value={form.paid||""} onChange={e=>setForm(f=>({...f,paid:e.target.value}))}/>
          </div>
          <Select label="Payment Method" value={form.method||""} onChange={e=>setForm(f=>({...f,method:e.target.value}))}>
            {["MPESA","Cash","Card","Insurance","Bank Transfer"].map(m=><option key={m}>{m}</option>)}
          </Select>
        </Modal>
      )}
    </div>
  );
}

// ─── LABORATORY ───────────────────────────────────────────────────────────────
function Laboratory() {
  const [tests] = useState(labTests);
  const [search, setSearch] = useState("");

  const filtered = tests.filter(t => !search || t.patient.toLowerCase().includes(search.toLowerCase()) || t.test.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div><h1 className="page-title">Laboratory</h1><p className="page-sub">{tests.length} tests · {tests.filter(t=>t.status==="Processing").length} pending</p></div>
        <button className="btn btn-primary">➕ Request Test</button>
      </div>

      <div className="stats-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[
          {l:"Total Tests",v:tests.length,i:"🧪",c:"blue"},
          {l:"Completed",v:tests.filter(t=>t.status==="Completed").length,i:"✅",c:"green"},
          {l:"Processing",v:tests.filter(t=>t.status==="Processing").length,i:"⏳",c:"amber"},
          {l:"Urgent",v:tests.filter(t=>t.priority==="Urgent").length,i:"🚨",c:"red"},
        ].map(s=>(
          <div key={s.l} className={`stat-card ${s.c}`}>
            <div className="stat-icon">{s.i}</div>
            <div className="stat-value">{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="search-bar mb-20" style={{maxWidth:400}}>
        <span>🔍</span>
        <input placeholder="Search tests…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Patient</th><th>Test</th><th>Requested By</th><th>Date</th><th>Priority</th><th>Result</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(t=>(
                <tr key={t.id}>
                  <td><span className="text-mono text-sm" style={{color:"var(--muted)"}}>{t.id}</span></td>
                  <td style={{fontWeight:600}}>{t.patient}</td>
                  <td>{t.test}</td>
                  <td style={{fontSize:12,color:"var(--muted)"}}>{t.requested}</td>
                  <td style={{fontSize:12}}>{t.date}</td>
                  <td><span className={`badge ${t.priority==="Urgent"?"badge-red":"badge-muted"}`}>{t.priority}</span></td>
                  <td>
                    {t.status==="Completed"
                      ? <span style={{fontFamily:"var(--mono)",fontSize:13,color:"var(--white)"}}>{t.result}</span>
                      : <span style={{color:"var(--muted)",fontSize:12}}>—</span>}
                  </td>
                  <td><span className={`badge ${statusColor(t.status)}`}><span className="badge-dot"/>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports({ patients, billing }) {
  const totalRevenue   = billing.reduce((s,b)=>s+b.paid,0);
  const totalOutstand  = billing.reduce((s,b)=>s+b.balance,0);
  const discharged     = patients.filter(p=>p.status==="Discharged").length;
  const critical       = patients.filter(p=>p.status==="Critical").length;

  const byWard = Object.entries(patients.reduce((a,p)=>{a[p.ward]=(a[p.ward]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]);
  const byDoc  = Object.entries(patients.reduce((a,p)=>{a[p.doctor]=(a[p.doctor]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]);

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-24">
        <div><h1 className="page-title">Reports & Analytics</h1><p className="page-sub">Hospital performance overview</p></div>
        <div className="flex gap-8">
          <button className="btn btn-ghost btn-sm">📤 Export PDF</button>
          <button className="btn btn-outline btn-sm">📊 Export Excel</button>
        </div>
      </div>

      <div className="stats-grid mb-24">
        {[
          {l:"Total Patients",v:patients.length,i:"👥",c:"blue"},
          {l:"Discharged",v:discharged,i:"🚪",c:"green"},
          {l:"Critical Cases",v:critical,i:"🚨",c:"red"},
          {l:"Revenue Collected",v:fmtCurrency(totalRevenue),i:"💰",c:"amber"},
          {l:"Outstanding",v:fmtCurrency(totalOutstand),i:"⏳",c:"purple"},
        ].map(s=>(
          <div key={s.l} className={`stat-card ${s.c}`}>
            <div className="stat-icon">{s.i}</div>
            <div className="stat-value" style={{fontSize:s.l.includes("Revenue")||s.l.includes("Out")?16:28}}>{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        <div className="card">
          <h3 className="section-title">📈 Monthly Admissions (2024)</h3>
          <MiniBarChart data={admissionsData} color="var(--sky)"/>
          <div style={{marginTop:12,fontSize:12,color:"var(--muted)"}}>Peak month: December ({Math.max(...admissionsData)} admissions)</div>
        </div>
        <div className="card">
          <h3 className="section-title">💹 Monthly Revenue (KSh '000)</h3>
          <MiniBarChart data={revenueData} color="var(--teal)"/>
          <div style={{marginTop:12,fontSize:12,color:"var(--muted)"}}>Total YTD: KSh {revenueData.reduce((a,b)=>a+b,0)}K</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="section-title">🏥 Patients by Ward</h3>
          {byWard.map(([ward,count])=>(
            <div key={ward} style={{marginBottom:14}}>
              <div className="flex items-center justify-between text-sm mb-16" style={{marginBottom:6}}>
                <span style={{fontWeight:600}}>{ward}</span>
                <span className="text-mono" style={{color:"var(--sky)"}}>{count} patients</span>
              </div>
              <ProgressBar value={count} max={Math.max(...byWard.map(x=>x[1]))} color="var(--sky)"/>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="section-title">👨‍⚕️ Patients by Doctor</h3>
          {byDoc.map(([doc,count])=>(
            <div key={doc} style={{marginBottom:14}}>
              <div className="flex items-center justify-between text-sm mb-16" style={{marginBottom:6}}>
                <span style={{fontWeight:600,fontSize:13}}>{doc}</span>
                <span className="text-mono" style={{color:"var(--purple)"}}>{count}</span>
              </div>
              <ProgressBar value={count} max={Math.max(...byDoc.map(x=>x[1]))} color="var(--purple)"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({ user }) {
  const [tab, setTab] = useState(0);
  const tabs = ["👤 Profile","🔒 Security","🏥 Hospital","🔔 Notifications"];

  return (
    <div className="page">
      <h1 className="page-title mb-24">Settings</h1>
      <div className="tabs">
        {tabs.map((t,i)=><div key={i} className={`tab ${tab===i?"active":""}`} onClick={()=>setTab(i)}>{t}</div>)}
      </div>

      {tab===0 && (
        <div className="card" style={{maxWidth:600}}>
          <h3 className="section-title">Profile Information</h3>
          <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:24,padding:16,background:"var(--navy2)",borderRadius:12}}>
            <div className="avatar" style={{width:64,height:64,fontSize:22,borderRadius:16}}>{user.avatar}</div>
            <div>
              <div style={{fontWeight:700,fontSize:16}}>{user.name}</div>
              <div style={{color:"var(--muted)",fontSize:13}}>{user.email}</div>
              <span className="badge badge-blue" style={{marginTop:6,display:"inline-block"}}>{user.role.toUpperCase()}</span>
            </div>
            <button className="btn btn-ghost btn-sm" style={{marginLeft:"auto"}}>Change Photo</button>
          </div>
          <div className="form-row">
            <Input label="Full Name" defaultValue={user.name}/>
            <Input label="Email" defaultValue={user.email}/>
          </div>
          <div className="form-row">
            <Input label="Phone" placeholder="07XXXXXXXX"/>
            <Input label="Department" defaultValue={user.dept}/>
          </div>
          <button className="btn btn-primary">💾 Save Changes</button>
        </div>
      )}

      {tab===1 && (
        <div className="card" style={{maxWidth:600}}>
          <h3 className="section-title">Change Password</h3>
          <Input label="Current Password" type="password" placeholder="••••••••"/>
          <Input label="New Password" type="password" placeholder="••••••••"/>
          <Input label="Confirm Password" type="password" placeholder="••••••••"/>
          <div className="alert alert-info">🔒 Use at least 8 characters with numbers and symbols for a strong password.</div>
          <button className="btn btn-primary">🔒 Update Password</button>
          <div style={{marginTop:24,borderTop:"1px solid var(--border)",paddingTop:20}}>
            <h3 className="section-title">Two-Factor Authentication</h3>
            <p style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Add an extra layer of security to your account.</p>
            <button className="btn btn-outline">🔐 Enable 2FA</button>
          </div>
        </div>
      )}

      {tab===2 && (
        <div className="card" style={{maxWidth:600}}>
          <h3 className="section-title">Hospital Information</h3>
          <Input label="Hospital Name" defaultValue="Ovic Hospitals"/>
          <div className="form-row">
            <Input label="Registration Number" defaultValue="MOH/KE/2024/001"/>
            <Input label="Phone" defaultValue="+254 700 000 000"/>
          </div>
          <div className="form-row">
            <Input label="Email" defaultValue="info@ovichospitals.ke"/>
            <Input label="Website" defaultValue="www.ovichospitals.ke"/>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="input" rows={3} defaultValue="123 Hospital Road, Nairobi, Kenya" style={{resize:"vertical"}}/>
          </div>
          <button className="btn btn-primary">💾 Save Hospital Info</button>
        </div>
      )}

      {tab===3 && (
        <div className="card" style={{maxWidth:600}}>
          <h3 className="section-title">Notification Preferences</h3>
          {[
            {t:"Patient Admissions","d":"Get notified when new patients are admitted"},
            {t:"Critical Alerts","d":"Urgent notifications for critical patients"},
            {t:"Appointment Reminders","d":"Reminders for upcoming appointments"},
            {t:"Low Inventory Alerts","d":"Notifications when stock is running low"},
            {t:"Billing Updates","d":"Payment confirmations and reminders"},
          ].map(n=>(
            <div key={n.t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{n.t}</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{n.d}</div>
              </div>
              <div style={{width:44,height:24,background:"var(--sky)",borderRadius:12,cursor:"pointer",position:"relative"}}>
                <div style={{width:18,height:18,background:"#fff",borderRadius:"50%",position:"absolute",right:3,top:3}}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { section:"Main", items:[
    { id:"dashboard",     icon:"📊", label:"Dashboard"    },
    { id:"patients",      icon:"👥", label:"Patients",     badge:3 },
    { id:"appointments",  icon:"📅", label:"Appointments"  },
    { id:"doctors",       icon:"👨‍⚕️", label:"Medical Staff" },
  ]},
  { section:"Clinical", items:[
    { id:"laboratory",    icon:"🔬", label:"Laboratory",   badge:2 },
    { id:"pharmacy",      icon:"💊", label:"Pharmacy"      },
  ]},
  { section:"Finance & Admin", items:[
    { id:"billing",       icon:"💰", label:"Billing"       },
    { id:"reports",       icon:"📈", label:"Reports"       },
    { id:"settings",      icon:"⚙️", label:"Settings"      },
  ]},
];

function Sidebar({ page, setPage, collapsed, role }) {
  const allowed = {
    admin:        ["dashboard","patients","appointments","doctors","laboratory","pharmacy","billing","reports","settings"],
    doctor:       ["dashboard","patients","appointments","laboratory","pharmacy"],
    nurse:        ["dashboard","patients","appointments","laboratory","pharmacy"],
    receptionist: ["dashboard","patients","appointments","billing"],
    pharmacist:   ["dashboard","pharmacy","billing"],
    lab:          ["dashboard","laboratory"],
  };
  const ok = allowed[role] || allowed.admin;

  return (
    <div className={`sidebar ${collapsed?"collapsed":""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">🏥</div>
        {!collapsed && <div className="logo-text"><h2>OHMS</h2><p>Ovic Hospitals</p></div>}
      </div>
      <nav className="sidebar-nav">
        {NAV.map(sec=>{
          const visItems = sec.items.filter(i=>ok.includes(i.id));
          if (!visItems.length) return null;
          return (
            <div key={sec.section} className="nav-section">
              {!collapsed && <div className="nav-section-label">{sec.section}</div>}
              {visItems.map(item=>(
                <div key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)} title={collapsed?item.label:""}>
                  <span className="icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="nav-item" style={{color:"var(--red)"}}>
          <span className="icon">🚪</span>
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
const NOTIFS = [
  { icon:"🚨", bg:"rgba(255,77,106,.15)", text:"Patient Brian Otieno in ICU is critical", time:"2 min ago" },
  { icon:"⚠️", bg:"rgba(255,176,32,.15)",  text:"Amoxicillin stock below reorder level",   time:"15 min ago" },
  { icon:"📅", bg:"rgba(13,132,255,.15)",  text:"6 appointments scheduled for today",       time:"1 hr ago" },
  { icon:"💰", bg:"rgba(0,208,132,.15)",   text:"Payment received: KSh 80,000 – David K.", time:"2 hrs ago" },
  { icon:"🔬", bg:"rgba(139,92,246,.15)",  text:"Lab results ready for Henry Ouma",         time:"3 hrs ago" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,     setUser]     = useState(null);
  const [page,     setPage]     = useState("dashboard");
  const [collapsed,setCollapsed]= useState(false);
  const [showNotif,setShowNotif]= useState(false);
  const [patients, setPatients] = useState(initPatients);
  const [appointments, setAppointments] = useState(initAppointments);
  const [billing,  setBilling]  = useState(initBilling);

  const PAGE_TITLES = {
    dashboard:"Dashboard", patients:"Patients", appointments:"Appointments",
    doctors:"Medical Staff", laboratory:"Laboratory", pharmacy:"Pharmacy & Inventory",
    billing:"Billing & Finance", reports:"Reports & Analytics", settings:"Settings",
  };

  const renderPage = () => {
    switch(page) {
      case "dashboard":    return <Dashboard user={user} patients={patients} appointments={appointments} billing={billing}/>;
      case "patients":     return <Patients patients={patients} setPatients={setPatients}/>;
      case "appointments": return <Appointments appointments={appointments} setAppointments={setAppointments}/>;
      case "doctors":      return <Doctors/>;
      case "laboratory":   return <Laboratory/>;
      case "pharmacy":     return <Pharmacy/>;
      case "billing":      return <Billing billing={billing} setBilling={setBilling}/>;
      case "reports":      return <Reports patients={patients} billing={billing}/>;
      case "settings":     return <Settings user={user}/>;
      default:             return <Dashboard user={user} patients={patients} appointments={appointments} billing={billing}/>;
    }
  };

  if (!user) return <LoginPage onLogin={setUser}/>;

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} role={user.role}/>
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <button className="topbar-btn" onClick={()=>setCollapsed(c=>!c)}>{collapsed?"☰":"✕"}</button>
          <h2 className="topbar-title">{PAGE_TITLES[page]}</h2>
          <div className="topbar-actions">
            <div style={{position:"relative"}}>
              <div className="topbar-btn" onClick={()=>setShowNotif(n=>!n)}>
                🔔
                <span className="notif-dot"/>
              </div>
              {showNotif && (
                <div className="notif-panel">
                  <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",fontWeight:700,fontSize:13,display:"flex",justifyContent:"space-between"}}>
                    Notifications
                    <span style={{fontSize:11,color:"var(--sky)",cursor:"pointer"}}>Mark all read</span>
                  </div>
                  {NOTIFS.map((n,i)=>(
                    <div key={i} className="notif-item">
                      <div className="notif-icon" style={{background:n.bg}}>{n.icon}</div>
                      <div>
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="topbar-btn">❓</div>
            <div className="avatar" title={`${user.name} (${user.role})`}>{user.avatar}</div>
            <div style={{display:"flex",flexDirection:"column"}}>
              <span style={{fontSize:13,fontWeight:600,lineHeight:1.3}}>{user.name.split(" ").slice(0,2).join(" ")}</span>
              <span style={{fontSize:11,color:"var(--muted)",textTransform:"capitalize"}}>{user.role}</span>
            </div>
            <button className="btn btn-danger btn-sm" onClick={()=>{setUser(null);setPage("dashboard");}}>Sign Out</button>
          </div>
        </div>

        {/* Page Content */}
        <div className="content" onClick={()=>showNotif&&setShowNotif(false)}>
          {renderPage()}
        </div>
      </div>

      {/* Inject CSS */}
      <style>{CSS}</style>
    </div>
  );
}
