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
cd /easy-commerce
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Database: `localhost:5432`

### Option B: Run each part manually

### 1) Start PostgreSQL

```bash
cd /easy-commerce/database
docker compose up -d
```

This initializes schema and imports products/coupons from seed files.

### 2) Start backend

```bash
cd /easy-commerce/server
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### 3) Start frontend

```bash
cd /easy-commerce/app
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Useful Docker commands

Run these commands from the project root (`/easy-commerce`).

### Service status

```bash
docker compose ps
```

### Logs

All services (follow):

```bash
docker compose logs -f
```

Backend API only:

```bash
docker compose logs -f server
```

Database only:

```bash
docker compose logs -f database
```

Frontend (Next.js) only:

```bash
docker compose logs -f app
```

Last lines without follow:

```bash
docker compose logs --tail=200 server
docker compose logs --tail=200 database
docker compose logs --tail=200 app
```

### Reset database when schema/seed changes

PostgreSQL init scripts in `/docker-entrypoint-initdb.d` are executed only on first initialization of a fresh data volume.
If you changed files in `database/init` or `database/seeds`, recreate volumes:

```bash
docker compose down -v
docker compose up -d
```

This re-runs schema and seed scripts.

## Git flow and dev flow

### How the compose dev flow works

When you run `docker compose up`, Docker Compose creates and orchestrates three services:

- `app` (Next.js)
- `server` (Spring Boot)
- `database` (PostgreSQL)

They run in isolated containers, but your source code is mounted from the host into containers using bind mounts:

- root compose mounts `./` into `/workspace` for app and server
- this means files are shared live between your machine and containers

So yes, containers can react to code changes from your real local directory because both sides see the same files.

What happens after a file change depends on each runtime:

- frontend (`next dev`): usually hot reloads automatically
- backend (`mvn spring-boot:run`): source is visible immediately, but Java changes may require restarting `server` depending on classpath/reload behavior
- database init scripts: do not re-run automatically after edits in `database/init` and `database/seeds`; you need volume reset

### Suggested dev flow

1. Create a feature branch from `main`.
2. Run the stack with `docker compose up -d`.
3. Develop and test changes in app/server.
4. If schema or seed changed, run reset:

```bash
docker compose down -v
docker compose up -d
```

5. Validate with tests and logs.
6. Commit with clear messages.
7. Open a Pull Request with destination branch `main`.

### Git flow quick commands

```bash
git checkout main
git pull origin main
git checkout -b feature/your-change

# after changes
git add .
git commit -m "feat: describe your change"
git push -u origin feature/your-change
```

Then create a PR from `feature/your-change` to `main`.

## Tests

### Frontend unit tests

```bash
docker compose exec app npm test
```

### Backend unit tests
```bash
docker compose exec server mvn test
```

## API examples

- `POST /api/auth/session`
- `GET /api/cart`
- `POST /api/cart/items`
- `GET /api/products?page=0&size=4`
- `GET /api/coupons/WELCOME10`

## Product format

```json
{ 
  "id": 1, 
  "title": "Camiseta Básica", 
  "price": 59.90, 
  "image": "url", 
  "description": "Camiseta básica de algodão, confortável e versátil para o dia a dia." 
}
```
