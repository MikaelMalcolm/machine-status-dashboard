import http from 'http';
import { WebSocketServer} from 'ws';
//const { randomUUID } = require('crypto');



const machineStates = ['Running', 'Idle', 'Alarm', 'Maintenance'];
const machines = [
  'Corrugator-01',
  'FlexoFolder-01',
  'FlexoFolder-02',
  'Stacker-01',
  'Palletizer-01'
];

/** How many recent readings we keep on the server */
export const MAX_HISTORY = 2000;

const dataArray = [];

function randomTelemetry() {
  return {
    machineId: machines[Math.floor(Math.random() * machines.length)],
    timestamp: new Date().toISOString(),

    temperature: Number((70 + Math.random() * 20).toFixed(1)),
    pressure: Number((40 + Math.random() * 15).toFixed(1)),
    speed: Math.floor(8000 + Math.random() * 4000),

    state: machineStates[Math.floor(Math.random() * machineStates.length)],

    healthScore: Math.floor(80 + Math.random() * 20),
    UDID: crypto.randomUUID()
  };
}

const interval = setInterval(() => {
    const dataPoint = {
        type: 'telemetry',
        payload: randomTelemetry()
      };

    broadcastDataPoint(dataPoint); 
    dataArray.push(dataPoint); //

    if(dataArray.length > MAX_HISTORY){
      dataArray.shift();     //Keep a maximum of 2000 data points alive on the server
    }

  }, 1000);



// 1. Create the native HTTP server and handle your single REST endpoint
const server = http.createServer((req, res) => {
  // Check the URL and the HTTP Method
  if (req.url === '/api/telemetry' && req.method === 'GET') {
    
    // Set headers for JSON and CORS (so your React app can fetch it)
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    });

    // Return your server's data cache instantly
    const responsePayload = {
      success: true,
      count: dataArray.length,
      history: dataArray // Your existing history buffer
    };

    res.end(JSON.stringify(responsePayload));
  } else {
    // Fallback for any other random HTTP paths
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const wss = new WebSocketServer({server});

function broadcastDataPoint(dataPoint){
  wss.clients.forEach(function each(client) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(dataPoint));
  }

 });
}


wss.on('connection', (ws) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    const dataPoint = {
        type: 'telemetry',
        payload: randomTelemetry()
      };

    ws.send(JSON.stringify(dataPoint));
    dataArray.push(dataPoint); //

    if(dataArray.length > MAX_HISTORY){
      dataArray.shift();     //Keep a maximum of 2000 data points alive on the server
    }

  }, 1000);

  ws.on('close', () => clearInterval(interval));
});

console.log('WebSocket server running on ws://localhost:8080');



server.listen(8080, () => {
  console.log('Mock automation server listening on port 8080 (REST + WS)');
});