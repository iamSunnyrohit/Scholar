import { useEffect } from "react";
import { Link } from "react-router-dom";
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
        s.textContent = `
            .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-family:'Material Symbols Outlined';display:inline-block;line-height:1;user-select:none}
            *{box-sizing:border-box;margin:0;padding:0}
            @keyframes fade-in-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
            .anim-1{animation:fade-in-up .5s ease both}
            .anim-2{animation:fade-in-up .5s .12s ease both}
            .anim-3{animation:fade-in-up .5s .22s ease both}
            .sample-card{transition:transform .2s,box-shadow .2s!important}
            .sample-card:hover{transform:translateY(-3px)!important;box-shadow:0 20px 40px rgba(25,28,29,0.1)!important}
            .feat-card{transition:background .15s!important}
            .feat-card:hover{background:#e7e8e9!important}
        `;
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
    primary: "#00357f", primaryMid: "#004aad", secondary: "#2a6b2c", secBg: "#acf4a4",
    bg: "#f8f9fa", surface: "#ffffff", surfaceLow: "#f3f4f5", surfaceHigh: "#e7e8e9",
    textPrimary: "#191c1d", textMuted: "#546167", textFaint: "#737784",
    outline: "rgba(195,198,213,0.4)", shadow: "0 20px 40px rgba(25,28,29,0.06)",
    shadowBlue: "0 8px 32px rgba(0,53,127,0.25)",
};

const SAMPLES = [
    { key: "photosynthesis", label: "Photosynthesis", emoji: "🌿", desc: "Biology · Cell processes" },
    { key: "quantum", label: "Quantum Mechanics", emoji: "⚛️", desc: "Physics · Fundamentals" },
    { key: "economics", label: "Supply & Demand", emoji: "📊", desc: "Economics · Markets" },
];

const FEATURES = [
    { icon: "auto_awesome", label: "AI Summaries", desc: "Instant smart summaries from any material" },
    { icon: "style", label: "Flashcards", desc: "Auto-generated cards with mastery tracking" },
    { icon: "quiz", label: "Auto Quizzes", desc: "MCQ quizzes with explanations & scoring" },
];

export default function HomePage() {
    const { user } = useAuth();

    return (
        <>
            <FontLoader />
            <div style={{ minHeight: "calc(100vh - 56px)", background: T.bg, fontFamily: "Inter,sans-serif" }}>

                {/* ── Hero ── */}
                <div style={{ background: `linear-gradient(135deg,${T.primary} 0%,${T.primaryMid} 60%,#1a6b2c 100%)`, padding: "72px 40px 88px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -80, right: -80, width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    <div style={{ position: "absolute", bottom: -60, left: "28%", width: 240, height: 240, borderRadius: "50%", background: "rgba(172,244,164,0.07)" }} />
                    <div style={{ position: "absolute", top: "20%", left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                    <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
                        <span className="anim-1" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.secBg, color: T.secondary, fontSize: 11, fontWeight: 700, letterSpacing: ".8px", padding: "5px 12px", borderRadius: 99, textTransform: "uppercase", marginBottom: 22 }}>
                            <Icon name="auto_awesome" size={14} fill={1} style={{ color: T.secondary }} />
                            AI-Powered Learning
                        </span>

                        <h1 className="anim-2" style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "clamp(32px,5vw,54px)", lineHeight: 1.1, color: "#ffffff", marginBottom: 20, letterSpacing: "-0.5px" }}>
                            Turn any text into an<br />
                            <span style={{ color: T.secBg }}>interactive study set</span>
                        </h1>

                        <p className="anim-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", maxWidth: 480, lineHeight: 1.7, marginBottom: 36 }}>
                            Paste your notes or upload a PDF. Scholar AI generates summaries,
                            flashcards, and quizzes — in seconds.
                        </p>

                        <div className="anim-3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <Link to={user ? "/dashboard" : "/register"}
                                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: T.surface, color: T.primary, borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "Manrope,sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                                onMouseEnter={e => e.currentTarget.style.opacity = ".9"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                                <Icon name={user ? "dashboard" : "rocket_launch"} size={18} fill={1} style={{ color: T.primary }} />
                                {user ? "Go to Dashboard" : "Get started free"}
                            </Link>
                            {!user && (
                                <Link to="/login"
                                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", fontFamily: "Manrope,sans-serif" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ maxWidth: 720, margin: "0 auto", padding: "52px 28px 72px" }}>

                    {/* Feature strip */}
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.textFaint, letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 16 }}>What Scholar AI does</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 52 }}>
                        {FEATURES.map(f => (
                            <div key={f.label} className="feat-card"
                                style={{ background: T.surface, borderRadius: 14, padding: "20px 18px", boxShadow: T.shadow, border: `1px solid ${T.outline}` }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#d9e2ff,#e0f2ef)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                                    <Icon name={f.icon} size={22} fill={1} style={{ color: T.primary }} />
                                </div>
                                <p style={{ fontFamily: "Manrope,sans-serif", fontWeight: 700, fontSize: 14, color: T.textPrimary, marginBottom: 6 }}>{f.label}</p>
                                <p style={{ fontSize: 12, color: T.textFaint, lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Sample topics */}
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.textFaint, letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 16 }}>Sample topics</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {SAMPLES.map(s => (
                            <Link key={s.key} to={user ? `/dashboard?sample=${s.key}` : "/register"}
                                className="sample-card"
                                style={{ display: "flex", alignItems: "center", gap: 16, background: T.surface, border: `1px solid ${T.outline}`, borderRadius: 14, padding: "18px 20px", textDecoration: "none", boxShadow: T.shadow }}>
                                <div style={{ width: 50, height: 50, background: "linear-gradient(135deg,#d9e2ff,#e0f2ef)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                                    {s.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontFamily: "Manrope,sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary, marginBottom: 3 }}>{s.label}</p>
                                    <p style={{ fontSize: 12, color: T.textFaint }}>{s.desc}</p>
                                </div>
                                <Icon name="arrow_forward" size={20} style={{ color: T.primary, flexShrink: 0 }} />
                            </Link>
                        ))}
                    </div>

                    {/* Bottom CTA banner */}
                    <div style={{ marginTop: 52, background: `linear-gradient(135deg,${T.primary},${T.primaryMid})`, borderRadius: 18, padding: "36px 32px", textAlign: "center", boxShadow: T.shadowBlue, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", right: -30, top: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                        <Icon name="school" size={36} fill={1} style={{ color: T.secBg, marginBottom: 14 }} />
                        <h2 style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 10 }}>
                            Ready to study smarter?
                        </h2>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 24, lineHeight: 1.6 }}>
                            Join thousands of students using Scholar AI to ace their exams.
                        </p>
                        <Link to={user ? "/dashboard" : "/register"}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: T.surface, color: T.primary, borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "Manrope,sans-serif", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = ".9"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                            <Icon name="rocket_launch" size={17} fill={1} style={{ color: T.primary }} />
                            {user ? "Open Dashboard" : "Start for free →"}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
