import { Database } from "lucide-react";

export const cppTradingHFTData = {
    id: "cpp-trading-hft",
    title: "C++ Trading HFT",
    icon: Database,
    longDescription: "Master high-frequency trading concepts using C++",
    chapters: [
        {
            course: "C++ Trading HFT",
            chapter_title: "Core Infrastructure",
            labComponentId: "cpp-hft-01",
            critical_concepts: [
                {
                    concept: "Lock-Free Data Structures",
                    elaboration: "In high-frequency trading, traditional locking mechanisms (mutexes) introduce unacceptable latency due to context switching and thread suspension. Lock-free data structures using atomic operations (like CAS - Compare And Swap) allow concurrent threads to manipulate shared data without blocking, maintaining nanosecond-level predictability.",
                    nature: "feature",
                    perspective: "developer_perspective",
                    theory_explanation: "Lock-free structures avoid the 'priority inversion' problem where a low-priority thread holding a lock preempts a critical high-priority trading thread.",
                    real_world_analogy: "Like a circular driveway where cars can enter and exit continuously without waiting for a traffic light, as opposed to a gated parking lot."
                }
            ],
            interactive_questions: [
                {
                    id: "hft-q1",
                    type: "multiple_choice",
                    question: "Why are std::mutex and std::lock_guard generally avoided in the critical path of an HFT system?",
                    options: [
                        "They consume too much memory.",
                        "They can cause context switches and non-deterministic latency.",
                        "They are not supported by modern C++ compilers.",
                        "They prevent the compiler from optimizing loops."
                    ],
                    correct_answer: "They can cause context switches and non-deterministic latency.",
                    explanation: "When a thread blocks on a mutex, the OS puts it to sleep and schedules another thread. This context switch takes microseconds, which is unacceptably slow for HFT where tick-to-trade latency must be in nanoseconds."
                }
            ]
        },
{
        "roadmap": 1,
        "course": "C++ Trading HFT",
        "chapter_title": "Introduction to HFT",
        "readingComponentId": "IntroductionToHFTReading",
        "glossary_table": [
            {
                "term": "High Frequency Trading (HFT)",
                "definition": "A form of algorithmic trading characterized by high speeds, high turnover rates, and high order-to-trade ratios that leverages high-frequency financial data and electronic trading tools."
            },
            {
                "term": "Latency",
                "definition": "The total time from receiving a market data tick to executing a trade and receiving confirmation. Measured in microseconds or nanoseconds."
            },
            {
                "term": "Algorithm",
                "definition": "A set of rules and mathematical models designed to identify trading opportunities and automatically place orders."
            }
        ],
        "visual_prompt": "Create an SVG diagram illustrating the speed hierarchy in trading. At the top, show a human clicking a mouse (~250ms). In the middle, show traditional algorithmic trading (~50ms). At the bottom, show HFT with C++ nodes and FPGAs (~0.005ms). Use a neon green and dark slate tech aesthetic.",
        "content": "<p>High Frequency Trading (HFT) is the pinnacle of performance engineering in finance. Unlike traditional trading which relies on human intuition or macroeconomic trends, HFT operates on the micro-structure of the market, identifying tiny pricing inefficiencies that exist for mere fractions of a second.</p><p>To achieve this, firms utilize highly optimized C++ code, bypassing standard operating system kernels to directly interface with Network Interface Cards (NICs).</p>"
    },
    {
        "roadmap": 1,
        "course": "C++ Trading HFT",
        "chapter_title": "Market Microstructure & The Order Book",
        "readingComponentId": "OrderBookMicrostructureReading",
        "glossary_table": [
            {
                "term": "Limit Order Book (LOB)",
                "definition": "The core data structure maintained by an exchange to record all resting limit orders for a given asset."
            },
            {
                "term": "Bid-Ask Spread",
                "definition": "The difference in price between the highest price a buyer is willing to pay (Best Bid) and the lowest price a seller is willing to accept (Best Ask)."
            },
            {
                "term": "Market Maker",
                "definition": "An entity that provides liquidity by quoting both bids and asks simultaneously, profiting from the spread."
            }
        ],
        "visual_prompt": "Create an SVG diagram of a Limit Order Book. The left side should show Bids in varying shades of green, stacking up to a 'Best Bid'. The right side should show Asks in shades of red, dropping down to a 'Best Ask'. Highlight the gap between them and label it 'The Spread'.",
        "content": "<p>The Limit Order Book is the heartbeat of any modern electronic exchange. It is a continuous auction where buyers and sellers state their intentions via limit orders. Market Makers continuously post quotes on both sides of the book to capture the spread.</p><p>HFT algorithms constantly monitor the shape and depth of this book to predict short-term price movements and adjust their own quotes accordingly.</p>"
    },
    {
        "roadmap": 1,
        "course": "C++ Trading HFT",
        "chapter_title": "Network Architecture & Co-location",
        "readingComponentId": "ExchangeColocationReading",
        "glossary_table": [
            {
                "term": "Co-location",
                "definition": "The practice of renting server space in the same physical data center as the exchange's matching engine to minimize network distance."
            },
            {
                "term": "Microwave Network",
                "definition": "A point-to-point wireless transmission network used in HFT because radio waves traveling through air are faster than light traveling through fiber-optic glass."
            },
            {
                "term": "FPGA",
                "definition": "Field Programmable Gate Array. A customizable integrated circuit used in HFT to burn trading logic directly into hardware, bypassing software CPU overhead."
            }
        ],
        "visual_prompt": "Create an SVG diagram comparing physical latency pathways. Pathway 1: A curved fiber optic cable snaking through terrain. Pathway 2: A direct line-of-sight microwave tower connection beaming a straight neon line across the sky. Label Pathway 2 as 'HFT Microwave Link (Faster)'.",
        "content": "<p>In HFT, physics is the ultimate limiting factor. Light travels through fiber-optic cables at approximately two-thirds the speed of light in a vacuum. To overcome this, HFT firms use microwave towers, which transmit data through the air at nearly 99% the speed of light.</p><p>Furthermore, firms co-locate their servers exactly next to the matching engines. Exchanges often measure the physical cables down to the millimeter to ensure fair access for all co-located participants.</p>"
    }
    ]
};
