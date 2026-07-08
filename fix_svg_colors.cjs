const fs = require('fs');
const file = '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/agentTypes/AgentOverviewActivity.tsx';
let code = fs.readFileSync(file, 'utf8');

const map = {
  'hsl(var(--primary))': '#6366f1',
  'hsl(var(--primary)/0.1)': 'rgba(99, 102, 241, 0.1)',
  'hsl(var(--primary)/0.2)': 'rgba(99, 102, 241, 0.2)',
  'hsl(var(--accent-foreground))': '#8b5cf6',
  'hsl(var(--accent-foreground)/0.2)': 'rgba(139, 92, 246, 0.2)',
  'hsl(var(--accent)/0.2)': 'rgba(167, 139, 250, 0.2)',
  'hsl(var(--destructive))': '#ef4444',
  'hsl(var(--destructive)/0.5)': 'rgba(239, 68, 68, 0.5)',
  'hsl(var(--success-DEFAULT, #22c55e))': '#22c55e',
  'hsl(var(--warning-DEFAULT, #eab308))': '#eab308',
  'hsl(var(--border))': '#334155',
  'hsl(var(--card))': '#1e293b',
  'hsl(var(--muted))': '#0f172a',
  'hsl(var(--muted-foreground))': '#94a3b8',
  'hsl(var(--foreground))': '#f8fafc',
  'hsl(var(--primary-foreground))': '#ffffff',
};

for (const [key, value] of Object.entries(map)) {
  const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  code = code.replace(new RegExp(safeKey, 'g'), value);
}

fs.writeFileSync(file, code);
console.log("Colors fixed.");
