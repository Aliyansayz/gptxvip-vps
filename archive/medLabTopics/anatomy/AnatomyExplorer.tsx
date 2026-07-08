import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { LabData, Exercise } from '../../../types';
import { LabSettings } from '../../LabSettingsMenu';

// Import raw SVGs
import maleSvg from '@ebi-gene-expression-group/anatomogram/lib/svg/homo_sapiens.male.svg?raw';
import brainSvg from '@ebi-gene-expression-group/anatomogram/lib/svg/homo_sapiens.brain.svg?raw';

// --- Types ---
type AnatomyView = 'body' | 'brain';

interface OrganData {
    name: string;
    system: string;
    description: string;
    clinical: {
        function: string;
        pathology: string;
        examination: string;
    };
    details: Record<string, string>;
    hasDrillDown?: boolean;
}

interface BrainRegionData {
    name: string;
    region: string;
    system?: string; // Added to satisfy union type checks
    description: string;
    clinical: {
        function: string;
        pathology: string;
        examination: string;
    };
    details: Record<string, string>;
    hasDrillDown?: boolean; // Added to satisfy union type checks
}

type AnatomyData = OrganData | BrainRegionData;

interface ChapterProps {
    labData: LabData;
    step: number;
    exercises: Exercise[];
    onComplete: () => void;
    infoVisible?: boolean;
    infoPlacement?: 'side' | 'bottom';
    settings?: LabSettings;
}

