# TrueMatch – Online Matrimonial Platform

A full-stack matrimonial website built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**, following the **MVC (Model-View-Controller)** architecture pattern.

---

## 🏗️ MVC Architecture

This project strictly follows the **MVC (Model-View-Controller)** design pattern, where each layer has a clear, single responsibility:

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (Browser)                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │    VIEW       │  │  CONTROLLER  │  │      MODEL       │  │
│  │  (React UI)   │→ │  (Services)  │→ │  (Context/State) │  │
│  │  pages/       │  │  services/   │  │  context/        │  │
│  │  components/  │  │              │  │                  │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────┘  │
│                           │ HTTP (Axios)                    │
└───────────────────────────┼─────────────────────────────────┘
                            │
                     ┌──────▼──────┐
                     │   ROUTES    │  (URL → Controller mapping)
                     │  routes/    │
                     └──────┬──────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                       SERVER (Node.js + Express)            │
│                           │                                 │
│  ┌──────────────┐  ┌──────▼───────┐  ┌──────────────────┐  │
│  │  MIDDLEWARE   │  │  CONTROLLER  │  │      MODEL       │  │
│  │  middleware/  │→ │  controllers/│→ │  models/         │  │
│  │  (auth, log,  │  │  (business   │  │  (Mongoose       │  │
│  │   error, etc) │  │   logic)     │  │   schemas)       │  │
│  └──────────────┘  └──────────────┘  └────────┬─────────┘  │
│                                               │             │
│                                        ┌──────▼──────┐      │
│                                        │  MongoDB    │      │
│                                        │  Database   │      │
│                                        └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### MVC Layer Mapping

| MVC Layer      | Server Side                | Client Side               |
|----------------|----------------------------|---------------------------|
| **Model**      | `models/` (Mongoose schemas: User, Interest, Message, Conversation, VerificationRequest) | `context/` (AuthContext, ThemeContext — app state) |
| **View**       | `public/index.html` (static page) | `pages/` & `components/` (React UI) |
| **Controller** | `controllers/` (business logic: auth, profile, interest, message, admin, settings) | `services/` (API communication layer) |
| **Routes**     | `routes/` (URL → controller mapping) | React Router in `App.jsx` |
| **Middleware**  | `middleware/` (auth, error, logger, rate-limiter) | — |

---

## 📁 Project Structure

