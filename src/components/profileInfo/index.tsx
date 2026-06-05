import React from "react";
import { ExternalLink, Mail, UserRound } from "lucide-react";
import profileMarkdown from "../../../profile.md?raw";

const isUrl = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());

const renderInlineLinks = (text: string) => {
  const parts = text.split(/(https?:\/\/\S+)/g);

  return parts.map((part, index) => {
    if (isUrl(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 hover:text-emerald-500"
        >
          {part}
        </a>
      );
    }

    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
};

const profileBlocks = profileMarkdown
  .split(/\r?\n\r?\n+/)
  .map((block) => block.trim())
  .filter(Boolean);

export const ProfileInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-[0_25px_100px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-8 py-8 md:px-10 md:py-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%)]">
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-400">
            <UserRound className="w-4 h-4" />
            Owner Profile
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white">
            About the site owner
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A short profile for the person behind GPTX.VIP, sourced from the local <code>profile.md</code> file.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <Mail className="w-4 h-4" />
            aliyan@gptx.vip
          </div>
        </div>

        <div className="px-8 py-8 md:px-10 md:py-10 space-y-5">
          {profileBlocks.map((block, blockIndex) => {
            const lines = block
              .split(/\r?\n/)
              .map((line) => line.trim())
              .filter(Boolean);

            const headingLine = lines[0]?.endsWith(":") ? lines[0].slice(0, -1) : null;
            const bodyLines = headingLine ? lines.slice(1) : lines;

            if (bodyLines.length === 1 && isUrl(bodyLines[0])) {
              return (
                <a
                  key={`profile-block-${blockIndex}`}
                  href={bodyLines[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-5 py-4 text-sm text-zinc-700 dark:text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <span className="truncate">{bodyLines[0]}</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              );
            }

            return (
              <section
                key={`profile-block-${blockIndex}`}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-5 py-5"
              >
                {headingLine && (
                  <h2 className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-zinc-100">
                    {headingLine}
                  </h2>
                )}
                <div className="space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {bodyLines.map((line, lineIndex) => (
                    <p key={`profile-line-${blockIndex}-${lineIndex}`}>
                      {renderInlineLinks(line)}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
