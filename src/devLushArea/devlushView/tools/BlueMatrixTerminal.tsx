import React, { ReactNode } from 'react';

type TerminalTheme = 'blue' | 'green' | 'red' | 'purple' | 'amber';

interface BlueMatrixTerminalProps {
  theme?: TerminalTheme;
  title?: string;
  osName?: string;
  children?: ReactNode;
  height?: string;
}

const themeColors: Record<TerminalTheme, any> = {
  blue: {
    bg: '#020912',
    bgLight: '#0b2b5d',
    border: '#00c8ff',
    borderLight: 'rgba(0,180,255,0.3)',
    borderInner: 'rgba(0,150,255,0.15)',
    gridLine: 'rgba(0,180,255,0.08)',
    scanline: 'rgba(0,200,255,0.08)',
    titlebarBg: '#04101f',
    titleText: '#8bdfff',
    contentBg: 'rgba(2,12,25,0.92)',
    textPrimary: '#8be8ff',
    textSecondary: '#84d6ff',
    textPrompt: '#2ef4ff',
    textPath: '#59a8ff',
    cursor: '#6ee7ff',
    glowBase: '#00d0ff',
    glowLogo: '#00ccff',
    logoText: '#9ef4ff',
  },
  green: {
    bg: '#021209',
    bgLight: '#0b5d2b',
    border: '#00ff41',
    borderLight: 'rgba(0,255,65,0.3)',
    borderInner: 'rgba(0,255,65,0.15)',
    gridLine: 'rgba(0,255,65,0.08)',
    scanline: 'rgba(0,255,65,0.08)',
    titlebarBg: '#041f0a',
    titleText: '#8bffb2',
    contentBg: 'rgba(2,25,12,0.92)',
    textPrimary: '#8bffb2',
    textSecondary: '#66cc8c',
    textPrompt: '#00ff41',
    textPath: '#33ff66',
    cursor: '#00ff41',
    glowBase: '#00ff41',
    glowLogo: '#00ff41',
    logoText: '#8bffb2',
  },
  red: {
    bg: '#120202',
    bgLight: '#5d0b0b',
    border: '#ff0033',
    borderLight: 'rgba(255,0,51,0.3)',
    borderInner: 'rgba(255,0,51,0.15)',
    gridLine: 'rgba(255,0,51,0.08)',
    scanline: 'rgba(255,0,51,0.08)',
    titlebarBg: '#1f0404',
    titleText: '#ff8b8b',
    contentBg: 'rgba(25,2,2,0.92)',
    textPrimary: '#ff8b8b',
    textSecondary: '#cc6666',
    textPrompt: '#ff0033',
    textPath: '#ff3366',
    cursor: '#ff0033',
    glowBase: '#ff0033',
    glowLogo: '#ff0033',
    logoText: '#ff8b8b',
  },
  purple: {
    bg: '#090212',
    bgLight: '#2b0b5d',
    border: '#b800ff',
    borderLight: 'rgba(184,0,255,0.3)',
    borderInner: 'rgba(184,0,255,0.15)',
    gridLine: 'rgba(184,0,255,0.08)',
    scanline: 'rgba(184,0,255,0.08)',
    titlebarBg: '#10041f',
    titleText: '#df8bff',
    contentBg: 'rgba(12,2,25,0.92)',
    textPrimary: '#df8bff',
    textSecondary: '#b266cc',
    textPrompt: '#b800ff',
    textPath: '#cc33ff',
    cursor: '#b800ff',
    glowBase: '#b800ff',
    glowLogo: '#b800ff',
    logoText: '#df8bff',
  },
  amber: {
    bg: '#120902',
    bgLight: '#5d3b0b',
    border: '#ffb300',
    borderLight: 'rgba(255,179,0,0.3)',
    borderInner: 'rgba(255,179,0,0.15)',
    gridLine: 'rgba(255,179,0,0.08)',
    scanline: 'rgba(255,179,0,0.08)',
    titlebarBg: '#1f1304',
    titleText: '#ffdf8b',
    contentBg: 'rgba(25,14,2,0.92)',
    textPrimary: '#ffdf8b',
    textSecondary: '#ccb366',
    textPrompt: '#ffb300',
    textPath: '#ffcc33',
    cursor: '#ffb300',
    glowBase: '#ffb300',
    glowLogo: '#ffb300',
    logoText: '#ffdf8b',
  }
};

