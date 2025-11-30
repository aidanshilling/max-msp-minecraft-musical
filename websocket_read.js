const WebSocket = require('ws');
const Max = require('max-api');
const path = require('path');

Max.post(`Loaded the ${path.basename(__filename)} script`);

const WS_URL = "ws://localhost:8080";

let ws = null;

Max.post("Starting connection...")
connect();

function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    Max.post("WebSocket already connected\n");
    return;
  }

  ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    Max.post("WebSocket connected\n");
  });

  ws.on('message', (msg) => {
    let text = msg.toString();
    try {
      let data = JSON.parse(text);
      Max.outlet(data);
    } catch (e) {
      Max.post("JSON parse error: " + e.toString() + "\n");
      Max.post("Raw message: " + text + "\n");
    }
  });

  ws.on('error', (err) => {
    Max.post("WebSocket error: " + err.toString() + "\n");
  });

  ws.on('close', () => {
    Max.post("WebSocket closed\n");
  });
}
