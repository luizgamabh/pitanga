# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development (runs both API and web concurrently)
yarn dev

# Individual app development
yarn api:dev          # NestJS API on http://localhost:3333/api
yarn web:dev          # Next.js web on http://localhost:3000

# Build
yarn build            # Build all projects
yarn api:build        # Build API only
yarn web:build        # Build web only

# Testing
yarn test             # Run all tests
yarn api:test         # API unit tests (Jest)
yarn web:test         # Web unit tests (Jest)
yarn api:e2e          # API e2e tests (Jest)
yarn web:e2e          # Web e2e tests (Playwright)

# Run a single test file
yarn nx test pitanga-api --testFile=app.service.spec.ts

# Linting & Formatting
yarn lint             # Lint all projects
yarn format           # Format code with Prettier
yarn typecheck        # TypeScript type checking

# Run affected (only changed projects)
yarn affected:build
yarn affected:test
yarn affected:lint
```

## Project Rules

Nossa conversa é em português do Brasil (pt_BR), mas este projeto é para uma empresa americana, logo qualquer comentário, código ou mensagem deve ser em inglês americano (en_US).

Sempre que for adicionar @author em novos arquivos, adicione meu nome, assim: `@author Luiz Gama`. Nunca use `@author Company Development Team`.

O sistema é hospedado em um servidor na Hostinger usando Dokku. Não é possível executar local, não há conectividade com banco de dados e outros recursos externos.

Este repositório usa o nx.dev (monorepo), sempre opte pelos comandos e recursos do ecossistema nx, conforme ./AGENTS.md

Nunca crie commits para mim, a não ser que eu solicite expressamente no prompt.

Só crie documentos quando eu solicitar e, ao criar, prefira usar o formato mermaid ao invés de ASCII para criação de gráficos.

Tenho o n8n instalado em servidor de produção (https://brain.guto.dev), quando ele for útil para alguma feature que eu solicitar, me faça sugestões para usá-lo.

### Trabalhando com tasks específicas

Algumas vezes vou passar tasks em arquivos dentro do diretório {root}/tasks/

Exemplo:

/tasks/123-task-xpto.md

Sempre que estiver trabalhando nestas tasks deve criar um novo arquivo com o mesmo nome e o sufixo "--context", para manter o contexto sempre atualizado, após cada alteração, para que eu possa recuperar o contexto daquela tarefa numa sessão futura.

/tasks/123-task-xpto.md -> /tasks/123-task-xpto--context.md

Caso eu peça um plano da tarefa (quando for mais complexa), você deve criar no mesmo padrão:

/tasks/123-task-xpto.md -> /tasks/123-task-xpto--plan.md

## Architecture

This is an Nx monorepo with two main applications:

### Apps
- **pitanga** (`apps/pitanga`) - Next.js 16 frontend with React 19, App Router
- **pitanga-api** (`apps/pitanga-api`) - NestJS 11 backend API, serves on `/api` prefix
- **pitanga-e2e** (`apps/pitanga-e2e`) - Playwright e2e tests for the web app
- **pitanga-api-e2e** (`apps/pitanga-api-e2e`) - Jest e2e tests for the API

### Key Configuration
- TypeScript strict mode enabled with `nodenext` module resolution
- SWC used for Jest transforms (faster than ts-jest for unit tests)
- ESLint flat config with `@nx/enforce-module-boundaries` rule
- Nx plugins auto-infer targets from project configuration files

### Ports
- Web (Next.js): 3000
- API (NestJS): 3333

## Databases

The API uses two databases:
- **PostgreSQL** (via Prisma) - Relational data (users, screens, playlists, media)
- **MongoDB** (via Mongoose) - Analytics and logs (events, playbacks, metrics)

### Database Commands (yarn scripts)
```bash
# Generate Prisma client (run after schema changes)
yarn db:generate

# Create a new migration (development)
yarn db:migrate

# Apply pending migrations (production)
yarn db:migrate:deploy

# Push schema changes without migration (prototype/dev only)
yarn db:push

# Open Prisma Studio (database GUI)
yarn db:studio

# Reset database (WARNING: deletes all data)
yarn db:reset
```

### Prisma Workflow

1. **First time setup:**
   ```bash
   # Configure .env with your database URL
   cp apps/pitanga-api/.env.example apps/pitanga-api/.env
   # Edit .env with your credentials

   # Generate client and create tables
   yarn db:generate
   yarn db:migrate
   ```

2. **After schema changes:**
   ```bash
   # Edit apps/pitanga-api/prisma/schema.prisma
   yarn db:migrate    # Creates migration and applies it
   ```

3. **Production deployment:**
   ```bash
   # Migrations are applied via Dokku
   dokku run pitanga-api yarn prisma migrate deploy
   ```

### Environment Variables
```bash
# PostgreSQL - configure in apps/pitanga-api/.env
DATABASE_URL="postgresql://user:password@localhost:5432/pitanga_db?schema=public"

# MongoDB - configure in apps/pitanga-api/.env
MONGODB_URL="mongodb://user:password@localhost:27017/pitanga_db?authSource=pitanga_db"
```

### Schema Location
- **Prisma schema:** `apps/pitanga-api/prisma/schema.prisma`
- **Mongoose schemas:** `apps/pitanga-api/src/database/schemas/`

## Deployment

Hosted on Hostinger VPS with Dokku. Each app has its own Dockerfile for production builds.

### Production URLs
- **Web**: https://pitanga.digital
- **API**: https://api.pitanga.digital

### Dokku Database Setup
```bash
# SSH into server
ssh dokku@your-server

# Create PostgreSQL database
dokku postgres:create pitanga-db

# Link PostgreSQL to API (sets DATABASE_URL automatically)
dokku postgres:link pitanga-db pitanga-api

# Create MongoDB database
dokku mongo:create pitanga-mongo

# Link MongoDB to API (sets MONGO_URL automatically)
dokku mongo:link pitanga-mongo pitanga-api

# View linked databases
dokku postgres:info pitanga-db
dokku mongo:info pitanga-mongo

# Check environment variables
dokku config:show pitanga-api
```

### Running Migrations in Production
```bash
# After deploy, run migrations
dokku run pitanga-api yarn prisma migrate deploy
```

### Docker Build (local test)
```bash
# Build API image
docker build -f apps/pitanga-api/Dockerfile -t pitanga-api .

# Build Web image
docker build -f apps/pitanga/Dockerfile -t pitanga-web .
```
