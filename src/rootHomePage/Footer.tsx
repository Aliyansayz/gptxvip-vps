import React from 'react';

export interface FooterProps {
    onNavigateFinhub?: () => void;
    onNavigateAgentWorkspace?: () => void;
    onNavigateUseCases?: () => void;
    onNavigateGuide?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateBlogs?: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateProjectSurfaces?: () => void;
    onNavigateAnalyticsSurfaces?: () => void;
    theme?: 'light' | 'dark';
    accent?: 'cyan' | 'warm';
    caption?: string;
    wordmark?: string;
}

export const Footer: React.FC<FooterProps> = ({
    onNavigateFinhub = () => window.location.assign('/finhub'),
    onNavigateAgentWorkspace = () => window.location.assign('/workspace'),
    onNavigateUseCases = () => window.location.assign('/resources/usecases'),
    onNavigateGuide = () => window.location.assign('/guide'),
    onNavigateDevLush = () => window.location.assign('/agents'),
    onNavigateBlogs = () => window.location.assign('/blogs'),
    onNavigateCodeConcepts = () => window.location.assign('/code_concepts/general'),
    onNavigateProjectSurfaces = () => window.location.assign('/agents/templates'),
    caption,
    wordmark = 'GPTX.VIP™',
}) => {
    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            id="footer"
            className="blvd-footer"
            style={{
                background: '#111114',
                color: '#fff',
                padding: '48px 1.25rem 24px',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'DM Sans', Arial, sans-serif",
            }}
        >
            <style>{`
                .blvd-footer .blvd-footer-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 24px;
                    max-width: 1152px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .blvd-footer .blvd-footer-kicker {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: .12em;
                    color: #a1a1aa;
                }
                .blvd-footer .blvd-footer-pill {
                    border: 1px solid #77777e;
                    border-radius: 30px;
                    padding: 8px 16px;
                    font-size: 11px;
                    color: #fff;
                    text-decoration: none;
                    white-space: nowrap;
                    transition: border-color 0.2s, color 0.2s;
                }
                .blvd-footer .blvd-footer-pill:hover {
                    border-color: #d8ff38;
                    color: #d8ff38;
                }
                .blvd-footer .blvd-email {
                    display: block;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(28px, 7.2vw, 80px);
                    letter-spacing: -.075em;
                    line-height: 1.05;
                    color: #a6afff;
                    text-decoration: none;
                    white-space: nowrap;
                    margin: 20px auto 36px;
                    max-width: 1152px;
                    transition: color 0.2s;
                }
                .blvd-footer .blvd-email:hover {
                    color: #d8ff38;
                }
                .blvd-footer .blvd-footer-rule {
                    height: 1px;
                    background: #ffffff20;
                    margin: 0 auto 28px;
                    max-width: 1152px;
                }
                .blvd-footer .blvd-footer-bottom {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr;
                    gap: 36px;
                    max-width: 1152px;
                    margin: 0 auto;
                }
                .blvd-footer .blvd-footer-blurb {
                    font-size: 12px;
                    line-height: 1.6;
                    color: #b5b5bc;
                    max-width: 360px;
                    margin: 0 0 12px;
                }
                .blvd-footer .blvd-footer-links {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                .blvd-footer .blvd-footer-links h4 {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: .12em;
                    color: #777780;
                    margin: 0 0 12px;
                    font-weight: 700;
                }
                .blvd-footer .blvd-footer-links a,
                .blvd-footer .blvd-footer-links button {
                    display: block;
                    text-decoration: none;
                    color: #e9e9ec;
                    font-size: 12px;
                    margin: 8px 0;
                    background: none;
                    border: 0;
                    padding: 0;
                    font-family: inherit;
                    cursor: pointer;
                    text-align: left;
                    transition: color 0.15s;
                }
                .blvd-footer .blvd-footer-links a:hover,
                .blvd-footer .blvd-footer-links button:hover {
                    color: #d8ff38;
                }
                .blvd-footer .blvd-footer-wordmark {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(42px, 9vw, 95px);
                    line-height: .95;
                    letter-spacing: -.085em;
                    margin: 48px auto 16px;
                    max-width: 1152px;
                    color: #fff;
                }
                .blvd-footer .blvd-footer-legal {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                    font-size: 10px;
                    color: #777780;
                    border-top: 1px solid #ffffff20;
                    padding-top: 16px;
                    max-width: 1152px;
                    margin: 0 auto;
                }
                .blvd-footer .blvd-footer-legal a,
                .blvd-footer .blvd-footer-legal button {
                    color: inherit;
                    text-decoration: none;
                    background: none;
                    border: 0;
                    padding: 0;
                    font: inherit;
                    cursor: pointer;
                }
                .blvd-footer .blvd-footer-legal a:hover,
                .blvd-footer .blvd-footer-legal button:hover {
                    color: #d8ff38;
                }
                @media (min-width: 640px) {
                    .blvd-footer { padding: 56px 2rem 24px !important; }
                }
                @media (max-width: 650px) {
                    .blvd-footer { padding: 36px 1.25rem 20px !important; }
                    .blvd-footer .blvd-footer-top { align-items: flex-start; }
                    .blvd-footer .blvd-email { font-size: 7.3vw; letter-spacing: -.07em; margin: 22px auto 28px; }
                    .blvd-footer .blvd-footer-bottom { grid-template-columns: 1fr; gap: 25px; }
                    .blvd-footer .blvd-footer-wordmark { margin-top: 38px; }
                    .blvd-footer .blvd-footer-legal { flex-wrap: wrap; }
                }
                @media (max-width: 380px) {
                    .blvd-footer .blvd-email { font-size: 7vw; }
                    .blvd-footer .blvd-footer-links { gap: 10px; }
                    .blvd-footer .blvd-footer-links a,
                    .blvd-footer .blvd-footer-links button { font-size: 10px; }
                }
            `}</style>

            <div className="blvd-footer-top">
                <div className="blvd-footer-kicker">Let’s make something great together</div>
                <a className="blvd-footer-pill" href="mailto:hello@gptx.vip">Start a project ↗</a>
            </div>

            <a className="blvd-email" href="mailto:hello@gptx.vip">hello@gptx.vip</a>

            <div className="blvd-footer-rule" />

            <div className="blvd-footer-bottom">
                <div>
                    <p className="blvd-footer-blurb">
                        {caption || 'We work with our strategists, designers, and engineers to deliver high-impact AI agents, interactive systems, and enterprise digital products with passion.'}
                    </p>
                    <p className="blvd-footer-blurb">© {new Date().getFullYear()} GPTX.VIP Creative Studio. All rights reserved.</p>
                </div>

                <div className="blvd-footer-links">
                    <div>
                        <h4>Navigate</h4>
                        <a href="/">Home</a>
                        <button type="button" onClick={onNavigateUseCases}>Use Cases</button>
                        <button type="button" onClick={onNavigateGuide}>Guide</button>
                        <button type="button" onClick={onNavigateAgentWorkspace}>Workspace</button>
                        <a href="/contact">Contact</a>
                    </div>
                    <div>
                        <h4>Social</h4>
                        <a href="mailto:hello@gptx.vip">Email ↗</a>
                        <a href="/resources/usecases">Case Studies ↗</a>
                        <a href="/guide">Field Guides ↗</a>
                        <a href="/agents">Agent Catalog ↗</a>
                    </div>
                    <div>
                        <h4>Explore</h4>
                        <button type="button" onClick={onNavigateDevLush}>Agent Labs</button>
                        <button type="button" onClick={onNavigateProjectSurfaces}>UI/UX Surfaces</button>
                        <button type="button" onClick={onNavigateUseCases}>Case Studies</button>
                        <a href="https://remove.gptx.vip" target="_blank" rel="noopener noreferrer">Remove Watermark ↗</a>
                        <button type="button" onClick={onNavigateBlogs}>Journal</button>
                    </div>
                </div>
            </div>

            <div className="blvd-footer-wordmark">{wordmark}</div>

            <div className="blvd-footer-legal">
                <span>© {new Date().getFullYear()} GPTX.VIP. Made with intention.</span>
                <span>
                    <a href="/contact">Privacy</a> &nbsp; · &nbsp; <a href="/contact">Terms</a>
                </span>
                <button type="button" onClick={scrollToTop}>Back to top ↑</button>
            </div>
        </footer>
    );
};

export default Footer;
