# Repository Guidelines

## Project Structure & Module Organization
- `websocket_read.js`: Node/Max bridge reading Minecraft entity data from the Fabric mod websocket (`ws://localhost:8080`) and emitting parsed JSON via `max-api` outlets.
- `final_proj.maxpat`: Max patch that receives and transforms the streamed data into musical behavior; keep patcher objects grouped by function (ingest, transform, output).
- `package.json` / `package-lock.json`: Node dependencies (`ws`, `max-api` bundled with Max) and scripts; `node_modules/` is vendored by npm.

## Setup, Build & Run
- Install dependencies once: `npm install`.
- Run inside Max: open `final_proj.maxpat`, ensure the `node.script`/`js` object points to `websocket_read.js`, then start audio and enable the script to connect to Minecraft.
- Local dry run without Max (for quick sanity checks): `node websocket_read.js` — it will attempt to connect and print Max-style logs to stdout.
- WebSocket source: keep the Fabric mod `mc-nbt-stream` running on `localhost:8080`; update `WS_URL` in the script if the host/port changes.

## Coding Style & Naming Conventions
- JavaScript uses CommonJS, 2-space indentation, `const`/`let` over `var`, and early returns for guard clauses (as in `connect()`).
- Prefer small, pure helpers for message parsing; name message handlers `handleX` and post errors via `Max.post` with clear prefixes.
- Keep Max patch names and receive/send symbols short and descriptive (e.g., `mob-data`, `note-bus`).

## Testing Guidelines
- No automated tests yet; start with manual checks: run the websocket, send a sample JSON message, and confirm it reaches Max via the patch inlet.
- When adding tests, use Node-based harnesses (e.g., Jest) for pure functions and consider fixture JSON for common Minecraft entities.

## Commit & Pull Request Guidelines
- Use concise, present-tense commit messages (`Add reconnect backoff`, `Document Max setup`).
- PRs should describe behavior changes, include Max patch screenshots when UI/patch layout shifts, and reference related Minecraft mod versions.
- Keep patches small and focused; prefer one PR per feature/fix, and note any protocol or port changes in the description.
