import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { TrustedConnectors } from './TrustedConnectors';
import { PillarsShowcase } from './PillarsShowcase';
import { BlockGallery } from './BlockGallery';
import { VerticalSolutions } from './VerticalSolutions';
import { FleetCatalog } from './FleetCatalog';
import { GovernanceFramework } from './GovernanceFramework';
import { RoiCalculator } from './RoiCalculator';
import { LeadMagnetSection } from './LeadMagnetSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { LeadCaptureModal } from './LeadCaptureModal';
import { StickyConversionBar } from './StickyConversionBar';
import { Footer } from './Footer';

export interface RootHomePageProps {
    onNavigateFinhub?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateBlogs?: () => void;
}

export const RootHomePage: React.FC<RootHomePageProps> = ({
    onNavigateFinhub = () => window.location.assign('/finhub'),
    onNavigateDevLush = () => window.location.assign('/agent'),
    onNavigateBlogs = () => window.location.assign('/blogs'),
}) => {
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [leadModalNote, setLeadModalNote] = useState('');

    const handleOpenDemoModal = (note?: string) => {
        setLeadModalNote(note || '');
        setIsLeadModalOpen(true);
    };

    const handleCloseDemoModal = () => {
        setIsLeadModalOpen(false);
        setLeadModalNote('');
    };

    const handleDeployAgent = (agentName: string) => {
        handleOpenDemoModal(`Priority Sandbox Deployment for agent: ${agentName}`);
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div id="top" className="min-h-screen w-full flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-300">
            
            {/* Top Navigation Bar with Finhub, DevLush, Blogs buttons */}
            <Navbar
                onNavigateFinhub={onNavigateFinhub}
                onNavigateDevLush={onNavigateDevLush}
                onNavigateBlogs={onNavigateBlogs}
                onBookDemo={() => handleOpenDemoModal()}
            />

            {/* Main Content Area */}
            <main className="flex-1 w-full">
                
                {/* 1. HERO SECTION WITH INTERACTIVE TERMINAL */}
                <HeroSection
                    onExploreCatalog={() => scrollToSection('fleet-catalog')}
                    onBookDemo={() => handleOpenDemoModal()}
                    onNavigateFinhub={onNavigateFinhub}
                />

                {/* 2. TRUSTED ZERO-TRUST CONNECTORS BAR */}
                <TrustedConnectors />

                {/* 3. THREE ECOSYSTEM PILLARS SHOWCASE */}
                <PillarsShowcase
                    onNavigateFinhub={onNavigateFinhub}
                    onNavigateDevLush={onNavigateDevLush}
                    onNavigateBlogs={onNavigateBlogs}
                />

                {/* 4. INTERACTIVE TOPIC BLOCK & VISUALIZERS GALLERY */}
                <BlockGallery />

                {/* 5. DEEP OPERATIONAL IMPACT VERTICAL SIMULATORS */}
                <VerticalSolutions />

                {/* 6. SPECIALIZED AUTONOMOUS AGENT FLEET CATALOG */}
                <FleetCatalog
                    onDeployAgent={handleDeployAgent}
                />

                {/* 7. ADAPT ZERO-TRUST GOVERNANCE FRAMEWORK */}
                <GovernanceFramework />

                {/* 8. ENTERPRISE FINANCIAL ROI CALCULATOR */}
                <RoiCalculator
                    onOpenLeadModal={(note) => handleOpenDemoModal(note)}
                />

                {/* 9. CONTENT MARKETING LEAD MAGNET WHITEPAPER */}
                <LeadMagnetSection />

                {/* 10. SOCIAL PROOF & ENTERPRISE TESTIMONIALS */}
                <TestimonialsSection />

                {/* 11. FAQ ACCORDION */}
                <FaqSection />

            </main>

            {/* Comprehensive Enterprise Footer */}
            <Footer
                onNavigateFinhub={onNavigateFinhub}
                onNavigateDevLush={onNavigateDevLush}
                onNavigateBlogs={onNavigateBlogs}
                onBookDemo={() => handleOpenDemoModal()}
            />

            {/* Interactive Lead Capture & Demo Booking Modal */}
            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={handleCloseDemoModal}
                initialNote={leadModalNote}
            />

            {/* Smart Scroll-Triggered Conversion Bar */}
            <StickyConversionBar
                onBookDemo={() => handleOpenDemoModal()}
                onNavigateFinhub={onNavigateFinhub}
            />

        </div>
    );
};

export default RootHomePage;