// --- Data Constants ---
const anatomyData: Record<string, OrganData> = {
  "UBERON_0000948": {"name": "Heart", "system": "Cardiovascular", "description": "Four-chambered muscular organ that pumps blood throughout the body.", "clinical": {"function": "Pumps 5 L/min at rest, up to 25 L/min during exercise. Generates 120/80 mmHg pressure.", "pathology": "Coronary artery disease, MI, heart failure, arrhythmias, valvular disorders. Leading cause of mortality worldwide.", "examination": "Auscultation (S1, S2), ECG, echocardiography, cardiac biomarkers (troponin, BNP)."}, "details": {"weight": "250-350g", "chambers": "RA, RV, LA, LV", "output": "4-8 L/min", "rate": "60-100 bpm"}},
  "UBERON_0002048": {"name": "Lung", "system": "Respiratory", "description": "Paired organs responsible for gas exchange between air and blood.", "clinical": {"function": "O2 uptake 250 mL/min at rest. Total capacity ~6 L. Surface area equivalent to tennis court.", "pathology": "COPD, asthma, pneumonia, PE, lung cancer, ILD. Smoking primary risk factor.", "examination": "Auscultation, spirometry (FEV1, FVC), CXR, CT, pulse ox, ABG."}, "details": {"capacity": "6L (M), 4.2L (F)", "rate": "12-20/min", "alveoli": "~300M/lung", "lobes": "R:3, L:2"}},
  "UBERON_0003126": {"name": "Trachea", "system": "Respiratory", "description": "Cartilaginous tube conducting air between larynx and bronchi.", "clinical": {"function": "Maintains patent airway via C-shaped cartilage rings. Ciliated epithelium propels mucus ~1 cm/min.", "pathology": "Tracheal stenosis, tracheomalacia, foreign body aspiration, tumors.", "examination": "Laryngoscopy, bronchoscopy, CT for assessment."}, "details": {"length": "10-12 cm", "diameter": "2-2.5 cm", "rings": "16-20 cartilages"}},
  "UBERON_0000945": {"name": "Stomach", "system": "Digestive", "description": "Muscular organ initiating protein digestion.", "clinical": {"function": "Secretes 2-3 L gastric juice daily (pH 1.5-3.5). Stores food 2-6 hours.", "pathology": "PUD (H. pylori), gastritis, GERD, gastric cancer, gastroparesis.", "examination": "EGD, barium swallow, CT, H. pylori testing."}, "details": {"capacity": "1-1.5 L", "pH": "1.5-3.5", "regions": "Cardia, fundus, body, pylorus", "emptying": "2-6 hr"}},
  "UBERON_0002108": {"name": "Small Intestine", "system": "Digestive", "description": "Primary site of nutrient absorption.", "clinical": {"function": "Absorbs 90% nutrients. Surface area ~200 m² via villi. Transit 3-5 hours.", "pathology": "Celiac disease, Crohn's, SBO, bacterial overgrowth.", "examination": "Capsule endoscopy, biopsy, CT enterography, celiac serology."}, "details": {"length": "6-7 m", "sections": "Duodenum, jejunum, ileum", "absorption": "90%", "transit": "3-5 hr"}},
  "UBERON_0001155": {"name": "Colon", "system": "Digestive", "description": "Large intestine for water absorption and feces formation.", "clinical": {"function": "Absorbs 1-2 L water daily. ~100 trillion bacteria. Transit 12-48 hours.", "pathology": "Colorectal cancer (3rd most common), IBD, diverticulosis, IBS, C. diff.", "examination": "Colonoscopy, CT colonography, FOBT, fecal calprotectin."}, "details": {"length": "1.5 m", "sections": "Ascending, transverse, descending, sigmoid", "microbiome": "~100T bacteria", "transit": "12-48 hr"}},
  "UBERON_0001264": {"name": "Pancreas", "system": "Digestive", "description": "Dual-function gland: exocrine and endocrine.", "clinical": {"function": "Secretes 1.5 L/day (amylase, lipase, proteases). Islets produce insulin/glucagon.", "pathology": "Pancreatitis, diabetes mellitus, pancreatic cancer (poor prognosis).", "examination": "Amylase/lipase, HbA1c, CT/MRI/ERCP, CA 19-9."}, "details": {"weight": "80-100g", "output": "1.5 L/day", "islets": "~1M", "enzymes": "Amylase, lipase, trypsin"}},
  "UBERON_0002107": {"name": "Liver", "system": "Digestive", "description": "Largest internal organ, >500 metabolic functions.", "clinical": {"function": "Filters 1.4 L/min blood. Produces bile 0.5-1 L/day. Synthesizes proteins. Only regenerating organ.", "pathology": "Hepatitis, cirrhosis, HCC, NAFLD (25% adults), hemochromatosis, Wilson disease.", "examination": "LFTs (ALT, AST, ALP, bili, albumin), US/CT/MRI, FibroScan, biopsy."}, "details": {"weight": "1.5 kg", "lobes": "Right, left, caudate, quadrate", "blood": "1.4 L/min", "functions": ">500"}},
  "UBERON_0002113": {"name": "Kidney", "system": "Urinary", "description": "Paired organs filtering blood and regulating fluid/electrolytes.", "clinical": {"function": "Filters 180 L/day via 1M nephrons. Produces 1-2 L urine/day. Regulates electrolytes, produces EPO.", "pathology": "CKD (10% pop), AKI, nephrolithiasis, GN, PKD, RCC.", "examination": "Cr, BUN, GFR, UA, renal US/CT, biopsy."}, "details": {"weight": "120-170g each", "nephrons": "~1M/kidney", "filtration": "180 L/day", "urine": "1-2 L/day"}},
  "UBERON_0001255": {"name": "Bladder", "system": "Urinary", "description": "Hollow organ storing and expelling urine.", "clinical": {"function": "Stores 300-500 mL. First urge ~150 mL. Frequency 6-8/day.", "pathology": "UTI (esp. females), OAB, IC, bladder cancer (smoking).", "examination": "UA, culture, cystoscopy, urodynamics, US."}, "details": {"capacity": "400-600 mL", "urge": "~150 mL", "frequency": "6-8/day", "control": "Voluntary"}},
  "UBERON_0000955": {"name": "Brain", "system": "Nervous", "description": "Central command organ controlling all body functions.", "clinical": {"function": "86B neurons. Consumes 20% O2 despite 2% body weight. Controls voluntary/involuntary functions.", "pathology": "Stroke, Alzheimer's, Parkinson's, epilepsy, TBI, tumors, MS, encephalitis.", "examination": "CT (hemorrhage), MRI (anatomy), EEG (seizures), PET (metabolism), LP."}, "details": {"weight": "~1400g", "neurons": "~86B", "oxygen": "20%", "regions": "Cerebrum, cerebellum, brainstem"}, "hasDrillDown": true},
  "UBERON_0002240": {"name": "Spinal Cord", "system": "Nervous", "description": "Neural pathway between brain and body.", "clinical": {"function": "Conducts sensory/motor signals. Reflex arcs. 31 pairs spinal nerves.", "pathology": "SCI (often permanent), MS, transverse myelitis, stenosis, syringomyelia, ALS.", "examination": "MRI, EMG/NCS, myelography, neuro exam."}, "details": {"length": "45 cm", "segments": "31 (8C,12T,5L,5S,1Co)", "nerves": "31 pairs", "position": "FM to L1-L2"}},
  "UBERON_0002046": {"name": "Thyroid", "system": "Endocrine", "description": "Butterfly gland regulating metabolism.", "clinical": {"function": "Produces T3, T4 (BMR, protein synthesis), calcitonin (lowers Ca). TSH-controlled.", "pathology": "Hypothyroidism (Hashimoto's), hyperthyroidism (Graves'), nodules, cancer, goiter.", "examination": "TSH (screen), T4/T3, antibodies, US, RAI, FNA."}, "details": {"weight": "15-25g", "lobes": "Right, left, isthmus", "hormones": "T3, T4, calcitonin", "regulation": "TSH"}},
  "UBERON_0002369": {"name": "Adrenal", "system": "Endocrine", "description": "Paired glands producing stress hormones.", "clinical": {"function": "Cortex: cortisol, aldosterone, androgens. Medulla: epi/norepi. Essential for life.", "pathology": "Addison disease, Cushing syndrome, pheo, CAH, adrenal crisis.", "examination": "Cortisol, ACTH, aldosterone, metanephrines, dex suppression, CT/MRI."}, "details": {"weight": "4-5g each", "layers": "Cortex 90%, Medulla 10%", "hormones": "Cortisol, aldo, epi"}},
  "UBERON_0002106": {"name": "Spleen", "system": "Lymphatic", "description": "Largest lymphoid organ filtering blood.", "clinical": {"function": "Filters aged RBCs (20-30 mL/day). Stores 1/3 platelets. Produces antibodies.", "pathology": "Splenomegaly (infection, portal HTN), rupture (trauma), hypersplenism, infarct.", "examination": "Physical exam (palpable if >2x), US, CT, CBC."}, "details": {"weight": "150-200g", "dimensions": "12×7×4 cm", "blood": "250-300 L/day", "platelets": "1/3 total"}},
  "UBERON_0001134": {"name": "Muscle", "system": "Musculoskeletal", "description": "Voluntary striated muscle for movement.", "clinical": {"function": "~640 muscles, 40% body weight. Type I (endurance), Type II (power).", "pathology": "Muscular dystrophies, myasthenia gravis, rhabdomyolysis, polymyositis.", "examination": "Biopsy, EMG, CK levels, genetic testing, MRI."}, "details": {"count": "~640", "weight": "~40%", "types": "I (slow), II (fast)", "energy": "ATP, CP"}},
  "UBERON_0000310": {"name": "Breast", "system": "Integumentary", "description": "Mammary gland for lactation.", "clinical": {"function": "Milk production. Develops puberty, enlarges pregnancy/lactation.", "pathology": "Breast cancer (most common in women), fibroadenoma, mastitis.", "examination": "CBE, mammography, US, MRI, biopsy."}, "details": {"tissue": "Glandular, adipose", "lobules": "15-20/breast", "screening": "Mammography >40"}},
  "UBERON_0001723": {"name": "Tongue", "system": "Digestive", "description": "Muscular organ for taste, speech, swallowing.", "clinical": {"function": "Taste (sweet, sour, salty, bitter, umami), manipulates food, speech.", "pathology": "Oral cancer, geographic tongue, glossitis, macroglossia.", "examination": "Visual inspection, biopsy if lesions, taste testing."}, "details": {"muscles": "Intrinsic/extrinsic", "papillae": "Fungiform, foliate, circumvallate", "taste_buds": "~10K"}},
  "UBERON_0000029": {"name": "Lymph Node", "system": "Lymphatic", "description": "Bean-shaped structures filtering lymph.", "clinical": {"function": "Filter pathogens, house B/T cells, initiate immune responses.", "pathology": "Lymphadenopathy (infection, cancer), lymphoma, metastases.", "examination": "Palpation, US, CT/PET, FNA, excisional biopsy."}, "details": {"count": "~600", "size": "0.1-2.5 cm", "regions": "Cervical, axillary, inguinal"}},
  "UBERON_0000977": {"name": "Pleura", "system": "Respiratory", "description": "Serous membrane lining lungs.", "clinical": {"function": "Reduces friction during breathing. Minimal pleural fluid for lubrication.", "pathology": "Effusion, pneumothorax, empyema, mesothelioma (asbestos).", "examination": "CXR, US, CT, thoracentesis."}, "details": {"layers": "Visceral, parietal", "fluid": "~10-20 mL", "pressure": "Negative (-5 cmH2O)"}},
  "UBERON_0000956": {"name": "Cerebral Cortex", "system": "Nervous", "description": "Outer brain layer for higher cognition.", "clinical": {"function": "2-4 mm, 16B neurons. Frontal (executive), parietal (sensory), temporal (memory), occipital (vision).", "pathology": "Stroke, dysplasia, epilepsy, tumors, Alzheimer atrophy, TBI.", "examination": "MRI, fMRI, EEG, PET."}, "details": {"thickness": "2-4 mm", "neurons": "~16B", "layers": "6", "area": "~2500 cm²"}},
  "UBERON_0002371": {"name": "Bone Marrow", "system": "Hematologic", "description": "Tissue in bones producing blood cells.", "clinical": {"function": "Produces 200-500B cells daily: RBCs, WBCs, platelets. EPO, G-CSF, TPO regulated.", "pathology": "Leukemias, lymphomas, aplastic anemia, MDS, myeloma.", "examination": "BM aspiration/biopsy (iliac), flow cytometry, cytogenetics."}, "details": {"types": "Red (active), Yellow (fat)", "output": "200-500B/day", "sites": "Pelvis, sternum, vertebrae"}},
  "UBERON_0001013": {"name": "Adipose", "system": "Integumentary", "description": "Fat tissue for energy storage and hormones.", "clinical": {"function": "Energy storage, insulation, endocrine (leptin, adiponectin). White (storage), brown (heat).", "pathology": "Obesity (BMI >30), metabolic syndrome, lipomas.", "examination": "BMI, waist circumference, DEXA scan."}, "details": {"types": "White, Brown", "energy": "9 kcal/g", "hormones": "Leptin, adiponectin"}},
  "UBERON_0002037": {"name": "Cerebellum", "system": "Nervous", "description": "Coordinates movement, balance, motor learning.", "clinical": {"function": "69B neurons (80% brain). Fine-tunes movement, balance, motor learning.", "pathology": "Cerebellar stroke (ataxia, dysmetria), tumors, SCAs, alcohol damage.", "examination": "Finger-to-nose, heel-shin, Romberg, gait, MRI."}, "details": {"neurons": "~69B", "weight": "~150g", "lobes": "Anterior, posterior, flocculonodular"}},
  "UBERON_0001052": {"name": "Rectum", "system": "Digestive", "description": "Terminal large intestine storing feces.", "clinical": {"function": "Stores feces, stretch receptors signal defecation. Sphincters control continence.", "pathology": "CRC, hemorrhoids, fissures, prolapse, proctitis.", "examination": "DRE, anoscopy, sigmoidoscopy, colonoscopy."}, "details": {"length": "12-15 cm", "capacity": "~300 mL", "sphincters": "Internal/external"}},
  "UBERON_0001103": { name: "Diaphragm", system: "Respiratory", description: "A dome-shaped, muscular and membranous structure that separates the thoracic (chest) and abdominal cavities.", clinical: { function: "Primary muscle of respiration; contraction increases the volume of the thorax and inflates the lungs.", pathology: "Diaphragmatic hernia, paralysis.", examination: "Fluoroscopy, CXR." }, details: { type: "Skeletal muscle", innervation: "Phrenic nerve (C3-C5)", shape: "Dome" } }
};

