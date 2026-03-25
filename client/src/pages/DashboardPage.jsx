import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMaterials } from "../hooks/useMaterials";

/* ── Google Fonts injected once ── */
const FontLoader = () => {
    useEffect(() => {
        if (document.getElementById("scholar-fonts")) return;
        const l1 = document.createElement("link");
        l1.id = "scholar-fonts";
        l1.rel = "stylesheet";
        l1.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap";
        document.head.appendChild(l1);
        const l2 = document.createElement("link");
        l2.rel = "stylesheet";
        l2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
        document.head.appendChild(l2);
        const style = document.createElement("style");
        style.textContent = `
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;
                font-family: 'Material Symbols Outlined';
                display: inline-block; line-height: 1; user-select: none;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(0,53,127,0.15); border-radius: 3px; }
            @keyframes pulse-bar {
                0%,100% { opacity: 1; } 50% { opacity: .7; }
            }
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes shimmer {
                0%   { background-position: -600px 0; }
                100% { background-position:  600px 0; }
            }
            .anim-card { animation: fade-in-up .4s ease both; }
            .anim-card:nth-child(1) { animation-delay: .05s; }
            .anim-card:nth-child(2) { animation-delay: .10s; }
            .anim-card:nth-child(3) { animation-delay: .15s; }
            .anim-card:nth-child(4) { animation-delay: .20s; }
        `;
        document.head.appendChild(style);
    }, []);
    return null;
};

/* ── Icon helper ── */
const Icon = ({ name, fill = 0, size = 24, style: s }) => (
    <span
        className="material-symbols-outlined"
        style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill},'wght' 400,'GRAD' 0,'opsz' 24`, lineHeight: 1, ...s }}
    >
        {name}
    </span>
);

/* ── Tokens ── */
const T = {
    primary:    "#00357f",
    primaryMid: "#004aad",
    secondary:  "#2a6b2c",
    secBg:      "#acf4a4",
    bg:         "#f8f9fa",
    surface:    "#ffffff",
    surfaceLow: "#f3f4f5",
    surfaceHigh:"#e7e8e9",
    textPrimary:"#191c1d",
    textMuted:  "#546167",
    textFaint:  "#737784",
    outline:    "rgba(195,198,213,0.4)",
    shadow:     "0 20px 40px rgba(25,28,29,0.06)",
    shadowBlue: "0 8px 32px rgba(0,53,127,0.25)",
};

/* ── Mastery progress bar ── */
const MasteryBar = ({ label, pct }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:500, color:T.textPrimary }}>{label}</span>
            <span style={{ fontSize:13, fontWeight:700, color:T.secondary }}>{pct}%</span>
        </div>
        <div style={{ height:4, background:T.secBg, borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:T.secondary, borderRadius:2, transition:"width 1.2s cubic-bezier(.4,0,.2,1)" }} />
        </div>
    </div>
);

/* ── Demo course card ── */
const DemoCourseCard = ({ title, modified, badge, progress, gradient }) => {
    const [hov, setHov] = useState(false);
    return (
        <div className="anim-card"
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ background:T.surface, borderRadius:14, overflow:"hidden", boxShadow:T.shadow, border:`1px solid ${hov?"rgba(0,53,127,0.18)":"transparent"}`, cursor:"pointer", transform: hov?"translateY(-3px)":"none", transition:"all .2s" }}>
            <div style={{ height:120, background:gradient, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="auto_stories" size={38} fill={0} style={{ color:"rgba(0,53,127,0.3)" }} />
                <div style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,0.92)", padding:"3px 9px", borderRadius:5, fontSize:10, fontWeight:700, color:T.primary, letterSpacing:".5px" }}>
                    {badge}
                </div>
            </div>
            <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                    <h4 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, lineHeight:1.35, color:T.textPrimary, marginBottom:3 }}>{title}</h4>
                    <p style={{ fontSize:11, color:T.textFaint }}>{modified}</p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:5, background:T.surfaceHigh, borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${progress}%`, background:T.primary, borderRadius:2 }} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:T.textPrimary, minWidth:28, textAlign:"right" }}>{progress}%</span>
                </div>
            </div>
        </div>
    );
};

