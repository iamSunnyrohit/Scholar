import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMaterials } from "../hooks/useMaterials";
import Spinner from "../components/Spinner";

const SAMPLES = {
    photosynthesis: `Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. This occurs in the chloroplasts of plant cells, containing a green pigment called chlorophyll. The overall reaction: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Photosynthesis occurs in two stages: the light-dependent reactions in the thylakoid membranes and the Calvin cycle in the stroma. During light reactions, water molecules are split, releasing oxygen as a byproduct and generating ATP and NADPH. The Calvin cycle uses this energy to convert carbon dioxide into glucose. Factors affecting photosynthesis include light intensity, CO₂ concentration, temperature, and water availability.`,
    quantum: `Quantum mechanics describes the physical properties of nature at the scale of atoms and subatomic particles. Unlike classical mechanics, quantum mechanics introduces probabilistic behavior through the wave function. The Schrödinger equation governs how the wave function evolves over time. Key principles include: wave-particle duality, the uncertainty principle (you cannot simultaneously know exact position and momentum of a particle), quantum superposition (particles can exist in multiple states until measured), and quantum entanglement (particles can be correlated such that measuring one instantly affects the other). The measurement problem remains one of the deepest puzzles in quantum mechanics.`,
    economics: `Supply and demand is one of the most fundamental concepts in economics. The law of demand states that as price increases, consumer demand decreases. The law of supply states that as price increases, producers supply more. The equilibrium price is where supply equals demand. Factors shifting the demand curve include changes in consumer income, tastes, prices of related goods, and expectations. Supply shifts due to changes in input costs, technology, and government policies. Price elasticity measures how sensitive quantity demanded or supplied is to price changes. Perfect competition, monopoly, oligopoly, and monopolistic competition represent different market structures.`,
};

const Icon = ({ name, size = 20 }) => (
    <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

export default function UploadPage() {
    const navigate = useNavigate();
    const { generateFromText, generateFromPDF, loading, error } = useMaterials();
    const [text, setText] = useState("");
    const [sample, setSample] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef();

    const activeText = sample ? SAMPLES[sample] : text;
    const wordCount = activeText.trim().split(/\s+/).filter(Boolean).length;
    const ready = wordCount >= 30;

    const handleGenerate = async () => {
        try {
            const mat = await generateFromText(activeText);
            navigate(`/study/${mat._id}`);
        } catch { }
    };

    const handlePDF = async (file) => {
        try {
            const mat = await generateFromPDF(file);
            navigate(`/study/${mat._id}`);
        } catch { }
    };

    return (
        <div style={{ minHeight: "calc(100vh - 56px)", background: "#f8f9fa", padding: "40px 24px" }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 28, color: "#00357f", marginBottom: 8 }}>New Study Set</h2>
                <p style={{ color: "#737784", marginBottom: 32, fontSize: 15 }}>Paste your notes or upload a PDF to generate AI-powered flashcards and quizzes.</p>

                {/* Sample chips */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#737784", marginBottom: 10 }}>Quick start with a sample</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[{ key: "photosynthesis", label: "🌿 Photosynthesis" }, { key: "quantum", label: "⚛️ Quantum Mechanics" }, { key: "economics", label: "📊 Economics" }].map(s => (
                            <button key={s.key} onClick={() => { setSample(s.key === sample ? null : s.key); setText(""); }}
                                style={{ padding: "7px 14px", background: sample === s.key ? "#00357f" : "#ffffff", color: sample === s.key ? "#ffffff" : "#00357f", border: "1px solid rgba(0,53,127,0.25)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text area */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#737784", marginBottom: 8 }}>Your material</label>
                    <textarea
                        value={sample ? SAMPLES[sample] : text}
                        onChange={e => { setSample(null); setText(e.target.value); }}
                        placeholder="Paste your notes, textbook excerpts, or any study material here…"
                        rows={10}
                        style={{ width: "100%", padding: "16px", background: "#ffffff", border: "1.5px solid rgba(195,198,213,0.4)", borderRadius: 12, fontSize: 15, lineHeight: 1.7, color: "#191c1d", resize: "vertical", outline: "none", fontFamily: "Inter, sans-serif", transition: "all .2s", boxShadow: "0 20px 40px rgba(25,28,29,0.04)" }}
                        onFocus={e => { e.target.style.borderColor = "#00357f"; e.target.style.background = "#ffffff"; }}
                        onBlur={e => e.target.style.borderColor = "rgba(195,198,213,0.4)"}
                    />
                    <p style={{ fontSize: 13, color: "#737784", marginTop: 6 }}>{wordCount} words · {ready ? "✓ Ready to process" : "Add more text"}</p>
                </div>

                {/* PDF drop */}
                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") handlePDF(f); }}
                    onClick={() => fileRef.current.click()}
                    style={{ border: `2px dashed ${dragOver ? "#00357f" : "rgba(195,198,213,0.5)"}`, borderRadius: 12, padding: "24px", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(0,53,127,0.03)" : "#f3f4f5", marginBottom: 24, transition: "all .2s" }}>
                    <Icon name="upload_file" size={28} />
                    <p style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, color: "#00357f", marginTop: 8 }}>Drop a PDF here</p>
                    <p style={{ fontSize: 12, color: "#737784", marginTop: 4 }}>or click to browse · max 10MB</p>
                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handlePDF(e.target.files[0]); }} />
                </div>

                {error && <div style={{ background: "rgba(186,26,26,0.08)", border: "1px solid rgba(186,26,26,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#ba1a1a" }}>{error}</div>}

                <button
                    onClick={handleGenerate}
                    disabled={!ready || loading}
                    style={{ width: "100%", padding: "15px", background: ready ? "linear-gradient(135deg,#00357f,#004aad)" : "#e1e3e4", color: ready ? "#ffffff" : "#737784", border: "none", borderRadius: 10, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, cursor: ready ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "opacity .2s" }}>
                    {loading ? <><Spinner size={18} /> Generating with AI…</> : "✦  Generate Study Set"}
                </button>
            </div>
        </div>
    );
}
