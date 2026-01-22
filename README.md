# Technical Interview project: Fullstack User Management Dashboard

A fullstack demonstration project built for a technical software development interview.

## Tech Stack
Node.js + Express | MongoDB | Vue 3 + Vuetify 3 + Vite | Docker

## Interview tasks
- Create a web app with the following features:
    - Import user data from CSV to database
    - Display user data in a table on a webpage
    - Create and edit users
    - Block and unblock users
    - Sort and filter by different attributes in the table
    - Use Vuetify for the UI
- Addon focused questions:
    - How would you simplify the structure?
    - What changes when deployed to production?

## My solution

### Main Features and Focus
### Security Features
1) Role devision and authentication layer
2) JWT session tokenisation
3) Password hasing via bcrypt for MongoDB
4) Differentiation between system- and user-controlled data within the backend
5) Multi-step input validation for text and file input
6) Consistent error handling in backend and frontend
### UI/UX Features
1) Consistent state management with clearly defined state owner and children
2) Customizable UX features incl.
      - Topbar-sidebar toggle<br>
      - Dark-light mode toggle<br>
      - Collapsible topbar and side
3) Instantaneous uder feedback for error handling via custom Snackbars
4) Reduction of user annoyances (invalid input check with button-blocking, safe page refresh, smart window closing)
5) Fully responsive layout from mobile to large screens
6) Modular and easy to extend 
### Tests
#### Frontend:
  - Unit tests for components using Vitest + Vue Test Utils<br>
  - Browser-based end-to-end tests using Cypress
#### Backend:
  - Test runner and assertions using Vitest<br>
  - HTTP API integration tests using Supertest 
      
## Getting Started
1. create a .env file<br>
1.1. add MONGO_URI to .env to connect a MongoDB database (use correct port for local or docker setup!)<br>
1.2. add TOKEN_KEY to .env for JWT tokenisation<br>
2. install dependencies for backend (in Backend/) and frontend (in Frontend/app) via `npm install`<br>
3. local setup<br>
3.1. to fire up the database, use e.g. docker `docker compose up -d mongo-user` inside backend root<br>
3.2. start both backend and frontend server via `npm start` in each project root (use the correct ports!)<br>
4. docker setup<br>
4.1. run `docker-compose up --build` in both backend and frontend root<br>
Note: due to ./scripts/wait-for-mongo.sh, the database is automatically fired up before backend (see Backend/Dockerfile.dev)
5. IMPORTANT: first login gets admin role assigned automatically (alternatively use Postman)

## Services and Ports (Development)
```
|  Service | Container Port | Host Port || Exposed in Production  |
|----------|----------------|-----------||------------------------|
| Frontend |      5173      |    5001   || Yes (via reverse proxy)|
|  Backend |      3000      |    4001   ||        Yes (API)       |
| Database |     27017      |   35555   ||  No (internal network) |
```
Note: The database port is exposed for local development only. In production, MongoDB would not be publicly accessible.

## Project Structure
```
App/
├── Backend/
|   ├─ data/
|   ├─ Database/
|   ├─ scripts/
|   ├─ service/
|   │  ├─ db/
|   │  ├─ entity/
|   │  ├─ middleware/
|   │  ├─ routes/
|   │  ├─ utils/
|   │  └─ validation/
|   ├─ .env
|   ├─ docker-compose.yml
|   ├─ Dockerfile.dev
|   ├─ index.js
|   └─ package.json
├── Frontend/
|   ├─ app/
|   │  ├─ e2e/
|   │  ├─ public/
|   │  ├─ src/
|   │  │  ├─ api/
|   │  │  ├─ components/
|   │  │  ├─ pages/
|   │  │  ├─ plugins/
|   │  │  ├─ router/
|   │  │  ├─ stores/
|   │  │  ├─ styles/
|   │  │  ├─ utils/
|   │  │  ├─ App.vue
|   │  │  └─ main.js
|   │  ├─ tests/
|   │  │  ├─ integration/
|   │  │  ├─ unit/
|   │  │  │  ├─ components/
|   │  │  │  ├─ pages/
|   │  │  │  ├─ stores/
|   │  │  │  └─ utils/
|   │  │  └─ setup.js
|   │  ├─ csv_to_json.py
|   │  ├─ Dockerfile.dev
|   │  ├─ index.html
|   │  └─ vite.config.mjs
|   └─ docker-compose.yml
├── Docs/
└── README.md
```

## Contact
Always open for constructive criticism and code roasts, and happy to acknowledge your contribution. For contributions, comments or collaborations, please open an issue or reach out directly.

## Demo Video
