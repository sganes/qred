import { execSync } from 'child_process';
import { prisma } from '../lib/prisma';

export async function setupDatabase() {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/qred_test?schema=public';

  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });

  execSync('npx prisma generate', { stdio: 'inherit' });

  // Connect the global Prisma client
  await prisma.$connect();

  // Optionally, you can seed the database here if needed
  execSync('npm run prisma:seed', { stdio: 'inherit' });

  console.log('Database setup complete');
}
