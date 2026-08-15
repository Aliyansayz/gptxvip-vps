import React, { useState } from "react";
import {
  ExternalLink,
  Mail,
  UserRound,
  GraduationCap,
  Shield,
  Cpu,
  Gamepad2,
  Terminal,
  Brain,
  Sparkles,
  MapPin,
  Copy,
  Check,
  Award,
  ArrowUpRight,
  Code2,
  Briefcase,
  Layers,
  Fingerprint
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

// Static profile data extracted and curated from profile.md
const BIO_TEXT =
  "Highly adaptive and versatile professional. Done work mainly in Python programming and data science to build complex, high-performance applications. By leveraging advanced AI technologies, Aliyan has developed deep expertise across multiple domains, including visual UI/UX design, prompt engineering, and intelligent information summarization. Passionate about system engineering, technical writing, and travel blogging.";

interface FocusGroup {
  label: string;
  items: string[];
}

interface EducationQualification {
  id: string;
  type: string;
  title: string;
  institution: string;
  period: string;
  status: string;
  badge: string;
  metricLabel: string;
  metricValue: string;
  description: string;
  transcriptUrl?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgGradient: string;
  borderClass: string;
  textClass: string;
  glowColor: string;
  progress: number;
  focusGroups?: FocusGroup[];
}

const EDUCATION_QUALIFICATIONS: EducationQualification[] = [
  {
    id: "undergrad",
    type: "Undergraduate Degree",
    title: "Computer Science",
    institution: "Federal Chartered Virtual University Pakistan",
    period: "",
    status: "Completed",
    badge: "With Honors & Distinctions",
    focusGroups: [
      {
        label: "Primary Focus",
        items: ["Computer Science Degree"],
      },
    ],
    metricLabel: "Academic Performance",
    metricValue: "3.2 / 4.0 CGPA",
    description: "Comprehensive study covering computer science fundamentals, data structures, algorithms, databases, and software engineering principles.",
    icon: GraduationCap,
    colorClass: "emerald",
    bgGradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    borderClass: "border-emerald-500/20 hover:border-emerald-500/40 dark:border-emerald-400/20 dark:hover:border-emerald-400/40",
    textClass: "text-emerald-600 dark:text-emerald-400",
    glowColor: "rgba(16,185,129,0.15)",
    progress: 100,
  },
  {
    id: "rit-cyber",
    type: "MicroMaster Program",
    title: "Cybersecurity",
    institution: "Rochester Institute Of Technology",
    period: "2026 - Ongoing",
    status: "In Progress",
    badge: "2/4 Completed",
    focusGroups: [
      {
        label: "Secondary Focus",
        items: ["Cybersecurity MicroMaster"],
      },
    ],
    metricLabel: "Program Progress",
    metricValue: "50% Completed",
    description: "Advanced learning in systems security, network defense, cryptography, digital forensics, and cybersecurity risk management.",
    transcriptUrl: "http://credentials.edx.org/records/programs/shared/51f90ae7b2a54a099dbcfd34e79eaae7/",
    icon: Shield,
    colorClass: "cyan",
    bgGradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    borderClass: "border-cyan-500/20 hover:border-cyan-500/40 dark:border-cyan-400/20 dark:hover:border-cyan-400/40",
    textClass: "text-cyan-600 dark:text-cyan-400",
    glowColor: "rgba(6,182,212,0.15)",
    progress: 50,
  },
  {
    id: "esports",
    type: "Professional Program",
    title: "Esports Management & Game Development",
    institution: "edX Platform",
    period: "2025",
    status: "Completed",
    badge: "Transcript Verified",
    focusGroups: [
      {
        label: "Enthusiasm",
        items: ["Internet of Things", "Game Development"],
      },
    ],
    metricLabel: "Verification Status",
    metricValue: "Completed (2025)",
    description: "Focused on game architecture, tournament logistics, player ecosystems, publishing pipelines, and business strategies.",
    transcriptUrl: "https://credentials.edx.org/records/programs/shared/f69a6ea7bddc486aacff525d96ebb041",
    icon: Gamepad2,
    colorClass: "rose",
    bgGradient: "from-rose-500/10 via-rose-500/5 to-transparent",
    borderClass: "border-rose-500/20 hover:border-rose-500/40 dark:border-rose-400/20 dark:hover:border-rose-400/40",
    textClass: "text-rose-600 dark:text-rose-400",
    glowColor: "rgba(244,63,94,0.15)",
    progress: 100,
  },
  {
    id: "curtin-iot",
    type: "MicroMaster Program",
    title: "Internet Of Things",
    institution: "Curtin University",
    period: "2024",
    status: "Partially Completed",
    badge: "Specialized Modules",
    metricLabel: "Acquired Competency",
    metricValue: "Partial Complete",
    description: "Explored sensor networks, microcontroller boards, wireless communication protocols, and cloud computing architectures for IoT devices.",
    transcriptUrl: "https://credentials.edx.org/records/programs/shared/3138c42ace2a4d13980fc95865f0017c",
    icon: Cpu,
    colorClass: "indigo",
    bgGradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    borderClass: "border-indigo-500/20 hover:border-indigo-500/40 dark:border-indigo-400/20 dark:hover:border-indigo-400/40",
    textClass: "text-indigo-600 dark:text-indigo-400",
    glowColor: "rgba(99,102,241,0.15)",
    progress: 35,
  },
  {
    id: "data-science-python",
    type: "Professional Certificate",
    title: "Data Science Python Specialization",
    institution: "edX Platform",
    period: "",
    status: "Verified",
    badge: "Credential Recorded",
    focusGroups: [
      {
        label: "Primary Focus",
        items: ["Data Science Python Specialization"],
      },
    ],
    metricLabel: "Verification",
    metricValue: "Verified",
    description: "Python-centered data science training covering analysis, modeling, and practical applied workflows.",
    transcriptUrl: "https://credentials.edx.org/records/programs/shared/b991e407d0824b33b2fc8e7566b0388c/",
    icon: Code2,
    colorClass: "amber",
    bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    borderClass: "border-amber-500/20 hover:border-amber-500/40 dark:border-amber-400/20 dark:hover:border-amber-400/40",
    textClass: "text-amber-600 dark:text-amber-400",
    glowColor: "rgba(245,158,11,0.15)",
    progress: 100,
  },
];

const SKILL_CATEGORIES = [
  {
    title: "Core Technologies",
    icon: Terminal,
    color: "from-cyan-500/20 to-blue-500/20",
    textColor: "text-cyan-500 dark:text-cyan-400",
    skills: ["Python Programming", "Data Science & Analytics", "Algorithmic Development"],
  },
  {
    title: "AI & UX Architecture",
    icon: Brain,
    color: "from-purple-500/20 to-pink-500/20",
    textColor: "text-purple-500 dark:text-purple-400",
    skills: ["AI Engineering & Prompting", "UI/UX Interface Design", "Information Summarization"],
  },
  {
    title: "Domain Integration",
    icon: Layers,
    color: "from-amber-500/20 to-orange-500/20",
    textColor: "text-amber-500 dark:text-amber-400",
    skills: ["Agentic Coding", "Frontend Visual Development", "Report Making", "System Design"],
  },
];

const sanitizeYears = (str: string, showYears: boolean): string => {
  if (showYears) return str;
  let cleaned = str.replace(/\b\d{4}\b/g, "").trim();
  cleaned = cleaned.replace(/^\s*-\s*|\s*-\s*$/g, "");
  cleaned = cleaned.replace(/\s*-\s*/g, " - ");
  cleaned = cleaned.replace(/\(\s*\)/g, "");
  return cleaned.trim();
};

interface ProfileInfoProps {
  showYears?: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ showYears = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("aliyan@gptx.vip");
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-10">
      {/* Hero Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl shadow-[0_25px_100px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_100px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        {/* Dynamic mesh gradients for aesthetic backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_35%)] pointer-events-none" />

        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Visual Avatar Element */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500" />
              <div className="relative w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 border-2 border-white dark:border-zinc-950 flex items-center justify-center shadow-inner overflow-hidden">
                <UserRound className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  SYSTEM OWNER
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  DEVELOPER
                </span>
              </div>

              <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
                Aliyan Anwar
              </h1>

              <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm md:text-base font-mono flex items-center justify-center md:justify-start gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                <span>System Architect & AI Engineer</span>
              </p>
            </div>
          </div>

          {/* Action and Contact links */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>aliyan@gptx.vip</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
              )}
            </button>

            <a
              href="https://www.credly.com/users/aliyan-anwar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-50 text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Credly Profile</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Grid of Profile Bio & Skill Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Bio */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/30 p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
              <UserRound className="w-4 h-4" /> About Aliyan
            </h2>
            <div className="relative">
              <span className="absolute -top-6 -left-3 text-7xl font-serif text-emerald-500/10 pointer-events-none">“</span>
              <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-light relative z-10">
                {BIO_TEXT}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Versatile execution skillset across engineering & layout designs</span>
          </div>
        </motion.div>

        {/* Skill Matrix */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/30 p-8 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Core Competence
          </h2>

          <div className="space-y-6">
            {SKILL_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    <Icon className={`w-4 h-4 ${category.textColor}`} />
                    <span className="font-display uppercase tracking-wider text-xs">{category.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300 transform hover:scale-[1.03] select-none"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Qualifications Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 mb-2">
              ACADEMIC & PROFESSIONAL CREDENTIALS
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Verified education history and certifications acquired or in progress.
            </p>
          </div>
        </div>

        {/* Qualifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EDUCATION_QUALIFICATIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
                className={`relative rounded-3xl border ${item.borderClass} bg-white/40 dark:bg-zinc-950/40 p-6 md:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden group`}
                style={{
                  boxShadow: `0 4px 30px rgba(0,0,0,0.01)`
                }}
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${item.glowColor}, transparent)`
                  }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top line with Icon and badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className={`p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 ${item.textClass} transition-colors group-hover:scale-110 duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50`}>
                      {item.type}
                    </span>
                  </div>

                  {/* Institution and Title */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      {item.institution}
                    </p>
                    <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white font-display">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-light">
                    {item.description}
                  </p>

                  {item.focusGroups ? (
                    <div className="space-y-3">
                      {item.focusGroups.map((group) => (
                        <div key={group.label} className="space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
                            {group.label}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {group.items.map((focusItem) => (
                              <span
                                key={focusItem}
                                className="px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60"
                              >
                                {focusItem}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Progress, Metrics and Actions */}
                <div className="relative z-10 mt-6 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                  {/* Performance / Completion status */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">{item.metricLabel}:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">
                      {sanitizeYears(item.metricValue, showYears)}
                    </span>
                  </div>

                  {/* Custom progress indicator bar */}
                  <div className="h-1.5 w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${item.colorClass === "emerald"
                        ? "bg-emerald-500"
                        : item.colorClass === "cyan"
                          ? "bg-cyan-500"
                          : item.colorClass === "indigo"
                            ? "bg-indigo-500"
                            : "bg-rose-500"
                        }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  {/* Actions (Transcript Verification link) */}
                  <div className="flex items-center justify-between text-xs pt-2">
                    {sanitizeYears(item.period, showYears) ? (
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px]">
                        Timeline: {sanitizeYears(item.period, showYears)}
                      </span>
                    ) : (
                      <span />
                    )}

                    {item.transcriptUrl ? (
                      <a
                        href={item.transcriptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 font-bold hover:underline transition-colors ${item.textClass}`}
                      >
                        <span>Verify Transcript</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-600 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Verified Record
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
