/**
 * Shape of each JSON message from the WebSocket server.
 * Keeping this in one place makes it easy to update if the server adds fields.
 */
export const DEFAULT_WS_URL =
  import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080';

/** How many recent readings we keep for the line charts. */
export const MAX_HISTORY = 60;

/** Machine states we expect from the server (used for badge colors). */
export const MACHINE_STATES = {
  Running: 'running',
  Idle: 'idle',
  Stopped: 'stopped',
  Error: 'error',
};

/**
 * @typedef {Object} MachineReading
 * @property {string} machineId
 * @property {string} timestamp - ISO 8601 string
 * @property {number} temperature
 * @property {number} pressure
 * @property {number} speed
 * @property {string} state
 * @property {number} healthScore
 */

/**
 * Validates and normalizes a raw JSON object from the WebSocket.
 * Returns null if the payload is missing required fields.
 *
 * @param {unknown} data
 * @returns {MachineReading | null}
 */
export function parseMachineReading(data) {
  if (!data || typeof data !== 'object') return null;

  const reading = /** @type {Record<string, unknown>} */ (data.payload);

  const required = [
    'machineId',
    'timestamp',
    'temperature',
    'pressure',
    'speed',
    'state',
    'healthScore',
  ];

  for (const key of required) {
    if (reading[key] === undefined || reading[key] === null) {
      return null;
    }
  }

  return {
    machineId: String(reading.machineId),
    timestamp: String(reading.timestamp),
    temperature: Number(reading.temperature),
    pressure: Number(reading.pressure),
    speed: Number(reading.speed),
    state: String(reading.state),
    healthScore: Number(reading.healthScore),
  };
}

/**
 * Formats an ISO timestamp for display on charts and cards.
 *
 * @param {string} isoString
 * @returns {string}
 */
export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Maps a health score (0–100) to a color for the gauge.
 *
 * @param {number} score
 * @returns {string}
 */
export function healthColor(score) {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
}
