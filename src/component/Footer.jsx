import '../css/Home.css'

export default function Footer(){
    return(
        <footer>
            <div className="footer-inner">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="nav-logo">
                            <div className="nav-logo-icon">🐑</div>
                            Sheeped
                        </div>
                        <p>International shipments,  one link at a time.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <a href="#">How It Works</a>
                        <a href="#">FAQs</a>
                        <a href="#">Pricing</a>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <a href="#">Contact Us</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                    <div className="footer-col">
                        <h4>Connect</h4>
                        <a href="#">support@sheeped.fakemail.com</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 TheUnknown392. All rights reserved.</span>
                </div>
            </div>
        </footer>

    )
}
