import { formatTime, healthColor } from '../config';

/**
 * Summary cards for the most recent reading.
 * Each card is a simple presentational component — no state of its own.
 */
export default function MachineOverview({ reading }) {
  if (!reading) {
    return (
      <section className="panel">
        <h2>Live snapshot</h2>
        <p className="muted">Waiting for data from the WebSocket server…</p>
      </section>
    );
  }

  const cards = [
    { label: 'Machine', value: reading.machineId },
    { label: 'State', value: reading.state, className: `state-${reading.state.toLowerCase()}` },
    { label: 'Temperature', value: `${reading.temperature.toFixed(1)} °C` },
    { label: 'Pressure', value: `${reading.pressure.toFixed(1)} psi` },
    { label: 'Speed', value: `${reading.speed.toLocaleString()} rpm` },
    {
      label: 'Health score',
      value: `${reading.healthScore}%`,
      style: { color: healthColor(reading.healthScore) },
    },
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Live snapshot</h2>
        <span className="muted">Updated {formatTime(reading.timestamp)}</span>
      </div>

      <div className="metric-grid">
        {cards.map((card) => (
          <article key={card.label} className={`metric-card ${card.className ?? ''}`}>
            <p className="metric-label">{card.label}</p>
            <p className="metric-value" style={card.style}>
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
