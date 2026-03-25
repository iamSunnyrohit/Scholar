import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const T = {
    primary: "#00357f",
    primaryMid: "#004aad",
    secondary: "#2a6b2c",
    secBg: "#acf4a4",
    surface: "#ffffff",
    surfaceLow: "#f3f4f5",
    textPrimary: "#191c1d",
    textMuted: "#546167",
    outline: "rgba(195,198,213,0.4)",
    shadowBlue: "0 8px 32px rgba(0,53,127,0.25)",
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuHov, setMenuHov] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const initials = (user?.name || "S").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <nav style={{
            background: T.surface,
            borderBottom: `1px solid ${T.outline}`,
            padding: "0 28px",
            display: "flex", alignItems: "center", height: 56, gap: 20,
            position: "sticky", top: 0, zIndex: 100,
            backdropFilter: "blur(12px)",
            boxShadow: "0 1px 12px rgba(25,28,29,0.06)",
        }}>
            {/* Logo */}
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <div style={{
                    width: 32, height: 32, background: `linear-gradient(135deg,${T.primary},${T.primaryMid})`,
                    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: T.shadowBlue, flexShrink: 0,
                }}>
                    <span style={{ fontSize: 16, color: "#fff", lineHeight: 1 }}>✦</span>
                </div>
                <span style={{
                    fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: 16,
                    color: T.primary, letterSpacing: "-0.3px",
                }}>
                    Scholar AI
                </span>
            </Link>

            <div style={{ flex: 1 }} />

            {user ? (
                <>
                    <Link to="/dashboard"
                        style={{ color: T.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color .15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = T.primary}
                        onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
                        Dashboard
                    </Link>
                    <div style={{ width: 1, height: 20, background: T.outline }} />
                    {/* User chip */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", borderRadius: 20, border: `1px solid ${T.outline}`, background: T.surfaceLow }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${T.primaryMid},${T.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: 11, color: "#fff" }}>{initials}</span>
                        </div>
                        <span style={{ fontFamily: "Manrope,sans-serif", fontWeight: 600, fontSize: 13, color: T.textPrimary }}>{user.name?.split(" ")[0]}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "none", border: `1px solid ${T.outline}`,
                            color: T.textMuted, padding: "6px 14px",
                            borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                            fontFamily: "Inter,sans-serif", transition: "all .15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.outline; e.currentTarget.style.color = T.textMuted; }}
                    >
                        Log out
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login"
                        style={{ color: T.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color .15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = T.primary}
                        onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
                        Log in
                    </Link>
                    <Link to="/register" style={{
                        background: `linear-gradient(135deg,${T.primary},${T.primaryMid})`,
                        color: "#fff", padding: "8px 18px", borderRadius: 9,
                        fontSize: 14, fontWeight: 700, textDecoration: "none",
                        fontFamily: "Manrope,sans-serif", boxShadow: T.shadowBlue,
                        transition: "opacity .15s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                        Sign up
                    </Link>
                </>
            )}
        </nav>
    );
}