```
TrueMatch/
│
├── server/                          # ── BACKEND (Node.js + Express) ──
│   ├── server.js                    # Entry point (DB connect + server start)
│   ├── app.js                       # Express app config (middleware + routes)
│   ├── httpServer.js                # Node HTTP module example (no Express)
│   ├── seed.js                      # Sample data seed script
│   ├── package.json
│   ├── .env                         # Environment variables
│   │
│   ├── config/                      # ── CONFIGURATION ──
│   │   └── db.js                    #   MongoDB connection with retry logic
│   │
│   ├── models/                      # ── MODEL LAYER (Data/Schema) ──
│   │   ├── User.js                  #   User schema (profile, auth, prefs)
│   │   ├── Interest.js              #   Interest request schema
│   │   ├── Message.js               #   Chat message schema
│   │   ├── Conversation.js          #   Conversation thread schema
│   │   └── VerificationRequest.js   #   ID/Photo verification schema
│   │
│   ├── controllers/                 # ── CONTROLLER LAYER (Business Logic) ──
│   │   ├── authController.js        #   Register, Login, Google OAuth, GetMe
│   │   ├── profileController.js     #   CRUD, Search, Favourites, Compatibility
│   │   ├── interestController.js    #   Send, Accept, Reject interests
│   │   ├── messageController.js     #   Conversations, Messages, Unread count
│   │   ├── adminController.js       #   Stats, Suspend, Approve, Export, Verify
│   │   └── settingsController.js    #   Privacy, Notifications, Password, Block
│   │
│   ├── routes/                      # ── ROUTE LAYER (URL → Controller) ──
│   │   ├── authRoutes.js            #   /api/auth/*
│   │   ├── profileRoutes.js         #   /api/profile/*
│   │   ├── interestRoutes.js        #   /api/interest/*
│   │   ├── messageRoutes.js         #   /api/messages/*
│   │   ├── adminRoutes.js           #   /api/admin/*
│   │   └── settingsRoutes.js        #   /api/settings/*
│   │
│   ├── middleware/                   # ── MIDDLEWARE LAYER ──
│   │   ├── authMiddleware.js        #   JWT verification + admin guard
│   │   ├── errorMiddleware.js       #   404 handler + global error handler
│   │   ├── loggerMiddleware.js      #   Custom request logger
│   │   └── rateLimiter.js           #   Rate limiting (auth + API)
│   │
│   ├── utils/                       # ── UTILITY LAYER ──
│   │   └── fileStreamExample.js     #   File stream demo (fs.createReadStream)
│   │
│   ├── uploads/                     # Uploaded profile photos
│   └── public/
│       └── index.html               # Static HTML page (View)
│
├── client/                          # ── FRONTEND (React.js SPA) ──
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite build config
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # React DOM render entry
│       ├── App.jsx                  # Route definitions + layout
│       ├── index.css                # Global styles + design tokens
│       │
│       ├── services/                # ── CONTROLLER LAYER (API Calls) ──
│       │   ├── api.js               #   Axios instance + interceptors
│       │   ├── authService.js       #   Auth API calls
│       │   ├── profileService.js    #   Profile API calls
│       │   ├── interestService.js   #   Interest API calls
│       │   ├── messageService.js    #   Message API calls
│       │   ├── adminService.js      #   Admin API calls
│       │   ├── settingsService.js   #   Settings API calls
│       │   └── index.js             #   Barrel export
│       │
│       ├── context/                 # ── MODEL LAYER (State Management) ──
│       │   ├── AuthContext.jsx      #   Auth state (user, login, logout)
│       │   └── ThemeContext.jsx     #   Theme state (dark/light mode)
│       │
│       ├── components/              # ── VIEW LAYER (Reusable UI) ──
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProfileCard.jsx
│       │   ├── FilterPanel.jsx
│       │   ├── QuickViewModal.jsx
│       │   ├── Shimmer.jsx
│       │   ├── Animations.jsx
│       │   └── InstallPrompt.jsx
│       │
│       ├── pages/                   # ── VIEW LAYER (Page Components) ──
│       │   ├── Home.jsx
│       │   ├── Register.jsx
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreateProfile.jsx
│       │   ├── SearchProfiles.jsx
│       │   ├── ProfileDetails.jsx
│       │   ├── Interests.jsx
│       │   ├── Favourites.jsx
│       │   ├── Settings.jsx
│       │   └── AdminDashboard.jsx
│       │
│       └── hooks/                   # ── CUSTOM HOOKS ──
│           └── useSmoothScroll.js
│
└── .gitignore
```

---

## 🚀 How To Run The Project

### Prerequisites
- **Node.js** (v18+): https://nodejs.org
- **MongoDB**: https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

### Step 1: Start MongoDB
```bash
# If installed locally, MongoDB should start automatically
# Or run:
mongod
```

### Step 2: Setup & Run Backend
```bash
cd TrueMatch/server

# Install dependencies
npm install

# Seed sample data (IMPORTANT - run this first!)
node seed.js

# Start server
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Setup & Run Frontend
```bash
# Open a NEW terminal
cd TrueMatch/client

# Install dependencies
npm install

# Start React dev server
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 4: Open in browser
Go to: **http://localhost:3000**

---

## 🔑 Test Login Credentials

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@truematch.com    | password123 |
| User  | priya@example.com      | password123 |
| User  | rahul@example.com      | password123 |
| User  | ayesha@example.com     | password123 |
| User  | amit@example.com       | password123 |
| User  | sarah@example.com      | password123 |
| User  | gurpreet@example.com   | password123 |
| User  | ali@example.com        | password123 |
| User  | neha@example.com       | password123 (pending approval) |

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Route              | Description              | Access  |
|--------|--------------------|--------------------------|---------|
| POST   | /api/auth/register | Register new user        | Public  |
| POST   | /api/auth/login    | Login & get JWT token    | Public  |
| GET    | /api/auth/me       | Get logged-in user info  | Private |

### Profile Routes (`/api/profile`)
| Method | Route                        | Description              | Access        |
|--------|------------------------------|--------------------------|---------------|
| GET    | /api/profile                 | Get all approved profiles| Private       |
| GET    | /api/profile/me              | Get my profile           | Private       |
| GET    | /api/profile/search          | Search with filters      | Private       |
| GET    | /api/profile/favourites      | Get my favourites        | Private       |
| PUT    | /api/profile                 | Update profile + photo   | Private       |
| GET    | /api/profile/:id             | Get profile by ID        | Private       |
| PUT    | /api/profile/favourite/:id   | Toggle favourite         | Private       |
| PUT    | /api/profile/report/:id      | Report a profile         | Private       |
| GET    | /api/profile/admin/users     | Get all users            | Admin         |
| GET    | /api/profile/admin/reported  | Get reported profiles    | Admin         |
| PUT    | /api/profile/admin/approve/:id | Approve profile        | Admin         |
| DELETE | /api/profile/admin/user/:id  | Delete user              | Admin         |

