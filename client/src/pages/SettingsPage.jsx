import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        s.textContent = `.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-family:'Material Symbols Outlined';display:inline-block;line-height:1;user-select:none}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:rgba(0,53,127,.15);border-radius:3px}@keyframes fade-in-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.anim-s{animation:fade-in-up .4s ease both}.setting-inp:focus{outline:none;box-shadow:0 0 0 2px rgba(0,53,127,.18)}`;
        document.head.appendChild(s);
    }, []);
    return null;
};

const Icon = ({ name, fill = 0, size = 24, style: s }) => (
    <span className="material-symbols-outlined"
        style={{ fontSize:size, fontVariationSettings:`'FILL' ${fill},'wght' 400,'GRAD' 0,'opsz' 24`, lineHeight:1, ...s }}>
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

const TABS = [
    { id:"account",       icon:"lock",         label:"Account & Security" },
    { id:"notifications", icon:"notifications", label:"Notifications" },
    { id:"appearance",    icon:"palette",       label:"Appearance" },
    { id:"danger",        icon:"warning",       label:"Danger Zone" },
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

const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
            background: type==="error" ? "#ba1a1a" : T.secondary, color:"#fff",
            padding:"12px 22px", borderRadius:12, fontFamily:"Manrope,sans-serif",
            fontWeight:600, fontSize:14, boxShadow:"0 8px 30px rgba(0,0,0,0.18)",
            zIndex:999, display:"flex", alignItems:"center", gap:10, animation:"fade-in-up .3s ease both" }}>
            <Icon name={type==="error"?"error":"check_circle"} size={19} fill={1} style={{ color:"#fff" }} />{message}
        </div>
    );
};