const BlueMatrixTerminal: React.FC<BlueMatrixTerminalProps> = ({
  theme = 'blue',
  title = 'BLUE MATRIX TERMINAL',
  osName = 'CYBER MATRIX OS',
  children,
  height = '550px'
}) => {
  const colors = themeColors[theme];

  return (
    <div 
      className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-xl"
      style={{
        background: `radial-gradient(circle at top, ${colors.bgLight}, ${colors.bg} 70%)`,
        minHeight: height
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gridMove {
          from { transform: translateY(0); }
          to { transform: translateY(40px); }
        }
        @keyframes scanner {
          to { top: 100%; }
        }
        @keyframes cursorBlink {
          50% { opacity: 0; }
        }
        .matrix-grid-${theme} {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(${colors.gridLine} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.gridLine} 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 10s linear infinite;
        }
        .matrix-scrollbar-${theme}::-webkit-scrollbar {
          width: 8px;
        }
        .matrix-scrollbar-${theme}::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 20px;
        }
        .matrix-scrollbar-${theme}::-webkit-scrollbar-track {
          background: ${colors.titlebarBg};
        }
      `}} />

      {/* Animated Grid */}
      <div className={`matrix-grid-${theme} pointer-events-none`}></div>

      {/* Terminal */}
      <div 
        className="relative w-full max-w-[900px] rounded-[14px] overflow-hidden backdrop-blur-[10px] m-4 z-10 font-mono"
        style={{
          height: height,
          background: colors.contentBg,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 20px ${colors.border}, 0 0 60px ${colors.borderLight}, inset 0 0 20px ${colors.borderInner}`
        }}
      >
        
        {/* Scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'repeating-linear-gradient(transparent 0px, rgba(255,255,255,.015) 2px, transparent 4px)'
          }}
        ></div>

        {/* Scanner animation */}
        <div 
          className="absolute top-[-100%] left-0 w-full h-full z-20 pointer-events-none"
          style={{
            background: `linear-gradient(transparent, ${colors.scanline}, transparent)`,
            animation: 'scanner 4s linear infinite'
          }}
        ></div>

        {/* Titlebar */}
        <div 
          className="h-[48px] flex items-center px-[18px] border-b relative z-30"
          style={{
            background: colors.titlebarBg,
            borderColor: colors.border
          }}
        >
          <div className="flex gap-[8px]">
            <div className="w-[12px] h-[12px] rounded-full bg-[#ff5f56]"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-[#ffbd2e]"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-[#27c93f]"></div>
          </div>
          <div 
            className="ml-[20px] font-bold tracking-[2px]"
            style={{ color: colors.titleText }}
          >
            {title}
          </div>
        </div>

        {/* Content */}
        <div 
          className={`p-[25px] h-[calc(100%-48px)] overflow-y-auto text-[16px] leading-[1.8] relative z-30 matrix-scrollbar-${theme}`}
          style={{ color: colors.textPrimary }}
        >
          
          <div 
            className="text-[26px] mb-[20px]" 
            style={{ 
              color: colors.logoText,
              textShadow: `0 0 10px ${colors.glowLogo}, 0 0 20px ${colors.glowLogo}` 
            }}
          >
            &gt; {osName}
          </div>

          {children || (
            <>
              <div>
                <span style={{color: colors.textPrompt}}>root</span>@<span style={{color: colors.textPath}}>matrix</span>:~$ <span className="text-white">initialize</span>
              </div>

              <div 
                className="ml-[20px]" 
                style={{ 
                  color: colors.textPrimary,
                  textShadow: `0 0 5px ${colors.glowBase}, 0 0 10px ${colors.glowBase}, 0 0 20px ${colors.glowBase}` 
                }}
              >
                Loading Neural Interface...
              </div>

              <br />

              <div>
                <span style={{color: colors.textPrompt}}>root</span>@<span style={{color: colors.textPath}}>matrix</span>:~$ <span className="text-white">scan network</span>
              </div>

              <div className="ml-[20px]" style={{color: colors.textSecondary}}>
                ✔ 145 Nodes Online<br />
                ✔ Firewall Active<br />
                ✔ Encryption Enabled
              </div>

              <br />

              <div>
                <span style={{color: colors.textPrompt}}>root</span>@<span style={{color: colors.textPath}}>matrix</span>:~$ <span className="text-white">system status</span>
              </div>

              <div className="ml-[20px]" style={{color: colors.textSecondary}}>
                CPU █████████░ 91%<br />
                Memory ███████░░ 74%<br />
                GPU ██████████ 99%<br />
                Temperature 48°C
              </div>

              <br />

              <div>
                <span style={{color: colors.textPrompt}}>root</span>@<span style={{color: colors.textPath}}>matrix</span>:~$ <span className="text-white">waiting...</span>
                <span 
                  className="inline-block w-[10px] h-[18px] align-middle ml-[2px]"
                  style={{ 
                    background: colors.cursor,
                    animation: 'cursorBlink .8s infinite' 
                  }}
                ></span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlueMatrixTerminal;
