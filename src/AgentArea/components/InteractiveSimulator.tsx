import React, { useState, useEffect, useRef } from 'react';
import { InteractiveChart } from './InteractiveChart';
import { RefreshCw, Play, Zap, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { editorialTheme } from '../utils/styles';

interface SimulatorState {
  stress: number;
  yieldStance: 'hawkish' | 'neutral' | 'dovish';
  snbIntervention: 'none' | 'buying';
}

interface InteractiveSimulatorProps {
  title?: string;
  subtitle?: string;
  initialState?: Partial<SimulatorState>;
  onScenarioRun?: (state: SimulatorState) => void;
  isDark?: boolean;
}

const INITIAL_STATE: SimulatorState = {
  stress: 3,
  yieldStance: 'neutral',
  snbIntervention: 'none',
};

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  title = 'Interactive Macro Sandbox',
  subtitle = 'Simulating market shocks & correlation responses',
  initialState,
  onScenarioRun,
  isDark = false,
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;
  const [state, setState] = useState<SimulatorState>({ ...INITIAL_STATE, ...initialState });
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      yAxisID: string;
    }>;
  }>({
    labels: ['T-10d', 'T-8d', 'T-6d', 'T-4d', 'T-2d', 'Current'],
    datasets: [
      {
        label: 'USD/CHF Rate',
        data: [0.9020, 0.8980, 0.8950, 0.8910, 0.8870, 0.8850],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        yAxisID: 'yUsdChf',
      },
      {
        label: 'Gold (XAU/USD $)',
        data: [2580, 2600, 2615, 2630, 2645, 2650],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        yAxisID: 'yGold',
      },
    ],
  });
  const [feedback, setFeedback] = useState<React.ReactNode>(
    'Under normal baseline conditions, USD/CHF and Gold exhibit strong inverse movement driven by natural USD exchange dynamics.'
  );
  const [isRunning, setIsRunning] = useState(false);

  const containerStyle: React.CSSProperties = {
    margin: '3rem 0',
    padding: '2rem',
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
  };

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const controlsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  };

  const controlPanelStyle: React.CSSProperties = {
    backgroundColor: colors.bgSecondary,
    border: `1px solid ${colors.border}`,
    borderRadius: '0.25rem',
    padding: '1.5rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: '0.75rem',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '0.5rem',
  };

  const controlItemStyle: React.CSSProperties = {
    marginBottom: '1.25rem',
  };

  const controlLabelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: colors.textSecondary,
    marginBottom: '0.5rem',
  };

  const sliderContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const sliderStyle: React.CSSProperties = {
    flex: 1,
    accentColor: colors.accent,
  };

  const sliderValueStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.mono,
    fontSize: '0.75rem',
    fontWeight: 700,
    color: colors.text,
    minWidth: '2rem',
    textAlign: 'center',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.6875rem',
    color: colors.text,
    backgroundColor: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: '0.25rem',
    cursor: 'pointer',
  };

  const runButtonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: colors.buttonPrimary,
    color: colors.buttonPrimary === '#1a1a1a' ? '#ffffff' : '#1a1a1a',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.75rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const feedbackStyle: React.CSSProperties = {
    padding: '1rem',
    backgroundColor: colors.bgSecondary,
    borderLeft: `4px solid ${colors.border}`,
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.75rem',
    lineHeight: 1.6,
    color: colors.textSecondary,
  };

  const calculateScenario = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      const { stress, yieldStance, snbIntervention } = state;
      
      let usdChfVal = 0.8850;
      let goldVal = 2650;
      let insightParts: React.ReactNode[] = [];

      const stressImpact = (stress - 3) * 0.008;
      usdChfVal -= stressImpact;
      goldVal += (stress - 3) * 35;

      if (stress > 6) {
        insightParts.push(
          React.createElement('strong', { key: 'high-stress' }, 'High geopolitical stress'),
          ' drives simultaneous Franc appreciation and gold rally.'
        );
      } else if (stress > 3) {
        insightParts.push(
          'Elevated geopolitical tension creates modest safe-haven flows.'
        );
      } else {
        insightParts.push(
          'Calm market conditions prevail with minimal safe-haven demand.'
        );
      }

      if (yieldStance === 'hawkish') {
        usdChfVal += 0.015;
        goldVal -= 45;
        insightParts.push(
          React.createElement('span', { key: 'hawkish' },
            React.createElement(Zap, { size: 12, className: 'inline' }),
            ' Hawkish Fed policy boosts USD yield appeal, dampening gold demand and supporting USD/CHF.'
          )
        );
      } else if (yieldStance === 'dovish') {
        usdChfVal -= 0.015;
        goldVal += 55;
        insightParts.push(
          React.createElement('span', { key: 'dovish' },
            React.createElement(Shield, { size: 12, className: 'inline' }),
            ' Dovish stance lowers real yields, accelerating gold rally and driving USD/CHF lower.'
          )
        );
      }

      if (snbIntervention === 'buying') {
        usdChfVal += 0.035;
        insightParts.push(
          React.createElement('span', { key: 'snb' },
            React.createElement(TrendingUp, { size: 12, className: 'inline' }),
            ' SNB intervention artificially depresses Franc value, breaking negative correlation with Gold.'
          )
        );
      }

      const newUsdChfData = [
        0.8950,
        0.8920,
        0.8890,
        Number((usdChfVal + 0.0080).toFixed(4)),
        Number((usdChfVal + 0.0030).toFixed(4)),
        Number(usdChfVal.toFixed(4)),
      ];

      const newGoldData = [
        2600,
        2615,
        2630,
        Math.round(goldVal - 30),
        Math.round(goldVal - 10),
        Math.round(goldVal),
      ];

      setChartData({
        labels: ['T-10d', 'T-8d', 'T-6d', 'T-4d', 'T-2d', 'Current'],
        datasets: [
          {
            label: 'USD/CHF Rate',
            data: newUsdChfData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            yAxisID: 'yUsdChf',
          },
          {
            label: 'Gold (XAU/USD $)',
            data: newGoldData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            yAxisID: 'yGold',
          },
        ],
      });

      const insightText = insightParts.length > 0 
        ? insightParts
        : 'Standard risk-off market conditions active. USD/CHF and XAU/USD exhibit normal inverse correlation.';
      
      setFeedback(insightText);
      setIsRunning(false);
      onScenarioRun?.(state);
    }, 500);
  };

  return (
    <div id="simulator" style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleRowStyle}>
          <span style={{
            fontFamily: editorialTheme.fonts.sans,
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.accent,
          }}>
            {title}
          </span>
          <h3 style={{
            fontFamily: editorialTheme.fonts.serif,
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            fontWeight: 700,
            color: colors.text,
            margin: 0,
          }}>
            {subtitle}
          </h3>
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlPanelStyle}>
          <div style={labelStyle}>Simulation Parameters</div>
          
          <div style={controlItemStyle}>
            <label htmlFor="stress-slider" style={controlLabelStyle}>
              Geopolitical Stress Index:
            </label>
            <div style={sliderContainerStyle}>
              <input
                type="range"
                id="stress-slider"
                min="1"
                max="10"
                value={state.stress}
                onChange={(e) => setState({ ...state, stress: parseInt(e.target.value) })}
                style={sliderStyle}
              />
              <span style={sliderValueStyle} id="stress-value">{state.stress}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.625rem', color: colors.textSecondary }}>
              <span>Low (Calm)</span>
              <span>High (Crisis)</span>
            </div>
          </div>

          <div style={controlItemStyle}>
            <label htmlFor="yield-select" style={controlLabelStyle}>
              Fed Yield Direction:
            </label>
            <select
              id="yield-select"
              value={state.yieldStance}
              onChange={(e) => setState({ ...state, yieldStance: e.target.value as SimulatorState['yieldStance'] })}
              style={selectStyle}
            >
              <option value="hawkish">Hawkish (Fed Raises Rates / Yields Rise)</option>
              <option value="neutral">Neutral Monetary Stance</option>
              <option value="dovish">Dovish (Fed Cuts Rates / Yields Fall)</option>
            </select>
          </div>

          <div style={controlItemStyle}>
            <label htmlFor="snb-select" style={controlLabelStyle}>
              SNB Currency Intervention:
            </label>
            <select
              id="snb-select"
              value={state.snbIntervention}
              onChange={(e) => setState({ ...state, snbIntervention: e.target.value as SimulatorState['snbIntervention'] })}
              style={selectStyle}
            >
              <option value="none">No Active Intervention</option>
              <option value="buying">SNB Selling CHF (Devaluation)</option>
            </select>
          </div>

          <button
            onClick={calculateScenario}
            disabled={isRunning}
            style={{
              ...runButtonStyle,
              opacity: isRunning ? 0.6 : 1,
              cursor: isRunning ? 'not-allowed' : 'pointer',
            }}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Running Scenario...
              </>
            ) : (
              <>
                <Play size={14} />
                Run Market Scenario
              </>
            )}
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <InteractiveChart
            data={chartData}
            height={360}
            isDark={isDark}
          />
          
          <div style={feedbackStyle}>
            <strong style={{ color: colors.text }}>Scenario Insight:</strong>{' '}
            {feedback}
          </div>
        </div>
      </div>
    </div>
  );
};