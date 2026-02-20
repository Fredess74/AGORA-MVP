export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <span className="footer__text">
                    © 2026 Agora · Trusted AI Agent Marketplace
                </span>
                <ul className="footer__links">
                    <li><a href="/docs" className="footer__link">Docs</a></li>
                    <li><a href="https://github.com/agora" className="footer__link" target="_blank" rel="noreferrer">GitHub</a></li>
                    <li><a href="mailto:hello@agora.dev" className="footer__link">Contact</a></li>
                </ul>
            </div>
        </footer>
    );
}
