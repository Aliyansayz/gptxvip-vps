import React, { useState, useEffect, useRef } from 'react';
import '../../bentoShowcases.css';

interface InvestmentBentoGridProps {
  onBookDemo?: () => void;
}

export const InvestmentBentoGrid: React.FC<InvestmentBentoGridProps> = ({
  onBookDemo,
}) => {
  // State for Block 1
  const [currentSidebarIndex, setCurrentSidebarIndex] = useState(1); // Default to Marketplace (index 1)
  const [animaticAutoplay, setAnimaticAutoplay] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'dashboard' | 'dualrail'>('dashboard');
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(false);
  const [isHandClicking, setIsHandClicking] = useState(false);

  // State for Block 2 (Personas)
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);
  const [isPersonaSwitching, setIsPersonaSwitching] = useState(false);

  // State for Block 3 (Property Card)
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeAmenityIndex, setActiveAmenityIndex] = useState(0);

  // State for Block 4 (Journey Map)
  const [selectedJourneyStage, setSelectedJourneyStage] = useState<number | null>(1); // Default: Onboarding Delight

  // State for Block 5 (Macro Financial Chart)
  const [macroBenchmark, setMacroBenchmark] = useState<'bonds' | 'fedrate'>('bonds');
  const [activeTimeframe, setActiveTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'All'>('1Y');
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number; rate: string; spread: string } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 1. Block 1 Dashboard Views
  const dashboardViews = [
    {
      id: 'dashboard',
      badge: 'Dashboard',
      title: 'Portfolio Performance',
      hint: 'Overview • +14.8% Net Asset Value',
      content: (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 stagger-1">
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">Total Balance</span>
              <span className="font-display font-bold text-[15px] text-slate-900">$142,850</span>
              <span className="text-[10px] font-semibold text-emerald-500 block mt-0.5">+12.4% APY</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">Monthly Rent</span>
              <span className="font-display font-bold text-[15px] text-[#1294A8]">+$1,490</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">8 Properties</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs stagger-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-700">Rental Yield Flow</span>
              <span className="text-[10px] font-bold text-[#1294A8]">Q3 2026</span>
            </div>
            <div className="flex items-end justify-between gap-1.5 h-16 pt-2 px-1">
              <div className="w-full bg-slate-100 rounded-t-md h-[45%] hover:bg-[#1294A8]/40 transition"></div>
              <div className="w-full bg-slate-100 rounded-t-md h-[62%] hover:bg-[#1294A8]/40 transition"></div>
              <div className="w-full bg-[#E8F5F7] rounded-t-md h-[55%]"></div>
              <div className="w-full bg-[#B5E4EB] rounded-t-md h-[78%]"></div>
              <div className="w-full bg-[#1294A8] rounded-t-md h-[96%] shadow-xs"></div>
              <div className="w-full bg-[#E8F5F7] rounded-t-md h-[84%]"></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 px-0.5">
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 flex items-center justify-between stagger-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">$</span>
              <div>
                <span className="text-[11px] font-semibold text-slate-800 block leading-tight">Dividend Payout</span>
                <span className="text-[9.5px] text-slate-400">Luxe Apt • Token #402</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">+$245.00</span>
          </div>
        </div>
      ),
    },
    {
      id: 'marketplace',
      badge: 'Marketplace',
      title: 'Tokenized Real Estate Deals',
      hint: 'Marketplace • 24 Verified Listings',
      content: (
        <div className="space-y-2.5">
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs flex items-center gap-2.5 stagger-1">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=240&q=80"
              alt="NY Apt"
              className="w-14 h-14 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[12px] text-slate-900 truncate">Luxe Apt • NYC</span>
                <span className="text-[11px] font-bold text-[#1294A8]">$220k</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Token $50 • IRR 12.3%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-[#1294A8] h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs flex items-center gap-2.5 stagger-2">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=240&q=80"
              alt="Miami Villa"
              className="w-14 h-14 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[12px] text-slate-900 truncate">Ocean Loft • Miami</span>
                <span className="text-[11px] font-bold text-[#1294A8]">$480k</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Token $100 • APR 11.4%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-100 stagger-3">
            <span className="text-[10.5px] font-semibold text-slate-600">Instant Buy Liquidity</span>
            <span className="text-[10.5px] font-bold text-[#1294A8] bg-[#E8F5F7] px-2 py-0.5 rounded-md">Active</span>
          </div>
        </div>
      ),
    },
    {
      id: 'properties',
      badge: 'My Properties',
      title: 'Owned Real Estate Fractions',
      hint: 'My Properties • 100% Occupancy',
      content: (
        <div className="space-y-2.5">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs stagger-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700">Total Real Estate Tokens</span>
              <span className="text-[11px] font-bold text-[#1294A8]">428 Shares</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-[#F6F8FA] p-1.5 rounded-lg">
                <span className="text-[9.5px] text-slate-400 block">Residential</span>
                <span className="font-bold text-[11.5px] text-slate-800">65%</span>
              </div>
              <div className="bg-[#F6F8FA] p-1.5 rounded-lg">
                <span className="text-[9.5px] text-slate-400 block">Commercial</span>
                <span className="font-bold text-[11.5px] text-slate-800">25%</span>
              </div>
              <div className="bg-[#F6F8FA] p-1.5 rounded-lg">
                <span className="text-[9.5px] text-slate-400 block">Hospitality</span>
                <span className="font-bold text-[11.5px] text-slate-800">10%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div>
              <span className="font-bold text-[12px] text-slate-800 block">SoHo Skyline Penthouse</span>
              <span className="text-[10px] text-slate-400">120 Tokens • Claimable: $84.20</span>
            </div>
            <button
              onClick={() => showToast('Rent dividend claimed to Wallet!')}
              className="px-2.5 py-1 rounded-lg bg-[#1294A8] text-white text-[10.5px] font-semibold hover:bg-[#0f7d8e] transition"
            >
              Claim
            </button>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-3">
            <div>
              <span className="font-bold text-[12px] text-slate-800 block">Austin Tech Hub Loft</span>
              <span className="text-[10px] text-slate-400">85 Tokens • Auto-Reinvest ON</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">+13.1%</span>
          </div>
        </div>
      ),
    },
    {
      id: 'auctions',
      badge: 'Auctions',
      title: 'Live Fractional Bidding',
      hint: 'Auctions • 3 Ending Soon',
      content: (
        <div className="space-y-2.5">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs stagger-1">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                ● Live Auction #89
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-700">02h : 18m : 44s</span>
            </div>
            <h4 className="font-display font-bold text-[13px] text-slate-900 mt-1.5">Tribeca Duplex Lot (50 Shares)</h4>
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-[9.5px] text-slate-400 block">Current Highest Bid</span>
                <span className="font-display font-bold text-[14px] text-[#1294A8]">$2,340 USD</span>
              </div>
              <button
                onClick={() => showToast('Bid +$50 placed on Tribeca Duplex!')}
                className="px-3 py-1.5 rounded-lg bg-[#14171F] text-white text-[11px] font-semibold hover:bg-slate-800 transition"
              >
                Place Bid
              </button>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div>
              <span className="font-bold text-[11.5px] text-slate-800 block">Brooklyn Brownstone #12</span>
              <span className="text-[10px] text-slate-400">14 Institutional Bidders</span>
            </div>
            <span className="text-[11px] font-bold text-[#1294A8]">$48.50 / sh</span>
          </div>
        </div>
      ),
    },
    {
      id: 'wallet',
      badge: 'Wallet',
      title: 'Escrow & Treasury Yield Sweep',
      hint: 'Treasury • U.S. T-Bills 4.18% APY',
      content: (
        <div className="space-y-2.5">
          <div className="bg-gradient-to-br from-[#14171F] to-[#252B3B] text-white p-3.5 rounded-xl shadow-sm stagger-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Idle Operating Reserve</span>
              <span className="text-[#32C5D8] font-semibold">USD / U.S. T-Bills</span>
            </div>
            <div className="font-display font-extrabold text-[18px] mt-1 tracking-tight">
              $125,988.80 <span className="text-xs font-normal text-slate-300">USD</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => showToast('Treasury Reserve sweep deposit initiated')}
                className="flex-1 py-1 rounded-lg bg-[#1294A8] text-white text-[10.5px] font-semibold hover:bg-[#15a9bf] transition"
              >
                + Fund Escrow
              </button>
              <button
                onClick={() => showToast('Distribution payout scheduled')}
                className="flex-1 py-1 rounded-lg bg-white/10 text-white text-[10.5px] font-semibold hover:bg-white/20 transition"
              >
                Distribute
              </button>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div>
              <span className="text-[11.5px] font-semibold text-slate-800 block">Daily Rent & T-Bill Sweep</span>
              <span className="text-[10px] text-slate-400">Auto-hedged against Fed Rate</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
              +$149.60/d
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'favorites',
      badge: 'Favorites',
      title: 'Saved Investment Watchlist',
      hint: 'Favorites • Price Alerts Enabled',
      content: (
        <div className="space-y-2.5">
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#E8F5F7] text-[#1294A8] flex items-center justify-center font-bold text-xs">
                NYC
              </div>
              <div>
                <span className="font-bold text-[12px] text-slate-900 block">Luxe Apt • New York</span>
                <span className="text-[10px] text-slate-400">$220,000 • 12.3% IRR</span>
              </div>
            </div>
            <span className="text-rose-500 text-sm">♥</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#E8F5F7] text-[#1294A8] flex items-center justify-center font-bold text-xs">
                LDN
              </div>
              <div>
                <span className="font-bold text-[12px] text-slate-900 block">Kensington Residence</span>
                <span className="text-[10px] text-slate-400">$390,000 • 10.9% IRR</span>
              </div>
            </div>
            <span className="text-rose-500 text-sm">♥</span>
          </div>

          <div className="bg-[#E8F5F7]/70 px-3 py-2 rounded-xl border border-[#BDE4EA] text-[10.5px] text-[#0E7C8D] font-medium stagger-3">
            🔔 Presale alert active for <strong>Luxe Apt</strong>
          </div>
        </div>
      ),
    },
  ];

  // Animatic Auto-switching Loop
  useEffect(() => {
    if (!animaticAutoplay) return;
    const interval = window.setInterval(() => {
      setCurrentSidebarIndex((prev) => (prev + 1) % dashboardViews.length);
      setIsHandClicking(true);
      setTimeout(() => setIsHandClicking(false), 300);
    }, 3400);

    return () => window.clearInterval(interval);
  }, [animaticAutoplay, dashboardViews.length]);

  const handleSelectSidebarView = (idx: number, isManual = true) => {
    setCurrentSidebarIndex(idx);
    setIsHandClicking(true);
    setTimeout(() => setIsHandClicking(false), 300);
    if (isManual && animaticAutoplay) {
      showToast(`Switched to ${dashboardViews[idx].badge}`);
    }
  };

  // 2. Block 2 Personas Data
  const personasData = [
    {
      name: 'Sophia Wilson',
      role: 'Retail Investor',
      email: 'wilson@gmail.com',
      flag: '🇺🇸',
      age: '30',
      location: 'United States',
      occupation: 'Marketing Manager',
      status: 'Single',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'Fund Manager',
      email: 'm.vance@vancecap.co.uk',
      flag: '🇬🇧',
      age: '42',
      location: 'London, UK',
      occupation: 'Private Equity Director',
      status: 'Married',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Global Investor',
      email: 'elena@rostova.sg',
      flag: '🇸🇬',
      age: '36',
      location: 'Singapore',
      occupation: 'Tech Founder & Angel',
      status: 'Family Office',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const handleSwitchPersona = (idx: number) => {
    setIsPersonaSwitching(true);
    setTimeout(() => {
      setActivePersonaIndex(idx);
      setIsPersonaSwitching(false);
    }, 140);
  };

  // 3. Block 3 Amenities Data
  const amenityTiles = [
    { label: '1 Bed', desc: 'King Ensuite Bedroom' },
    { label: '1 Bath', desc: 'Italian Marble Bath' },
    { label: '68 m²', desc: 'Net Usable Area' },
    { label: 'Residential', desc: 'Class-A Zoning' },
    { label: 'Playground', desc: 'Private Courtyard & Park' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Property link copied to clipboard!');
  };

  const handleToggleFavorite = () => {
    setIsFavorited((prev) => {
      const next = !prev;
      showToast(next ? 'Saved Luxe Apt to Favorites!' : 'Removed from Favorites');
      return next;
    });
  };

  // 4. Block 4 Journey Stages
  const journeyStages = [
    {
      avatar: '👩🏽💻',
      title: 'Discovery Stage',
      metric: '88% search clarity rate',
      detail: 'Prospective investors browse tokenized real estate offerings, filter by projected IRR/APR, and review verified smart contracts.',
    },
    {
      avatar: '👩🏻💼',
      title: 'Onboarding Delight',
      metric: '94% KYC instant pass',
      detail: 'Frictionless accreditation and wallet linking in under 90 seconds with automated institutional AML compliance.',
    },
    {
      avatar: '🧑🏽💼',
      title: 'Property Comparison',
      metric: '3.4 properties compared avg',
      detail: 'Side-by-side financial modeling, cap-rate spreads against U.S. 10Y Treasuries, and historical rent collections.',
    },
    {
      avatar: '🧔🏻‍♂️',
      title: 'Token Purchase',
      metric: 'Instant blockchain settlement',
      detail: 'Fractional ownership secured through legal SPV structure with zero intermediary escrow friction.',
    },
    {
      avatar: '👩🏼🎨',
      title: 'Yield Payout Delight',
      metric: 'Daily rental streaming active',
      detail: 'Tenants pay monthly rent converted automatically into daily yield streaming with auto-reinvestment into T-Bills.',
    },
  ];

  // 5. Block 5 Benchmark Datasets
  const bondDatasets: Record<string, { yieldVal: string; delta: string; spread: string; path: string }> = {
    '1M': {
      yieldVal: '4.24%',
      delta: '-6 bps (-1.40%)',
      spread: '+214 bps',
      path: 'M0,75 L30,68 L70,82 L110,64 L150,70 L200,58 L250,62 L300,52 L350,60 L390,48 L420,44',
    },
    '3M': {
      yieldVal: '4.32%',
      delta: '+12 bps (+2.85%)',
      spread: '+206 bps',
      path: 'M0,85 L40,78 L90,65 L140,72 L190,55 L240,60 L290,45 L340,50 L380,42 L420,38',
    },
    '6M': {
      yieldVal: '4.45%',
      delta: '+25 bps (+5.95%)',
      spread: '+193 bps',
      path: 'M0,95 L50,82 L100,74 L160,60 L220,52 L280,48 L330,42 L380,36 L420,30',
    },
    '1Y': {
      yieldVal: '4.18%',
      delta: '-14 bps (-3.24%)',
      spread: '+220 bps',
      path: 'M0,62 L8,48 L22,55 L48,92 L72,78 L92,32 L106,60 L132,52 L162,74 L195,42 L222,64 L252,66 L278,86 L305,76 L342,96 L368,118 L394,104 L420,94',
    },
    '3Y': {
      yieldVal: '3.88%',
      delta: '-44 bps (-10.1%)',
      spread: '+250 bps',
      path: 'M0,110 L60,95 L120,80 L180,68 L240,62 L300,54 L360,46 L420,40',
    },
    '5Y': {
      yieldVal: '3.65%',
      delta: '-67 bps (-15.5%)',
      spread: '+273 bps',
      path: 'M0,125 L70,105 L140,88 L210,74 L280,62 L350,50 L420,35',
    },
    'All': {
      yieldVal: '4.18%',
      delta: '+180 bps (Macro cycle)',
      spread: '+220 bps',
      path: 'M0,140 L50,120 L110,95 L170,80 L230,65 L290,55 L350,75 L420,94',
    },
  };

  const currentMacro = bondDatasets[activeTimeframe] || bondDatasets['1Y'];

  const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.max(15, Math.min(rect.width - 15, e.clientX - rect.left));
    const svgX = Math.round((relX / rect.width) * 420);
    const waveY = Math.round(75 + Math.sin(svgX * 0.04) * 22);
    const calculatedRate = (5.2 - (waveY / 165) * 1.5).toFixed(2);
    const calculatedSpread = (6.38 - Number(calculatedRate)).toFixed(2);

    setHoverPosition({
      x: svgX,
      y: waveY,
      rate: `${calculatedRate}%`,
      spread: `+${Math.round(Number(calculatedSpread) * 100)} bps`,
    });
  };

  const handleChartMouseLeave = () => {
    setHoverPosition(null);
  };

  const currentPersona = personasData[activePersonaIndex];

  return (
    <div className="w-full text-slate-900 select-none">
      {/* Top Interactive Control Bar */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#23B5C8] via-[#1294A8] to-[#0E8394] flex items-center justify-center shadow-sm border border-white text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10M17 7L7 17M12 3a9 9 0 100 18 9 9 0 000-18z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                Real Estate Investment UI — Interactive Bento Showcase
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5F7] text-[#118A9C] border border-[#BDE4EA]">
                Live Fractional Liquidity • SEC Reg D / Reg S
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Click any sidebar button in Block 1 to experience the live dashboard &amp; animatic view switching
            </p>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setAnimaticAutoplay(!animaticAutoplay);
              showToast(
                !animaticAutoplay
                  ? 'Animatic marketplace auto-switching enabled'
                  : 'Manual marketplace navigation active'
              );
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition shadow-xs border ${
              animaticAutoplay
                ? 'bg-[#E8F5F7] text-[#118A9C] border-[#BDE4EA] hover:bg-[#D5EEF2]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                animaticAutoplay ? 'bg-[#1294A8] animate-ping' : 'bg-slate-400'
              }`}
            />
            <span>Animatic Auto-Switch: {animaticAutoplay ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              const next = !isWorkspaceExpanded;
              setIsWorkspaceExpanded(next);
              if (next) {
                setLayoutMode('dualrail');
                showToast('Expanded Block 1 Workspace to 8 columns');
              } else {
                setLayoutMode('dashboard');
                showToast('Reset 3-Column Bento Grid');
              }
            }}
            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 transition border border-slate-200 shadow-xs"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>{isWorkspaceExpanded ? 'Reset 3-Column Bento Grid' : 'Expand Block 1 Workspace'}</span>
          </button>
        </div>
      </header>

      {/* MAIN BENTO GRID */}
      <main className={`bento-grid ${isWorkspaceExpanded ? 'dashboard-expanded' : ''}`}>

        {/* =================================================================== */}
        {/* BLOCK 1: STREAMLINED NAVIGATION + ACTUAL INTERACTIVE DASHBOARD      */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-1 p-6 sm:p-7 flex flex-col justify-between min-h-[550px] bg-[#F6F7F9] border border-slate-200/85 shadow-sm">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#14171F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M9 3v18M14 9l3 3-3 3" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-bold text-[19px] sm:text-[20px] text-[#14171F] leading-snug tracking-tight">
                    Streamlined navigation for<br className="hidden sm:inline" /> enhanced user experience
                  </h2>
                  <p className="text-[13px] text-[#6E7787] leading-relaxed mt-1.5 max-w-md">
                    Optimized the information architecture to ensure that users can effortlessly navigate the platform
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-white/90 p-1 rounded-xl border border-slate-200/80 shadow-xs shrink-0">
                <button
                  onClick={() => {
                    setLayoutMode('dashboard');
                    showToast('Switched to Standard Dashboard');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    layoutMode === 'dashboard'
                      ? 'bg-[#14171F] text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setLayoutMode('dualrail');
                    showToast('Showing Collapsed Icon Rail alongside Live Dashboard');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    layoutMode === 'dualrail'
                      ? 'bg-[#14171F] text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  + Rail
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Container */}
          <div className="relative mt-5 flex-1 flex items-stretch gap-2.5 select-none overflow-hidden pt-1">
            {/* Animatic Hand Pointer Cursor */}
            {animaticAutoplay && (
              <div
                className={`animatic-cursor absolute flex items-center justify-center ${
                  isHandClicking ? 'clicking' : ''
                }`}
                style={{
                  top: `${112 + currentSidebarIndex * 40}px`,
                  left: sidebarCollapsed ? '42px' : '118px',
                }}
              >
                <div className={`w-7 h-7 rounded-full border-2 border-[#1294A8] absolute -top-1.5 -left-1.5 ${isHandClicking ? 'cursor-ripple' : 'opacity-0'}`} />
                <svg className="w-6 h-6 drop-shadow-md" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M11.5 4.5C11.5 3.39543 12.3954 2.5 13.5 2.5C14.6046 2.5 15.5 3.39543 15.5 4.5V12.5H17.2C18.08 12.5 18.8 13.22 18.8 14.1V14.3C19.68 14.3 20.4 15.02 20.4 15.9V16.5C21.28 16.5 22 17.22 22 18.1V20.5C22 23.8137 19.3137 26.5 16 26.5H12.3C10.5 26.5 8.9 25.5 8.1 23.9L5.8 19.3C5.3 18.3 5.7 17.1 6.7 16.6C7.6 16.1 8.8 16.5 9.3 17.4L11.5 21V4.5Z"
                    fill="white"
                    stroke="#1E293B"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {/* Application Frame */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)] flex overflow-hidden min-h-[385px]">
              {/* Left Sidebar */}
              <aside
                className={`app-sidebar ${
                  sidebarCollapsed ? 'w-[58px]' : 'w-[166px] sm:w-[178px]'
                } border-r border-slate-100 py-4 px-3 flex flex-col justify-between bg-white shrink-0 relative z-10`}
              >
                <div>
                  <div className="flex items-center justify-between px-1.5 mb-5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1294A8] to-[#32C5D8] flex items-center justify-center shrink-0 shadow-xs">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8m0-8l-8 8M6 4h4l2 2 2-2h4a2 2 0 012 2v4l-2 2 2 2v4a2 2 0 01-2 2h-4l-2-2-2 2H6a2 2 0 01-2-2v-4l2-2-2-2V6a2 2 0 012-2z" />
                        </svg>
                      </div>
                      {!sidebarCollapsed && (
                        <span className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#14171F] whitespace-nowrap">
                          INVESTMENT
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      title="Collapse / Expand Sidebar"
                      className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600 transition shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  {!sidebarCollapsed && (
                    <div className="px-2 mb-2 text-[9.5px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      OVERVIEW
                    </div>
                  )}

                  <nav className="relative space-y-1">
                    <div
                      className="nav-pill-indicator absolute left-0 right-0 h-[36px] rounded-xl bg-[#E8F5F7] pointer-events-none"
                      style={{ transform: `translateY(${currentSidebarIndex * 40}px)` }}
                    />

                    {dashboardViews.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSidebarView(idx, true)}
                        className={`relative z-10 w-full h-[36px] px-2.5 rounded-xl flex items-center gap-2.5 text-[12.5px] transition-colors ${
                          idx === currentSidebarIndex
                            ? 'font-semibold text-[#1294A8]'
                            : 'font-medium text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span className="shrink-0">
                          {idx === 0 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <rect x="3" y="3" width="7" height="7" rx="2" />
                              <rect x="14" y="3" width="7" height="7" rx="2" />
                              <rect x="14" y="14" width="7" height="7" rx="2" />
                              <rect x="3" y="14" width="7" height="7" rx="2" />
                            </svg>
                          )}
                          {idx === 1 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4v18M19 21V11l-7-4M9 9v.01M9 13v.01M9 17v.01" />
                            </svg>
                          )}
                          {idx === 2 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7zM4 11h16M4 15h16" />
                            </svg>
                          )}
                          {idx === 3 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 4.5l5 5m-11 2l5-5 5 5-5 5-5-5zm-4.5 9.5l5.5-5.5" />
                            </svg>
                          )}
                          {idx === 4 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <rect x="3" y="5" width="18" height="14" rx="2.5" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h.01M3 9.5h18" />
                            </svg>
                          )}
                          {idx === 5 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </span>
                        {!sidebarCollapsed && <span className="truncate">{item.badge}</span>}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between px-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {!sidebarCollapsed && (
                      <span className="text-[10.5px] font-medium text-slate-500">Live Mainnet</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-bold text-[#1294A8] bg-[#E8F5F7] px-1.5 py-0.5 rounded">
                      v2.4
                    </span>
                  )}
                </div>
              </aside>

              {/* Right Mini-Dashboard Viewport */}
              <div className="flex-1 bg-[#F9FAFC] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden relative">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E8F5F7] text-[#1294A8]">
                        {dashboardViews[currentSidebarIndex].badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {currentSidebarIndex + 1}/{dashboardViews.length}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-[13.5px] text-slate-900 mt-0.5">
                      {dashboardViews[currentSidebarIndex].title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleSelectSidebarView((currentSidebarIndex + 1) % dashboardViews.length)}
                    title="Next Sidebar View"
                    className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1294A8] hover:border-[#1294A8] transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Dynamic Stage */}
                <div key={currentSidebarIndex} className="flex-1 py-2.5 flex flex-col justify-between animate-view-switch">
                  {dashboardViews[currentSidebarIndex].content}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10.5px] text-slate-400">
                  <span className="truncate">{dashboardViews[currentSidebarIndex].hint}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {dashboardViews.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => handleSelectSidebarView(dotIdx)}
                        className={`h-1.5 rounded-full transition-all ${
                          dotIdx === currentSidebarIndex ? 'w-4 bg-[#1294A8]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Collapsed Icon Rail */}
            {layoutMode === 'dualrail' && (
              <div className="w-[52px] bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)] py-4 px-1.5 flex flex-col items-center justify-between shrink-0">
                <div className="flex flex-col items-center w-full">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1294A8] to-[#32C5D8] flex items-center justify-center mb-8 shadow-xs">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8m0-8l-8 8M6 4h4l2 2 2-2h4a2 2 0 012 2v4l-2 2 2 2v4a2 2 0 01-2 2h-4l-2-2-2 2H6a2 2 0 01-2-2v-4l2-2-2-2V6a2 2 0 012-2z" />
                    </svg>
                  </div>

                  <div className="relative space-y-1 w-full flex flex-col items-center">
                    <div
                      className="nav-pill-indicator absolute w-9 h-[36px] rounded-xl bg-[#E8F5F7] pointer-events-none"
                      style={{ transform: `translateY(${currentSidebarIndex * 40}px)` }}
                    />
                    {dashboardViews.map((_, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleSelectSidebarView(rIdx)}
                        className={`relative z-10 w-9 h-[36px] rounded-xl flex items-center justify-center transition ${
                          rIdx === currentSidebarIndex ? 'text-[#1294A8]' : 'text-slate-600'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 2: TAILORING THE EXPERIENCE TO DIVERSE USER PERSONAS          */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-2 p-6 sm:p-7 flex flex-col justify-between min-h-[550px] bg-[#F6F7F9] border border-slate-200/85 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#14171F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <circle cx="9" cy="10" r="2" />
                <path strokeLinecap="round" d="M6 16c.8-1.5 2-2 3-2s2.2.5 3 2M15 9h3M15 13h3" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-[19px] sm:text-[20px] text-[#14171F] leading-snug tracking-tight">
                Tailoring the experience to<br className="hidden sm:inline" /> diverse user personas
              </h2>
              <p className="text-[13px] text-[#6E7787] leading-relaxed mt-1.5">
                Developed user personas representing a spectrum of potential investors
              </p>
            </div>
          </div>

          {/* Center Persona Card */}
          <div className="my-auto pt-5">
            <div
              className={`bg-white rounded-2xl p-6 sm:p-7 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.06)] border border-slate-100/90 max-w-[390px] mx-auto transition-all duration-300 ${
                isPersonaSwitching ? 'opacity-40 scale-98' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex items-center gap-3.5 pb-5">
                <div className="relative shrink-0">
                  <img
                    src={currentPersona.avatar}
                    alt={currentPersona.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-[16px] text-[#14171F] truncate">
                      {currentPersona.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white border border-slate-200 text-slate-600 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{currentPersona.role}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-[12.5px] text-slate-400">
                    <span>{currentPersona.email}</span>
                    <span>•</span>
                    <span className="text-xs">{currentPersona.flag}</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-slate-400 font-normal w-28">Age</span>
                  <span className="font-semibold text-[#14171F] flex-1">{currentPersona.age}</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-slate-400 font-normal w-28">Location</span>
                  <span className="font-semibold text-[#14171F] flex-1">{currentPersona.location}</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-slate-400 font-normal w-28">Occupation</span>
                  <span className="font-semibold text-[#14171F] flex-1">{currentPersona.occupation}</span>
                </div>
                <div className="pt-3.5 pb-1 flex items-center justify-between">
                  <span className="text-slate-400 font-normal w-28">Status</span>
                  <span className="font-semibold text-[#14171F] flex-1">{currentPersona.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              {personasData.map((p, pIdx) => (
                <button
                  key={p.name}
                  onClick={() => handleSwitchPersona(pIdx)}
                  className={`px-2.5 py-1 rounded-full text-[11px] transition ${
                    pIdx === activePersonaIndex
                      ? 'font-semibold bg-[#14171F] text-white shadow-xs'
                      : 'font-medium bg-white text-slate-500 hover:text-slate-800 border border-slate-200/80'
                  }`}
                >
                  {p.name.split(' ')[0]} ({p.role.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 3: PROPERTY CARD COMPONENTS                                   */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-3 p-6 sm:p-7 flex flex-col justify-between min-h-[550px] bg-[#F6F7F9] border border-slate-200/85 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#14171F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="4" width="12" height="16" rx="2.5" />
                <path strokeLinecap="round" d="M16 7h2a2 2 0 012 2v9a2 2 0 01-2 2h-2" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-[19px] sm:text-[20px] text-[#14171F] leading-snug tracking-tight">
                Property card components
              </h2>
              <p className="text-[13px] text-[#6E7787] leading-relaxed mt-1.5">
                Property Card provides a more intuitive and informative interface with organized data
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-stretch gap-3 max-w-[420px] mx-auto w-full">
            {/* Main Property Card */}
            <div className="flex-1 bg-white rounded-2xl p-3 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col justify-between">
              <div className="relative rounded-xl overflow-hidden h-[175px] group">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80"
                  alt="Luxe Apt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14171F]"></span>
                  <span className="text-[11px] font-semibold text-[#14171F]">Upcoming</span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1.5">
                  <button
                    onClick={handleCopyLink}
                    title="Copy property link"
                    className="w-7 h-7 rounded-full bg-slate-900/55 hover:bg-slate-900/80 backdrop-blur-xs text-white flex items-center justify-center transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    title="Save to Favorites"
                    className={`w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center transition ${
                      isFavorited ? 'bg-rose-600 text-white' : 'bg-slate-900/55 hover:bg-slate-900/80 text-white'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-[15px] text-[#14171F] leading-tight">
                    Luxe Apt
                  </h3>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">USA, New York City</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10.5px] text-slate-400">Property price</span>
                  <span className="font-display font-bold text-[15px] text-[#1294A8]">$220,00</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-[12px] text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 14h18M5 10V7a1 1 0 011-1h4a1 1 0 011 1v3" />
                  </svg>
                  <span>1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1zM6 12V5a2 2 0 012-2h1" />
                  </svg>
                  <span>1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="4" width="16" height="16" rx="1" />
                    <path d="M4 8h16M8 4v16" />
                  </svg>
                  <span>150</span>
                </div>
              </div>

              <div className="mt-3 bg-[#F6F8FA] rounded-xl p-2.5 grid grid-cols-3 gap-1 border border-slate-100">
                <div>
                  <span className="block text-[9.5px] text-slate-400">Token price</span>
                  <span className="font-display font-bold text-[12px] text-[#1294A8]">$50</span>
                </div>
                <div>
                  <span className="block text-[9.5px] text-slate-400">Projected IRR</span>
                  <span className="font-display font-bold text-[12px] text-[#1294A8]">12.3%</span>
                </div>
                <div>
                  <span className="block text-[9.5px] text-slate-400">Projected APR</span>
                  <span className="font-display font-bold text-[12px] text-[#1294A8]">10.5%</span>
                </div>
              </div>
            </div>

            {/* Stacked 5 Feature Component Tiles */}
            <div className="w-[82px] flex flex-col justify-between gap-2 shrink-0">
              {amenityTiles.map((tile, aIdx) => (
                <button
                  key={tile.label}
                  onClick={() => {
                    setActiveAmenityIndex(aIdx);
                    showToast(`${tile.label}: ${tile.desc}`);
                  }}
                  className={`flex-1 rounded-xl border shadow-2xs flex flex-col items-center justify-center p-1.5 transition group ${
                    aIdx === activeAmenityIndex
                      ? 'border-[#1294A8] ring-2 ring-[#1294A8] bg-[#E8F5F7]'
                      : 'bg-white border-slate-100 hover:border-[#1294A8]'
                  }`}
                >
                  <span className="text-[10.5px] font-medium text-slate-600">{tile.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 4: PRODUCT EXPERIENCE JOURNEY MAP                             */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-4 p-6 sm:p-8 flex flex-col justify-between min-h-[480px] bg-[#F6F7F9] border border-slate-200/85 shadow-sm">
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#14171F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-[19px] sm:text-[21px] text-[#14171F] leading-snug tracking-tight">
                  Product Experience Journey Map
                </h2>
                <p className="text-[13px] text-[#6E7787] leading-relaxed mt-1.5 max-w-md">
                  Gain valuable insights into the customer's perspective, pain points, and moments of delight throughout their interaction with product
                </p>
              </div>
            </div>
          </div>

          {/* Concentric Circles */}
          <div className="relative flex-1 flex items-center justify-center min-h-[340px] mt-2 overflow-hidden">
            <div className="w-[340px] h-[340px] sm:w-[370px] sm:h-[370px] rounded-full border border-slate-200/75 flex items-center justify-center relative">
              <div className="w-[265px] h-[265px] sm:w-[290px] sm:h-[290px] rounded-full border border-slate-200/80 flex items-center justify-center">
                <div className="w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] rounded-full border border-slate-200/90 flex items-center justify-center bg-slate-100/40">
                  <button
                    onClick={() => {
                      setSelectedJourneyStage(null);
                      showToast('Product Journey Core View');
                    }}
                    className="w-[116px] h-[116px] sm:w-[126px] sm:h-[126px] rounded-full bg-white shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] flex flex-col items-center justify-center border border-slate-100 hover:scale-105 transition cursor-pointer"
                  >
                    <span className="font-display font-semibold text-[15px] text-[#1294A8]">
                      {selectedJourneyStage !== null ? journeyStages[selectedJourneyStage].title.split(' ')[0] : 'Product'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline">
                      {selectedJourneyStage !== null ? 'Delight' : 'Click nodes'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Orbit Avatars */}
              <button
                onClick={() => {
                  setSelectedJourneyStage(0);
                  showToast('Stage: Discovery Stage');
                }}
                style={{ animationDelay: '0s' }}
                className="orbit-avatar absolute top-[32px] left-[42px] w-11 h-11 rounded-full bg-[#D8B4FE] p-1 shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
                title="Discovery Stage"
              >
                <span className="text-xl leading-none">👩🏽💻</span>
              </button>

              <button
                onClick={() => {
                  setSelectedJourneyStage(1);
                  showToast('Stage: Onboarding Delight');
                }}
                style={{ animationDelay: '0.7s' }}
                className="orbit-avatar absolute top-[62px] right-[112px] w-11 h-11 rounded-full bg-[#86EFAC] p-1 shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
                title="Onboarding Delight"
              >
                <span className="text-xl leading-none">👩🏻💼</span>
              </button>

              <button
                onClick={() => {
                  setSelectedJourneyStage(2);
                  showToast('Stage: Property Comparison');
                }}
                style={{ animationDelay: '1.4s' }}
                className="orbit-avatar absolute top-[148px] -right-[14px] w-11 h-11 rounded-full bg-[#F1F5F9] p-1 shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
                title="Property Comparison"
              >
                <span className="text-xl leading-none">🧑🏽💼</span>
              </button>

              <button
                onClick={() => {
                  setSelectedJourneyStage(3);
                  showToast('Stage: Token Purchase');
                }}
                style={{ animationDelay: '2.1s' }}
                className="orbit-avatar absolute bottom-[52px] left-[28px] w-11 h-11 rounded-full bg-[#FDE047] p-1 shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
                title="Token Purchase"
              >
                <span className="text-xl leading-none">🧔🏻‍♂️</span>
              </button>

              <button
                onClick={() => {
                  setSelectedJourneyStage(4);
                  showToast('Stage: Yield Payout Delight');
                }}
                style={{ animationDelay: '2.8s' }}
                className="orbit-avatar absolute bottom-[8px] right-[78px] w-11 h-11 rounded-full bg-[#60A5FA] p-1 shadow-md border-2 border-white flex items-center justify-center cursor-pointer"
                title="Yield Payout Delight"
              >
                <span className="text-xl leading-none">👩🏼🎨</span>
              </button>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-2 whitespace-nowrap text-xs max-w-full overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-[#1294A8]"></span>
              <span className="font-medium text-slate-700 truncate">
                {selectedJourneyStage !== null ? (
                  <>
                    Stage: <strong>{journeyStages[selectedJourneyStage].title}</strong> — {journeyStages[selectedJourneyStage].metric}
                  </>
                ) : (
                  'Click any customer avatar node along the orbit to inspect delight metrics'
                )}
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 5: USER-ORIENTED DATA VISUALIZATION                           */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-5 p-6 sm:p-8 flex flex-col justify-between min-h-[480px] bg-[#F6F7F9] border border-slate-200/85 shadow-sm">
          <div className="flex items-start justify-between gap-3.5 relative z-10 flex-wrap sm:flex-nowrap">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#14171F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16V12M12 16V8M16 16v-5" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-[19px] sm:text-[21px] text-[#14171F] leading-snug tracking-tight">
                  User-oriented data visualization
                </h2>
                <p className="text-[13px] text-[#6E7787] leading-relaxed mt-1.5 max-w-md">
                  Track U.S. Treasury bond yields, Fed rate hikes, and property cap-rate spreads to time acquisitions and debt refinancing
                </p>
              </div>
            </div>

            <div className="flex items-center bg-white/90 p-1 rounded-xl border border-slate-200/80 shadow-xs shrink-0 self-start">
              <button
                onClick={() => {
                  setMacroBenchmark('bonds');
                  showToast('Benchmark: U.S. 10Y Treasury Bond');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  macroBenchmark === 'bonds'
                    ? 'bg-[#14171F] text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                U.S. 10Y Bond
              </button>
              <button
                onClick={() => {
                  setMacroBenchmark('fedrate');
                  showToast('Benchmark: Federal Reserve Funds Rate');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  macroBenchmark === 'fedrate'
                    ? 'bg-[#14171F] text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Fed Rate Hike
              </button>
            </div>
          </div>

          <div className="relative mt-6 pt-3 flex-1 flex flex-col justify-end">
            {/* Circular Magnifying Loupe */}
            <div
              onClick={() => {
                setMacroBenchmark((prev) => (prev === 'bonds' ? 'fedrate' : 'bonds'));
                showToast('Switched Macro Benchmark Mode');
              }}
              title="Click to switch between U.S. 10Y Bond Yield and Fed Rate Hike"
              className="chart-loupe-investment cursor-pointer w-[172px] h-[172px] sm:w-[188px] sm:h-[188px] rounded-full absolute -top-2 left-1 sm:left-3 z-20 flex flex-col justify-center px-6 select-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1294A8] text-white flex items-center justify-center text-[11px] font-bold shadow-2xs shrink-0">
                  {macroBenchmark === 'bonds' ? '🏛️' : '📈'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-800 leading-none truncate">
                      {macroBenchmark === 'bonds' ? 'U.S. 10Y Bond' : 'Fed Funds Rate'}
                    </span>
                    <svg className="w-2.5 h-2.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <span className="block text-[8.5px] text-slate-400 font-semibold leading-none mt-0.5 uppercase tracking-wider">
                    {macroBenchmark === 'bonds' ? 'US10Y • TREASURY' : 'FED • TARGET RATE'}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-[19px] sm:text-[20px] text-[#14171F] tracking-tight">
                    {hoverPosition ? hoverPosition.rate : (macroBenchmark === 'bonds' ? currentMacro.yieldVal : '5.33%')}
                  </span>
                  <span className="text-[10px] font-bold text-[#1294A8]">YIELD</span>
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                  {currentMacro.delta}
                </div>
              </div>

              <div className="mt-2.5 text-[9px] text-slate-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Refi Window: Optimal</span>
              </div>
            </div>

            {/* Main Chart White Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.06)] p-4 sm:p-5 pt-5 relative overflow-hidden">
              <div className="flex items-center justify-end gap-1 mb-5 relative z-30 flex-wrap">
                <div className="bg-[#F6F8FA] p-1 rounded-xl flex items-center gap-0.5 border border-slate-100">
                  {(['1M', '3M', '6M', '1Y', '3Y', '5Y', 'All'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setActiveTimeframe(tf);
                        showToast(`Timeframe switched: ${tf}`);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10.5px] transition ${
                        activeTimeframe === tf
                          ? 'font-bold bg-white text-slate-900 shadow-2xs'
                          : 'font-medium text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-stretch gap-3 pt-3">
                <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium select-none py-1 w-10 text-right shrink-0">
                  <span>5.50%</span>
                  <span>5.25%</span>
                  <span>5.00%</span>
                  <span>4.75%</span>
                  <span>4.50%</span>
                  <span>4.25%</span>
                  <span>4.00%</span>
                </div>

                <div
                  className="relative flex-1 h-[165px]"
                  onMouseMove={handleChartMouseMove}
                  onMouseLeave={handleChartMouseLeave}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 420 165" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="invTealChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1294A8" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#1294A8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <g stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3">
                      <line x1="0" y1="15" x2="420" y2="15" />
                      <line x1="0" y1="40" x2="420" y2="40" />
                      <line x1="0" y1="65" x2="420" y2="65" />
                      <line x1="0" y1="90" x2="420" y2="90" />
                      <line x1="0" y1="115" x2="420" y2="115" />
                      <line x1="0" y1="140" x2="420" y2="140" />
                    </g>

                    <line x1="0" y1="52" x2="420" y2="52" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" opacity="0.55" />

                    <path
                      d={`${currentMacro.path} L420,160 L0,160 Z`}
                      fill="url(#invTealChartGrad)"
                      className="transition-all duration-500"
                    />

                    <path
                      d={currentMacro.path}
                      fill="none"
                      stroke="#1294A8"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />

                    <line
                      x1={hoverPosition ? hoverPosition.x : 394}
                      y1="15"
                      x2={hoverPosition ? hoverPosition.x : 394}
                      y2="155"
                      stroke="#1294A8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />

                    <circle
                      cx={hoverPosition ? hoverPosition.x : 394}
                      cy={hoverPosition ? hoverPosition.y : 104}
                      r="4.5"
                      fill="#1294A8"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Dark Floating Tooltip */}
                  <div
                    className="absolute bg-[#14171F] text-white rounded-xl px-3 py-2 shadow-lg pointer-events-none transition-all duration-150"
                    style={{
                      right: hoverPosition ? `${Math.max(5, 100 - (hoverPosition.x / 420) * 100)}%` : '8px',
                      top: '36px',
                    }}
                  >
                    <div className="text-[9.5px] text-slate-400 font-medium">
                      FOMC • Q3 Benchmark
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-display font-bold text-[11.5px]">
                        {hoverPosition ? hoverPosition.rate : currentMacro.yieldVal}
                      </span>
                      <span className="text-[9.5px] text-[#32C5D8] font-medium">
                        Cap Spread {hoverPosition ? hoverPosition.spread : currentMacro.spread}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Estate Portfolio Impact Strip */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#E8F5F7] text-[#1294A8] font-semibold text-[10px]">
                    Portfolio Cap Rate: 6.38%
                  </span>
                  <span className="text-slate-500 text-[10.5px]">
                    +220 bps positive leverage spread over 10Y Treasury
                  </span>
                </div>
                <span className="font-semibold text-emerald-600 text-[10.5px]">DSCR: 1.72x</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#14171F] text-white px-4 py-2.5 rounded-full shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-medium animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#23B5C8]"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
