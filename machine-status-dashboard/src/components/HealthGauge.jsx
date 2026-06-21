import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';
import { healthColor } from '../config';

/**
 * A simple donut chart used as a health score gauge.
 * Recharts PieChart is a quick way to show a 0–100 score without extra libraries.
 */
export default function HealthGauge({ score }) {
  const safeScore = Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0;
  const color = healthColor(safeScore);

  const data = [
    { name: 'score', value: safeScore },
    { name: 'remaining', value: 100 - safeScore },
  ];

  return (
    <section className="panel gauge-panel">
      <h2>Health score</h2>
      <div className="gauge-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={95}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#1e293b" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="gauge-center">
          <span className="gauge-value" style={{ color }}>
            {safeScore}
          </span>
          <span className="gauge-unit">/ 100</span>
        </div>
      </div>
    </section>
  );
}