const Toggle = ({ checked, onChange, label, sub }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${T.outline}` }}>
        <div>
            <p style={{ fontSize:14, fontWeight:500, color:T.textPrimary }}>{label}</p>
            {sub && <p style={{ fontSize:12, color:T.textFaint, marginTop:2 }}>{sub}</p>}
        </div>
        <button onClick={() => onChange(!checked)}
            style={{ width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
                background: checked ? T.primary : T.surfaceHigh, position:"relative", transition:"background .2s" }}>
            <span style={{ position:"absolute", top:3, left: checked?20:3, width:18, height:18, borderRadius:"50%",
                background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left .2s" }} />
        </button>
    </div>
);

const ConfirmModal = ({ onConfirm, onCancel }) => (
    <div style={{ position:"fixed", inset:0, background:"rgba(25,28,29,0.45)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ background:T.surface, borderRadius:18, padding:32, maxWidth:400, width:"90%", boxShadow:"0 24px 60px rgba(25,28,29,0.2)", animation:"fade-in-up .25s ease both" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"#fff1f1", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                <Icon name="warning" size={28} fill={1} style={{ color:"#ba1a1a" }} />
            </div>
            <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:T.textPrimary, marginBottom:10 }}>Delete Account?</h3>
            <p style={{ fontSize:14, color:T.textMuted, lineHeight:1.65, marginBottom:24 }}>
                This action is permanent and cannot be undone. All your study materials, flashcards, and progress will be erased.
            </p>
            <div style={{ display:"flex", gap:10 }}>
                <button onClick={onCancel}
                    style={{ flex:1, padding:"11px", background:"none", border:`1px solid ${T.outline}`, borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:14, color:T.textMuted, cursor:"pointer" }}>
                    Cancel
                </button>
                <button onClick={onConfirm}
                    style={{ flex:1, padding:"11px", background:"#ba1a1a", border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, color:"#fff", cursor:"pointer" }}>
                    Yes, Delete
                </button>
            </div>
        </div>
    </div>
);

export default function SettingsPage() {
    const { user, logout, updatePassword } = useAuth();
    const navigate = useNavigate();
    const [navActive, setNavActive] = useState("settings");
    const [activeTab, setActiveTab] = useState("account");
    const [toast, setToast] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Password
    const [curPw,  setCurPw]  = useState("");
    const [newPw,  setNewPw]  = useState("");
    const [confPw, setConfPw] = useState("");
    const [pwSaving, setPwSaving] = useState(false);

    // Notifications
    const [notifs, setNotifs] = useState({ emailDigest:true, quizReminders:true, weeklyReport:false, achievementAlerts:true });

    // Appearance
    const [fontSize, setFontSize] = useState("medium");
    const [compactMode, setCompactMode] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const initials = (user?.name || "S").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    const firstName = user?.name?.split(" ")[0] || "Scholar";

    const handlePasswordChange = async () => {
        if (!curPw || !newPw || !confPw) { setToast({ message:"All password fields are required.", type:"error" }); return; }
        if (newPw !== confPw) { setToast({ message:"New passwords don't match.", type:"error" }); return; }
        if (newPw.length < 6) { setToast({ message:"Password must be at least 6 characters.", type:"error" }); return; }
        setPwSaving(true);
        try {
            await updatePassword(curPw, newPw);
            setToast({ message:"Password updated successfully!", type:"success" });
            setCurPw(""); setNewPw(""); setConfPw("");
        } catch (err) {
            setToast({ message: err.message || "Failed to update password.", type:"error" });
        } finally { setPwSaving(false); }
    };

    const Sidebar = useCallback(() => (
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
                    style={{ width:"100%", marginBottom:8, background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, color:"#fff", padding:"12px", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:13, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:T.shadowBlue }}
                    onMouseEnter={e => e.currentTarget.style.opacity=".85"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                    <Icon name="bolt" size={17} fill={1} style={{ color:"#fff" }} />Ask AI Assistant
                </button>
            </div>
        </aside>
    ), [navActive, navigate]);

    const tabContent = {
        account: (
            <div className="anim-s">
                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:17, color:T.primary, marginBottom:6 }}>Change Password</h3>
                <p style={{ fontSize:13, color:T.textFaint, marginBottom:24 }}>Make sure your account stays secure with a strong password.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    {[
                        { label:"Current Password",  val:curPw,  set:setCurPw,  ph:"Enter current password" },
                        { label:"New Password",      val:newPw,  set:setNewPw,  ph:"At least 6 characters" },
                        { label:"Confirm Password",  val:confPw, set:setConfPw, ph:"Repeat new password" },
                    ].map(({ label, val, set, ph }) => (
                        <div key={label}>
                            <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.textMuted, marginBottom:6, letterSpacing:".3px" }}>{label.toUpperCase()}</label>
                            <input type="password" className="setting-inp" value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                style={{ width:"100%", padding:"11px 14px", background:T.surfaceLow, border:`1px solid ${T.outline}`, borderRadius:10, fontSize:14, color:T.textPrimary, fontFamily:"Inter,sans-serif" }} />
                        </div>
                    ))}
                    <button onClick={handlePasswordChange} disabled={pwSaving}
                        style={{ alignSelf:"flex-start", padding:"11px 26px", background:`linear-gradient(135deg,${T.primary},${T.primaryMid})`, border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, color:"#fff", cursor:pwSaving?"not-allowed":"pointer", opacity:pwSaving?.7:1, boxShadow:T.shadowBlue, display:"flex", alignItems:"center", gap:8 }}>
                        <Icon name={pwSaving?"sync":"lock"} size={16} style={{ color:"#fff" }} />{pwSaving?"Updating…":"Update Password"}
                    </button>
                </div>
                <div style={{ marginTop:32, paddingTop:24, borderTop:`1px solid ${T.outline}` }}>
                    <h4 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, color:T.textPrimary, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                        <Icon name="verified_user" size={17} fill={1} style={{ color:T.secondary }} />Account Info
                    </h4>
                    {[
                        { label:"Email",       value: user?.email },
                        { label:"Plan",        value: (user?.subscriptionTier || "free").charAt(0).toUpperCase() + (user?.subscriptionTier||"free").slice(1) },
                        { label:"AI Generations Used", value: `${user?.aiGenerationsUsed ?? 0}` },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.outline}` }}>
                            <span style={{ fontSize:13, color:T.textMuted }}>{label}</span>
                            <span style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        notifications: (
            <div className="anim-s">
                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:17, color:T.primary, marginBottom:6 }}>Notification Preferences</h3>
                <p style={{ fontSize:13, color:T.textFaint, marginBottom:24 }}>Choose what you'd like to be notified about.</p>
                <Toggle checked={notifs.emailDigest}      onChange={v => setNotifs(n => ({...n, emailDigest:v}))}      label="Daily Email Digest"      sub="Get a summary of your progress each morning" />
                <Toggle checked={notifs.quizReminders}    onChange={v => setNotifs(n => ({...n, quizReminders:v}))}    label="Quiz Reminders"          sub="Be reminded when quizzes are due for review" />
                <Toggle checked={notifs.weeklyReport}     onChange={v => setNotifs(n => ({...n, weeklyReport:v}))}     label="Weekly Progress Report"  sub="Receive a comprehensive weekly learning report" />
                <Toggle checked={notifs.achievementAlerts} onChange={v => setNotifs(n => ({...n, achievementAlerts:v}))} label="Achievement Alerts"  sub="Celebrate when you earn new mastery badges" />
                <button onClick={() => setToast({ message:"Notification preferences saved!", type:"success" })}
                    style={{ marginTop:24, padding:"11px 26px", background:T.primary, border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, color:"#fff", cursor:"pointer", boxShadow:T.shadowBlue, display:"flex", alignItems:"center", gap:8 }}>
                    <Icon name="check" size={16} style={{ color:"#fff" }} />Save Preferences
                </button>
            </div>
        ),
        appearance: (
            <div className="anim-s">
                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:17, color:T.primary, marginBottom:6 }}>Appearance</h3>
                <p style={{ fontSize:13, color:T.textFaint, marginBottom:24 }}>Personalise how Scholar AI looks for you.</p>
                <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" sub="Switch to a darker colour scheme (coming soon)" />
                <Toggle checked={compactMode} onChange={setCompactMode} label="Compact Layout" sub="Show more content with reduced spacing" />
                <div style={{ padding:"14px 0", borderBottom:`1px solid ${T.outline}` }}>
                    <p style={{ fontSize:14, fontWeight:500, color:T.textPrimary, marginBottom:10 }}>Font Size</p>
                    <div style={{ display:"flex", gap:10 }}>
                        {["small","medium","large"].map(sz => (
                            <button key={sz} onClick={() => setFontSize(sz)}
                                style={{ padding:"7px 18px", borderRadius:20, border:`1.5px solid ${fontSize===sz?T.primary:T.outline}`, background: fontSize===sz ? `rgba(0,53,127,0.08)`:T.surface, color: fontSize===sz ? T.primary : T.textMuted, fontFamily:"Manrope,sans-serif", fontWeight:600, fontSize:12, cursor:"pointer", textTransform:"capitalize", transition:"all .15s" }}>
                                {sz}
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={() => setToast({ message:"Appearance settings saved!", type:"success" })}
                    style={{ marginTop:24, padding:"11px 26px", background:T.primary, border:"none", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, color:"#fff", cursor:"pointer", boxShadow:T.shadowBlue, display:"flex", alignItems:"center", gap:8 }}>
                    <Icon name="check" size={16} style={{ color:"#fff" }} />Apply Settings
                </button>
            </div>
        ),
        danger: (
            <div className="anim-s">
                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:17, color:"#ba1a1a", marginBottom:6 }}>Danger Zone</h3>
                <p style={{ fontSize:13, color:T.textFaint, marginBottom:24 }}>These actions are irreversible. Please proceed with caution.</p>
                <div style={{ border:"1.5px solid rgba(186,26,26,0.2)", borderRadius:14, padding:22, background:"rgba(186,26,26,0.03)" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                        <div>
                            <p style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15, color:T.textPrimary }}>Delete Account</p>
                            <p style={{ fontSize:13, color:T.textFaint, marginTop:4, lineHeight:1.5 }}>
                                Permanently delete your account and all associated data including study materials, flashcards, and progress.
                            </p>
                        </div>
                        <button onClick={() => setShowDeleteModal(true)}
                            style={{ flexShrink:0, padding:"10px 20px", background:"none", border:"1.5px solid #ba1a1a", borderRadius:10, fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, color:"#ba1a1a", cursor:"pointer", whiteSpace:"nowrap", transition:"all .15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background="#ba1a1a"; e.currentTarget.style.color="#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color="#ba1a1a"; }}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <>
            <FontLoader />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {showDeleteModal && <ConfirmModal onConfirm={() => { logout(); navigate("/"); }} onCancel={() => setShowDeleteModal(false)} />}
            <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Inter,sans-serif", background:T.bg, color:T.textPrimary }}>
                <Sidebar />
                <main style={{ flex:1, marginLeft:256, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
                    {/* Topbar */}
                    <header style={{ position:"sticky", top:0, zIndex:30, background:"rgba(248,249,250,0.96)", backdropFilter:"blur(12px)", padding:"10px 28px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${T.outline}` }}>
                        <div>
                            <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:T.primary }}>Settings</h2>
                            <p style={{ fontSize:12, color:T.textFaint }}>Manage your account preferences</p>
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
                    <div style={{ padding:"32px 28px 80px", flex:1, display:"flex", gap:24, maxWidth:980, margin:"0 auto", width:"100%", alignItems:"flex-start" }}>
                        {/* Tab menu */}
                        <div style={{ width:220, flexShrink:0, background:T.surface, borderRadius:16, padding:10, boxShadow:T.shadow, position:"sticky", top:90 }}>
                            {TABS.map(tab => {
                                const on = activeTab === tab.id;
                                const isDanger = tab.id === "danger";
                                return (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 13px", borderRadius:10, border:"none", background: on ? (isDanger ? "rgba(186,26,26,0.08)" : `rgba(0,53,127,0.08)`) : "none",
                                            color: on ? (isDanger ? "#ba1a1a" : T.primary) : (isDanger ? "rgba(186,26,26,0.7)" : T.textMuted),
                                            fontFamily:"Inter,sans-serif", fontWeight: on?700:500, fontSize:13, cursor:"pointer", transition:"all .15s", textAlign:"left", marginBottom:2 }}
                                        onMouseEnter={e => { if(!on) e.currentTarget.style.background = isDanger ? "rgba(186,26,26,0.05)" : T.surfaceLow; }}
                                        onMouseLeave={e => { if(!on) e.currentTarget.style.background = "none"; }}>
                                        <Icon name={tab.icon} size={18} fill={on?1:0} />{tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab content */}
                        <div style={{ flex:1, background:T.surface, borderRadius:16, padding:28, boxShadow:T.shadow }}>
                            {tabContent[activeTab]}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
