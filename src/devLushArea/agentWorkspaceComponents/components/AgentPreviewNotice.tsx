import React from 'react';

interface AgentPreviewNoticeProps {
  title?: string;
  children: React.ReactNode;
}

const AgentPreviewNotice: React.FC<AgentPreviewNoticeProps> = ({
  title = 'Illustrative preview',
  children,
}) => (
  <aside role="note" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
    <strong>{title}.</strong> {children}
  </aside>
);

export default AgentPreviewNotice;
