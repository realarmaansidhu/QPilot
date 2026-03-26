'use client';

interface ScoreGaugeProps {
  score: number;     // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Visual 0-100 QPilot Score gauge with colored ring */
export function ScoreGauge({ score, size = 'md', className = '' }: ScoreGaugeProps) {
  // Color based on score range
  const color = score >= 80 ? '#00D4AA' // strong buy — electric green
    : score >= 65 ? '#4ade80'           // buy — light green
    : score >= 45 ? '#facc15'           // hold — yellow
    : score >= 25 ? '#fb923c'           // sell — orange
    : '#ef4444';                        // strong sell — red

  const sizeConfig = {
    sm: { width: 48, stroke: 3, fontSize: 'text-sm' },
    md: { width: 72, stroke: 4, fontSize: 'text-xl' },
    lg: { width: 96, stroke: 5, fontSize: 'text-3xl' },
  }[size];

  const radius = (sizeConfig.width - sizeConfig.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={sizeConfig.width} height={sizeConfig.width} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={sizeConfig.width / 2}
          cy={sizeConfig.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={sizeConfig.stroke}
          className="text-white/10"
        />
        {/* Score ring */}
        <circle
          cx={sizeConfig.width / 2}
          cy={sizeConfig.width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={sizeConfig.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className={`absolute font-bold ${sizeConfig.fontSize}`} style={{ color }}>
        {Math.round(score)}
      </span>
    </div>
  );
}
