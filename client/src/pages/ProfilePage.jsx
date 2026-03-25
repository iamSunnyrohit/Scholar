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
        s.textContent = `.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-family:'Material Symbols Outlined';display:inline-block;line-height:1;user-select:none}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:rgba(0,53,127,.15);border-radius:3px}@keyframes fade-in-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.anim-s{animation:fade-in-up .4s ease both}.profile-inp:focus{outline:none;box-shadow:0 0 0 2px rgba(0,53,127,.18)}`;
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
                boxShadow: on ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                color: on||hov ? T.primary : T.textMuted,
                fontWeight: on ? 700 : 500, fontSize:14,
                transform: on ? "translateX(2px)" : "none", transition:"all .15s" }}>
            <Icon name={icon} size={19} fill={on?1:0} />{label}
        </Link>
    );
};

const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
            background: type==="error" ? "#ba1a1a" : T.secondary, color:"#fff",
            padding:"12px 22px", borderRadius:12, fontFamily:"Manrope,sans-serif",
            fontWeight:600, fontSize:14, boxShadow:"0 8px 30px rgba(0,0,0,0.18)",
            zIndex:999, display:"flex", alignItems:"center", gap:10, animation:"fade-in-up .3s ease both" }}>
            <Icon name={type==="error" ? "error" : "check_circle"} size={19} fill={1} style={{ color:"#fff" }} />
            {message}
        </div>
    );
};

const StatCard = ({ icon, iconBg, iconColor, label, value }) => (
    <div style={{ background:T.surface, borderRadius:14, padding:"18px 20px", boxShadow:T.shadow, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:50, height:50, borderRadius:"50%", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name={icon} size={22} fill={1} style={{ color:iconColor }} />
        </div>
        <div>
            <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:T.textFaint, marginBottom:4 }}>{label}</p>
            <p style={{ fontFamily:"Manrope,sans-serif", fontSize:20, fontWeight:800, color:T.primary, lineHeight:1 }}>{value}</p>
        </div>
    </div>
);

