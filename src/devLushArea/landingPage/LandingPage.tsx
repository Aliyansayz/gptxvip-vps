import React from 'react';
import { HeroSection } from './HeroSection';
import { TrustedConnectors } from './TrustedConnectors';
import { BlockGallery } from './BlockGallery';
import { VerticalSolutions } from './VerticalSolutions';
import { FleetCatalog } from './FleetCatalog';
import { GovernanceFramework } from './GovernanceFramework';
import { RoiCalculator } from './RoiCalculator';
import { TestimonialsSection } from './TestimonialsSection';

export const LandingPage: React.FC = () => {
    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-300">
            {/* HERO SECTION */}
            <HeroSection onExploreCatalog={() => scrollToSection('fleet-catalog')} />

            {/* TRUSTED CONNECTORS BAR */}
            <TrustedConnectors />

            {/* INTERACTIVE TOPIC BLOCK GALLERY */}
            <BlockGallery />

            {/* DEEP OPERATIONAL IMPACT VERTICAL DEMOS */}
            <VerticalSolutions />

            {/* SPECIALIZED AGENT FLEET CATALOG */}
            <FleetCatalog />

            {/* ADAPT GOVERNANCE FRAMEWORK */}
            <GovernanceFramework />

            {/* ENTERPRISE SAVINGS CALCULATOR */}
            <RoiCalculator />

            {/* ENTERPRISE TESTIMONIALS & SOCIAL PROOF */}
            <TestimonialsSection />

            {/* FOOTER CTA */}
            <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 space-y-2">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                    devLush AgentOS — Multi-Agent Autonomous Enterprise Framework
                </p>
                <p>SOC 2 Type II Certified • GDPR Compliant • Zero Data Retention</p>
            </footer>
        </div>
    );
};

export default LandingPage;
