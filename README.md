# COSMOS Tech — Tech Electronics E‑Commerce (MERN)

A full-stack e-commerce web app (Amazon/Flipkart-like) focused on selling tech/electronics accessories (keyboards, mice, CPUs, laptops, etc.) with **RBAC** for:

- **Admin** (owners / middle-man company): cannot register; can only login using credentials from `.env`
- **Seller** (franchise product sellers): can register + login; manage **only their products** and see product orders/reviews
- **Customer** (end users): can register + login; browse, cart, direct purchase, rate + review purchased items

## 1) Setup

### Prereqs
- Node.js 18+
- MongoDB (local or Atlas)

### Install dependencies (root)
```bash
npm install
```

### Server env
Create `server/.env` using `server/.env.example`:
```bash
cp server/.env.example server/.env
```

### Client env
Create `client/.env` using `client/.env.example`:
```bash
cp client/.env.example client/.env
```

## 2) Run

### Seed dummy products/users
```bash
npm run seed
```

### Start backend (dev)
```bash
npm run dev:server
```

### Start frontend (dev)
Open a second terminal:
```bash
npm run dev:client
```

## 3) Accounts / Roles

### Admin login (no registration)
Admins are defined in `server/.env` as comma-separated `email:password`:
```
ADMIN_CREDS=admin@cosmos.tech:Admin@123,owner@cosmos.tech:Owner@123
```

### Seller / Customer
Register from the UI. Sellers can create products; customers can buy/review.

## 4) Folder structure
- `server/` Express + MongoDB + JWT + RBAC APIs
- `client/` React (Vite) + Tailwind UI



## GitHub
Repository: https://github.com/RamzanKhansLab/COSMOS-TECH

## Deployment (single server)
1) Build client: npm run build
2) Set server NODE_ENV=production and CORS_ORIGIN to your domain
3) Start server: npm run start


## Fix broken images
If older products have broken/remote image URLs, run:
`ash
npm run fix:images -w server
`\r\n

## Render Deployment (recommended)

This repo is set up for a **single Render Web Service**:
- React is built to client/dist
- Express serves the static build when NODE_ENV=production

### Render settings
- **Build Command:** 
pm install && npm run build
- **Start Command:** 
pm run start

### Render environment variables (Server)
Set these in Render Dashboard → Environment:
- NODE_ENV=production
- PORT=10000
- MONGODB_URI=... (MongoDB Atlas)
- JWT_SECRET=...
- ADMIN_CREDS=email:password,email2:password2
- CORS_ORIGIN=https://<your-service>.onrender.com

### Client API URL on Render
For a single-service deployment, the frontend calls the backend at the same domain.
- Set VITE_API_URL to empty in the Render environment (or build with it empty) so requests go to /api.

Tip: A ender.yaml blueprint is included at ender.yaml.
