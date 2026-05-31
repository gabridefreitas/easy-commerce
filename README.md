# EasyCommerce

EasyCommerce is an academic project that implements a simplified e-commerce flow with a split architecture:

- `database`: PostgreSQL initialization and seed data
- `server`: Java Spring Boot backend
- `app`: Next.js frontend

## Tech stack

- Frontend: Next.js, React, Axios, Material UI, Tailwind CSS
- Backend: Spring Boot, Spring Data JPA
- Database: PostgreSQL

## Project structure

```text
/database
  /init
  /seeds
  docker-compose.yml
/app
/server
.gitignore
README.md
```

## Running locally

### Option A: Run everything with root Docker Compose

```bash
cd /tmp/workspace/gabridefreitas/easy-commerce
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Database: `localhost:5432`

### Option B: Run each part manually

### 1) Start PostgreSQL

```bash
cd /tmp/workspace/gabridefreitas/easy-commerce/database
docker compose up -d
```

This initializes schema and imports products/coupons from seed files.

### 2) Start backend

```bash
cd /tmp/workspace/gabridefreitas/easy-commerce/server
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### 3) Start frontend

```bash
cd /tmp/workspace/gabridefreitas/easy-commerce/app
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Tests

### Backend unit tests

```bash
cd /tmp/workspace/gabridefreitas/easy-commerce/server
mvn test
```

### Frontend unit tests

```bash
cd /tmp/workspace/gabridefreitas/easy-commerce/app
npm test
```

## API examples

- `POST /api/auth/session`
- `GET /api/cart`
- `POST /api/cart/items`
- `GET /api/products?page=0&size=4`
- `GET /api/coupons/WELCOME10`

## Product format

```json
{ "id": 1, "title": "Basic T-Shirt", "price": 59.90, "image": "url", "description": "100% cotton basic t-shirt" }
```
