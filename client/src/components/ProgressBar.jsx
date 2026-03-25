export default function ProgressBar({ value, max = 100, color = "var(--accent)" }) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
        <div style={{ background: "var(--paper3)", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width .4s ease" }} />
        </div>
    );
}