export default function ProfilePage() {
    const { user, logout, updateProfile } = useAuth();
    const { materials, fetchAll } = useMaterials();
    const navigate = useNavigate();
    const [navActive, setNavActive] = useState("profile");
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => { fetchAll(); }, [fetchAll]);
    useEffect(() => { setName(user?.name || ""); setEmail(user?.email || ""); }, [user]);

    const firstName = user?.name?.split(" ")[0] || "Scholar";
    const initials  = (user?.name || "S").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    const readyMats = (materials || []).filter(m => m.status === "ready");
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"long" })
        : "Recently";
    const tier = user?.subscriptionTier || "free";
    const tierBadge = { free:{ bg:T.surfaceHigh, color:T.textMuted }, pro:{ bg:"rgba(0,53,127,0.12)", color:T.primary }, enterprise:{ bg:"rgba(172,244,164,0.7)", color:T.secondary } };
    const ts = tierBadge[tier] || tierBadge.free;

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) { setToast({ message:"Name and email required.", type:"error" }); return; }
        setSaving(true);
        try {
            await updateProfile(name.trim(), email.trim());
            setToast({ message:"Profile updated!", type:"success" });
            setEditMode(false);
        } catch (err) {
            setToast({ message: err.message || "Update failed.", type:"error" });
        } finally { setSaving(false); }
    };

    /* ── shared sidebar shell ── */
    const Sidebar = () => (
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
            <div style={{ borderTop:`1px solid ${T.outline}`, paddingTop:12, display:"flex", flexDirection:"column", gap:3 }}>
                <button onClick={() => navigate("/upload")}
                    style={{ width:"100%", marginBottom:8, background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, color:"#fff", padding:"12px", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:T.shadowBlue }}
                    onMouseEnter={e => e.currentTarget.style.opacity=".85"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                    <Icon name="bolt" size={17} fill={1} style={{ color:"#fff" }} />Ask AI Assistant
                </button>
                <button style={{ display:"flex", alignItems:"center", gap:11, padding:"8px 12px", borderRadius:8, background:"none", border:"none", color:T.textMuted, fontSize:13, cursor:"pointer", width:"100%" }}
                    onMouseEnter={e => e.currentTarget.style.color=T.primary} onMouseLeave={e => e.currentTarget.style.color=T.textMuted}>
                    <Icon name="help_outline" size={19} />Help
                </button>
            </div>
        </aside>
    );

    return (
        <>
            <FontLoader />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Inter,sans-serif", background:T.bg, color:T.textPrimary }}>
                <Sidebar />
                <main style={{ flex:1, marginLeft:256, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
                    {/* Topbar */}
                    <header style={{ position:"sticky", top:0, zIndex:30, background:"rgba(248,249,250,0.96)", backdropFilter:"blur(12px)", padding:"10px 28px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${T.outline}` }}>
                        <div>
                            <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:T.primary }}>My Profile</h2>
                            <p style={{ fontSize:12, color:T.textFaint }}>Manage your personal information</p>
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

                    {/* Content */}
                    <div style={{ padding:"32px 28px 80px", flex:1, maxWidth:860, margin:"0 auto", width:"100%" }}>

                        {/* Hero */}
                        <div className="anim-s" style={{ background:`linear-gradient(135deg,${T.primary} 0%,${T.primaryMid} 55%,#1a6b2c 100%)`, borderRadius:20, padding:"36px 32px", display:"flex", alignItems:"center", gap:28, marginBottom:28, boxShadow:T.shadowBlue, position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", right:-40, top:-40, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
                            <div style={{ position:"absolute", right:60, bottom:-60, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
                            <div style={{ width:96, height:96, borderRadius:"50%", background:"rgba(255,255,255,0.18)", backdropFilter:"blur(10px)", border:"3px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:34, color:"#fff" }}>{initials}</span>
                            </div>
                            <div style={{ flex:1 }}>
                                <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:26, color:"#fff", marginBottom:5 }}>{user?.name || "Scholar"}</h2>
                                <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginBottom:14 }}>{user?.email}</p>
                                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                                    <span style={{ background:ts.bg, color:ts.color, padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".8px" }}>{tier} plan</span>
                                    <span style={{ background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.85)", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:600 }}>Member since {memberSince}</span>
                                </div>
                            </div>
                            <button onClick={() => setEditMode(v => !v)}
                                style={{ background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", padding:"9px 18px", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:7, flexShrink:0 }}
                                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.26)"}
                                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.18)"}>
                                <Icon name={editMode ? "close" : "edit"} size={16} style={{ color:"#fff" }} />
                                {editMode ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>

                        {/* Edit form */}
                        {editMode && (
                            <div className="anim-s" style={{ background:T.surface, borderRadius:16, padding:24, boxShadow:T.shadow, marginBottom:28, border:`1px solid ${T.outline}` }}>
                                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:16, color:T.primary, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
                                    <Icon name="edit" size={18} fill={1} style={{ color:T.primary }} />Edit Information
                                </h3>
                                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                                    {[{label:"FULL NAME",val:name,set:setName,type:"text",ph:"Your full name"},{label:"EMAIL ADDRESS",val:email,set:setEmail,type:"email",ph:"your@email.com"}].map(({label,val,set,type,ph}) => (
                                        <div key={label}>
                                            <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.textMuted, marginBottom:6, letterSpacing:".3px" }}>{label}</label>
                                            <input className="profile-inp" type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                                style={{ width:"100%", padding:"11px 14px", background:T.surfaceLow, border:`1px solid ${T.outline}`, borderRadius:10, fontSize:14, color:T.textPrimary, fontFamily:"Inter,sans-serif", transition:"box-shadow .2s" }} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:20 }}>
                                    <button onClick={() => setEditMode(false)}
                                        style={{ padding:"10px 18px", background:"none", border:`1px solid ${T.outline}`, borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, color:T.textMuted, cursor:"pointer" }}>
                                        Cancel
                                    </button>
                                    <button onClick={handleSave} disabled={saving}
                                        style={{ padding:"10px 22px", background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, color:"#fff", cursor:saving?"not-allowed":"pointer", opacity:saving?.7:1, boxShadow:T.shadowBlue, display:"flex", alignItems:"center", gap:8 }}>
                                        <Icon name={saving?"sync":"check"} size={16} style={{ color:"#fff" }} />{saving?"Saving…":"Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="anim-s" style={{ marginBottom:28 }}>
                            <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:16, color:T.primary, marginBottom:16 }}>Learning Stats</h3>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                                <StatCard icon="auto_stories" iconBg="#d9e2ff" iconColor={T.primary} label="Study Materials" value={readyMats.length} />
                                <StatCard icon="military_tech" iconBg={T.secBg} iconColor={T.secondary} label="Mastery Badges" value={12} />
                                <StatCard icon="timer" iconBg="rgba(0,53,127,0.08)" iconColor={T.primary} label="Focus Hours" value="24.5" />
                            </div>
                        </div>

                        {/* Subscription */}
                        <div className="anim-s" style={{ background:T.surface, borderRadius:16, padding:24, boxShadow:T.shadow, border:`1px solid ${T.outline}` }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                                    <div style={{ width:48, height:48, borderRadius:12, background:"linear-gradient(135deg,#d9e2ff,#e0f2ef)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                        <Icon name="workspace_premium" size={24} fill={1} style={{ color:T.primary }} />
                                    </div>
                                    <div>
                                        <p style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15, color:T.textPrimary }}>{tier==="free"?"Free Plan":tier==="pro"?"Pro Plan":"Enterprise Plan"}</p>
                                        <p style={{ fontSize:12, color:T.textFaint, marginTop:2 }}>{user?.aiGenerationsUsed ?? 0} AI generations used this month</p>
                                    </div>
                                </div>
                                {tier === "free" && (
                                    <button style={{ padding:"10px 22px", background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, color:"#fff", cursor:"pointer", boxShadow:T.shadowBlue }}
                                        onMouseEnter={e => e.currentTarget.style.opacity=".85"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                                        Upgrade to Pro →
                                    </button>
                                )}
                            </div>
                            {tier === "free" && (
                                <div style={{ marginTop:18, paddingTop:18, borderTop:`1px solid ${T.outline}` }}>
                                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                                        <span style={{ fontSize:12, color:T.textMuted }}>Monthly AI generations</span>
                                        <span style={{ fontSize:12, fontWeight:700, color:T.primary }}>{user?.aiGenerationsUsed ?? 0} / 5</span>
                                    </div>
                                    <div style={{ height:6, background:T.surfaceHigh, borderRadius:3, overflow:"hidden" }}>
                                        <div style={{ height:"100%", width:`${Math.min(((user?.aiGenerationsUsed??0)/5)*100,100)}%`, background:`linear-gradient(90deg,${T.primary},${T.primaryMid})`, borderRadius:3, transition:"width 1s" }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
