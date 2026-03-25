export default function Spinner({ size = 20 }) {
    return (
        <div style={{
            width: size, height: size,
            border: `2px solid var(--paper3)`,
            borderTop: `2px solid var(--accent)`,
            borderRadius: "50%",
            animation: "spin .8s linear infinite",
            flexShrink: 0,
        }} />
    );
}
