import { DEFAULT_WS_URL } from '../config';

/**
 * Shows WebSocket connection state and lets you change the server URL at runtime.
 *
 * The URL comes from:
 * 1. User input in this panel (stored in React state in App.jsx)
 * 2. Default from .env via VITE_WS_URL
 */
export default function ConnectionPanel({
  wsUrl,
  activeWsUrl,
  onWsUrlChange,
  onApplyWsUrl,
  connectionStatus,
  error,
  onReconnect,
  onDisconnect,
  onClearHistory,
}) {
  const statusLabel = {
    connected: 'Connected',
    connecting: 'Connecting…',
    disconnected: 'Disconnected',
  }[connectionStatus];

  return (
    <section className="panel connection-panel">
      <div className="panel-header">
        <h2>Connection</h2>
        <span className={`status-badge status-${connectionStatus}`}>
          {statusLabel}
        </span>
      </div>

      <label className="field">
        <span>WebSocket URL</span>
        <input
          type="text"
          value={wsUrl}
          onChange={(e) => onWsUrlChange(e.target.value)}
          placeholder={DEFAULT_WS_URL}
          spellCheck={false}
        />
        <small>
          Default from <code>.env</code>: {DEFAULT_WS_URL}
          {activeWsUrl !== wsUrl.trim() && ' — press Apply to use your edit'}
        </small>
      </label>

      {error && <p className="error-banner">{error}</p>}

      <div className="button-row">
        <button type="button" onClick={onApplyWsUrl}>
          Apply URL
        </button>
        <button type="button" onClick={onReconnect}>
          Reconnect
        </button>
        <button type="button" className="secondary" onClick={onDisconnect}>
          Disconnect
        </button>
        <button type="button" className="secondary" onClick={onClearHistory}>
          Clear chart history
        </button>
      </div>
    </section>
  );
}
