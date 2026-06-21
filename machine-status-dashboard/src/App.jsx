import { useState } from 'react';
import ConnectionPanel from './components/ConnectionPanel';
import HealthGauge from './components/HealthGauge';
import MachineOverview from './components/MachineOverview';
import MetricCharts from './components/MetricCharts';
import { DEFAULT_WS_URL } from './config';
import { useMachineWebSocket } from './hooks/useMachineWebSocket';
import './App.css';

/**
 * Root application component.
 *
 * State flow (top → down):
 *   App holds wsUrl → useMachineWebSocket connects → readings flow to child components
 *
 * This is "lifting state up" — the URL lives here so changing it reconnects the hook.
 */
function App() {
  // Two URLs on purpose:
  // - draftWsUrl: what the input shows (updates on every keystroke)
  // - activeWsUrl: what the hook actually connects to (only changes when you Apply)
  // Without this split, the socket would reconnect on every character typed.
  const [draftWsUrl, setDraftWsUrl] = useState(DEFAULT_WS_URL);
  const [activeWsUrl, setActiveWsUrl] = useState(DEFAULT_WS_URL);

  const {
    latestReading,
    history,
    connectionStatus,
    error,
    reconnect,
    disconnect,
    clearHistory,
  } = useMachineWebSocket(activeWsUrl);

  const applyWsUrl = () => setActiveWsUrl(draftWsUrl.trim());

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">React + WebSocket demo</p>
          <h1>Machine Status Dashboard</h1>
          <p className="subtitle">
            Live metrics from your mock server, rendered as cards and charts.
          </p>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <ConnectionPanel
            wsUrl={draftWsUrl}
            activeWsUrl={activeWsUrl}
            onWsUrlChange={setDraftWsUrl}
            onApplyWsUrl={applyWsUrl}
            connectionStatus={connectionStatus}
            error={error}
            onReconnect={reconnect}
            onDisconnect={disconnect}
            onClearHistory={clearHistory}
          />
          <HealthGauge score={latestReading?.healthScore ?? 0} />
        </aside>

        <div className="main-column">
          <MachineOverview reading={latestReading} />
          <MetricCharts history={history} />
        </div>
      </main>
    </div>
  );
}

export default App;
