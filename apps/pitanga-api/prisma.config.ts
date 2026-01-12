// Prisma Configuration
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load .env - try multiple paths for different execution contexts
config({ path: 'apps/pitanga-api/.env' }); // From workspace root
config({ path: '.env' }); // From pitanga-api directory

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
