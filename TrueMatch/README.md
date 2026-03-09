# TrueMatch – Online Matrimonial Platform

A full-stack matrimonial website built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 📁 Project Structure

```
TrueMatch/
│
├── server/                     # Backend (Node.js + Express)
│   ├── server.js               # Main Express server
│   ├── httpServer.js           # Node HTTP module example
│   ├── seed.js                 # Sample data seed script
│   ├── package.json
│   ├── .env                    # Environment variables
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Interest.js         # Interest schema
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   ├── profileController.js # CRUD, Search, Admin
│   │   └── interestController.js # Send, Accept, Reject
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── profileRoutes.js    # /api/profile/*
│   │   └── interestRoutes.js   # /api/interest/*
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── errorMiddleware.js  # Error handling
│   │   └── loggerMiddleware.js # Custom request logger
│   ├── uploads/                # Uploaded photos
│   ├── public/
│   │   └── index.html          # Static HTML page
│   └── utils/
│       └── fileStreamExample.js # File stream demo
│
├── client/                     # Frontend (React.js)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # Routes & layout
│       ├── index.css           # Global styles
│       ├── context/
│       │   └── AuthContext.jsx  # Auth state management
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProfileCard.jsx
│       │   └── FilterPanel.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Register.jsx
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── CreateProfile.jsx
│           ├── SearchProfiles.jsx
│           ├── ProfileDetails.jsx
│           ├── Interests.jsx
│           ├── Favourites.jsx
│           └── AdminDashboard.jsx
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

### 1. Client-Server Architecture
**File:** `server/server.js`
- The backend (Express server on port 5000) acts as the **server**
- The frontend (React on port 3000) acts as the **client**
- They communicate via HTTP requests (REST API)

### 2. Understanding How Server Handles Requests
**File:** `server/server.js`, `server/httpServer.js`
- When a request arrives, it passes through middleware → routes → controllers
- The response is sent back as JSON data

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
**File:** `server/server.js`
- `const app = express()` creates an Express application
- Uses `app.use()` for middleware, `app.get/post/put/delete` for routes

### 10. Serving Static Files
**File:** `server/server.js`
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
**File:** `server/server.js`
Request flow: Client → cors → morgan → express.json → logger → routes → errorHandler → Response

### 16. Application-Level Middleware
**File:** `server/middleware/loggerMiddleware.js`, `server/server.js`
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
**File:** `server/server.js`, `server/routes/profileRoutes.js`
- **cors** - Cross-Origin Resource Sharing (allows frontend to call backend)
- **morgan** - HTTP request logger (logs method, URL, status, time)
- **multer** - File upload middleware (handles `multipart/form-data`)

---

## 🎤 Viva Questions & Answers

**Q: What is Client-Server Architecture?**
A: Client (browser/React) sends requests, Server (Express/Node) processes them and sends responses. They communicate over HTTP protocol.

**Q: What is Express.js?**
A: Express is a minimal, fast web framework for Node.js. It simplifies creating servers, handling routes, and middleware.

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

| Layer      | Technology    |
|------------|---------------|
| Frontend   | React.js      |
| Styling    | CSS (custom)  |
| Routing    | React Router  |
| HTTP Client| Axios         |
| Backend    | Node.js + Express.js |
| Database   | MongoDB + Mongoose |
| Auth       | JWT + bcryptjs |
| File Upload| Multer        |
| Logging    | Morgan (third-party) + Custom logger |
| Build Tool | Vite          |
