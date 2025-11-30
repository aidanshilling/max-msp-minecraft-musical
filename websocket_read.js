// ws_json.js
const WebSocket = require('ws'); // Will be installed via npm (see note below)

// Change this to your WebSocket URL:
const WS_URL = "ws://localhost:8080";

// Store ws instance
let ws = null;

function bang() {
  // Use a bang to (re)connect if needed
  connect();
}

function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    post("WebSocket already connected\n");
    return;
  }

  ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    post("WebSocket connected\n");
  });

  ws.on('message', (msg) => {
    // msg is a Buffer or string
    let text = msg.toString();
    try {
      let data = JSON.parse(text);
      // Send parsed JSON as a Max dict
      outlet(0, ["dictionary", data]);
    } catch (e) {
      post("JSON parse error: " + e.toString() + "\n");
      post("Raw message: " + text + "\n");
    }
  });

  ws.on('error', (err) => {
    post("WebSocket error: " + err.toString() + "\n");
  });

  ws.on('close', () => {
    post("WebSocket closed\n");
  });
}
