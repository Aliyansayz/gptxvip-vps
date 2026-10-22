import { CaseStudy } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-vireon-threat-center',
    slug: 'vireon-threat-center',
    title: 'Vireon Threat Center: 24×7 Managed Cybersecurity, MXDR & SIEM Telemetry',
    client: 'Vireon Security & MSSP Global',
    clientProfile: {
      name: 'Vireon Defense Technologies',
      industry: 'Managed Cybersecurity & Cloud Security (MSSP)',
      companySize: 'Enterprise (2,400+ Nodes)',
      location: 'New York, NY & Frankfurt, DE',
      timeframe: '90-Day Production Deployment',
    },
    industry: 'Financial Services',
    service: 'Cybersecurity & Zero Trust',
    tagline:
      'Correlating SIEM, ITDR, EDR, compliance, and immutable disaster recovery workflows into a single 24×7 Managed Security Threat Center.',
    summary:
      'Vireon integrated multi-cloud network telemetry, endpoint isolation, automated incident response playbooks, and continuous NIST CSF 2.0 / SOC 2 Type II compliance tracking into a responsive bento architecture monitoring 40.3M multi-cloud events.',
    heroStats: [
      {
        value: '40.3M',
        label: 'Packet Telemetry Events',
        detail: 'Continuous AWS & Azure SIEM log ingestion with zero packet loss',
        trend: 'up',
      },
      {
        value: '78%',
        label: 'Threat Protection Score',
        detail: 'Unified ZTNA & MFA policy enforcement across all enterprise gateways',
        trend: 'up',
      },
      {
        value: '4.0 hrs',
        label: 'Target RTO Disaster Recovery',
        detail: 'Immutable air-gapped backup restoration for critical databases',
        trend: 'down',
      },
      {
        value: '15 mins',
        label: 'Target RPO Data Guarantee',
        detail: 'Continuous delta snapshots encrypted with AES-256 keys',
        trend: 'down',
      },
    ],
    challenge: {
      headline: 'Fragmented Security Telemetry and Slow Incident Triage Across Hybrid Infrastructure',
      description:
        'With hybrid infrastructure distributed across AWS EU-West-1, Azure West US, and on-premises core enclaves, security operations suffered from disjointed tooling. SOC engineers spent critical minutes manually pivoting between disconnected SIEM consoles, endpoint isolation agents, and identity directories during active credential stuffing and API abuse attempts.',
      bulletPoints: [
        'Disparate monitoring consoles delayed P1 incident escalation and breach containment by up to 45 minutes.',
        'Identity threat detection (ITDR) was segregated from endpoint response (EDR), obscuring compromised user session pathways.',
        'Manual audit preparation for SOC 2 Type II and NIST CSF 2.0 consumed over 120 engineering hours per quarter.',
        'Lack of real-time multi-cloud network traffic inspection led to noisy alert fatigue and unmitigated DDoS attack vectors.',
      ],
    },
    solution: {
      headline: 'Unified 24×7 SOC Threat Center with Live Animatic Telemetry & Automated Playbooks',
      description:
        'Implemented the Vireon Threat Center bento platform with centralized signal correlation across MITRE ATT&CK tactics, one-click host isolation, automated ITDR session revocation, and immutable BaaS/DRaaS recovery vaults.',
      phases: [
        {
          phaseNumber: '01',
          title: 'Signal Aggregation & SIEM Pipeline',
          description:
            'Configured high-throughput event streaming ingesting 40.3M daily security events from VPC flow logs, Azure NSGs, Kubernetes audit streams, and Okta identity events.',
          deliverable: 'Real-time telemetry pipeline with automated deduplication and MITRE ATT&CK mapping',
        },
        {
          phaseNumber: '02',
          title: 'EDR & ITDR Automated Containment Playbooks',
          description:
            'Integrated bidirectional APIs connecting Falcon EDR with Entra ID/M365 SSO, enabling instantaneous host network containment and token revocation upon brute force detection.',
          deliverable: 'Sub-second containment orchestrations for high-confidence CVE and IOC alerts',
        },
        {
          phaseNumber: '03',
          title: 'Continuous Compliance & Immutable BDR Hardening',
          description:
            'Deployed automated compliance evidence collectors mapped against NIST CSF 2.0, SOC 2 Type II, and CMMC Level 2, backed by AES-256 air-gapped snapshots guaranteeing RTO < 4h.',
          deliverable: 'Live audit-ready compliance dashboard with cryptographic snapshot verification',
        },
      ],
      architecturalFeatures: [
        {
          title: 'Multi-Cloud Telemetry Loupe',
          description:
            'Interactive SVG dual-curve analytics comparing AWS and Azure packet volumes with real-time hover tooltips and timeframe filtering.',
          iconName: 'telemetry',
        },
        {
          title: 'Matrix Cyber Globe Activity Arc',
          description:
            'Holographic threat activity globe visualizing incoming attack vectors with instant IOC artifact hash generation and containment toggles.',
          iconName: 'globe',
        },
        {
          title: 'Incident Response & Correlation Orbit Map',
          description:
            'Concentric radar orbit tracking the complete incident lifecycle from SIEM detection through triage, containment, DFIR, and recovery.',
          iconName: 'radar',
        },
        {
          title: 'Stakeholder Governance Personas',
          description:
            'Role-tailored interfaces accommodating vCISO risk oversight, Tier-3 DFIR specialists, and technology alignment engineers.',
          iconName: 'users',
        },
      ],
    },
    results: {
      headline: 'Sub-Minute Threat Containment, 96% Control Mapping, and Zero Ransomware Exposure',
      description:
        'The deployment transitioned Vireon from reactive log aggregation to autonomous, proactive cyber defense with measurable operational improvements.',
      metrics: [
        {
          value: '40.3M',
          label: 'Events Daily Inspected',
          detail: 'Real-time multi-cloud correlation',
          trend: 'up',
        },
        {
          value: '< 60s',
          label: 'P1 Threat Containment',
          detail: 'Reduced from 45 min baseline',
          trend: 'down',
        },
        {
          value: '96%',
          label: 'NIST CSF 2.0 Alignment',
          detail: 'Automated continuous control validation',
          trend: 'up',
        },
        {
          value: '0',
          label: 'Critical CVE Breaches',
          detail: 'Over 12 consecutive months',
          trend: 'neutral',
        },
      ],
      businessOutcomes: [
        'Reduced median time to detect (MTTD) from 4.2 hours to under 3 minutes across all multi-cloud infrastructure.',
        'Automated 92% of routine Tier-1 alert triages, allowing senior analysts to focus on proactive threat hunting.',
        'Streamlined annual SOC 2 Type II audit completion with zero remediation findings and zero customer downtime.',
        'Guaranteed zero business interruption through immutable off-site backups validated every 14 minutes.',
      ],
    },
    testimonial: {
      quote:
        'The Vireon Threat Center bento interface delivers what traditional SIEM tools promised for a decade: instantaneous visibility from raw multi-cloud network packets down to individual endpoint containment, saving our SOC hundreds of hours.',
      author: 'Noah Turner',
      title: 'Virtual CISO & Head of Cybersecurity Operations',
      company: 'Vireon Defense Global',
    },
    techStack: [
      {
        category: 'Threat Telemetry & SIEM',
        tools: ['Elastic SIEM', 'AWS Security Hub', 'Azure Sentinel', 'Zeek Network Bro'],
      },
      {
        category: 'Identity & Endpoint Protection',
        tools: ['CrowdStrike Falcon', 'Microsoft Defender for Identity', 'Okta ZTNA', 'YubiKey MFA'],
      },
      {
        category: 'Governance & Compliance',
        tools: ['Vanta SOC 2 Automation', 'NIST CSF 2.0 Framework', 'CMMC 2.0 Level 2', 'AWS Audit Manager'],
      },
      {
        category: 'Resilience & BDR',
        tools: ['AWS S3 Glacier Vault Lock', 'Veeam Immutable Cloud Backup', 'AES-256 Air-Gapping', 'DRaaS Failover'],
      },
    ],
    relatedSlugs: ['real-estate-investment-platform'],
    accentColor: 'cyan',
    abstractGraphicType: 'shield',
  },
  {
    id: 'cs-real-estate-investment',
    slug: 'real-estate-investment-platform',
    title: 'Real Estate Investment Platform: Tokenized Fractional Assets & Treasury Benchmarks',
    client: 'Global Real Estate Investment Platform',
    clientProfile: {
      name: 'Investment Global Capital Partners',
      industry: 'Alternative Real Estate & PropTech Finance',
      companySize: 'Asset Management ($380M+ AUM)',
      location: 'New York, London & Singapore',
      timeframe: '60-Day Interactive Rollout',
    },
    industry: 'Financial Services',
    service: 'High-Throughput Data & DevOps',
    tagline:
      'Optimized information architecture and interactive bento dashboards enabling seamless fractional property investments, live auctions, and macroeconomic bond benchmarking.',
    summary:
      'A high-performance modern web platform bridging commercial real estate syndication with blockchain-secured liquidity, featuring live secondary rails, user persona tailoring, and real-time U.S. 10Y Treasury yield spreads.',
    heroStats: [
      {
        value: '$142,850',
        label: 'Average Portfolio Balance',
        detail: 'Diversified across 8 fractional residential & commercial properties',
        trend: 'up',
      },
      {
        value: '+12.4%',
        label: 'Net Projected APY',
        detail: 'Combining monthly rental yields with quarterly property appreciation',
        trend: 'up',
      },
      {
        value: '4.18%',
        label: 'U.S. 10Y Benchmark Tracking',
        detail: 'Live yield monitoring against Federal Reserve target rates',
        trend: 'neutral',
      },
      {
        value: '+220 bps',
        label: 'Cap Rate Spread',
        detail: 'Positive leverage differential over benchmark 10-year sovereign bonds',
        trend: 'up',
      },
    ],
    challenge: {
      headline: 'Complex Onboarding, High Minimum Investment Thresholds, and Fragmented Asset Data',
      description:
        'Commercial and multi-family real estate transactions historically required \$50,000+ minimum commitments, weeks of paperwork, and opacity regarding cap-rate performance. Individual retail investors and global family offices lacked transparent tools to evaluate lease rolls, historical net operating incomes, and sensitivity to fluctuating interest rates.',
      bulletPoints: [
        'Complex spreadsheets made comparing projected IRR versus macroeconomic Treasury yields cumbersome.',
        'High KYC and escrow drop-off rates due to slow, disconnected document verification workflows.',
        'Inability for investors to liquidate fractional positions before the standard 5-to-7 year hold period.',
        'Missing real-time property health telemetry such as occupancy rates, rent collections, and reserve balances.',
      ],
    },
    solution: {
      headline: 'Responsive Bento Investment Interface with Live Marketplace, Escrow Sweeps & Journey Analytics',
      description:
        'Engineered an interactive 5-block bento dashboard allowing investors to browse tokenized assets (from \$50/share), track rental distributions, participate in fractional auctions, and assess debt refinancing opportunities via U.S. Treasury yield curves.',
      phases: [
        {
          phaseNumber: '01',
          title: 'Tokenization Architecture & Smart Escrows',
          description:
            'Structured legally compliant SPVs under SEC Reg D/Reg S with automated daily rent dividend streaming directly to investor wallets.',
          deliverable: 'Automated ERC-3643 compliant permissioned real estate token infrastructure',
        },
        {
          phaseNumber: '02',
          title: 'Interactive Bento Grid Dashboard & Dual Rails',
          description:
            'Designed a responsive bento grid containing live marketplace deals (Luxe Apt NYC, Miami Ocean Loft), 5-stacked amenity specs, and expandable desktop workspaces.',
          deliverable: '6-view interactive application supporting Marketplace, My Properties, Auctions, and Wallet',
        },
        {
          phaseNumber: '03',
          title: 'Macro Benchmark Visualizer & Cap Spread Engine',
          description:
            'Integrated live financial market data feeds comparing portfolio net cap rates (6.38%) against U.S. 10Y Treasury yields and FOMC interest rate announcements.',
          deliverable: 'Interactive SVG area chart with magnifying glass loupe and debt-service coverage ratio telemetry',
        },
      ],
      architecturalFeatures: [
        {
          title: 'Streamlined Navigation & Animatic Auto-Switch',
          description:
            'Seamless view transitions across Portfolio, Marketplace, Auctions, and Multi-Chain Treasury Wallets.',
          iconName: 'layout',
        },
        {
          title: 'Interactive Property Loupe & Cap Rate Spread',
          description:
            'Circular magnifying readout tracking sovereign bond yields and refinancing spreads with interactive SVG cursor crosshairs.',
          iconName: 'trending',
        },
        {
          title: 'Customer Experience Journey Map',
          description:
            'Concentric orbit visualization showing customer delightful touchpoints from Discovery through Token Purchase and Rent Sweeping.',
          iconName: 'journey',
        },
        {
          title: 'Multi-Persona Wealth Alignment',
          description:
            'Tailored views for retail fractional investors, UK private equity directors, and Asian family office founders.',
          iconName: 'persona',
        },
      ],
    },
    results: {
      headline: '94% Onboarding Completion, 428 Fractional Shares Traded, and Seamless Yield Streaming',
      description:
        'The interactive platform lowered entry barriers to \$50 per token while providing institutional-grade debt-service telemetry and liquid fractional markets.',
      metrics: [
        {
          value: '94%',
          label: 'Onboarding KYC Pass Rate',
          detail: 'Under 90 seconds verification',
          trend: 'up',
        },
        {
          value: '6.38%',
          label: 'Portfolio Cap Rate',
          detail: 'Maintained across all active holdings',
          trend: 'up',
        },
        {
          value: '1.72x',
          label: 'DSCR Debt Coverage',
          detail: 'Substantial buffer against rate hikes',
          trend: 'up',
        },
        {
          value: '100%',
          label: 'Occupancy Rate',
          detail: 'Prime residential NYC & Miami assets',
          trend: 'neutral',
        },
      ],
      businessOutcomes: [
        'Enabled over 4,200 active investors to allocate capital into premium urban real estate in fractions as low as \$50.',
        'Automated daily rental income distribution, eliminating manual quarterly accounting reconciliation overhead.',
        'Equipped investors with real-time macroeconomic context, showing when debt refinancing or acquisition is mathematically optimal.',
        'Maintained 100% on-time rental collections with transparent tenant occupancy disclosures.',
      ],
    },
    testimonial: {
      quote:
        'The interactive bento design demystifies real estate investing. Being able to compare property cap rates directly against 10-year Treasury yields in real time gives our investors confidence they never had with private syndications.',
      author: 'Sophia Wilson',
      title: 'Principal Investor & Product Marketing Lead',
      company: 'Global Investment Asset Platform',
    },
    techStack: [
      {
        category: 'Frontend & Visual Components',
        tools: ['React 18', 'Tailwind CSS', 'Vite', 'Lucide React', 'SVG Chart Engine'],
      },
      {
        category: 'Macro & Financial Feeds',
        tools: ['Federal Reserve FRED API', 'U.S. Treasury Bond Feed', 'Coinbase Pay API', 'Plaid Banking'],
      },
      {
        category: 'Asset Infrastructure & Legal',
        tools: ['SEC Reg D 506(c)', 'SEC Reg S', 'Delaware Series LLC', 'Chainlink Proof of Reserve'],
      },
      {
        category: 'Security & Custody',
        tools: ['Fireblocks Institutional Custody', 'Soc 2 Certified Infrastructure', 'Stripe Identity', 'Sumsub KYC'],
      },
    ],
    relatedSlugs: ['vireon-threat-center'],
    accentColor: 'blue',
    abstractGraphicType: 'pipeline',
  },
];
