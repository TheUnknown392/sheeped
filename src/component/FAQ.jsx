import '../css/Home.css'
import { useState, useContext } from 'react'

const faqs = [
    {
        q: "How long does it take to get a quote?",
        a: "We provide a detailed quotation including product costs and shipping estimates within 24 hours for standard items."
    },
    {
        q: "Do you verify product quality?",
        a: "No, We are only responcible for transfering and managing custom duty in your name. We do not even open the packages."
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept wire transfers, credit cards, banks and any other wallet applications."
    },
    {
        q: "Do you do returns?",
        a: "The total cost has to be NRS 2500 or higher and return depends on the website you ordered from and their policy."
    },
    {
        q: "What countries do you support",
        a: "We support Nepal, India, China and America for the time being"
    }
        
];


export default function Faq(){
    const [openFaq, setOpenFaq] = useState(null);
    return(
        <div className="faq-section">
            <div className="faq-header">
                <span className="section-label" style={{display:'block', textAlign:'center'}}>FAQ</span>
                <h2 className="section-title" style={{textAlign:'center'}}>Frequently Asked Questions</h2>
                <p style={{color:'var(--muted)', textAlign:'center', fontSize:15}}>Everything you need to know about our sourcing and logistics process.</p>
            </div>
            {faqs.map((f, i) => (
                <div className="faq-item" key={i}>
                    <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        {f.q}
                        <span className={`faq-icon ${openFaq === i ? "open" : ""}`}>+</span>
                    </button>
                    <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{f.a}</div>
                </div>
            ))}
        </div>
    )
}