/* ── Real material card ── */
const MaterialCard = ({ material, onClick }) => {
    const [hov, setHov] = useState(false);
    const mastery = material.masteryLevel ?? 0;
    return (
        <div className="anim-card"
            onClick={onClick}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ background:T.surface, borderRadius:14, overflow:"hidden", boxShadow:T.shadow, border:`1px solid ${hov?"rgba(0,53,127,0.18)":"transparent"}`, cursor:"pointer", transform:hov?"translateY(-3px)":"none", transition:"all .2s" }}>
            <div style={{ height:120, background:"linear-gradient(135deg,#d9e2ff,#e0f2ef)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <span style={{ fontSize:44 }}>{material.emoji || "📚"}</span>
                <div style={{ position:"absolute", top:10, right:10, background:material.status==="ready"?"rgba(172,244,164,0.95)":"rgba(255,255,255,0.9)", padding:"3px 9px", borderRadius:5, fontSize:10, fontWeight:700, color: material.status==="ready"?T.secondary:T.textFaint, letterSpacing:".5px" }}>
                    {material.status === "ready" ? "READY" : "PROCESSING"}
                </div>
            </div>
            <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                    <h4 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, lineHeight:1.35, color:T.textPrimary, marginBottom:3 }}>{material.title}</h4>
                    <p style={{ fontSize:11, color:T.textFaint }}>
                        {new Date(material.updatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                    </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:5, background:T.surfaceHigh, borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${mastery}%`, background:T.secondary, borderRadius:2 }} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:T.textPrimary, minWidth:28, textAlign:"right" }}>{mastery}%</span>
                </div>
            </div>
        </div>
    );
};

/* ── Stat chip ── */
const StatChip = ({ icon, iconBg, iconColor, label, value, sub }) => (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:16, borderRadius:14, background:T.surfaceLow, border:"1px solid #ffffff", boxShadow:T.shadow }}>
        <div style={{ width:46, height:46, borderRadius:"50%", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name={icon} size={21} style={{ color:iconColor }} />
        </div>
        <div>
            <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:T.textFaint, marginBottom:3 }}>{label}</p>
            <p style={{ fontFamily:"Manrope,sans-serif", fontSize:19, fontWeight:800, color:T.primary, lineHeight:1 }}>
                {value}
                {sub && <span style={{ fontSize:11, fontWeight:500, color:T.secondary, marginLeft:5 }}>{sub}</span>}
            </p>
        </div>
    </div>
);

/* ── Nav item ── */
const NavItem = ({ id, icon, label, to, active, onClick }) => {
    const [hov, setHov] = useState(false);
    const on = active === id;
    return (
        <Link to={to} onClick={() => onClick(id)}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 13px", borderRadius:10, textDecoration:"none",
                background: on ? T.surface : hov ? "rgba(255,255,255,0.55)" : "transparent",
                boxShadow: on ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                color: on||hov ? T.primary : T.textMuted,
                fontWeight: on ? 700 : 500, fontSize:14,
                transform: on ? "translateX(2px)" : "none",
                transition:"all .15s" }}>
            <Icon name={icon} size={19} fill={on?1:0} />
            {label}
        </Link>
    );
};

/* ── Static demo data ── */
const DEMO_COURSES = [
    { title:"Quantum Mechanics Foundations", modified:"Modified 2h ago", badge:"12 NOTES",    progress:35, gradient:"linear-gradient(135deg,#dbeafe,#ede9fe)" },
    { title:"Biochemistry: Lipid Synthesis",  modified:"Modified 5h ago", badge:"8 DOCUMENTS", progress:78, gradient:"linear-gradient(135deg,#dcfce7,#d1fae5)" },
    { title:"Western Philosophy: Kant & Hegel",modified:"Modified Yesterday",badge:"24 NOTES", progress:52, gradient:"linear-gradient(135deg,#fef9c3,#fce7f3)" },
];
const NAV_ITEMS = [
    { id:"dashboard", icon:"dashboard",    label:"Dashboard",   to:"/dashboard" },
    { id:"upload",    icon:"cloud_upload", label:"Upload",      to:"/upload" },
    { id:"study",     icon:"auto_stories", label:"Study Hub",   to:"/study" },
    { id:"quiz",      icon:"quiz",         label:"Quiz Center", to:"/quiz" },
    { id:"profile",   icon:"person",       label:"Profile",     to:"/profile" },
    { id:"settings",  icon:"settings",     label:"Settings",    to:"/settings" },
];

/* ════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
    const { user, logout } = useAuth();
    const { materials, fetchAll } = useMaterials();
    const navigate  = useNavigate();
    const [navActive,   setNavActive]   = useState("dashboard");
    const [aiProgress,  setAiProgress]  = useState(84);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocus, setSearchFocus] = useState(false);
    const [showUserMenu,setShowUserMenu]= useState(false);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    /* Animate the AI progress bar */
    useEffect(() => {
        const t = setInterval(() => setAiProgress(p => p >= 99 ? 84 : p + 1), 380);
        return () => clearInterval(t);
    }, []);

    const firstName    = user?.name?.split(" ")[0] || "Scholar";
    const readyMats    = (materials || []).filter(m => m.status === "ready");
    const showDemo     = readyMats.length === 0;

    const masteryData  = readyMats.slice(0,3).map(m => ({
        label: m.title.length > 22 ? m.title.slice(0,22)+"…" : m.title,
        pct:   m.masteryLevel ?? Math.floor(Math.random()*50+30),
    }));
    if (masteryData.length === 0) {
        masteryData.push(
            { label:"Molecular Biology", pct:92 },
            { label:"Cognitive Psych",   pct:45 },
            { label:"Ethics in AI",      pct:68 },
        );
    }

    return (
        <>
            <FontLoader />
            <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Inter,sans-serif", background:T.bg, color:T.textPrimary }}>

                {/* ══ SIDEBAR ══ */}
                <aside style={{ width:256, flexShrink:0, position:"fixed", left:0, top:0, bottom:0, background:T.surfaceLow, display:"flex", flexDirection:"column", padding:16, gap:4, zIndex:40, overflowY:"auto" }}>

                    {/* Logo */}
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 8px 26px" }}>
                        <div style={{ width:40, height:40, background:T.primary, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:T.shadowBlue }}>
                            <Icon name="school" size={22} fill={1} style={{ color:"#ffffff" }} />
                        </div>
                        <div>
                            <h1 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:T.primary, letterSpacing:"-0.5px", lineHeight:1 }}>Scholar AI</h1>
                            <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:T.textFaint, marginTop:2 }}>Academic Precision</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
                        {NAV_ITEMS.map(item => (
                            <NavItem key={item.id} {...item} active={navActive} onClick={setNavActive} />
                        ))}
                    </nav>

                    {/* Bottom */}
                    <div style={{ borderTop:`1px solid ${T.outline}`, paddingTop:12, display:"flex", flexDirection:"column", gap:3 }}>
                        <button
                            onClick={() => navigate("/upload")}
                            style={{ width:"100%", marginBottom:8, background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, color:"#fff", padding:"12px", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:T.shadowBlue, transition:"opacity .15s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity=".85"}
                            onMouseLeave={e => e.currentTarget.style.opacity="1"}
                        >
                            <Icon name="bolt" size={17} fill={1} style={{ color:"#fff" }} />
                            Ask AI Assistant
                        </button>
                        {[{icon:"settings",label:"Settings",to:"/settings"},{icon:"help_outline",label:"Help",to:null}].map(({icon,label,to}) => (
                            to ? (
                                <Link key={label} to={to}
                                    style={{ display:"flex", alignItems:"center", gap:11, padding:"8px 12px", borderRadius:8, background:"none", border:"none", color:T.textMuted, fontSize:13, cursor:"pointer", width:"100%", textDecoration:"none", transition:"color .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.color=T.primary}
                                    onMouseLeave={e => e.currentTarget.style.color=T.textMuted}>
                                    <Icon name={icon} size={19} /> {label}
                                </Link>
                            ) : (
                                <button key={label}
                                    style={{ display:"flex", alignItems:"center", gap:11, padding:"8px 12px", borderRadius:8, background:"none", border:"none", color:T.textMuted, fontSize:13, cursor:"pointer", width:"100%", transition:"color .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.color=T.primary}
                                    onMouseLeave={e => e.currentTarget.style.color=T.textMuted}>
                                    <Icon name={icon} size={19} /> {label}
                                </button>
                            )
                        ))}
                    </div>
                </aside>

                {/* ══ MAIN ══ */}
                <main style={{ flex:1, marginLeft:256, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

                    {/* Top bar */}
                    <header style={{ position:"sticky", top:0, zIndex:30, background:"rgba(248,249,250,0.96)", backdropFilter:"blur(12px)", padding:"10px 28px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${T.outline}` }}>
                        {/* Search */}
                        <div style={{ flex:1, maxWidth:460, position:"relative" }}>
                            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", display:"flex", color:T.textFaint }}>
                                <Icon name="search" size={17} />
                            </span>
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocus(true)}
                                onBlur={()  => setSearchFocus(false)}
                                placeholder="Search materials, notes, concepts..."
                                style={{ width:"100%", padding:"9px 12px 9px 36px", background: searchFocus?"#fff":T.surfaceHigh, border:"none", borderRadius:10, fontSize:13, color:T.textPrimary, outline:"none", boxShadow: searchFocus?"0 0 0 2px rgba(0,53,127,0.15)":"none", transition:"all .2s" }}
                            />
                        </div>

                        <div style={{ display:"flex", alignItems:"center", gap:6, marginLeft:"auto" }}>
                            {/* Notifications */}
                            <button style={{ width:37, height:37, borderRadius:"50%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:T.textFaint, position:"relative", transition:"background .15s" }}
                                onMouseEnter={e => e.currentTarget.style.background=T.surfaceHigh}
                                onMouseLeave={e => e.currentTarget.style.background="none"}>
                                <Icon name="notifications" size={21} />
                                <span style={{ position:"absolute", top:7, right:7, width:7, height:7, background:"#ba1a1a", borderRadius:"50%", border:"2px solid #f8f9fa" }} />
                            </button>
                            {/* Mic */}
                            <button style={{ width:37, height:37, borderRadius:"50%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:T.textFaint, transition:"background .15s" }}
                                onMouseEnter={e => e.currentTarget.style.background=T.surfaceHigh}
                                onMouseLeave={e => e.currentTarget.style.background="none"}>
                                <Icon name="mic" size={21} />
                            </button>

                            <div style={{ width:1, height:26, background:T.outline, margin:"0 6px" }} />

                            {/* User chip */}
                            <div style={{ position:"relative" }}>
                                <button
                                    onClick={() => setShowUserMenu(v => !v)}
                                    style={{ display:"flex", alignItems:"center", gap:9, padding:"5px 10px 5px 5px", borderRadius:20, border:`1px solid ${T.outline}`, background:"none", cursor:"pointer", transition:"background .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                                    <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${T.primaryMid},#2a6b2c)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                        <Icon name="person" size={17} fill={1} style={{ color:"#fff" }} />
                                    </div>
                                    <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, color:T.textPrimary }}>{user?.name || "Scholar"}</span>
                                    <Icon name="expand_more" size={16} style={{ color:T.textFaint }} />
                                </button>
                                {showUserMenu && (
                                    <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:T.surface, borderRadius:12, boxShadow:"0 12px 40px rgba(25,28,29,0.12)", border:`1px solid ${T.outline}`, minWidth:160, overflow:"hidden", zIndex:100 }}>
                                        {[
                                            { icon:"person", label:"Profile", to:"/profile" },
                                            { icon:"settings", label:"Settings", to:"/settings" },
                                        ].map(({ icon, label, to }) => (
                                            <Link key={label} to={to}
                                                onClick={() => setShowUserMenu(false)}
                                                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", width:"100%", border:"none", background:"none", fontSize:13, color:T.textPrimary, cursor:"pointer", textDecoration:"none", transition:"background .12s" }}
                                                onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                                onMouseLeave={e => e.currentTarget.style.background="none"}>
                                                <Icon name={icon} size={17} /> {label}
                                            </Link>
                                        ))}
                                        <div style={{ height:1, background:T.outline, margin:"4px 0" }} />
                                        <button
                                            onClick={logout}
                                            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", width:"100%", border:"none", background:"none", fontSize:13, color:"#ba1a1a", cursor:"pointer", transition:"background .12s" }}
                                            onMouseEnter={e => e.currentTarget.style.background="#fff1f1"}
                                            onMouseLeave={e => e.currentTarget.style.background="none"}>
                                            <Icon name="logout" size={17} style={{ color:"#ba1a1a" }} /> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* ── Content ── */}
                    <div style={{ padding:"28px 28px 80px", flex:1 }}>

                        {/* Welcome row */}
                        <section style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, gap:16, flexWrap:"wrap" }}>
                            <div style={{ animation:"fade-in-up .45s ease both" }}>
                                <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:"clamp(24px,2.8vw,34px)", color:T.primary, lineHeight:1.1, marginBottom:7 }}>
                                    Welcome back, {firstName}.
                                </h2>
                                <p style={{ fontSize:14, color:T.textMuted, maxWidth:420, lineHeight:1.65 }}>
                                    {readyMats.length > 0
                                        ? `You have ${readyMats.length} active study set${readyMats.length>1?"s":""}. Keep up the momentum.`
                                        : "You've completed 72% of your weekly study goals. Your next session is waiting."}
                                </p>
                            </div>
                            <div style={{ display:"flex", gap:10, flexShrink:0, animation:"fade-in-up .45s .1s ease both" }}>
                                <button
                                    style={{ padding:"10px 18px", background:"none", border:`1px solid rgba(195,198,213,0.6)`, borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, color:T.primary, cursor:"pointer", transition:"all .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                                    View Schedule
                                </button>
                                <button
                                    onClick={() => readyMats.length>0 ? navigate(`/study/${readyMats[0]._id}`) : navigate("/upload")}
                                    style={{ padding:"10px 18px", background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, color:"#fff", cursor:"pointer", boxShadow:T.shadowBlue, transition:"opacity .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.opacity=".85"}
                                    onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                                    {readyMats.length>0 ? "Continue Last Session" : "Upload Material"}
                                </button>
                            </div>
                        </section>

                        {/* AI Insight + Mastery row */}
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, marginBottom:28 }}>

                            {/* AI Insight — glassmorphism */}
                            <div style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", borderRadius:16, padding:22, boxShadow:T.shadow, border:"1px solid rgba(255,255,255,0.85)", animation:"fade-in-up .45s .05s ease both" }}>
                                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                        <Icon name="auto_awesome" size={17} fill={1} style={{ color:T.primary }} />
                                        <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, color:T.primary }}>Active AI Insight</span>
                                    </div>
                                    <span style={{ background:T.secBg, color:"#0c5216", fontSize:9, fontWeight:700, padding:"4px 10px", borderRadius:5, letterSpacing:".8px", textTransform:"uppercase" }}>
                                        Live Processing
                                    </span>
                                </div>
                                <div style={{ display:"flex", gap:18, alignItems:"flex-start" }}>
                                    <div style={{ width:150, height:100, background:"linear-gradient(135deg,#d9e2ff,#e7e8e9)", borderRadius:10, overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                        <Icon name="description" size={36} fill={0} style={{ color:"rgba(0,53,127,0.3)" }} />
                                    </div>
                                    <div style={{ flex:1 }}>
                                        <h4 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15, color:T.textPrimary, marginBottom:7, lineHeight:1.3 }}>
                                            {readyMats[0]?.title ?? "Advanced Neuroplasticity – Section 4"}
                                        </h4>
                                        <p style={{ fontSize:12, color:T.textMuted, fontStyle:"italic", lineHeight:1.65, marginBottom:14 }}>
                                            {readyMats[0]?.summary
                                                ? readyMats[0].summary.slice(0,115)+"…"
                                                : '"The role of synaptic pruning in adult learning cycles and the impact of cognitive load..."'}
                                        </p>
                                        <div>
                                            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                                                <span style={{ fontSize:9, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:T.textFaint }}>Generating Smart Summary</span>
                                                <span style={{ fontSize:11, fontWeight:700, color:T.secondary }}>{aiProgress}%</span>
                                            </div>
                                            <div style={{ height:4, background:T.secBg, borderRadius:2, overflow:"hidden" }}>
                                                <div style={{ height:"100%", width:`${aiProgress}%`, background:T.secondary, borderRadius:2, transition:"width .4s ease", animation:"pulse-bar 2s infinite" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Course Mastery */}
                            <div style={{ background:T.surface, borderRadius:16, padding:22, boxShadow:T.shadow, display:"flex", flexDirection:"column", justifyContent:"space-between", animation:"fade-in-up .45s .1s ease both" }}>
                                <div>
                                    <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15, color:T.primary, marginBottom:20 }}>Course Mastery</h3>
                                    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                                        {masteryData.map(({ label, pct }) => (
                                            <MasteryBar key={label} label={label} pct={pct} />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    style={{ width:"100%", marginTop:20, paddingTop:14, background:"none", border:"none", borderTop:`1px solid ${T.outline}`, color:T.primary, fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", transition:"background .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                                    Full Analytics Report
                                </button>
                            </div>
                        </div>

                        {/* Study sets section */}
                        <div style={{ marginBottom:28 }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:18, color:T.primary }}>
                                    {showDemo ? "Continue Studying" : "Your Study Sets"}
                                </h3>
                                <Link to="/upload" style={{ fontSize:13, fontWeight:600, color:"rgba(0,53,127,0.65)", textDecoration:"underline", textUnderlineOffset:4 }}>
                                    {showDemo ? "View all materials" : "Upload new +"}
                                </Link>
                            </div>

                            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(210px,1fr))", gap:18 }}>
                                {/* Real materials */}
                                {readyMats.map(mat => (
                                    <MaterialCard key={mat._id} material={mat} onClick={() => navigate(`/study/${mat._id}`)} />
                                ))}

                                {/* Demo cards */}
                                {showDemo && DEMO_COURSES.map(c => <DemoCourseCard key={c.title} {...c} />)}

                                {/* Add new card */}
                                <div className="anim-card"
                                    onClick={() => navigate("/upload")}
                                    style={{ borderRadius:14, border:"2px dashed rgba(195,198,213,0.5)", background:T.surfaceLow, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, cursor:"pointer", transition:"background .2s", minHeight:190 }}
                                    onMouseEnter={e => e.currentTarget.style.background=T.surfaceHigh}
                                    onMouseLeave={e => e.currentTarget.style.background=T.surfaceLow}>
                                    <div style={{ width:46, height:46, borderRadius:"50%", background:T.surface, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:T.shadow, marginBottom:10 }}>
                                        <Icon name="add" size={24} style={{ color:T.primary }} />
                                    </div>
                                    <p style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, color:T.primary, fontSize:14 }}>New Study Path</p>
                                    <p style={{ fontSize:10, color:T.textFaint, fontWeight:500, textAlign:"center", marginTop:3 }}>Upload PDF, MP3 or Text</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
                            <StatChip icon="timer"        iconBg={T.secBg}        iconColor="#0c5216"    label="Focus Time"          value="24.5 Hours" sub="+12%" />
                            <StatChip icon="description"  iconBg="#d9e2ff"        iconColor="#00429b"    label="Material Processed"  value={`${readyMats.length*12+128} Pages`} />
                            <StatChip icon="military_tech" iconBg={T.secBg}       iconColor="#0c5216"    label="Mastery Badges"      value="12 Earned" />
                        </div>
                    </div>
                </main>

                {/* FAB */}
                <button
                    onClick={() => navigate("/upload")}
                    style={{ position:"fixed", bottom:28, right:28, width:54, height:54, background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, color:"#fff", borderRadius:"50%", border:"none", cursor:"pointer", boxShadow:"0 8px 32px rgba(0,53,127,0.35)", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform .15s, box-shadow .15s", zIndex:50 }}
                    onMouseEnter={e => { e.currentTarget.style.transform="scale(1.09)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,53,127,0.45)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,53,127,0.35)"; }}>
                    <Icon name="add_box" size={25} fill={1} style={{ color:"#fff" }} />
                </button>
            </div>
        </>
    );
}