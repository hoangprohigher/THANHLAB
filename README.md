## THANHLAB — E-commerce + Project Support Platform

Stack: Next.js 15 (App Router, TS), Tailwind, shadcn/ui, MongoDB (Mongoose), NextAuth (JWT), Docker, Portainer-ready.

### Local Development

1) Install deps
```bash
npm install
```

2) Environment
Create `.env.local`:
```bash
MONGODB_URI=mongodb://localhost:27017/thanhlab
NEXTAUTH_SECRET=dev-secret
```

3) Start MongoDB (Docker)
```bash
docker run -d --name thanhlab-mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:7
```

4) Run dev server
```bash
npm run dev
# App: http://localhost:6001
```

5) Seed sample data
```bash
curl -X POST http://localhost:6001/api/seed
# Accounts: admin@thanhlab.vn / admin123, customer@thanhlab.vn / customer123
```

### Features
- Customer: auth, catalog, cart, orders, services, requests, posts
- Admin: dashboard (charts), users, categories, products, orders, services, posts, requests

Admin pages:
- /admin, /admin/users, /admin/categories, /admin/products, /admin/orders, /admin/services, /admin/posts, /admin/requests

### Docker (local)

Build & run via compose:
```bash
docker compose up --build -d
# App: http://localhost:6001
```

### Deploy via Portainer (Git repository)

- Repository: https://github.com/hoangprohigher/THANHLAB.git
- Compose file: docker-compose.yml
- Environment variables:
  - PORT=6001
  - MONGODB_URI=mongodb://thanhlab-mongodb:27017/thanhlab

Deploy stack. Service exposes port 6001.

### ERD
- See `docs/erd.puml` (PlantUML)

