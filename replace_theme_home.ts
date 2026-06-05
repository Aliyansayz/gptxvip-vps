import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (filepath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

walk('./src/components/homeMainView', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf-8');
  content = content.replace(/bg-emerald-950/g, 'bg-zinc-900');
  content = content.replace(/border-emerald-800\/50/g, 'border-zinc-800');
  content = content.replace(/border-emerald-800/g, 'border-zinc-700');
  content = content.replace(/border-emerald-700/g, 'border-zinc-700');
  content = content.replace(/text-emerald-300/g, 'text-zinc-300');
  content = content.replace(/bg-emerald-900\/50/g, 'bg-zinc-800/50');
  content = content.replace(/text-emerald-500/g, 'text-zinc-400');
  content = content.replace(/hover:text-emerald-300/g, 'hover:text-cyan-400');
  content = content.replace(/bg-\[#00ff41\]/g, 'bg-cyan-500');
  content = content.replace(/text-emerald-950/g, 'text-black');
  content = content.replace(/shadow-\[0_0_10px_#00ff41\]/g, 'shadow-[0_0_15px_rgba(6,182,212,0.5)]');
  content = content.replace(/shadow-\[0_0_15px_rgba\(52,211,153,0.5\)\]/g, 'shadow-[0_0_15px_rgba(34,211,238,0.5)]');
  content = content.replace(/text-emerald-400/g, 'text-cyan-400');
  content = content.replace(/text-emerald-200\/70/g, 'text-cyan-100/70');
  content = content.replace(/text-emerald-100/g, 'text-cyan-50');
  content = content.replace(/bg-emerald-900\/30/g, 'bg-cyan-900/20');
  content = content.replace(/bg-emerald-900/g, 'bg-zinc-800');
  content = content.replace(/focus:ring-emerald-500/g, 'focus:ring-cyan-500');
  content = content.replace(/focus:border-emerald-500/g, 'focus:border-cyan-500');
  content = content.replace(/hover:bg-emerald-800/g, 'hover:bg-zinc-700');
  content = content.replace(/border-emerald-900/g, 'border-zinc-800');
  content = content.replace(/border-emerald-500/g, 'border-cyan-500');
  content = content.replace(/bg-emerald-800/g, 'bg-zinc-700');
  content = content.replace(/text-emerald-200/g, 'text-zinc-200');
  content = content.replace(/accent-emerald-500/g, 'accent-cyan-500');
  content = content.replace(/text-emerald-50/g, 'text-cyan-50');
  content = content.replace(/emerald/g, 'cyan'); // fallback for any remaining green touches
  content = content.replace(/0, 255, 65/g, '34, 211, 238'); // specific rgba fix
  content = content.replace(/#00ff41/g, 'rgba(34,211,238,1)'); // hex cyan
  fs.writeFileSync(filepath, content);
});
console.log('UI theme replaced in homeMainView.');
