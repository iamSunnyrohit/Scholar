import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMaterials } from "../hooks/useMaterials";

const FontLoader = () => {
    useEffect(() => {
        if (document.getElementById("scholar-fonts")) return;
        const l1 = document.createElement("link");
        l1.id = "scholar-fonts"; l1.rel = "stylesheet";
        l1.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap";
        document.head.appendChild(l1);
        const l2 = document.createElement("link"); l2.rel = "stylesheet";
        l2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
        document.head.appendChild(l2);
        const s = document.createElement("style");
        s.textContent = `.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-family:'Material Symbols Outlined';display:inline-block;line-height:1;user-select:none}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:rgba(0,53,127,.15);border-radius:3px}@keyframes fade-in-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.hub-card{animation:fade-in-up .35s ease both}.card-flip-container{perspective:1000px}.card-flip-inner{position:relative;width:100%;transition:transform .55s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d}.card-flip-inner.flipped{transform:rotateY(180deg)}.card-face{position:absolute;inset:0;backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;border-radius:16px}.card-back{transform:rotateY(180deg)}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`;
        document.head.appendChild(s);
    }, []);
    return null;
};

const Icon = ({ name, fill = 0, size = 24, style: s }) => (
    <span className="material-symbols-outlined"
        style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill},'wght' 400,'GRAD' 0,'opsz' 24`, lineHeight: 1, ...s }}>
        {name}
    </span>
);

const T = {
    primary:"#00357f", primaryMid:"#004aad", secondary:"#2a6b2c", secBg:"#acf4a4",
    bg:"#f8f9fa", surface:"#ffffff", surfaceLow:"#f3f4f5", surfaceHigh:"#e7e8e9",
    textPrimary:"#191c1d", textMuted:"#546167", textFaint:"#737784",
    outline:"rgba(195,198,213,0.4)", shadow:"0 20px 40px rgba(25,28,29,0.06)",
    shadowBlue:"0 8px 32px rgba(0,53,127,0.25)",
};

const NAV_ITEMS = [
    { id:"dashboard", icon:"dashboard",    label:"Dashboard",   to:"/dashboard" },
    { id:"upload",    icon:"cloud_upload", label:"Upload",      to:"/upload" },
    { id:"study",     icon:"auto_stories", label:"Study Hub",   to:"/study" },
    { id:"quiz",      icon:"quiz",         label:"Quiz Center", to:"/quiz" },
    { id:"profile",   icon:"person",       label:"Profile",     to:"/profile" },
    { id:"settings",  icon:"settings",     label:"Settings",    to:"/settings" },
];

const NavItem = ({ id, icon, label, to, active, onClick }) => {
    const [hov, setHov] = useState(false);
    const on = active === id;
    return (
        <Link to={to} onClick={() => onClick(id)}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 13px", borderRadius:10, textDecoration:"none",
                background: on ? T.surface : hov ? "rgba(255,255,255,0.55)" : "transparent",
                color: on||hov ? T.primary : T.textMuted, fontWeight: on?700:500, fontSize:14,
                transform: on ? "translateX(2px)" : "none", transition:"all .15s" }}>
            <Icon name={icon} size={19} fill={on?1:0} />{label}
        </Link>
    );
};

function Sidebar({ navActive, setNavActive, navigate }) {
    return (
        <aside style={{ width:256, flexShrink:0, position:"fixed", left:0, top:0, bottom:0, background:T.surfaceLow, display:"flex", flexDirection:"column", padding:16, gap:4, zIndex:40, overflowY:"auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 8px 26px" }}>
                <div style={{ width:40, height:40, background:T.primary, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:T.shadowBlue }}>
                    <Icon name="school" size={22} fill={1} style={{ color:"#fff" }} />
                </div>
                <div>
                    <h1 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:T.primary, letterSpacing:"-0.5px", lineHeight:1 }}>Scholar AI</h1>
                    <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:T.textFaint, marginTop:2 }}>Academic Precision</p>
                </div>
            </div>
            <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
                {NAV_ITEMS.map(item => <NavItem key={item.id} {...item} active={navActive} onClick={setNavActive} />)}
            </nav>
            <div style={{ borderTop:`1px solid ${T.outline}`, paddingTop:12 }}>
                <button onClick={() => navigate("/upload")}
                    style={{ width:"100%", background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, color:"#fff", padding:"12px", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:T.shadowBlue }}
                    onMouseEnter={e => e.currentTarget.style.opacity=".85"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                    <Icon name="bolt" size={17} fill={1} style={{ color:"#fff" }} />Ask AI Assistant
                </button>
            </div>
        </aside>
    );
}

/* ── Material card for hub ── */
function HubCard({ material, actionLabel, actionTo, actionIcon, delay }) {
    const [hov, setHov] = useState(false);
    const mastery = material.masteryLevel ?? 0;
    const navigate = useNavigate();
    return (
        <div className="hub-card"
            style={{ background:T.surface, borderRadius:16, overflow:"hidden", boxShadow:T.shadow,
                border:`1px solid ${hov ? "rgba(0,53,127,0.18)" : "transparent"}`,
                transform: hov ? "translateY(-4px)" : "none", transition:"all .22s",
                animationDelay: `${delay}s`, display:"flex", flexDirection:"column" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {/* Banner */}
            <div style={{ height:110, background:"linear-gradient(135deg,#d9e2ff,#e0f2ef)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <span style={{ fontSize:40 }}>{material.emoji || "📚"}</span>
                <div style={{ position:"absolute", top:10, right:10, background: material.status==="ready" ? "rgba(172,244,164,0.95)" : "rgba(255,255,255,0.9)", padding:"3px 9px", borderRadius:5, fontSize:10, fontWeight:700, color: material.status==="ready" ? T.secondary : T.textFaint, letterSpacing:".5px" }}>
                    {material.status === "ready" ? "READY" : "PROCESSING"}
                </div>
            </div>
            {/* Body */}
            <div style={{ padding:"16px 18px", flex:1, display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                    <h4 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, lineHeight:1.35, color:T.textPrimary, marginBottom:3 }}>{material.title}</h4>
                    <p style={{ fontSize:11, color:T.textFaint }}>
                        {new Date(material.updatedAt).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" })}
                    </p>
                </div>
                {/* Mastery bar */}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:5, background:T.surfaceHigh, borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${mastery}%`, background:T.secondary, borderRadius:2, transition:"width 1.2s" }} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:T.textPrimary, minWidth:32, textAlign:"right" }}>{mastery}% mastery</span>
                </div>
                {/* CTA */}
                <button
                    onClick={() => material.status === "ready" && navigate(actionTo(material._id))}
                    disabled={material.status !== "ready"}
                    style={{ marginTop:"auto", width:"100%", padding:"10px", background: material.status==="ready" ? `linear-gradient(135deg,${T.primary},${T.primaryMid})` : T.surfaceHigh, border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, color: material.status==="ready" ? "#fff" : T.textFaint, cursor: material.status==="ready" ? "pointer" : "not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow: material.status==="ready" ? T.shadowBlue : "none", transition:"opacity .15s" }}
                    onMouseEnter={e => { if(material.status==="ready") e.currentTarget.style.opacity=".85"; }}
                    onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                    <Icon name={actionIcon} size={16} fill={1} style={{ color: material.status==="ready" ? "#fff" : T.textFaint }} />
                    {material.status==="ready" ? actionLabel : "Processing…"}
                </button>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════ */
export function StudyHubPage() {
    const { user, logout } = useAuth();
    const { materials, fetchAll } = useMaterials();
    const navigate = useNavigate();
    const [navActive, setNavActive] = useState("study");
    const [search, setSearch] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const initials = (user?.name || "S").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    const firstName = user?.name?.split(" ")[0] || "Scholar";
    const readyMats = (materials || []).filter(m => m.status === "ready");
    const filtered  = readyMats.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <FontLoader />
            <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Inter,sans-serif", background:T.bg, color:T.textPrimary }}>
                <Sidebar navActive={navActive} setNavActive={setNavActive} navigate={navigate} />
                <main style={{ flex:1, marginLeft:256, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
                    {/* Topbar */}
                    <header style={{ position:"sticky", top:0, zIndex:30, background:"rgba(248,249,250,0.96)", backdropFilter:"blur(12px)", padding:"10px 28px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${T.outline}` }}>
                        <div>
                            <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:T.primary }}>Study Hub</h2>
                            <p style={{ fontSize:12, color:T.textFaint }}>Pick a study set and start learning</p>
                        </div>
                        {/* Search */}
                        <div style={{ flex:1, maxWidth:380, marginLeft:24, position:"relative" }}>
                            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}>
                                <Icon name="search" size={16} style={{ color:T.textFaint }} />
                            </span>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search study sets…"
                                style={{ width:"100%", padding:"8px 12px 8px 34px", background:T.surfaceHigh, border:"none", borderRadius:9, fontSize:13, color:T.textPrimary, outline:"none", fontFamily:"Inter,sans-serif" }} />
                        </div>
                        {/* User chip */}
                        <div style={{ marginLeft:"auto", position:"relative" }}>
                            <button onClick={() => setShowMenu(v => !v)}
                                style={{ display:"flex", alignItems:"center", gap:9, padding:"5px 10px 5px 5px", borderRadius:20, border:`1px solid ${T.outline}`, background:"none", cursor:"pointer" }}
                                onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                onMouseLeave={e => e.currentTarget.style.background="none"}>
                                <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${T.primaryMid},#2a6b2c)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:12, color:"#fff" }}>{initials}</span>
                                </div>
                                <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, color:T.textPrimary }}>{firstName}</span>
                                <Icon name="expand_more" size={16} style={{ color:T.textFaint }} />
                            </button>
                            {showMenu && (
                                <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:T.surface, borderRadius:12, boxShadow:"0 12px 40px rgba(25,28,29,0.12)", border:`1px solid ${T.outline}`, minWidth:160, overflow:"hidden", zIndex:100 }}>
                                    {[{icon:"person",label:"Profile",to:"/profile"},{icon:"settings",label:"Settings",to:"/settings"}].map(({ icon,label,to }) => (
                                        <Link key={label} to={to} onClick={() => setShowMenu(false)}
                                            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", fontSize:13, color:T.textPrimary, textDecoration:"none" }}
                                            onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                            onMouseLeave={e => e.currentTarget.style.background="none"}>
                                            <Icon name={icon} size={17} />{label}
                                        </Link>
                                    ))}
                                    <div style={{ height:1, background:T.outline, margin:"4px 0" }} />
                                    <button onClick={logout}
                                        style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", width:"100%", border:"none", background:"none", fontSize:13, color:"#ba1a1a", cursor:"pointer" }}
                                        onMouseEnter={e => e.currentTarget.style.background="#fff1f1"}
                                        onMouseLeave={e => e.currentTarget.style.background="none"}>
                                        <Icon name="logout" size={17} style={{ color:"#ba1a1a" }} />Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div style={{ padding:"28px 28px 80px", flex:1 }}>
                        {/* Stats strip */}
                        <div style={{ display:"flex", gap:16, marginBottom:28 }}>
                            {[
                                { icon:"auto_stories", bg:"#d9e2ff", color:T.primary, label:"Study Sets", value: readyMats.length },
                                { icon:"military_tech", bg:T.secBg, color:T.secondary, label:"Avg Mastery", value: readyMats.length ? Math.round(readyMats.reduce((a,m) => a+(m.masteryLevel??0),0)/readyMats.length)+"%" : "–" },
                                { icon:"timer", bg:"rgba(0,53,127,0.08)", color:T.primary, label:"Focus Hours", value:"24.5h" },
                            ].map(({ icon, bg, color, label, value }) => (
                                <div key={label} style={{ flex:1, background:T.surface, borderRadius:14, padding:"16px 18px", boxShadow:T.shadow, display:"flex", alignItems:"center", gap:14 }}>
                                    <div style={{ width:42, height:42, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                        <Icon name={icon} size={20} fill={1} style={{ color }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:T.textFaint, marginBottom:3 }}>{label}</p>
                                        <p style={{ fontFamily:"Manrope,sans-serif", fontSize:18, fontWeight:800, color:T.primary, lineHeight:1 }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section header */}
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                            <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:18, color:T.primary }}>
                                {search ? `Results for "${search}"` : "Your Study Sets"}
                            </h3>
                            <Link to="/upload" style={{ fontSize:13, fontWeight:600, color:"rgba(0,53,127,0.65)", textDecoration:"underline", textUnderlineOffset:3 }}>
                                Upload new +
                            </Link>
                        </div>

                        {/* Grid */}
                        {filtered.length > 0 ? (
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:20 }}>
                                {filtered.map((mat, i) => (
                                    <HubCard key={mat._id} material={mat}
                                        actionLabel="Start Studying"
                                        actionIcon="menu_book"
                                        actionTo={id => `/study/${id}`}
                                        delay={i * 0.06} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign:"center", padding:"80px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
                                <div style={{ width:72, height:72, borderRadius:"50%", background:"#d9e2ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <Icon name="auto_stories" size={32} fill={1} style={{ color:T.primary }} />
                                </div>
                                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:19, color:T.primary }}>
                                    {search ? "No study sets match your search" : "No study sets yet"}
                                </h3>
                                <p style={{ fontSize:14, color:T.textFaint, maxWidth:340, lineHeight:1.6 }}>
                                    {search ? "Try a different keyword." : "Upload a PDF or paste text to create your first AI-powered study set."}
                                </p>
                                {!search && (
                                    <button onClick={() => navigate("/upload")}
                                        style={{ marginTop:8, padding:"12px 26px", background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, border:"none", borderRadius:12, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, color:"#fff", cursor:"pointer", boxShadow:T.shadowBlue }}
                                        onMouseEnter={e => e.currentTarget.style.opacity=".85"}
                                        onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                                        Upload Material →
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

/* ══════════════════════════════════════════════════════════ */
export function QuizHubPage() {
    const { user, logout } = useAuth();
    const { materials, fetchAll } = useMaterials();
    const navigate = useNavigate();
    const [navActive, setNavActive] = useState("quiz");
    const [search, setSearch] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const initials = (user?.name || "S").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    const firstName = user?.name?.split(" ")[0] || "Scholar";
    const readyMats = (materials || []).filter(m => m.status === "ready");
    const filtered  = readyMats.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <FontLoader />
            <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Inter,sans-serif", background:T.bg, color:T.textPrimary }}>
                <Sidebar navActive={navActive} setNavActive={setNavActive} navigate={navigate} />
                <main style={{ flex:1, marginLeft:256, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
                    <header style={{ position:"sticky", top:0, zIndex:30, background:"rgba(248,249,250,0.96)", backdropFilter:"blur(12px)", padding:"10px 28px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${T.outline}` }}>
                        <div>
                            <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:T.primary }}>Quiz Center</h2>
                            <p style={{ fontSize:12, color:T.textFaint }}>Test your knowledge on any study set</p>
                        </div>
                        <div style={{ flex:1, maxWidth:380, marginLeft:24, position:"relative" }}>
                            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}>
                                <Icon name="search" size={16} style={{ color:T.textFaint }} />
                            </span>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quiz sets…"
                                style={{ width:"100%", padding:"8px 12px 8px 34px", background:T.surfaceHigh, border:"none", borderRadius:9, fontSize:13, color:T.textPrimary, outline:"none", fontFamily:"Inter,sans-serif" }} />
                        </div>
                        <div style={{ marginLeft:"auto", position:"relative" }}>
                            <button onClick={() => setShowMenu(v => !v)}
                                style={{ display:"flex", alignItems:"center", gap:9, padding:"5px 10px 5px 5px", borderRadius:20, border:`1px solid ${T.outline}`, background:"none", cursor:"pointer" }}
                                onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                onMouseLeave={e => e.currentTarget.style.background="none"}>
                                <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${T.primaryMid},#2a6b2c)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:12, color:"#fff" }}>{initials}</span>
                                </div>
                                <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, color:T.textPrimary }}>{firstName}</span>
                                <Icon name="expand_more" size={16} style={{ color:T.textFaint }} />
                            </button>
                            {showMenu && (
                                <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:T.surface, borderRadius:12, boxShadow:"0 12px 40px rgba(25,28,29,0.12)", border:`1px solid ${T.outline}`, minWidth:160, overflow:"hidden", zIndex:100 }}>
                                    {[{icon:"person",label:"Profile",to:"/profile"},{icon:"settings",label:"Settings",to:"/settings"}].map(({ icon,label,to }) => (
                                        <Link key={label} to={to} onClick={() => setShowMenu(false)}
                                            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", fontSize:13, color:T.textPrimary, textDecoration:"none" }}
                                            onMouseEnter={e => e.currentTarget.style.background=T.surfaceLow}
                                            onMouseLeave={e => e.currentTarget.style.background="none"}>
                                            <Icon name={icon} size={17} />{label}
                                        </Link>
                                    ))}
                                    <div style={{ height:1, background:T.outline, margin:"4px 0" }} />
                                    <button onClick={logout}
                                        style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", width:"100%", border:"none", background:"none", fontSize:13, color:"#ba1a1a", cursor:"pointer" }}
                                        onMouseEnter={e => e.currentTarget.style.background="#fff1f1"}
                                        onMouseLeave={e => e.currentTarget.style.background="none"}>
                                        <Icon name="logout" size={17} style={{ color:"#ba1a1a" }} />Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div style={{ padding:"28px 28px 80px", flex:1 }}>
                        {/* Stats strip */}
                        <div style={{ display:"flex", gap:16, marginBottom:28 }}>
                            {[
                                { icon:"quiz", bg:"#d9e2ff", color:T.primary, label:"Quiz Sets Available", value: readyMats.length },
                                { icon:"emoji_events", bg:T.secBg, color:T.secondary, label:"Best Score", value:"92%" },
                                { icon:"history", bg:"rgba(0,53,127,0.08)", color:T.primary, label:"Quizzes Taken", value:"18" },
                            ].map(({ icon, bg, color, label, value }) => (
                                <div key={label} style={{ flex:1, background:T.surface, borderRadius:14, padding:"16px 18px", boxShadow:T.shadow, display:"flex", alignItems:"center", gap:14 }}>
                                    <div style={{ width:42, height:42, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                        <Icon name={icon} size={20} fill={1} style={{ color }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:T.textFaint, marginBottom:3 }}>{label}</p>
                                        <p style={{ fontFamily:"Manrope,sans-serif", fontSize:18, fontWeight:800, color:T.primary, lineHeight:1 }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                            <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:18, color:T.primary }}>
                                {search ? `Results for "${search}"` : "Available Quizzes"}
                            </h3>
                            <Link to="/upload" style={{ fontSize:13, fontWeight:600, color:"rgba(0,53,127,0.65)", textDecoration:"underline", textUnderlineOffset:3 }}>
                                Upload new +
                            </Link>
                        </div>

                        {filtered.length > 0 ? (
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:20 }}>
                                {filtered.map((mat, i) => (
                                    <HubCard key={mat._id} material={mat}
                                        actionLabel="Start Quiz"
                                        actionIcon="quiz"
                                        actionTo={id => `/quiz/${id}`}
                                        delay={i * 0.06} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign:"center", padding:"80px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
                                <div style={{ width:72, height:72, borderRadius:"50%", background:"#d9e2ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <Icon name="quiz" size={32} fill={1} style={{ color:T.primary }} />
                                </div>
                                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:19, color:T.primary }}>
                                    {search ? "No quizzes match your search" : "No quizzes available yet"}
                                </h3>
                                <p style={{ fontSize:14, color:T.textFaint, maxWidth:340, lineHeight:1.6 }}>
                                    {search ? "Try a different keyword." : "Upload study material and Scholar AI will automatically generate quiz questions for you."}
                                </p>
                                {!search && (
                                    <button onClick={() => navigate("/upload")}
                                        style={{ marginTop:8, padding:"12px 26px", background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, border:"none", borderRadius:12, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, color:"#fff", cursor:"pointer", boxShadow:T.shadowBlue }}
                                        onMouseEnter={e => e.currentTarget.style.opacity=".85"}
                                        onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                                        Upload Material →
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