### Interest Routes (`/api/interest`)
| Method | Route                         | Description              | Access  |
|--------|-------------------------------|--------------------------|---------|
| POST   | /api/interest/:receiverId     | Send interest            | Private |
| GET    | /api/interest/received        | Get received interests   | Private |
| GET    | /api/interest/sent            | Get sent interests       | Private |
| PUT    | /api/interest/:interestId     | Accept/Reject interest   | Private |

### Other Routes
| Method | Route         | Description                        |
|--------|---------------|------------------------------------|
| GET    | /api          | API welcome message                |
| GET    | /static-page  | HTML served via file stream        |

---

## 📚 Syllabus Concepts Mapping

### 1. Client-Server Architecture & MVC Pattern
**Files:** `server/server.js`, `server/app.js`
- The backend (Express server on port 5000) acts as the **server**
- The frontend (React on port 3000) acts as the **client**
- They communicate via HTTP requests (REST API)
- **MVC Architecture:** Model (`models/`) → Controller (`controllers/`) → View (`client/`)
- `server.js` handles only DB connection + server startup (separation of concerns)
- `app.js` handles all Express configuration, middleware, and route mounting

### 2. Understanding How Server Handles Requests
**Files:** `server/app.js`, `server/httpServer.js`
- When a request arrives, it passes through middleware → routes → controllers
- The response is sent back as JSON data
- MVC flow: Route receives request → Controller processes logic → Model interacts with DB

### 3. Installing NodeJS and Environment Setup
**Files:** `server/package.json`, `server/.env`
- Node.js installed on system; npm used to manage packages
- Environment variables stored in `.env` file using `dotenv`

### 4. File Handling Module and File Dependency
**File:** `server/utils/fileStreamExample.js`
- Uses `fs.createReadStream()` to read and stream an HTML file
- Uses `path.join()` for safe file path construction
- Demonstrates piping file stream to HTTP response

### 5. NodeJS Advantages and Disadvantages
- **Advantages:** Non-blocking I/O, fast (V8 engine), NPM ecosystem, single language (JS)
- **Disadvantages:** Single-threaded (not ideal for CPU-heavy tasks), callback hell (solved with async/await)

### 6. Handling HTTP Requests Using Node HTTP Module
**File:** `server/httpServer.js`
- Creates a server using `http.createServer()`
- Manually routes requests using `req.url` and `req.method`
- Run separately: `node httpServer.js`

### 7. Creating Endpoints Using HTTP Module
**File:** `server/httpServer.js`
- Two endpoints: `/` and `/about`
- Shows manual routing without Express

### 8. Modules and NPM
**All files** use `require()` (CommonJS modules)
- Built-in: `fs`, `path`, `http`
- Third-party: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `morgan`, `multer`
- Custom: `./config/db`, `./models/User`, etc.

### 9. Express.js Framework
**File:** `server/app.js`
- `const app = express()` creates an Express application
- Uses `app.use()` for middleware, `app.get/post/put/delete` for routes
- App configuration is separated from server startup (MVC best practice)

