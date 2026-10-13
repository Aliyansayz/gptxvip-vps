import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { editorialTheme } from '../utils/styles';

Chart.register(...registerables);

interface InteractiveChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      yAxisID: string;
    }>;
  };
  options?: Partial<ChartConfiguration['options']>;
  height?: number;
  isDark?: boolean;
  className?: string;
  title?: string;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  options,
  height = 320,
  isDark = false,
  className = '',
  title,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const defaultOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: editorialTheme.fonts.sans,
            size: 10,
          },
          color: colors.textSecondary,
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: colors.figureBg,
        titleFont: { family: editorialTheme.fonts.sans, size: 11, weight: 'bold' },
        bodyFont: { family: editorialTheme.fonts.sans, size: 10 },
        padding: 12,
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { display: false, color: colors.border },
        ticks: {
          font: { family: editorialTheme.fonts.sans, size: 9 },
          color: colors.textSecondary,
        },
      },
      yUsdChf: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'USD/CHF Rate',
          font: { family: editorialTheme.fonts.sans, size: 9, weight: 'bold' },
          color: colors.textSecondary,
        },
        grid: { color: colors.borderSubtle },
        ticks: {
          font: { family: editorialTheme.fonts.sans, size: 9 },
          color: colors.textSecondary,
        },
      },
      yGold: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Gold ($/oz)',
          font: { family: editorialTheme.fonts.sans, size: 9, weight: 'bold' },
          color: colors.textSecondary,
        },
        grid: { drawOnChartArea: false, color: colors.borderSubtle },
        ticks: {
          font: { family: editorialTheme.fonts.sans, size: 9 },
          color: colors.textSecondary,
        },
      },
    },
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...options?.plugins,
      },
      scales: {
        ...defaultOptions.scales,
        ...options?.scales,
      },
    };

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data,
      options: mergedOptions,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, options, isDark]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.options.plugins.legend.labels.color = colors.textSecondary;
      chartRef.current.options.plugins.tooltip.backgroundColor = colors.figureBg;
      chartRef.current.options.plugins.tooltip.borderColor = colors.border;
      if (chartRef.current.options.scales) {
        const scales = chartRef.current.options.scales as Record<string, any>;
        Object.values(scales).forEach((scale: any) => {
          if (scale.grid) scale.grid.color = colors.borderSubtle;
          if (scale.ticks) scale.ticks.color = colors.textSecondary;
          if (scale.title) scale.title.color = colors.textSecondary;
        });
      }
      chartRef.current.update('none');
    }
  }, [isDark, colors]);

  const containerStyle: React.CSSProperties = {
    height: `${height}px`,
    width: '100%',
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      {title && (
        <div style={{
          fontFamily: editorialTheme.fonts.sans,
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '0.5rem',
        }}>
          {title}
        </div>
      )}
      <div style={containerStyle}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

// Hook for creating chart data
export function useChartData() {
  const [chartData, setChartData] = useState<InteractiveChartProps['data']>({
    labels: [],
    datasets: [],
  });

  const updateData = React.useCallback((newData: InteractiveChartProps['data']) => {
    setChartData(newData);
  }, []);

  return { chartData, updateData };
}