const bodySystems: Record<string, { color: string }> = {
  Cardiovascular: { color: "#C1666B" },
  Respiratory: { color: "#A67B5B" },
  Digestive: { color: "#8B7355" },
  Urinary: { color: "#B89968" },
  Nervous: { color: "#8B6F47" },
  Musculoskeletal: { color: "#9B8579" },
  Integumentary: { color: "#C9A07C" },
  Endocrine: { color: "#A67C52" },
  Lymphatic: { color: "#8B7D6B" },
  Hematologic: { color: "#9B4444" }
};

const brainRegions: Record<string, BrainRegionData> = {
  "UBERON_0001869": {"name": "Cerebral Cortex", "region": "Cerebrum", "description": "Outer brain layer responsible for higher cognition.", "clinical": {"function": "2-4 mm layer, 16B neurons. Lobes: frontal (executive), parietal (sensation), temporal (memory), occipital (vision).", "pathology": "Stroke, cortical dysplasia, epilepsy, tumors, Alzheimer atrophy.", "examination": "MRI structure, fMRI function, EEG electrical, PET metabolism."}, "details": {"thickness": "2-4 mm", "neurons": "~16B", "layers": "6 cortical", "area": "~2500 cm²"}},
  "UBERON_0002037": {"name": "Cerebellum", "region": "Metencephalon", "description": "Coordinates movement, balance, motor learning.", "clinical": {"function": "69B neurons (80% total). Fine-tunes movement, maintains balance, motor learning.", "pathology": "Stroke (ataxia, dysmetria), tumors (medulloblastoma), SCAs, alcohol damage.", "examination": "Finger-to-nose, heel-shin, Romberg, gait, MRI."}, "details": {"neurons": "~69B", "weight": "~150g (10%)", "lobes": "Anterior, posterior, flocculonodular"}}
};

