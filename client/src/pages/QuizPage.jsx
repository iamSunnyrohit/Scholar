import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import ProgressBar from "../components/ProgressBar";
import Spinner from "../components/Spinner";

export default function QuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState(null);
    const [quiz, setQuiz] = useState([]);
    const [qIdx, setQIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [done, setDone] = useState(false);
    const [startTime] = useState(Date.now());
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/materials/${id}`)
            .then(d => {
                setMaterial(d.material);
                if (d.material.quiz && d.material.quiz.length > 0) {
                    setQuiz(d.material.quiz);
                }
            })
            .catch(() => navigate("/dashboard"));
    }, [id, navigate]);

    if (!material) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <Spinner />
            </div>
        );
    }

    if (quiz.length === 0) {
        return (
            <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
                <SubHeader title={`Quiz · ${material.title}`} onBack={() => navigate(`/study/${id}`)} />
                <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                    <h3 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 20, color: "#00357f", marginBottom: 10 }}>
                        No quiz questions found
                    </h3>
                    <p style={{ fontSize: 15, color: "#737784", lineHeight: 1.6, marginBottom: 28 }}>
                        Quiz questions are generated when you create a study set. Try uploading new material to generate a fresh quiz.
                    </p>
                    <button
                        onClick={() => navigate("/upload")}
                        style={{ padding: "13px 28px", background: "linear-gradient(135deg,#00357f,#004aad)", color: "#fff", border: "none", borderRadius: 10, fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer" }}
                    >
                        Upload new material →
                    </button>
                </div>
            </div>
        );
    }

    const q = quiz[qIdx];
    const score = answers.filter((a, i) => a === quiz[i]?.correct).length;
    const pct = Math.round((score / quiz.length) * 100);

    const choose = (i) => { if (selected === null) setSelected(i); };

    const handleNext = async () => {
        const newAnswers = [...answers, selected];

        if (qIdx + 1 >= quiz.length) {
            // Last question — submit and show results
            setSubmitting(true);
            try {
                await api.post(`/quiz/${id}/submit`, {
                    answers: newAnswers,
                    questions: quiz,
                    timeTakenSeconds: Math.round((Date.now() - startTime) / 1000),
                });
            } catch {
                // Non-fatal — still show results locally
            } finally {
                setSubmitting(false);
            }
            setAnswers(newAnswers);
            setDone(true);
        } else {
            setAnswers(newAnswers);
            setQIdx(qIdx + 1);
            setSelected(null);
        }
    };

    /* ── Results screen ── */
    if (done) {
        const grade =
            pct >= 80 ? { label: "Excellent!", color: "#2a6b2c", bg: "#acf4a4" } :
                pct >= 60 ? { label: "Good Work", color: "#854f0b", bg: "#fdf4d8" } :
                    { label: "Keep Studying", color: "#ba1a1a", bg: "#ffdad6" };

        return (
            <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
                <SubHeader title="Quiz Results" onBack={() => navigate(`/study/${id}`)} />
                <div style={{ maxWidth: 580, margin: "0 auto", padding: "40px 24px 60px" }}>

                    {/* Score hero */}
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 80, fontWeight: 800, color: "#00357f", lineHeight: 1 }}>{pct}%</div>
                        <span style={{ background: grade.bg, color: grade.color, padding: "6px 20px", borderRadius: 99, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, display: "inline-block", marginTop: 12 }}>
                            {grade.label}
                        </span>
                        <p style={{ marginTop: 12, color: "#737784", fontSize: 15 }}>
                            {score} of {quiz.length} correct
                        </p>
                    </div>

                    <ProgressBar value={pct} color={grade.color} />

                    {/* Per-question breakdown */}
                    <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                        {quiz.map((question, i) => {
                            const correct = answers[i] === question.correct;
                            return (
                                <div key={i} style={{ background: "#ffffff", borderRadius: 12, padding: "16px 18px", border: `1px solid ${correct ? "#2a6b2c" : "#ba1a1a"}`, boxShadow: "0 4px 12px rgba(25,28,29,0.04)" }}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{correct ? "✓" : "✗"}</span>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#191c1d", lineHeight: 1.4 }}>{question.question}</p>
                                            {!correct && (
                                                <p style={{ fontSize: 13, color: "#ba1a1a", marginBottom: 4 }}>
                                                    Your answer: {question.options?.[answers[i]] ?? "—"}
                                                </p>
                                            )}
                                            <p style={{ fontSize: 13, color: "#2a6b2c", marginBottom: 6 }}>
                                                Correct: {question.options?.[question.correct]}
                                            </p>
                                            <p style={{ fontSize: 13, color: "#737784", lineHeight: 1.55 }}>{question.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                        <button
                            onClick={() => { setDone(false); setQIdx(0); setSelected(null); setAnswers([]); }}
                            style={{ flex: 1, padding: "14px", background: "#f3f4f5", color: "#00357f", border: "none", borderRadius: 10, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "background .15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#e7e8e9"}
                            onMouseLeave={e => e.currentTarget.style.background = "#f3f4f5"}
                        >
                            Retry Quiz
                        </button>
                        <button
                            onClick={() => navigate(`/study/${id}`)}
                            style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg,#00357f,#004aad)", color: "#fff", border: "none", borderRadius: 10, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "opacity .15s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                            Back to Study Set
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Active quiz ── */
    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
            <SubHeader title={`Quiz · ${material.title}`} onBack={() => navigate(`/study/${id}`)} extra={<span style={{ color: "#737784", fontSize: 13 }}>{qIdx + 1} / {quiz.length}</span>} />

            {/* Progress strip */}
            <div style={{ height: 3, background: "#e7e8e9" }}>
                <div style={{ height: "100%", width: `${(qIdx / quiz.length) * 100}%`, background: "#00357f", transition: "width .4s ease" }} />
            </div>

            <div style={{ maxWidth: 580, margin: "0 auto", padding: "36px 24px 60px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: "#737784", marginBottom: 16 }}>
                    Question {qIdx + 1}
                </p>
                <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 20, lineHeight: 1.45, marginBottom: 28, color: "#191c1d" }}>
                    {q.question}
                </h2>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {q.options?.map((opt, i) => {
                        let bg = "#ffffff";
                        let border = "1px solid rgba(195,198,213,0.4)";
                        let color = "#191c1d";

                        if (selected !== null) {
                            if (i === q.correct) { bg = "#acf4a4"; border = "2px solid #2a6b2c"; color = "#0c5216"; }
                            else if (i === selected) { bg = "rgba(186,26,26,0.07)"; border = "2px solid #ba1a1a"; color = "#ba1a1a"; }
                            else { bg = "#fafafa"; color = "#9e9e9e"; }
                        }

                        return (
                            <button key={i} onClick={() => choose(i)}
                                style={{ background: bg, border, borderRadius: 10, padding: "15px 18px", textAlign: "left", cursor: selected !== null ? "default" : "pointer", fontSize: 15, color, transition: "all .18s", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}
                                onMouseEnter={e => { if (selected === null) e.currentTarget.style.background = "#f3f4f5"; }}
                                onMouseLeave={e => { if (selected === null) e.currentTarget.style.background = "#ffffff"; }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {selected !== null && (
                    <div style={{ background: selected === q.correct ? "#acf4a4" : "rgba(186,26,26,0.07)", borderRadius: 10, padding: "14px 16px", marginBottom: 20, border: `1px solid ${selected === q.correct ? "#2a6b2c" : "rgba(186,26,26,0.3)"}` }}>
                        <p style={{ fontSize: 14, color: selected === q.correct ? "#0c5216" : "#ba1a1a", lineHeight: 1.6 }}>
                            <strong>{selected === q.correct ? "✓ Correct! " : "✗ Not quite. "}</strong>
                            {q.explanation}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleNext}
                    disabled={selected === null || submitting}
                    style={{ width: "100%", padding: "15px", background: selected !== null ? "linear-gradient(135deg,#00357f,#004aad)" : "#e7e8e9", color: selected !== null ? "#fff" : "#9e9e9e", border: "none", borderRadius: 10, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, cursor: selected !== null ? "pointer" : "not-allowed", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onMouseEnter={e => { if (selected !== null) e.currentTarget.style.opacity = ".88"; }}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                    {submitting && <Spinner size={18} />}
                    {qIdx + 1 >= quiz.length ? "See Results →" : "Next Question →"}
                </button>
            </div>
        </div>
    );
}

/* ── Shared sub-header ── */
function SubHeader({ title, onBack, extra }) {
    return (
        <div style={{ background: "#ffffff", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "0.5px solid rgba(195,198,213,0.3)", position: "sticky", top: 0, zIndex: 20 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#737784", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "0 4px" }}>←</button>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: "#00357f", flex: 1 }}>{title}</span>
            {extra}
        </div>
    );
}
