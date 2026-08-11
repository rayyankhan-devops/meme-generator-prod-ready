# 🎭 Random Meme Generator (Production Ready)

A full-stack, ultra-lightweight, and hardened **Random Meme Generator** built with a **React Frontend**, **Node.js Express Backend**, and **MySQL Database**.

Designed following strict production DevOps standards, featuring multi-stage Docker builds, non-root user execution, ESLint code quality rules, and 0 security vulnerabilities.

---

## 🌟 Key Features

- **Single-Page React Frontend**: Modern dark-mode UI with spacebar shortcuts, copy/share capabilities, and smooth micro-animations.
- **Node.js Express Backend**: Exposes a single `/api/meme/random` endpoint with automatic fallback logic if MySQL is temporarily offline.
- **MySQL Auto-Seeding**: Includes `init/mysql/init.sql` script to automatically create table schemas and insert predefined developer memes upon container startup.
- **Production Hardened Dockerfiles**:
  - **Frontend Image Size**: **~15–20 MB** (Nginx Alpine Unprivileged).
  - **Backend Image Size**: **~35–45 MB** (Alpine 3.24 + `esbuild` single JS bundle).
- **Enterprise Security**: Executed under non-root users (`USER 101` in Nginx, `USER node` in Backend) with zero CVE vulnerabilities.

---

## 📁 Directory Structure

```
meme-generator/
├── init/
│   └── mysql/
│       └── init.sql            # Pre-seeded MySQL table schema & meme data
├── backend/
│   ├── index.js                # Express API server & fallback engine
│   ├── Dockerfile              # Multi-stage ultra-minimal bundled Dockerfile (~38MB)
│   ├── eslint.config.js        # Backend ESLint configuration
│   ├── package.json            # Node.js dependencies
│   └── .env.example            # Environment variables template
├── frontend/
    ├── src/
    │   ├── App.jsx             # Main React Single-Page Application
    │   ├── App.css             # Glassmorphism dark mode aesthetic
    │   └── main.jsx            # React mount point
    ├── nginx.conf              # Production Nginx config (SPA routing & security headers)
    ├── Dockerfile              # Multi-stage Nginx Alpine Dockerfile (~15MB)
    ├── .eslintrc.cjs           # Frontend React ESLint rules
    ├── index.html              # HTML5 entry point
    └── vite.config.js          # Vite build & proxy configuration
```

---

## 🚀 Step-by-Step Setup Guide

### Method 1: Running with Docker Compose (Recommended - Single Command)

Start all services (MySQL, Backend, Frontend) with automatic health checks and database auto-seeding:

```bash
# Start all containers in background
docker compose up -d

# View status of running services
docker compose ps

# Stop all services and clean up volumes
docker compose down -v
```

Open **[`http://localhost:8080`](http://localhost:8080)** in your browser!

---

### Method 2: Running with Individual Docker CLI Commands

#### Step 1: Create the Docker Network
```bash
docker network create memegen
```

#### Step 2: Run the MySQL Database Container
```bash
docker run -d \
  --name mysql \
  --network memegen \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=memedb \
  -v $(pwd)/init/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 3306:3306 \
  mysql:8.0
```

#### Step 3: Build & Run the Backend Container
```bash
cd backend
docker build -t memegen-backend:v3.0.0 .

docker run -d \
  --name backend \
  --network memegen \
  -e DB_HOST=mysql \
  -e DB_USER=root \
  -e DB_PASSWORD=rootpassword \
  -e DB_NAME=memedb \
  -p 5000:5000 \
  memegen-backend:v3.0.0
```

#### Step 4: Build & Run the Frontend Container
```bash
cd ../frontend
docker build -t memegen-frontend:v2.0.0 .

docker run -d \
  --name frontend \
  --network memegen \
  -p 8080:8080 \
  memegen-frontend:v2.0.0
```

---

### Method 2: Local Development Setup (Without Docker)

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```
*Backend API will run at `http://localhost:5000`.*

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend app will run at `http://localhost:3000`.*

---

## 📡 API Reference

### 1. Get Random Meme
- **Endpoint**: `GET /api/meme/random`
- **Response Format**:
```json
{
  "success": true,
  "source": "database",
  "data": {
    "id": 1,
    "title": "It Works on My Machine",
    "image_url": "https://images.unsplash.com/...",
    "caption": "Then we will ship your machine to the customer!",
    "category": "developer"
  }
}
```

### 2. Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{ "status": "ok", "timestamp": "2026-08-06T21:15:00.000Z" }`

---

## 🧹 Code Quality & Linting

ESLint is configured for both projects:

```bash
# Lint Backend code
cd backend && npm run lint

# Lint Frontend code
cd frontend && npm run lint
```

---

## 🛡️ Security & Performance Metrics

| Service | Runtime Base | Image Size | Non-Root User | Trivy / Scout CVEs |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | `nginx:alpine-slim` | **~15 MB** | `USER 101` (`nginx`) | 0 Vulnerabilities |
| **Backend** | `alpine:3.24` + `esbuild` | **~38 MB** | `USER node` (UID 1000) | 0 Vulnerabilities |

---

## 📜 License
MIT License. Created for production DevOps deployment.
