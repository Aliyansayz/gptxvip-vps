import { CaseStudy } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-compliance-legal-agent',
    slug: 'compliance-legal-agent',
    title: 'LexGuard Legal & Compliance Agent: Instant Contract Review & Always-On Audit Readiness',
    client: 'LexGuard Enterprise Legal & Compliance',
    clientProfile: {
      name: 'LexGuard Global Operations',
      industry: 'Legal, Risk & Regulatory Compliance',
      companySize: 'Enterprise (1,800+ Employees)',
      location: 'New York, London & Zurich',
      timeframe: '45-Day Rollout',
    },
    industry: 'Legal & Compliance',
    service: 'AI & Autonomous Agents',
    tagline:
      'Review vendor contracts in minutes, spot risky clauses in plain English, and stay 100% ready for GDPR, SOC 2, and HIPAA audits without manual spreadsheet work.',
    summary:
      'An easy-to-use AI legal and compliance assistant that reads incoming agreements, highlights hidden business risks, suggests pre-approved wording fixes, and keeps compliance evidence up to date automatically.',
    heroStats: [
      {
        value: '85%',
        label: 'Faster Contract Reviews',
        detail: 'Cut average agreement review time from 5 days down to under 4 minutes',
        trend: 'up',
      },
      {
        value: '99.4%',
        label: 'Policy Match Accuracy',
        detail: 'Every clause checked against your company legal playbook',
        trend: 'up',
      },
      {
        value: '120 hrs',
        label: 'Saved Every Month',
        detail: 'No more manual copy-pasting for quarterly compliance audits',
        trend: 'down',
      },
      {
        value: '100%',
        label: 'Audit Trail Clarity',
        detail: 'Every edit, approval, and policy check logged in one place',
        trend: 'neutral',
      },
    ],
    challenge: {
      headline: 'Slow Contract Approvals and Stressful Last-Minute Audit Prep',
      description:
        'Sales and purchasing teams were waitingnearly a week just to get standard vendor agreements and NDAs reviewed. At the same time, preparing for SOC 2, GDPR, and HIPAA audits meant pulling legal and operations leaders away from their real work to hunt down signatures and policy screenshots across dozens of folders.',
      bulletPoints: [
        'Sales deals were delayed up to 5 business days waiting on routine contract reviews.',
        'Important risks — like automatic 2-year renewals or unlimited liability clauses — were easy to miss in 40-page PDFs.',
        'Preparing for quarterly compliance audits took over 120 hours of manual spreadsheet tracking.',
        'Approvals were scattered across emails and chat threads, making it hard to see who signed off on what.',
      ],
    },
    solution: {
      headline: 'An AI Legal Assistant That Explains Risks in Plain English and Automates Compliance Checks',
      description:
        'We launched the LexGuard Legal & Compliance Agent — an interactive workspace where anyone on the team can upload a contract, see risky terms highlighted in plain English, apply pre-approved fixes in one click, and track regulatory compliance live.',
      phases: [
        {
          phaseNumber: '01',
          title: 'Connect Your Company Playbook',
          description:
            'Loaded the company’s standard legal rules, preferred contract wording, and regulatory checklists (GDPR, SOC 2, HIPAA, EU AI Act) into a private, secure knowledge base.',
          deliverable: 'Custom company playbook that checks every incoming agreement automatically',
        },
        {
          phaseNumber: '02',
          title: 'One-Click Plain-English Contract Reviewer',
          description:
            'Built an interactive review screen that translates dense legal jargon into simple business summaries and suggests safe replacement wording ready to send back.',
          deliverable: 'Live contract redlining assistant with one-click lawyer-approved revisions',
        },
        {
          phaseNumber: '03',
          title: 'Continuous Audit & Compliance Tracker',
          description:
            'Connected daily policy checks so privacy, security, and vendor records are collected automatically in the background instead of right before an audit.',
          deliverable: 'Always-ready compliance dashboard with downloadable audit reports',
        },
      ],
      architecturalFeatures: [
        {
          title: 'Plain-English Clause Translator',
          description:
            'Shows the original legal text side-by-side with a simple explanation of what it actually means for your budget and liability.',
          iconName: 'file',
        },
        {
          title: 'One-Click Playbook Redlines',
          description:
            'Suggests exact replacement wording already approved by your General Counsel so deals move forward without back-and-forth.',
          iconName: 'check',
        },
        {
          title: 'Live Regulatory Scorecards',
          description:
            'Tracks GDPR, SOC 2, HIPAA, and AI governance readiness in real time with clear pass/fail indicators.',
          iconName: 'shield',
        },
        {
          title: 'Complete Sign-Off Timeline',
          description:
            'Records every review, revision, and executive approval automatically so external auditors have everything they need.',
          iconName: 'users',
        },
      ],
    },
    results: {
      headline: 'Deals Close 85% Faster and Compliance Audits Finish with Zero Last-Minute Fire Drills',
      description:
        'By giving legal, finance, and operations teams an easy-to-use agentic workspace, routine agreements are cleared in minutes while high-risk contracts get immediate expert attention.',
      metrics: [
        {
          value: '3.5 mins',
          label: 'Contract First-Pass Review',
          detail: 'Down from 5 business days',
          trend: 'down',
        },
        {
          value: '85%',
          label: 'Faster Deal Turnaround',
          detail: 'Standard NDAs and vendor MSAs cleared same-day',
          trend: 'up',
        },
        {
          value: '100%',
          label: 'On-Time Audit Readiness',
          detail: 'Across GDPR, SOC 2 & HIPAA',
          trend: 'up',
        },
        {
          value: '0',
          label: 'Missed Auto-Renewals',
          detail: 'Automated alerts before vendor lock-in dates',
          trend: 'neutral',
        },
      ],
      businessOutcomes: [
        'Cut first-pass contract review times from 5 days to under 4 minutes for sales and procurement agreements.',
        'Flagged 100% of non-standard liability and auto-renewal clauses before signature.',
        'Saved 120+ hours every quarter by collecting compliance evidence automatically in the background.',
        'Gave business leaders clear, jargon-free visibility into legal risks and regulatory readiness.',
      ],
    },
    testimonial: {
      quote:
        'LexGuard turned our legal and compliance team from a bottleneck into a growth accelerator. Business managers finally understand contract risks in plain English, and our audits practically run themselves.',
      author: 'Elena Rostova',
      title: 'General Counsel & Chief Compliance Officer',
      company: 'LexGuard Global Operations',
    },
    techStack: [
      {
        category: 'Contract & Policy Intelligence',
        tools: ['Agentic Clause Reviewer', 'Company Playbook Engine', 'Plain-English Redliner', 'DocuSign Sync'],
      },
      {
        category: 'Regulatory Frameworks',
        tools: ['GDPR Privacy Controls', 'SOC 2 Type II', 'HIPAA Safeguards', 'EU AI Act Governance'],
      },
      {
        category: 'Workflow & Approvals',
        tools: ['Slack & Teams Alerts', 'One-Click Sign-Off', 'Vendor Renewal Tracker', 'Immutable Audit Log'],
      },
      {
        category: 'Data Privacy & Security',
        tools: ['Zero External Training', 'Private Vault Storage', 'Role-Based Access', 'Encrypted Document Archive'],
      },
    ],
    relatedSlugs: ['vireon-threat-center', 'real-estate-investment-platform'],
    accentColor: 'indigo',
    abstractGraphicType: 'shield',
  },
  {
    id: 'cs-vireon-threat-center',
    slug: 'vireon-threat-center',
    title: 'Vireon Threat Center: 24/7 Business Security Monitoring & Instant Threat Protection',
    client: 'Vireon Security & MSSP Global',
    clientProfile: {
      name: 'Vireon Defense Technologies',
      industry: '24/7 Managed Cybersecurity & Cloud Protection',
      companySize: 'Enterprise (2,400+ Connected Devices)',
      location: 'New York, NY & Frankfurt, DE',
      timeframe: '90-Day Rollout',
    },
    industry: 'Financial Services',
    service: 'Cybersecurity & Zero Trust',
    tagline:
      'Bringing all your cloud alerts, employee login checks, compliance tracking, and backup recovery into one clear 24/7 security command center.',
    summary:
      'Vireon replaced a tangle of separate security screens with one easy-to-read command center that watches over 40.3 million daily activity events, blocks suspicious logins automatically, and keeps safe backups ready to restore.',
    heroStats: [
      {
        value: '40.3M',
        label: 'Daily Security Checks',
        detail: 'Continuous monitoring across AWS and Azure cloud accounts',
        trend: 'up',
      },
      {
        value: '78%',
        label: 'Stronger Protection Score',
        detail: 'Consistent multi-factor login and access rules for every team member',
        trend: 'up',
      },
      {
        value: '4.0 hrs',
        label: 'Full Recovery Guarantee',
        detail: 'Protected backups that can restore core business systems fast',
        trend: 'down',
      },
      {
        value: '15 mins',
        label: 'Backup Save Window',
        detail: 'Automatic encrypted snapshots saved every 15 minutes',
        trend: 'down',
      },
    ],
    challenge: {
      headline: 'Too Many Separate Security Screens Made It Hard to Spot Real Threats Fast',
      description:
        'As the company grew across multiple cloud services and offices, the security team had to jump between half a dozen different dashboards just to investigate a single suspicious login. Valuable time was lost piecing together clues, and preparing for routine security audits took weeks of manual work.',
      bulletPoints: [
        'Switching between separate tools slowed down urgent security responses by up to 45 minutes.',
        'Employee login alerts were separated from laptop security alerts, making it hard to see the full picture.',
        'Gathering proof for quarterly security audits took over 120 hours of staff time.',
        'Too many repetitive, low-priority alerts made it harder for analysts to focus on real risks.',
      ],
    },
    solution: {
      headline: 'One Clear 24/7 Security Dashboard with Automatic Threat Blocking',
      description:
        'We built the Vireon Threat Center — a single visual workspace that connects cloud monitoring, device protection, compliance checklists, and automatic backups so the team can spot and stop threats in seconds.',
      phases: [
        {
          phaseNumber: '01',
          title: 'Bring All Security Alerts into One View',
          description:
            'Connected cloud accounts, office networks, and employee login systems into a single live feed that filters out noise and highlights what matters.',
          deliverable: 'Unified security feed that groups related alerts automatically',
        },
        {
          phaseNumber: '02',
          title: 'One-Click Protection & Login Lockdowns',
          description:
            'Set up automatic safety rules that isolate affected laptops and pause suspicious user accounts the moment an attack is detected.',
          deliverable: 'Instant containment playbooks that stop threats in under 60 seconds',
        },
        {
          phaseNumber: '03',
          title: 'Automated Audit Tracking & Safe Backups',
          description:
            'Added live compliance tracking for SOC 2 and NIST standards alongside tamper-proof cloud backups that are tested every 15 minutes.',
          deliverable: 'Always-ready audit dashboard and verified disaster recovery vault',
        },
      ],
      architecturalFeatures: [
        {
          title: 'Live Cloud Traffic Comparison',
          description:
            'Easy-to-read visual charts comparing AWS and Azure activity so teams can spot unusual spikes right away.',
          iconName: 'telemetry',
        },
        {
          title: 'Global Threat Activity Map',
          description:
            'Interactive globe showing where incoming threats originate and blocking them with a single click.',
          iconName: 'globe',
        },
        {
          title: 'Step-by-Step Incident Tracker',
          description:
            'Clear visual ring showing every stage of response — from detection to containment and full recovery.',
          iconName: 'radar',
        },
        {
          title: 'Views Tailored for Every Role',
          description:
            'Custom summaries for executives, security analysts, and IT operations managers.',
          iconName: 'users',
        },
      ],
    },
    results: {
      headline: 'Threats Stopped in Under a Minute, Stress-Free Audits, and Zero Ransomware Downtime',
      description:
        'Vireon moved from chasing noisy alerts across multiple tabs to proactive, automated protection that keeps the business running safely around the clock.',
      metrics: [
        {
          value: '40.3M',
          label: 'Daily Events Checked',
          detail: 'Watched automatically 24/7',
          trend: 'up',
        },
        {
          value: '< 60s',
          label: 'Time to Stop Threats',
          detail: 'Improved from 45 minutes',
          trend: 'down',
        },
        {
          value: '96%',
          label: 'Compliance Readiness',
          detail: 'Tracked automatically every day',
          trend: 'up',
        },
        {
          value: '0',
          label: 'Business Disruptions',
          detail: 'Over 12 straight months',
          trend: 'neutral',
        },
      ],
      businessOutcomes: [
        'Cut the time to spot a potential issue from over 4 hours down to under 3 minutes.',
        'Automated 92% of routine alert checks so senior specialists can focus on high-value protection.',
        'Completed annual SOC 2 security audits smoothly with zero customer downtime.',
        'Guaranteed business continuity with tamper-proof backups verified every 15 minutes.',
      ],
    },
    testimonial: {
      quote:
        'The Vireon Threat Center gives our leadership and security teams instant clarity. We can see cloud health, stop suspicious logins, and prove compliance in one place — saving hundreds of hours every quarter.',
      author: 'Noah Turner',
      title: 'Head of Cybersecurity Operations',
      company: 'Vireon Defense Global',
    },
    techStack: [
      {
        category: 'Cloud & Network Monitoring',
        tools: ['Elastic SIEM', 'AWS Security Hub', 'Azure Sentinel', 'Live Traffic Inspector'],
      },
      {
        category: 'Login & Device Safety',
        tools: ['CrowdStrike Falcon', 'Microsoft Defender', 'Okta Access Control', 'Hardware MFA Keys'],
      },
      {
        category: 'Compliance & Audits',
        tools: ['Vanta SOC 2 Automation', 'NIST Security Framework', 'CMMC Readiness', 'AWS Audit Manager'],
      },
      {
        category: 'Backups & Recovery',
        tools: ['Immutable Cloud Vault', 'Veeam Backup', 'Encrypted Snapshots', 'Instant Failover'],
      },
    ],
    relatedSlugs: ['compliance-legal-agent', 'real-estate-investment-platform'],
    accentColor: 'cyan',
    abstractGraphicType: 'shield',
  },
  {
    id: 'cs-real-estate-investment',
    slug: 'real-estate-investment-platform',
    title: 'Real Estate Investment Platform: Easy Fractional Property Investing & Live Return Tracking',
    client: 'Global Real Estate Investment Platform',
    clientProfile: {
      name: 'Investment Global Capital Partners',
      industry: 'Modern Real Estate & Property Investing',
      companySize: 'Asset Management ($380M+ Managed)',
      location: 'New York, London & Singapore',
      timeframe: '60-Day Rollout',
    },
    industry: 'Financial Services',
    service: 'High-Throughput Data & DevOps',
    tagline:
      'Making it simple for everyday investors and family offices to buy fractional shares of premier properties, collect rental income, and compare returns in real time.',
    summary:
      'A clean, modern web platform that lets investors start with as little as $50, browse vetted residential and commercial properties, receive automated rental payouts, and compare property performance against standard U.S. Treasury rates.',
    heroStats: [
      {
        value: '$142,850',
        label: 'Average Investor Portfolio',
        detail: 'Spread across 8 vetted residential and commercial properties',
        trend: 'up',
      },
      {
        value: '+12.4%',
        label: 'Projected Annual Return',
        detail: 'Combining monthly rental income with long-term property value growth',
        trend: 'up',
      },
      {
        value: '4.18%',
        label: 'U.S. Treasury Comparison',
        detail: 'Live side-by-side comparison with 10-year government bond rates',
        trend: 'neutral',
      },
      {
        value: '+2.20%',
        label: 'Extra Yield Advantage',
        detail: 'Higher net property return compared to standard government bonds',
        trend: 'up',
      },
    ],
    challenge: {
      headline: 'High Minimum Investments, Slow Paperwork, and Hard-to-Compare Property Numbers',
      description:
        'Traditionally, investing in high-quality commercial or apartment buildings required $50,000+ upfront, weeks of legal paperwork, and confusing spreadsheets. Investors had no easy way to check building occupancy, track monthly rent payouts, or compare property returns against safe government bonds.',
      bulletPoints: [
        'Complicated spreadsheets made it hard to compare property returns against standard bank or bond rates.',
        'Long identity checks and paper forms caused many interested investors to drop off before finishing sign-up.',
        'Investors were locked in for 5 to 7 years with no simple way to buy or sell smaller shares.',
        'Lack of clear, up-to-date numbers on building occupancy, rent collection, and maintenance reserves.',
      ],
    },
    solution: {
      headline: 'An All-in-One Property Dashboard with $50 Entry Shares and Automatic Rent Payouts',
      description:
        'We created an interactive 5-panel investment workspace where users can explore vetted properties in New York and Miami, buy fractional shares in minutes, watch rental income arrive automatically, and compare yields at a glance.',
      phases: [
        {
          phaseNumber: '01',
          title: 'Simple Legal Structure & Automatic Rent Payouts',
          description:
            'Set up regulated property shares with automated payout rails so rental income goes straight to each investor’s account without manual bookkeeping.',
          deliverable: 'Compliant fractional ownership system with automated rent distributions',
        },
        {
          phaseNumber: '02',
          title: 'Interactive Property Marketplace & Portfolio View',
          description:
            'Designed a clean visual dashboard showing live property deals, building amenities, occupancy rates, and an easy secondary market for trading shares.',
          deliverable: '6-view web application covering Marketplace, My Properties, Auctions, and Wallet',
        },
        {
          phaseNumber: '03',
          title: 'Live Market Comparison & Return Calculator',
          description:
            'Added live financial feeds that compare property rental yields (6.38%) directly against 10-year U.S. Treasury rates so investors can make informed decisions.',
          deliverable: 'Interactive comparison chart with magnifying loupe and cash-flow health indicators',
        },
      ],
      architecturalFeatures: [
        {
          title: 'One-Click Workspace Switching',
          description:
            'Smooth transitions between your Portfolio, Property Marketplace, Live Auctions, and Payout Wallet.',
          iconName: 'layout',
        },
        {
          title: 'Interactive Return Comparison Chart',
          description:
            'Built-in magnifier tool that lets investors compare property yields against government bond rates on any date.',
          iconName: 'trending',
        },
        {
          title: 'Clear Investor Journey Tracker',
          description:
            'Visual guide showing every step from account sign-up to buying your first property share and collecting rent.',
          iconName: 'journey',
        },
        {
          title: 'Tailored Views for Every Investor',
          description:
            'Personalized dashboards whether you are a first-time $50 investor, a financial advisor, or a family office.',
          iconName: 'persona',
        },
      ],
    },
    results: {
      headline: '94% Sign-Up Completion, 4,200+ Active Investors, and Effortless Rent Distributions',
      description:
        'The new platform opened premier real estate to everyday investors starting at $50 while giving larger wealth managers the clear performance numbers they need.',
      metrics: [
        {
          value: '94%',
          label: 'Fast Sign-Up Completion',
          detail: 'Account verification in under 90 seconds',
          trend: 'up',
        },
        {
          value: '6.38%',
          label: 'Average Net Rental Yield',
          detail: 'Across all active properties',
          trend: 'up',
        },
        {
          value: '1.72x',
          label: 'Healthy Cash-Flow Buffer',
          detail: 'Strong rental coverage above mortgage costs',
          trend: 'up',
        },
        {
          value: '100%',
          label: 'Building Occupancy',
          detail: 'Across premier NYC & Miami properties',
          trend: 'neutral',
        },
      ],
      businessOutcomes: [
        'Welcomed over 4,200 active investors buying fractional shares starting at just $50.',
        'Automated rental payouts, eliminating weeks of manual quarterly accounting work.',
        'Helped investors clearly see how property returns stack up against interest rates in real time.',
        'Maintained 100% on-time rent reporting and full transparency on building occupancy.',
      ],
    },
    testimonial: {
      quote:
        'This interactive dashboard makes property investing effortless to understand. Being able to compare rental returns directly against U.S. Treasury rates in plain language gives our investors total confidence.',
      author: 'Sophia Wilson',
      title: 'Principal Investor & Product Lead',
      company: 'Global Investment Asset Platform',
    },
    techStack: [
      {
        category: 'Interactive Web Experience',
        tools: ['React 18', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'Interactive SVG Charts'],
      },
      {
        category: 'Financial & Market Data',
        tools: ['Federal Reserve Rate Feed', 'U.S. Treasury Benchmarks', 'Instant Bank Linking', 'Automated Payouts'],
      },
      {
        category: 'Property & Legal Compliance',
        tools: ['SEC Reg D & Reg S', 'Delaware Property LLCs', 'Verified Reserve Proofs', 'Automated Tax Docs'],
      },
      {
        category: 'Account Safety & Verification',
        tools: ['Institutional Custody', 'SOC 2 Certified Hosting', 'Stripe Identity', '90-Second KYC Check'],
      },
    ],
    relatedSlugs: ['compliance-legal-agent', 'vireon-threat-center'],
    accentColor: 'blue',
    abstractGraphicType: 'pipeline',
  },
];
