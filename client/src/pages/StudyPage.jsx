import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useFlashcards } from "../hooks/useFlashcards";
import Spinner from "../components/Spinner";
import ProgressBar from "../components/ProgressBar";

const MASTERY = ["Not started", "Learning", "Familiar", "Mastered"];
const MASTERY_COLORS = ["#e7e8e9", "#d9e2ff", "#acf4a4", "#2a6b2c"];

const DIFF_STYLE = {
    easy: { bg: "#acf4a4", color: "#0c5216" },
    medium: { bg: "#fdf4d8", color: "#854f0b" },
    hard: { bg: "#ffdad6", color: "#93000a" },
};

export default function StudyPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState(null);
    const [tab, setTab] = useState("overview");
    const [cardIdx, setCardIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [listening, setListening] = useState(false);
    const [spoken, setSpoken] = useState("");
    const [result, setResult] = useState(null); // "correct" | "incorrect" | null
    const recogRef = useRef(null);

    const { flashcards, fetch, review } = useFlashcards(id);

    useEffect(() => {
        api.get(`/materials/${id}`).then(d => setMaterial(d.material)).catch(() => navigate("/dashboard"));
        fetch();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const card = flashcards[cardIdx];
    const mastery = card?.masteryLevel ?? 0;
    const overallMastery = flashcards.length
        ? Math.round((flashcards.reduce((a, c) => a + c.masteryLevel, 0) / (flashcards.length * 3)) * 100)
        : 0;

    const resetCard = () => { setFlipped(false); setSpoken(""); setResult(null); };
    const next = () => { setCardIdx(i => (i + 1) % flashcards.length); resetCard(); };
    const prev = () => { setCardIdx(i => (i - 1 + flashcards.length) % flashcards.length); resetCard(); };

    const handleReview = async (correct) => {
        if (!card) return;
        await review(card._id, correct);
        setResult(correct ? "correct" : "incorrect");
        if (!flipped) setFlipped(true);
    };

    // Defined as a regular function so it always has latest card/handleReview in scope
    const startListening = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert("Speech recognition requires Chrome or Edge."); return; }
        if (recogRef.current) { recogRef.current.abort(); }

        const r = new SR();
        r.lang = "en-US";
        r.continuous = false;
        r.interimResults = false;

        r.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setSpoken(transcript);
            const answerWords = card.answer.toLowerCase().split(/\s+/).filter(w => w.length > 4);
            const matchCount = answerWords.filter(w => transcript.toLowerCase().includes(w)).length;
            const correct = answerWords.length > 0 ? (matchCount / answerWords.length) > 0.4 : false;
            handleReview(correct);
        };
        r.onend = () => setListening(false);
        r.onerror = () => setListening(false);

        recogRef.current = r;
        r.start();
        setListening(true);
        setSpoken("");
        setResult(null);
    };

    if (!material) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>

            {/* ── Sub-header ── */}
            <div style={{ background: "#ffffff", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "0.5px solid rgba(195,198,213,0.3)", position: "sticky", top: 0, zIndex: 20 }}>
                <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#737784", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "0 4px" }}>←</button>
                <span style={{ fontSize: 22 }}>{material.emoji}</span>
                <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: "#00357f", flex: 1 }}>{material.title}</span>
                <button
                    onClick={() => navigate(`/quiz/${id}`)}
                    style={{ background: "linear-gradient(135deg,#00357f,#004aad)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "opacity .15s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                    Take Quiz →
                </button>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: "flex", background: "#ffffff", borderBottom: "0.5px solid rgba(195,198,213,0.3)" }}>
                {["overview", "flashcards"].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        flex: 1, padding: "14px", background: "none", border: "none", cursor: "pointer",
                        fontFamily: "Manrope, sans-serif", fontSize: 13, fontWeight: 700,
                        letterSpacing: ".5px", textTransform: "uppercase",
                        color: tab === t ? "#00357f" : "#737784",
                        borderBottom: `2px solid ${tab === t ? "#00357f" : "transparent"}`,
                        transition: "all .2s",
                    }}>
                        {t} {t === "flashcards" && flashcards.length > 0 && `(${flashcards.length})`}
                    </button>
                ))}
            </div>

            <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 24px 60px" }}>

                {/* ══ OVERVIEW TAB ══ */}
                {tab === "overview" && (
                    <div>
                        {/* AI Summary */}
                        <div style={{ background: "#00357f", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "#b0c6ff", marginBottom: 10 }}>AI Summary</p>
                            <p style={{ color: "rgba(255,255,255,0.88)", lineHeight: 1.75, fontSize: 15 }}>{material.summary}</p>
                        </div>

                        {/* Key Concepts */}
                        {material.bulletPoints?.length > 0 && (
                            <>
                                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: "#737784", marginBottom: 12 }}>Key Concepts</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                                    {material.bulletPoints.map((bp, i) => (
                                        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f3f4f5", borderRadius: 10, padding: "14px 16px" }}>
                                            <div style={{ width: 24, height: 24, background: "#00357f", color: "#fff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, fontFamily: "Manrope, sans-serif" }}>{i + 1}</div>
                                            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#434653", margin: 0 }}>{bp}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Mastery overview */}
                        <div style={{ background: "#ffffff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 20px 40px rgba(25,28,29,0.06)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, color: "#191c1d" }}>Flashcard Mastery</span>
                                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 24, fontWeight: 800, color: "#00357f" }}>{overallMastery}%</span>
                            </div>
                            <ProgressBar value={overallMastery} color="#2a6b2c" />

                            {flashcards.length > 0 && (
                                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                                    {flashcards.map((c, i) => (
                                        <button
                                            key={i}
                                            title={`Card ${i + 1}: ${MASTERY[c.masteryLevel]}`}
                                            onClick={() => { setCardIdx(i); setTab("flashcards"); resetCard(); }}
                                            style={{ width: 34, height: 34, borderRadius: 8, background: MASTERY_COLORS[c.masteryLevel], border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, cursor: "pointer", color: c.masteryLevel >= 3 ? "#fff" : "#191c1d", transition: "transform .15s" }}
                                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                                            onMouseLeave={e => e.currentTarget.style.transform = "none"}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {flashcards.length === 0 && (
                                <p style={{ fontSize: 13, color: "#737784", marginTop: 12 }}>No flashcards generated yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ══ FLASHCARDS TAB ══ */}
                {tab === "flashcards" && (
                    <div>
                        {flashcards.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "#737784" }}>
                                <p style={{ fontSize: 15 }}>No flashcards found for this study set.</p>
                            </div>
                        ) : (
                            <>
                                {/* Progress row */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                                    <span style={{ fontSize: 14, color: "#737784" }}>Card {cardIdx + 1} of {flashcards.length}</span>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {card && (
                                            <>
                                                <span style={{ ...DIFF_STYLE[card.difficulty] || DIFF_STYLE.medium, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: ".5px" }}>
                                                    {card.difficulty}
                                                </span>
                                                <span style={{ background: MASTERY_COLORS[mastery], fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, color: mastery >= 3 ? "#fff" : "#191c1d" }}>
                                                    {MASTERY[mastery]}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Flip card */}
                                {card && (
                                    <div
                                        className="card-flip-container"
                                        style={{ height: 240, marginBottom: 20, cursor: "pointer" }}
                                        onClick={() => setFlipped(f => !f)}
                                    >
                                        <div className={`card-flip-inner ${flipped ? "flipped" : ""}`} style={{ height: 240 }}>
                                            {/* Front */}
                                            <div className="card-face" style={{ background: "#00357f", borderRadius: 16 }}>
                                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.4px", color: "#b0c6ff", textTransform: "uppercase", marginBottom: 18 }}>Question</p>
                                                <p style={{ fontSize: 17, textAlign: "center", lineHeight: 1.55, color: "#ffffff", padding: "0 12px" }}>{card.question}</p>
                                                <p style={{ fontSize: 12, color: "rgba(176,198,255,0.45)", marginTop: 24 }}>tap to reveal</p>
                                            </div>
                                            {/* Back */}
                                            <div className="card-back card-face" style={{
                                                background: result === "correct" ? "#2a6b2c" : result === "incorrect" ? "#ba1a1a" : "#d9e2ff",
                                                borderRadius: 16,
                                            }}>
                                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.4px", color: result ? "rgba(255,255,255,0.65)" : "#00357f", textTransform: "uppercase", marginBottom: 18 }}>Answer</p>
                                                <p style={{ fontSize: 15, textAlign: "center", lineHeight: 1.65, color: result ? "#ffffff" : "#191c1d", padding: "0 12px" }}>{card.answer}</p>
                                                {result && (
                                                    <p style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,.75)", textAlign: "center" }}>
                                                        {result === "correct" ? "✓ Great answer!" : "✗ Review this one"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Spoken answer */}
                                {spoken && (
                                    <div style={{ background: "#f3f4f5", borderRadius: 10, padding: "10px 16px", marginBottom: 14, fontSize: 14, color: "#434653", fontStyle: "italic" }}>
                                        You said: "{spoken}"
                                    </div>
                                )}

                                {/* Navigation + Mic */}
                                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                                    <button
                                        onClick={prev}
                                        style={{ flex: 1, padding: "13px", background: "#f3f4f5", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 22, color: "#00357f", transition: "background .15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#e7e8e9"}
                                        onMouseLeave={e => e.currentTarget.style.background = "#f3f4f5"}
                                    >‹</button>

                                    <button
                                        onClick={startListening}
                                        style={{
                                            flex: 2, padding: "13px 16px",
                                            background: listening ? "#00357f" : "#f3f4f5",
                                            border: "none", borderRadius: 10, cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                            fontSize: 14, fontWeight: 600,
                                            color: listening ? "#ffffff" : "#434653",
                                            transition: "all .2s",
                                        }}
                                    >
                                        <span style={{ fontSize: 18, animation: listening ? "pulse 1s infinite" : "none" }}>
                                            {listening ? "●" : "🎤"}
                                        </span>
                                        {listening ? "Listening…" : "Speak Answer"}
                                    </button>

                                    <button
                                        onClick={next}
                                        style={{ flex: 1, padding: "13px", background: "#f3f4f5", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 22, color: "#00357f", transition: "background .15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#e7e8e9"}
                                        onMouseLeave={e => e.currentTarget.style.background = "#f3f4f5"}
                                    >›</button>
                                </div>

                                {/* Mastery buttons */}
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => handleReview(false)}
                                        style={{ flex: 1, padding: "12px", background: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.2)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#ba1a1a", fontFamily: "Manrope, sans-serif", transition: "background .15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(186,26,26,0.12)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(186,26,26,0.06)"}
                                    >
                                        Need review
                                    </button>
                                    <button
                                        onClick={() => handleReview(true)}
                                        style={{ flex: 1, padding: "12px", background: "#acf4a4", border: "1px solid #2a6b2c", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#0c5216", fontFamily: "Manrope, sans-serif", transition: "background .15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#91d78a"}
                                        onMouseLeave={e => e.currentTarget.style.background = "#acf4a4"}
                                    >
                                        Got it ✓
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
