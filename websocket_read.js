const WebSocket = require('ws');
const Max = require('max-api');
const path = require('path');

Max.post(`Loaded the ${path.basename(__filename)} script`);

const WS_URL = "ws://localhost:8080";

let ws = null;

Max.post("Starting connection...")
connect();

function buildEntityAverages(data, prevFrame) {
  const entities = Array.isArray(data?.entities) ? data.entities : [];
  const sums = new Map();
  const prevNames = new Set(
    Array.isArray(prevFrame?.entities)
      ? prevFrame.entities
          .map((entity) => entity && typeof entity === 'object' ? entity.name : undefined)
          .filter(Boolean)
      : []
  );

  for (const entity of entities) {
    if (!entity || typeof entity !== 'object') continue;
    const { name, position } = entity;
    if (!name || !position) continue;
    const { x, y, z } = position;
    if (![x, y, z].every((coord) => typeof coord === 'number')) continue;

    if (!sums.has(name)) {
      sums.set(name, { count: 0, x: 0, y: 0, z: 0 });
    }

    const acc = sums.get(name);
    acc.count += 1;
    acc.x += x;
    acc.y += y;
    acc.z += z;
  }

  const averages = {};
  for (const [name, acc] of sums.entries()) {
    averages[name] = {
      count: acc.count,
      position: {
        x: acc.x / acc.count,
        y: acc.y / acc.count,
        z: acc.z / acc.count,
      },
    };
  }

  for (const name of prevNames.values()) {
    if (!averages[name]) {
      averages[name] = {
        count: 0,
        position: { x: 0, y: 0, z: 0 },
      };
    }
  }

  return averages;
}

function connect() {
  let prevFrame;
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
      const entityAverages = buildEntityAverages(data, prevFrame);
      prevFrame = data;
      Max.outlet({ entities: entityAverages });
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