### 10. Serving Static Files
**File:** `server/app.js`
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
```
- `express.static()` serves files from a directory

### 11. Routing
**Files:** `server/routes/*.js`

- **Route Methods:** `router.get()`, `router.post()`, `router.put()`, `router.delete()`
- **Route Paths:** `/api/auth/register`, `/api/profile/search`
- **Route Parameters:** `/api/profile/:id` → `req.params.id`
- **Route Handlers:** Controller functions like `registerUser`, `loginUser`

### 12. Response Methods
**Files:** `server/controllers/*.js`
- `res.json()` - Send JSON response
- `res.status(201).json()` - Send with status code
- `res.setHeader()` - Set response headers

### 13. Handling Static Pages Using File Stream
**File:** `server/utils/fileStreamExample.js`
- Route: `GET /static-page`
- Uses `fs.createReadStream()` and `.pipe(res)` to stream HTML

### 14. Handling Exceptions
**Files:** `server/controllers/*.js`, `server/middleware/errorMiddleware.js`
- Try-catch blocks in every controller
- Global error handler catches all unhandled errors

### 15. Middleware Lifecycle
**File:** `server/app.js`
Request flow: Client → cors → morgan → express.json → sanitize → logger → routes → errorHandler → Response

### 16. Application-Level Middleware
**File:** `server/middleware/loggerMiddleware.js`, `server/app.js`
- `app.use(logger)` - Runs on EVERY request
- `app.use(express.json())` - Parses JSON body

### 17. Router-Level Middleware
**Files:** `server/routes/*.js`
- `router.get('/me', protect, getMyProfile)` - `protect` runs before the handler
- `router.put('/admin/approve/:id', protect, adminOnly, approveProfile)` - Two middleware chained

### 18. Error-Handling Middleware
**File:** `server/middleware/errorMiddleware.js`
- `notFound` - Catches 404 errors
- `errorHandler` - Has 4 parameters `(err, req, res, next)` — Express recognizes this as error middleware

### 19. Third-Party Middleware
**File:** `server/app.js`, `server/routes/profileRoutes.js`
- **cors** - Cross-Origin Resource Sharing (allows frontend to call backend)
- **morgan** - HTTP request logger (logs method, URL, status, time)
- **multer** - File upload middleware (handles `multipart/form-data`)

---

## 🎤 Viva Questions & Answers

**Q: What is Client-Server Architecture?**
A: Client (browser/React) sends requests, Server (Express/Node) processes them and sends responses. They communicate over HTTP protocol.

**Q: What is Express.js?**
A: Express is a minimal, fast web framework for Node.js. It simplifies creating servers, handling routes, and middleware.

**Q: What is MVC Architecture?**
A: MVC (Model-View-Controller) separates an application into three layers: **Model** (data/database schemas in `models/`), **View** (UI presentation in React `pages/` and `components/`), and **Controller** (business logic in `controllers/` on server, `services/` on client). Routes map URLs to controllers. This separation makes the code modular, testable, and maintainable.

**Q: Why separate `server.js` and `app.js`?**
A: `app.js` configures the Express application (middleware, routes, error handling), while `server.js` handles server startup and database connection. This separation follows MVC best practices — it makes the app testable (you can import `app.js` without starting the server) and keeps concerns isolated.

**Q: What is the Services layer in React?**
A: The `services/` folder acts as the Controller layer on the client side. It centralizes all API calls using Axios, so React components (View) don't directly make HTTP requests. This keeps UI code clean and API logic reusable.

**Q: What is Middleware?**
A: Functions that execute between request and response. They can modify req/res objects, end the request, or call next().

**Q: What is JWT?**
A: JSON Web Token - a secure way to transmit user identity. After login, server creates a token; client sends it with every request.

**Q: What is Mongoose?**
A: An ODM (Object Document Mapper) for MongoDB. It provides schema-based models for data validation and querying.

**Q: How does file upload work?**
A: Multer middleware intercepts multipart/form-data requests, saves the file to `uploads/` folder, and adds file info to `req.file`.

**Q: What is the difference between `app.use()` and `app.get()`?**
A: `app.use()` runs middleware on ALL requests (any method). `app.get()` only handles GET requests for a specific path.

**Q: What are Route Parameters?**
A: Dynamic segments in URLs. `/profile/:id` captures the ID. Access via `req.params.id`.

**Q: How does error handling middleware work in Express?**
A: It has 4 parameters: `(err, req, res, next)`. Express recognizes 4-param functions as error handlers and calls them when errors occur.

**Q: What is CORS?**
A: Cross-Origin Resource Sharing. Browsers block requests to different domains by default. CORS middleware adds headers to allow it.

**Q: What is bcryptjs used for?**
A: Hashing passwords. It converts plain text passwords into irreversible hashes before storing in the database.

**Q: What is the difference between HTTP module server and Express server?**
A: HTTP module is Node's built-in basic server (manual routing). Express is a framework built on top of it with routing, middleware, and more features.

---

## 🛠 Tech Stack Summary

| Layer          | Technology              | MVC Role            |
|----------------|-------------------------|---------------------|
| Frontend       | React.js                | View                |
| API Services   | Axios                   | Controller (Client) |
| State Mgmt     | React Context API       | Model (Client)      |
| Styling        | Tailwind CSS            | View                |
| Routing (FE)   | React Router            | Route (Client)      |
| Backend        | Node.js + Express.js    | Controller (Server) |
| Database       | MongoDB + Mongoose      | Model (Server)      |
| Auth           | JWT + bcryptjs          | Middleware          |
| File Upload    | Multer                  | Middleware          |
| Logging        | Morgan + Custom logger  | Middleware          |
| Security       | Helmet, Rate-Limit, XSS | Middleware          |
| Build Tool     | Vite                    | —                   |
