# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development (runs both API and web concurrently)
npm run dev

# Individual app development
npm run api:dev          # NestJS API on http://localhost:3333/api
npm run web:dev          # Next.js web on http://localhost:3000

# Build
npm run build            # Build all projects
npm run api:build        # Build API only
npm run web:build        # Build web only

# Testing
npm run test             # Run all tests
npm run api:test         # API unit tests (Jest)
npm run web:test         # Web unit tests (Jest)
npm run api:e2e          # API e2e tests (Jest)
npm run web:e2e          # Web e2e tests (Playwright)

# Run a single test file
npx nx test pitanga-api --testFile=app.service.spec.ts

# Linting & Formatting
npm run lint             # Lint all projects
npm run format           # Format code with Prettier
npm run typecheck        # TypeScript type checking

# Run affected (only changed projects)
npm run affected:build
npm run affected:test
npm run affected:lint
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

### Prisma Commands
```bash
# Generate Prisma client after schema changes
cd apps/pitanga-api && npx prisma generate

# Create migration
cd apps/pitanga-api && npx prisma migrate dev --name migration_name

# Apply migrations in production
cd apps/pitanga-api && npx prisma migrate deploy

# Open Prisma Studio (database GUI)
cd apps/pitanga-api && npx prisma studio
```

### Environment Variables
```bash
# PostgreSQL (set by Dokku when linked)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# MongoDB (set by Dokku when linked)
MONGODB_URL="mongodb://user:password@host:27017/database"
```

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
dokku run pitanga-api npx prisma migrate deploy
```

### Docker Build (local test)
```bash
# Build API image
docker build -f apps/pitanga-api/Dockerfile -t pitanga-api .

# Build Web image
docker build -f apps/pitanga/Dockerfile -t pitanga-web .
```
