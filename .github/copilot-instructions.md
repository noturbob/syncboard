Project: Syncboard — quick reference for AI coding agents

Summary
- Syncboard is a MERN real-time collaborative whiteboard. Backend (Express + Socket.IO + MongoDB + Redis) serves a REST API and sockets; frontend (Create React App + Socket.IO client) provides the whiteboard UI.

Key files to read first
- `server/index.js` — main HTTP + Socket.IO server, CORS origins, and socket event names.
- `server/routes/*.js` — REST endpoints and access rules (notably `auth.js`, `boards.js`, `coboards.js`).
- `server/middleware/auth.js` — JWT verification and Redis blacklist check (token_blacklist set).
- `server/redisClient.js` — Redis connection uses `process.env.REDIS_URL` or localhost.
- `server/models/Board.js` — board schema: `{ boardName, boardData:Object, owner:ObjectId, collaborators:[] }`.
- `client/src/utils/api.js` — axios instance: baseURL is hard-coded (`https://syncboard-ch6b.onrender.com/api`) and sets `x-auth-token` from localStorage. Also uses `withCredentials: true`.
- `client/src/context/AuthContext.js` — token stored in `localStorage` and `login/logout` helpers. Many components rely on `isAuthenticated`.
- `client/src/components/Whiteboard/Whiteboard.jsx` — authoritative reference for socket events, drawing payloads, and imperative APIs (exposed via `useImperativeHandle`).

Architecture & data flow (quick)
- HTTP (REST) handles auth, board CRUD and co-board creation (`/api/auth`, `/api/boards`, `/api/coboards`). See `server/routes/*`.
- Socket.IO handles live collaboration. Important events (server and client):
  - `join-board` (payload: boardId) — socket joins a room.
  - `drawing` — line segments: { x0,y0,x1,y1,color,brushSize,boardId }
  - `draw-shape` — shapes: { tool, startX,startY,endX,endY,color,brushSize,boardId }
  - `cursor-move` / `cursor-update` — cursor presence updates
  - `clear` — clear canvas for a board
- Persistence: `boardData` is saved as an Object in MongoDB. The frontend sends consolidated history via REST `POST`/`PUT` for save/autosave flows.
- Auth: JWT passed in header `x-auth-token`. On logout the token is added to Redis `token_blacklist` with expiry matching the token `exp`.

Project-specific developer workflows
- Run locally (dev):
  - Start Redis (local or Docker).
  - Start server: from `server/` run `npm install` then `node index.js` (server listens on port 4000 by default).
  - Start client: from `client/` run `npm install` then `npm start` (CRA dev server at http://localhost:3000).
- Build frontend for production: `npm run build` in `client/` requires `REACT_APP_API_URL` env var (the `build` script exits if it's unset). Example:
  REACT_APP_API_URL=https://syncboard-ch6b.onrender.com npm run build

Project conventions and gotchas (explicit)
- API base URL: `client/src/utils/api.js` contains the baseURL; change this if the backend URL differs. The file also adds `x-auth-token` header from `localStorage`.
- Auth header: backend expects the JWT in `x-auth-token` header (not `Authorization`). See `server/middleware/auth.js` and axios interceptor.
- Redis: tokens are blacklisted in Redis under the set `token_blacklist`. The Redis client uses `process.env.REDIS_URL` — ensure this is set in cloud deployments.
- CORS: `server/index.js` sets allowed origins to `https://syncboard-xi.vercel.app` and `http://localhost:3000`. Update to add other deploy domains.
- Frontend build guard: `client/package.json` build script will fail if `REACT_APP_API_URL` is missing — set it for CI/CD pipelines.
- Whiteboard canvas: `client/src/components/Whiteboard/Whiteboard.jsx` uses a doubled-resolution canvas (width/height *2 and CSS width/height set to window size). Modifying sizing needs to preserve this scaling logic.
- Socket rooms: socket joins rooms by `boardId`. Emit and broadcast always use room-based logic (server uses `socket.to(boardId).emit(...)`). Keep this when renaming events.

Examples & quick references
- To read how drawing data is emitted on client: `client/src/components/Whiteboard/Whiteboard.jsx` — look for `socket.emit('drawing', lineData)` and `socket.emit('draw-shape', shapeData)`.
- To see token blacklist flow: `server/routes/auth.js` (`/logout`) adds token to Redis via `redisClient.sAdd('token_blacklist', token)` then sets expiry with `expireAt`.
- Board schema reference: `server/models/Board.js` (boardData = Object). When returning boards, API endpoints usually return entire document; client code expects `boardData` to be iterable as drawing history.

When editing or adding endpoints
- Respect the auth middleware: most routes call `auth` which checks Redis. New private routes should include the same `auth` middleware and follow the token header convention.
- For socket-backed features, keep REST persistence in sync: live updates should still be stored into `boardData` via existing REST `PUT /api/boards/:id`.

Where to run quick checks
- Start server and open logs: run `node server/index.js` and watch console for "Server running on port" and Redis/Mongo connection messages.
- Client dev: `npm start` in `client/` (hot reload). If backend requests fail, confirm `client/src/utils/api.js` baseURL and that server CORS origins include `localhost:3000`.

If something is missing
- Ask for missing env values (.env), deployment URLs, or intended production domains. Also request sample tokens or sample board data if you need to write integration tests.

End — please review this file and tell me if you'd like more specific examples (unit test snippets, example REST payloads, or CI/CD steps).
