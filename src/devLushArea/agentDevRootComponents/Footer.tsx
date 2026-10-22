import React from 'react';
import { Mail, Heart } from 'lucide-react';
import { ContactForm } from '../../shared/components/ContactForm';

interface FooterProps {
    theme?: 'light' | 'dark';
    currentView?: string;
}

const Footer: React.FC<FooterProps> = ({ theme, currentView }) => {
    const isHome = currentView === 'home';

    // Elegant, minimal background styling
    const footerBg = isHome
        ? 'bg-black/30 border-t border-white/5 text-white/70 backdrop-blur-xl'
        : 'bg-background/80 border-t border-border/40 text-muted-foreground backdrop-blur-md';

    const textHighlight = isHome ? 'text-white/90' : 'text-foreground/90';
    const linkHover = isHome ? 'hover:text-white hover:opacity-100' : 'hover:text-primary hover:opacity-100';

    return (
        <footer className={`w-full py-10 px-6 mt-auto z-40 transition-colors duration-300 ${footerBg}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

                {/* Brand / Copy */}
                <div className="flex flex-col items-center md:items-start gap-3 md:w-1/3">
                    <div className="flex items-center gap-2">
                        <span className={`font-heading text-2xl font-medium tracking-wide ${textHighlight}`}>DevLush</span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-center md:text-left opacity-80 max-w-xs">
                        Elevating medical and biological learning through interactive simulations and elegant design.
                    </p>
                    <span className="text-xs tracking-wider opacity-60 mt-2 flex items-center gap-1.5">
                        &copy; {new Date().getFullYear()} DevLush <span className="w-1 h-1 rounded-full bg-current opacity-50"></span> Crafted with <Heart className="w-3 h-3 mx-0.5" />
                    </span>
                </div>

                {/* Contact */}
                <div className="flex w-full flex-col items-center gap-4 md:w-1/3 md:items-end">
                    <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${textHighlight}`}>Contact</span>
                    <ContactForm
                        variant="compact"
                        tone={isHome ? 'dark' : 'light'}
                        accent="emerald"
                        title="Send a message"
                        description="This form reaches the site owner directly."
                        subject="Contact from DevLush"
                        className="w-full max-w-sm"
                    />
                    <a href="mailto:aliyan@gptx.vip" className={`inline-flex items-center gap-2 text-sm font-medium opacity-80 transition-all duration-300 ${linkHover}`}>
                        <Mail className="w-4 h-4 stroke-[1.5]" />
                        aliyan@gptx.vip
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
