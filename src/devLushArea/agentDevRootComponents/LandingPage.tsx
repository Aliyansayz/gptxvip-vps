import React from 'react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
    const marqueeItems = [
        "CONNOISSEUR",
        "DESK DECORATOR",
        "CABLE TAMER",
        "REP COUNTER",
        "APPLE FAN",
        "KEYBOARD ENTHUSIAST",
    ];

    // Duplicate array multiple times to ensure seamless infinite scroll
    const marqueeText = Array(4).fill(marqueeItems).flat();

    const textStyle: React.CSSProperties = {
        fontFamily: "'Oswald', 'Anton', 'Impact', sans-serif",
        lineHeight: "1.1",
        letterSpacing: "0.02em",
        textTransform: "uppercase"
    };

    return (
        <div className="relative w-full h-full bg-[#1e1e1e] overflow-hidden flex flex-col justify-center items-center font-sans">
            
            <div className="flex-1 flex flex-col justify-center items-center w-full px-4 text-center z-10" style={textStyle}>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
                    HOOKED BY <span className="text-[#facc15]">VISUALS</span>,
                </h1>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
                    FASCINATED BY <span className="text-[#10b981]">TECHNOLOGY</span>,
                </h1>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
                    FUELLED BY <span className="text-[#f472b6]">CRAFTSMANSHIP</span> AND
                </h1>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                    MEANINGFUL <span className="text-[#f97316]">AESTHETICS</span>.
                </h1>

            </div>

            {/* Marquee Banner */}
            <div className="absolute bottom-12 left-0 w-full z-20" style={{ transform: 'rotate(-2deg)' }}>
                {/* Dark shadows to create depth */}
                <div className="absolute inset-0 bg-black/20 translate-y-2 -translate-x-2 w-[110%] h-full -ml-[5%]"></div>
                
                <div className="bg-[#ff4522] py-3 sm:py-4 md:py-5 overflow-hidden w-[110%] -ml-[5%] flex items-center relative border-y border-[#e03816] shadow-xl">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                        style={textStyle}
                    >
                        {marqueeText.map((item, index) => (
                            <div key={index} className="flex items-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mx-2 sm:mx-4">
                                <span>{item}</span>
                                <span className="mx-4 sm:mx-6 md:mx-8 text-white/50 text-xl sm:text-2xl">♦</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Diagonal dark shapes in background for texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-[#1a1a1a]" style={{ transform: 'skewY(-5deg)', transformOrigin: 'bottom right' }}></div>
                <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-[#151515]" style={{ transform: 'skewY(-2deg)', transformOrigin: 'bottom left' }}></div>
            </div>

        </div>
    );
};

export default LandingPage;
