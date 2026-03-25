export default function Badge({ children, color = "var(--paper2)", text = "var(--ink2)" }) {
    return (
        <span style={{
            background: color, color: text,
            fontSize: 11, fontWeight: 600, letterSpacing: ".5px",
            padding: "3px 8px", borderRadius: 99,
            display: "inline-block", textTransform: "uppercase",
        }}>
            {children}
        </span>
    );
}
