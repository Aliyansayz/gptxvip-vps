import React, { useState, useEffect } from 'react';
import { Calculator, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import { editorialTheme } from '../utils/styles';

interface CalculatorResult {
  newGold: number;
  newUsdChf: number;
  impliedMove: number;
}

interface DeltaCalculatorProps {
  title?: string;
  subtitle?: string;
  initialValues?: {
    usdChf: number;
    gold: number;
    goldMove: number;
  };
  correlation?: number;
  onCalculate?: (result: CalculatorResult) => void;
  isDark?: boolean;
}

const DEFAULT_VALUES = {
  usdChf: 0.8850,
  gold: 2650.00,
  goldMove: 3.5,
};

const DEFAULT_CORRELATION = -0.75;

export const DeltaCalculator: React.FC<DeltaCalculatorProps> = ({
  title = 'Quantitative Analysis Tool',
  subtitle = 'Estimate expected target movements based on statistical beta relationships.',
  initialValues = DEFAULT_VALUES,
  correlation = DEFAULT_CORRELATION,
  onCalculate,
  isDark = false,
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;
  const [usdChf, setUsdChf] = useState(initialValues.usdChf);
  const [gold, setGold] = useState(initialValues.gold);
  const [goldMove, setGoldMove] = useState(initialValues.goldMove);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 640);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const containerStyle: React.CSSProperties = {
    margin: '3rem 0',
    padding: '2rem',
    backgroundColor: colors.bgSecondary,
    border: `1px solid ${colors.border}`,
    borderRadius: '0.25rem',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
  };

  const inputGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.6875rem',
    fontWeight: 700,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.75rem',
    fontFamily: editorialTheme.fonts.mono,
    fontSize: '0.875rem',
    color: colors.text,
    backgroundColor: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: '0.25rem',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const calculateButtonStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '24rem',
    backgroundColor: colors.buttonPrimary,
    color: colors.buttonPrimary === '#1a1a1a' ? '#ffffff' : '#1a1a1a',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  };

  const resultsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
    gap: '1rem',
  };

  const resultCardStyle: React.CSSProperties = {
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: '0.25rem',
    padding: '1rem',
  };

  const resultLabelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: '0.5rem',
  };

  const resultValueStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.mono,
    fontSize: '1.125rem',
    fontWeight: 700,
    color: colors.text,
  };

  const calculate = () => {
    const movePct = goldMove / 100;
    const newGold = gold * (1 + movePct);
    const impliedUsdChfMove = movePct * correlation;
    const newUsdChf = usdChf * (1 + impliedUsdChfMove);

    const calculationResult: CalculatorResult = {
      newGold,
      newUsdChf,
      impliedMove: impliedUsdChfMove * 100,
    };

    setResult(calculationResult);
    setShowResult(true);
    onCalculate?.(calculationResult);
  };

  return (
    <div id="calculator" style={containerStyle}>
      <div style={headerStyle}>
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
          margin: '0.5rem 0 0',
        }}>
          {subtitle}
        </h3>
        <p style={{
          fontFamily: editorialTheme.fonts.sans,
          fontSize: '0.75rem',
          color: colors.textSecondary,
          margin: '0.5rem 0 0',
        }}>
          Implied correlation (ρ): <strong>{correlation.toFixed(2)}</strong>
        </p>
      </div>

      <div style={inputGridStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="calc-usdchf" style={labelStyle}>
            Current USD/CHF Spot
          </label>
          <input
            type="number"
            id="calc-usdchf"
            value={usdChf}
            onChange={(e) => setUsdChf(parseFloat(e.target.value) || 0)}
            step="0.0001"
            min="0"
            style={inputStyle}
            placeholder="0.8850"
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="calc-gold" style={labelStyle}>
            Current Gold Spot (XAU/USD)
          </label>
          <input
            type="number"
            id="calc-gold"
            value={gold}
            onChange={(e) => setGold(parseFloat(e.target.value) || 0)}
            step="0.01"
            min="0"
            style={inputStyle}
            placeholder="2650.00"
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="calc-move" style={labelStyle}>
            Expected Gold Move (%)
          </label>
          <input
            type="number"
            id="calc-move"
            value={goldMove}
            onChange={(e) => setGoldMove(parseFloat(e.target.value) || 0)}
            step="0.1"
            style={inputStyle}
            placeholder="3.5"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        style={calculateButtonStyle}
      >
        <Calculator size={14} />
        Calculate Implied CHF Shift
      </button>

      {showResult && result && (
        <div style={resultsGridStyle} role="status" aria-live="polite">
          <div style={resultCardStyle}>
            <span style={resultLabelStyle}>Implied New Gold Price</span>
            <span style={resultValueStyle}>
              ${result.newGold.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div style={resultCardStyle}>
            <span style={resultLabelStyle}>
              Implied USD/CHF Target (at ρ = {correlation.toFixed(2)})
            </span>
            <span style={{
              ...resultValueStyle,
              color: result.newUsdChf < usdChf ? '#10b981' : '#ef4444',
            }}>
              {result.newUsdChf.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {!showResult && (
        <p style={{
          fontFamily: editorialTheme.fonts.sans,
          fontSize: '0.75rem',
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: '1rem',
        }}>
          Enter values above and click calculate to see implied movements.
        </p>
      )}
    </div>
  );
};