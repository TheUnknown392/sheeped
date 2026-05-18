import '../css/Home.css'
export default function Hero(){
    const steps = ["Submit", "Verify", "Price", "Offer"];
    return(
            <section className="hero">
                <div className="hero-glow" />
                <div className="hero-glow2" />
                <div className="badge">
                    <div className="badge-dot" />
                    Global Sourcing, Reimagined
                </div>
                <h1>
                    Request a dropship quote<br />
                    paste a product link.
                </h1>
                <p className="hero-sub">
                    Skip the middleman. We verify suppliers, negotiate bulk pricing, and handle international logistics for you.
                </p>
                <div className="hero-cta">
                    <button className="btn-large primary">Request a Quote</button>
                    <button className="btn-large outline">See How It Works</button>
                </div>
                <div className="steps">
                    {steps.map((s, i) => (
                        <div className="step" key={s}>
                            <div className="step-num">{i + 1}</div>
                            <div className="step-label">{s}</div>
                        </div>
                    ))}
                </div>
            </section>
    )
}
