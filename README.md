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
#### Architecture Overview
1) Router-driven UI state in the frontend
2) Stateless REST API with role-based authorization
3) Multi-layer validation for user and file input
4) Docker-based local development environment
#### Security Features
1) Authentication and Authorization
    - Role-based access control (Admin/User)
    - JWT-based session tokenization
2) Data Protection
    - Password hashing using bcrypt
    - Differentiation between system- and user-controlled data
3) Input & API Security
    - Multi-step validation (in backend + frontend)
    - File upload validation & rate limiting
    - Consistent error handling
#### UI/UX Features
1) Consistent state management with clearly defined state owner and children
2) Customizable UX features incl.
      - Topbar-sidebar toggle<br>
      - Dark-light mode toggle<br>
      - Collapsible topbar and side
3) Instantaneous user feedback for error handling via custom Snackbars
4) Reduction of user annoyances (invalid input check with button-blocking, safe page refresh, smart window closing)
5) Fully responsive layout from mobile to large screens
6) Modular and easy to extend 
#### Tests
1) Frontend:
  - Unit and integration tests for components using Vitest + Vue Test Utils<br>
  - Browser-based end-to-end tests using Cypress
2) Backend:
  - Test runner and assertions using Vitest<br>
  - HTTP API integration tests using Supertest 
      
## Getting Started
1. create a .env file in Backend/ and add MONGO_URI and TOKEN_KEY<br>
2. install dependencies in Backend/ and in Frontend/app via `npm install`<br>
3. local setup<br>
3.1. start MongoDB e.g. via Docker `docker compose up -d mongo-user`<br>
3.2. run `npm start` in Backend/ and Frontend/app<br>
4. docker setup<br>
4.1. run `docker compose up --build` in Backend/ and Frontend/<br>
Note: due to ./scripts/wait-for-mongo.sh, the database automatically fires up before the backend server is up
5. IMPORTANT: first login gets admin role assigned automatically (alternatively use Postman)

## Services and Ports (Development)
```
|  Service | Container Port | Host Port | Exposed in Production  |
|----------|----------------|-----------|------------------------|
| Frontend |      5173      |    5001   | Yes (via reverse proxy)|
|  Backend |      3000      |    4001   |        Yes (API)       |
| Database |     27017      |   35555   |  No (internal network) |
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
|   │  └─ utils/
|   ├─ tests/
|   │  ├─ api/
|   │  ├─ middleware/
|   │  └─ utils/
|   │  │  ├─ csv/
|   │  │  └─ validation/
|   ├─ .env
|   ├─ docker-compose.yml
|   ├─ Dockerfile.dev
|   ├─ index.js
|   └─ package.json
├── Frontend/
|   ├─ app/
|   │  ├─ cypress/
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
|   │  │  │  ├─ auth/
|   │  │  │  ├─ pages/
|   │  │  │  └─ utils/
|   │  │  ├─ unit/
|   │  │  │  ├─ components/
|   │  │  │  ├─ pages/
|   │  │  │  └─ stores/
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

https://github.com/user-attachments/assets/28d183a9-f9e9-4375-a471-de2df6e47676


