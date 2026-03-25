import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

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
            @keyframes fade-in-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
            .auth-fadeup{animation:fade-in-up .45s ease both}
            .auth-inp:focus{border-color:#00357f!important;box-shadow:0 0 0 3px rgba(0,53,127,0.12)!important;outline:none!important}
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
    bg: "#f8f9fa", surface: "#ffffff", surfaceLow: "#f3f4f5",
    textPrimary: "#191c1d", textMuted: "#546167", textFaint: "#737784",
    outline: "rgba(195,198,213,0.4)", shadow: "0 20px 40px rgba(25,28,29,0.06)",
    shadowBlue: "0 8px 32px rgba(0,53,127,0.25)",
};

export default function AuthPage({ mode }) {
    const isLogin = mode === "login";
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isLogin) {
                await login(form.email, form.password);
            } else {
                await register(form.name, form.email, form.password);
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, name, type = "text", icon }) => (
        <div style={{ marginBottom: 18 }}>
            <label style={{
                display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "1px",
                textTransform: "uppercase", color: T.textMuted, marginBottom: 7,
                fontFamily: "Manrope,sans-serif",
            }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <Icon name={icon} size={18} style={{ color: T.textFaint }} />
                </span>
                <input
                    name={name}
                    type={name === "password" ? (showPw ? "text" : "password") : type}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    className="auth-inp"
                    style={{
                        width: "100%", padding: "12px 14px 12px 40px",
                        background: T.surfaceLow,
                        border: `1.5px solid ${T.outline}`,
                        borderRadius: 10, fontSize: 14,
                        color: T.textPrimary, fontFamily: "Inter,sans-serif",
                        transition: "border-color .15s, box-shadow .15s",
                    }}
                    placeholder={
                        name === "name" ? "Jane Smith" :
                            name === "email" ? "you@example.com" :
                                name === "password" ? "Min. 6 characters" : ""
                    }
                />
                {name === "password" && (
                    <button type="button" onClick={() => setShowPw(v => !v)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        <Icon name={showPw ? "visibility_off" : "visibility"} size={18} style={{ color: T.textFaint }} />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            <FontLoader />
            <div style={{
                minHeight: "calc(100vh - 56px)", display: "flex",
                background: T.bg, fontFamily: "Inter,sans-serif",
            }}>
                {/* Left panel — branding */}
                <div style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: "48px 40px",
                    background: `linear-gradient(135deg,${T.primary} 0%,${T.primaryMid} 55%,#1a6b2c 100%)`,
                    position: "relative", overflow: "hidden",
                }}>
                    {/* Decorative blobs */}
                    <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    <div style={{ position: "absolute", bottom: -60, left: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(172,244,164,0.08)" }} />

                    <div style={{ position: "relative", textAlign: "center", maxWidth: 360 }}>
                        {/* Logo mark */}
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                            <Icon name="school" size={34} fill={1} style={{ color: "#fff" }} />
                        </div>
                        <h2 style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: 28, color: "#fff", marginBottom: 14, letterSpacing: "-0.5px" }}>
                            Scholar AI
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
                            Your AI-powered study companion. Upload any material and get instant summaries, flashcards, and quizzes.
                        </p>
                        {/* Feature pills */}
                        {[
                            { icon: "auto_awesome", text: "AI-generated summaries" },
                            { icon: "style", text: "Smart flashcards" },
                            { icon: "quiz", text: "Auto MCQ quizzes" },
                        ].map(f => (
                            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
                                <Icon name={f.icon} size={18} fill={1} style={{ color: T.secBg, flexShrink: 0 }} />
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right panel — form */}
                <div style={{ width: 460, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 40px", overflowY: "auto" }}>
                    <div className="auth-fadeup" style={{ width: "100%", maxWidth: 380 }}>
                        {/* Header */}
                        <div style={{ marginBottom: 32 }}>
                            <h1 style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: 26, color: T.primary, marginBottom: 6, letterSpacing: "-0.3px" }}>
                                {isLogin ? "Welcome back 👋" : "Create your account"}
                            </h1>
                            <p style={{ fontSize: 14, color: T.textFaint, lineHeight: 1.5 }}>
                                {isLogin ? "Sign in to access your study dashboard." : "Start learning smarter today — it's free."}
                            </p>
                        </div>

                        {/* Form card */}
                        <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.outline}`, padding: "28px 26px", boxShadow: T.shadow }}>
                            <form onSubmit={handleSubmit}>
                                {!isLogin && <Field label="Full name" name="name" type="text" icon="person" />}
                                <Field label="Email address" name="email" type="email" icon="mail" />
                                <Field label="Password" name="password" type="password" icon="lock" />

                                {error && (
                                    <div style={{
                                        background: "rgba(186,26,26,0.07)", border: "1px solid rgba(186,26,26,0.25)",
                                        borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                                        fontSize: 13, color: "#ba1a1a", display: "flex", alignItems: "center", gap: 8,
                                    }}>
                                        <Icon name="error" size={16} fill={1} style={{ color: "#ba1a1a", flexShrink: 0 }} />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit" disabled={loading}
                                    style={{
                                        width: "100%", padding: "13px",
                                        background: `linear-gradient(135deg,${T.primary},${T.primaryMid})`,
                                        color: "#fff", border: "none", borderRadius: 10,
                                        fontFamily: "Manrope,sans-serif", fontSize: 15, fontWeight: 700,
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                        cursor: loading ? "not-allowed" : "pointer",
                                        opacity: loading ? 0.75 : 1,
                                        boxShadow: T.shadowBlue, transition: "opacity .15s",
                                    }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = ".88"; }}
                                    onMouseLeave={e => e.currentTarget.style.opacity = loading ? "0.75" : "1"}
                                >
                                    {loading && <Spinner size={18} />}
                                    <Icon name={isLogin ? "login" : "how_to_reg"} size={18} fill={1} style={{ color: "#fff" }} />
                                    {isLogin ? "Sign in" : "Create account"}
                                </button>
                            </form>

                            <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: T.textFaint }}>
                                {isLogin ? "No account yet? " : "Already have an account? "}
                                <Link to={isLogin ? "/register" : "/login"}
                                    style={{ color: T.primary, fontWeight: 700, textDecoration: "none" }}
                                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                                    {isLogin ? "Sign up free →" : "Sign in →"}
                                </Link>
                            </p>
                        </div>

                        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: T.textFaint, lineHeight: 1.6 }}>
                            By continuing you agree to our{" "}
                            <span style={{ color: T.primary, cursor: "pointer" }}>Terms</span> &amp;{" "}
                            <span style={{ color: T.primary, cursor: "pointer" }}>Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