// --- Component ---
const AnatomyExplorer: React.FC<ChapterProps> = ({ onComplete }) => {
    const [view, setView] = useState<AnatomyView>('body');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeSystem, setActiveSystem] = useState<string | null>(null);
    const [exploredOrgans, setExploredOrgans] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<'overview' | 'clinical' | 'details'>('overview');
    const [hoveredName, setHoveredName] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize Audio Context
    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    const playSound = (f = 440, d = 50) => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + d/1000);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + d/1000);
    };

    // Load SVG content
    const svgContent = useMemo(() => {
        return view === 'body' ? maleSvg : brainSvg;
    }, [view]);

    // Handle SVG Interactions & Styling
    useEffect(() => {
        if (!containerRef.current) return;
        const svgElement = containerRef.current.querySelector('svg');
        if (!svgElement) return;

        const dataSource = (view === 'body' ? anatomyData : brainRegions) as Record<string, AnatomyData>;
        // Target elements starting with UBERON
        const elements = svgElement.querySelectorAll('[id^="UBERON"]');

        // Reset styles first
        elements.forEach((el) => {
            const element = el as SVGElement;
            element.style.fill = '#E8DCC8';
            element.style.stroke = '#C1666B';
            element.style.strokeWidth = '0.3px';
            element.style.opacity = '0.3';
            element.style.cursor = 'default';
            element.style.pointerEvents = 'none';
        });

        // Apply data-specific styling
        elements.forEach((el) => {
            const element = el as SVGElement;
            const id = element.id;
            const data = dataSource[id];

            if (!data) return;

            // System filtering
            if (activeSystem && data.system !== activeSystem) {
                element.style.opacity = '0.15';
                element.style.pointerEvents = 'none';
            } else {
                element.style.opacity = '1';
                element.style.pointerEvents = 'all';
                element.style.cursor = 'pointer';
                element.style.transition = 'all 0.2s ease';

                const systemColor = (bodySystems[data.system as keyof typeof bodySystems])?.color || '#8B7355';
                
                // Highlight if selected
                if (selectedId === id) {
                     element.style.fill = systemColor;
                     element.style.fillOpacity = '0.9';
                     element.style.stroke = '#2B2520';
                     element.style.strokeWidth = '1.5px';
                     element.style.filter = 'drop-shadow(0 0 4px rgba(0,0,0,0.2))';
                } else {
                    element.style.fill = systemColor;
                    element.style.fillOpacity = activeSystem ? '0.6' : '0.3';
                    element.style.stroke = systemColor;
                    element.style.strokeWidth = activeSystem ? '0.8px' : '0.5px';
                    element.style.filter = 'none';
                }

                // Mark explored
                if (exploredOrgans.has(id) && selectedId !== id) {
                    element.style.strokeWidth = '1.5px';
                    element.style.stroke = '#8B7355';
                }
            }
        });

        // Event Listeners
        const handleMouseOver = (e: Event) => {
            const target = e.target as Element;
            const element = target.closest('[id^="UBERON"]');
            if (element && element.id && dataSource[element.id]) {
                const data = dataSource[element.id];
                if (activeSystem && data.system !== activeSystem) return;
                
                setHoveredName(data.name);
                playSound(520, 40);
                
                // Hover effect
                const svgEl = element as SVGElement;
                if (element.id !== selectedId) {
                     svgEl.style.fillOpacity = activeSystem ? '0.75' : '0.5';
                     svgEl.style.strokeWidth = activeSystem ? '1px' : '0.7px';
                }
            }
        };

        const handleMouseOut = (e: Event) => {
             const target = e.target as Element;
             const element = target.closest('[id^="UBERON"]');
             if (element && element.id && dataSource[element.id]) {
                 setHoveredName(null);
                 const svgEl = element as SVGElement;
                 if (element.id !== selectedId) {
                    const data = dataSource[element.id];
                    svgEl.style.fillOpacity = activeSystem ? '0.6' : '0.3';
                    const systemColor = (bodySystems[data.system as keyof typeof bodySystems])?.color || '#8B7355';
                    svgEl.style.stroke = exploredOrgans.has(element.id) ? '#8B7355' : systemColor;
                    svgEl.style.strokeWidth = exploredOrgans.has(element.id) ? '1.5px' : (activeSystem ? '0.8px' : '0.5px');
                 }
             }
        };

        const handleClick = (e: Event) => {
            const target = e.target as Element;
            const element = target.closest('[id^="UBERON"]');
            if (element && element.id && dataSource[element.id]) {
                const data = dataSource[element.id];
                if (activeSystem && data.system !== activeSystem) return;

                setSelectedId(element.id);
                setExploredOrgans(prev => new Set(prev).add(element.id));
                setActiveTab('overview');
                playSound(660, 60);
            }
        };

        svgElement.addEventListener('mouseover', handleMouseOver);
        svgElement.addEventListener('mouseout', handleMouseOut);
        svgElement.addEventListener('click', handleClick);

        return () => {
            svgElement.removeEventListener('mouseover', handleMouseOver);
            svgElement.removeEventListener('mouseout', handleMouseOut);
            svgElement.removeEventListener('click', handleClick);
        };

    }, [svgContent, view, activeSystem, selectedId, exploredOrgans]);


    // Derived Data
    const currentData = (view === 'body' ? anatomyData : brainRegions) as Record<string, AnatomyData>;
    const selectedData = selectedId ? currentData[selectedId] : null;
    const totalStructures = Object.keys(currentData).length;
    const exploredCount = Array.from(exploredOrgans).filter((id: string) => currentData[id]).length;
    const progressPercent = (exploredCount / totalStructures) * 100;

    return (
        <div className="grid grid-cols-[320px_1fr_350px] h-full min-h-0 bg-[#F5F1E8] text-[#2B2520] font-sans overflow-hidden overscroll-none rounded-2xl border border-[#E8DCC8] shadow-inner">
            {/* --- Left Sidebar --- */}
            <div className="bg-[#FFFEFA] border-r border-[#E8DCC8] p-6 overflow-y-auto flex flex-col gap-6 overscroll-contain custom-scrollbar">
                <div className="space-y-2">
                    <h1 className="font-heading text-2xl font-semibold text-[#2B2520]">Anatomy Explorer</h1>
                    <p className="text-xs text-[#5B4E45]">Interactive anatomical reference</p>
                    
                    <div className="flex gap-2 mt-4">
                        <button 
                            onClick={() => { setView('body'); setSelectedId(null); setActiveSystem(null); playSound(880, 70); }}
                            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all ${view === 'body' ? 'bg-[#8B7355] text-[#FFFEFA]' : 'bg-[#E8DCC8] text-[#2B2520] hover:translate-y-[-1px] hover:shadow-sm'}`}
                        >
                            Full Body
                        </button>
                        <button 
                            onClick={() => { setView('brain'); setSelectedId(null); setActiveSystem(null); playSound(880, 70); }}
                            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all ${view === 'brain' ? 'bg-[#8B7355] text-[#FFFEFA]' : 'bg-[#E8DCC8] text-[#2B2520] hover:translate-y-[-1px] hover:shadow-sm'}`}
                        >
                            Brain Detail
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="font-heading text-lg font-semibold text-[#2B2520]">Body Systems</h2>
                    <div className="flex flex-col gap-1.5">
                        <button 
                            onClick={() => { setActiveSystem(null); setSelectedId(null); playSound(500, 50); }}
                            className={`flex items-center gap-2.5 p-2.5 rounded-md text-left transition-all border ${!activeSystem ? 'bg-[#FFFEFA] border-[#8B7355] border-[1.5px]' : 'bg-[#F5F1E8] border-[#E8DCC8] hover:bg-[#FFFEFA] hover:border-[#D4C4B0] hover:translate-x-[2px]'}`}
                        >
                            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-[#A67B5B] to-[#C1666B]" />
                            <span className="flex-1 font-medium text-sm">All Systems</span>
                        </button>
                        {Object.entries(bodySystems).map(([sys, { color }]) => (
                            <button 
                                key={sys}
                                onClick={() => { setActiveSystem(sys); setSelectedId(null); playSound(500, 50); }}
                                className={`flex items-center gap-2.5 p-2.5 rounded-md text-left transition-all border ${activeSystem === sys ? 'bg-[#FFFEFA] border-[#8B7355] border-[1.5px]' : 'bg-[#F5F1E8] border-[#E8DCC8] hover:bg-[#FFFEFA] hover:border-[#D4C4B0] hover:translate-x-[2px]'}`}
                            >
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                                <span className="flex-1 font-medium text-sm">{sys}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-[#E8DCC8]">
                    <h3 className="font-heading text-sm font-semibold text-[#5B4E45] mb-2">Exploration Progress</h3>
                    <div className="h-1 bg-[#E8DCC8] rounded-full overflow-hidden mb-1.5">
                        <div className="h-full bg-gradient-to-r from-[#A67B5B] to-[#C1666B] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="text-[10px] text-[#5B4E45] font-mono mb-3">{exploredCount} / {totalStructures} structures explored</div>
                    
                    <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1 text-[11px]">
                        {Array.from(exploredOrgans).map((id: string) => {
                            const item = currentData[id];
                            return item ? (
                                <div key={id} className="px-2 py-1 bg-[#F5F1E8] rounded text-[#5B4E45]">
                                    {((item as any).name)}
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-[#E8DCC8]">
                    <button 
                        onClick={onComplete}
                        className="w-full py-2.5 bg-[#2B2520] text-[#FFFEFA] rounded-md font-bold text-sm hover:bg-[#453C35] transition-colors shadow-sm"
                    >
                        Complete Exploration
                    </button>
                </div>
            </div>

            {/* --- Main Canvas --- */}
            <div ref={canvasRef} className="flex flex-col items-center justify-center p-8 bg-[#FFFEFA] relative overflow-hidden">
                <div className="absolute top-6 left-8 right-8 text-center pointer-events-none z-10">
                    <div className="font-heading text-xl font-semibold text-[#2B2520]" id="canvas-title">
                        {view === 'body' ? 'Human Body' : 'Brain Structure'}
                    </div>
                    <div className="text-xs text-[#5B4E45] mt-0.5">
                        {activeSystem ? `Highlighting ${activeSystem} System` : 'Click any structure to explore'}
                    </div>
                </div>

                <motion.div 
                    drag
                    dragConstraints={canvasRef}
                    dragElastic={0.1}
                    dragMomentum={false}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[400px] h-auto flex items-center justify-center cursor-grab active:cursor-grabbing"
                    ref={containerRef}
                >
                    <div 
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-sm"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                </motion.div>

                <AnimatePresence>
                    {hoveredName && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2B2520] text-[#FFFEFA] px-4 py-2 rounded-lg text-sm font-medium shadow-xl pointer-events-none z-50 whitespace-nowrap"
                        >
                            {hoveredName}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- Right Sidebar --- */}
            <div className="bg-[#FFFEFA] border-l border-[#E8DCC8] overflow-y-auto flex flex-col overscroll-contain custom-scrollbar">
                {!selectedData ? (
                    <div className={`flex flex-col items-center ${activeSystem ? 'justify-start pt-12' : 'justify-center'} min-h-full p-8 text-center text-[#5B4E45]`}>
                        <h3 className="font-heading text-lg mb-2 text-[#2B2520]">Select a Structure</h3>
                        <p className="text-sm">Click on any anatomical structure to view detailed information, clinical significance, and connections.</p>
                        
                        {activeSystem && (
                             <div className="mt-6 w-full">
                                <p className="text-xs mb-3 font-medium uppercase tracking-wider">Available in {activeSystem}:</p>
                                <div className="flex flex-col gap-2">
                                    {Object.entries(currentData)
                                        .filter(([_, d]) => d.system === activeSystem)
                                        .map(([id, d]) => (
                                            <button 
                                                key={id}
                                                onClick={() => { setSelectedId(id); setExploredOrgans(prev => new Set(prev).add(id)); playSound(660, 60); }}
                                                className="flex items-center px-4 py-3 bg-[#FFFEFA] border border-[#E8DCC8] rounded-md hover:bg-[#F5F1E8] hover:border-[#C1666B] hover:translate-x-1 hover:shadow-sm transition-all text-left group"
                                            >
                                                <span className="text-sm font-medium text-[#2B2520] group-hover:text-[#C1666B] transition-colors">{d.name}</span>
                                            </button>
                                        ))
                                    }
                                </div>
                             </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-[#E8DCC8] flex justify-between items-start bg-[#FFFEFA]">
                            <div>
                                <h2 className="font-heading text-2xl font-semibold text-[#2B2520] mb-1.5">{selectedData.name}</h2>
                                <div 
                                    className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-[#FFFEFA] uppercase tracking-wider"
                                    style={{ backgroundColor: bodySystems[selectedData.system as keyof typeof bodySystems]?.color || '#8B7355' }}
                                >
                                    {selectedData.system} System
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedId(null)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F5F1E8] text-[#5B4E45] text-xl leading-none transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex border-b border-[#E8DCC8] px-4">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'clinical', label: 'Clinical' },
                                { id: 'details', label: 'Details' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id as any); playSound(550, 40); }}
                                    className={`py-3 px-4 text-xs font-semibold transition-all border-b-2 ${activeTab === tab.id ? 'border-[#8B7355] text-[#2B2520]' : 'border-transparent text-[#5B4E45] hover:bg-[#F5F1E8] hover:text-[#2B2520]'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedId + activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'overview' && (
                                        <div className="space-y-4">
                                            <p className="text-sm leading-relaxed text-[#2B2520]">
                                                {selectedData.description}
                                            </p>
                                            {selectedData.hasDrillDown && (
                                                <button 
                                                    onClick={() => { setView('brain'); setSelectedId(null); playSound(880, 70); }}
                                                    className="w-full py-2.5 px-4 bg-[#8B7355] text-[#FFFEFA] rounded-md font-medium text-xs hover:bg-[#6D5B44] hover:shadow-md hover:-translate-y-px transition-all"
                                                >
                                                    Explore {selectedData.name} Structure →
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'clinical' && (
                                        <div className="flex flex-col gap-6">
                                            <div className="space-y-2">
                                                <h3 className="font-heading text-sm font-semibold text-[#2B2520]">Function</h3>
                                                <p className="text-xs leading-relaxed text-[#2B2520]">{selectedData.clinical.function}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-heading text-sm font-semibold text-[#2B2520]">Pathology</h3>
                                                <p className="text-xs leading-relaxed text-[#2B2520]">{selectedData.clinical.pathology}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-heading text-sm font-semibold text-[#2B2520]">Examination</h3>
                                                <p className="text-xs leading-relaxed text-[#2B2520]">{selectedData.clinical.examination}</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'details' && (
                                        <div className="grid gap-2.5">
                                            {Object.entries(selectedData.details).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center p-3 bg-[#F5F1E8] rounded-md">
                                                    <span className="text-[10px] font-bold text-[#5B4E45] uppercase tracking-tight">{key.replace(/_/g, ' ')}</span>
                                                    <span className="font-mono text-[11px] text-[#2B2520] text-right">{value}</span>
                                                </div>
                                            ))}
                                            <div className="mt-3 pt-3 border-t border-[#E8DCC8] flex justify-between items-center">
                                                <span className="text-[9px] text-[#5B4E45] uppercase tracking-wider font-bold">ID</span>
                                                <span className="font-mono text-[9px] text-[#5B4E45] bg-[#F5F1E8] px-1.5 py-0.5 rounded">{selectedId}</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnatomyExplorer;
