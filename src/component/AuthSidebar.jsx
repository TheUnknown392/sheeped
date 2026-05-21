import '../css/Home.css'

const whyItems = [
    "One upfront sourcing fee",
    "Private label & blind shipping",
    "Stress-free customs handling",
    "Quote within 24 hours",
];

const stats = [
    { num: "4",        label: "Countries supported" },
    { num: "24h",      label: "Quote turnaround" },
    { num: "NRS 2,500", label: "Minimum order" },
];

export default function AuthSidebar() {
    return (
        <aside className="auth-sidebar">
            <div className="side-card">
                <div className="side-title">Why Sheeped?</div>
                {whyItems.map(item => (
                    <div className="why-item" key={item}>{item}</div>
                ))}
            </div>

            <div className="side-card">
                <div className="side-title">By the numbers</div>
                {stats.map((s, i) => (
                    <div key={s.label}>
                        <div className="stat-item">
                            <div className="stat-num">{s.num}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                        {i < stats.length - 1 && <div className="stat-divider" />}
                    </div>
                ))}
            </div>
        </aside>
    );
}
