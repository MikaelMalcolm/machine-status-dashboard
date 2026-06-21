import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatTime } from '../config';

/**
 * Transforms raw readings into chart-friendly rows.
 * Recharts expects an array of plain objects with consistent keys.
 */
function toChartData(history) {
  return history.map((reading) => ({
    time: formatTime(reading.timestamp),
    temperature: reading.temperature,
    pressure: reading.pressure,
    speed: reading.speed,
    healthScore: reading.healthScore,
  }));
}

/** Reusable line chart wrapper — pass dataKey + color for each metric. */
function MetricLineChart({ title, data, dataKey, color, unit }) {
  return (
    <article className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit={unit} />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={title}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </article>
  );
}

/**
 * Time-series charts for temperature, pressure, speed, and health.
 * Updates automatically as `history` grows from the WebSocket hook.
 */
export default function MetricCharts({ history }) {
  const chartData = toChartData(history);

  if (chartData.length === 0) {
    return (
      <section className="panel">
        <h2>Trends</h2>
        <p className="muted">Charts will appear once readings arrive.</p>
      </section>
    );
  }

  return (
    <section className="panel charts-panel">
      <div className="panel-header">
        <h2>Trends</h2>
        <span className="muted">{chartData.length} data points</span>
      </div>

      <div className="charts-grid">
        <MetricLineChart
          title="Temperature"
          data={chartData}
          dataKey="temperature"
          color="#f97316"
          unit="°C"
        />
        <MetricLineChart
          title="Pressure"
          data={chartData}
          dataKey="pressure"
          color="#38bdf8"
          unit=" psi"
        />
        <MetricLineChart
          title="Speed"
          data={chartData}
          dataKey="speed"
          color="#a78bfa"
          unit=" rpm"
        />
        <MetricLineChart
          title="Health score"
          data={chartData}
          dataKey="healthScore"
          color="#22c55e"
          unit="%"
        />
      </div>
    </section>
  );
}
