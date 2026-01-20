/**
 * Prisma Seed Script
 * Seeds the database with initial data for development/production.
 * Run with: npx prisma db seed
 *
 * @author Luiz Gama
 */
import { PrismaClient, UserRole, TenantGroupType, ContentType, PointStatus, PointOrientation } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Super Admin user (no tenant)
  const superAdminPassword = await bcrypt.hash('Admin@123!', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@pitanga.digital' },
    update: {},
    create: {
      email: 'admin@pitanga.digital',
      name: 'Super Admin',
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`Created super admin: ${superAdmin.email}`);

  // Create Demo Tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant-001' },
    update: {},
    create: {
      id: 'demo-tenant-001',
      name: 'Demo Company',
      legalName: 'Demo Company LLC',
      document: '12.345.678/0001-99',
      groupType: TenantGroupType.COMPANY,
      billingEmail: 'billing@demo.com',
      isActive: true,
    },
  });
  console.log(`Created tenant: ${demoTenant.name}`);

  // Create Tenant Admin
  const tenantAdminPassword = await bcrypt.hash('Tenant@123!', 10);
  const tenantAdmin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Tenant Admin',
      password: tenantAdminPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      tenantId: demoTenant.id,
    },
  });
  console.log(`Created tenant admin: ${tenantAdmin.email}`);

  // Create Tenant Manager
  const managerPassword = await bcrypt.hash('Manager@123!', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@demo.com' },
    update: {},
    create: {
      email: 'manager@demo.com',
      name: 'Content Manager',
      password: managerPassword,
      role: UserRole.MANAGER,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      tenantId: demoTenant.id,
    },
  });
  console.log(`Created manager: ${manager.email}`);

  // Create Tenant Operator
  const operatorPassword = await bcrypt.hash('Operator@123!', 10);
  const operator = await prisma.user.upsert({
    where: { email: 'operator@demo.com' },
    update: {},
    create: {
      email: 'operator@demo.com',
      name: 'Screen Operator',
      password: operatorPassword,
      role: UserRole.OPERATOR,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      tenantId: demoTenant.id,
    },
  });
  console.log(`Created operator: ${operator.email}`);

  // Create Demo Points (Screens)
  const point1 = await prisma.point.upsert({
    where: { code: 'PTG-DEMO01' },
    update: {},
    create: {
      name: 'Lobby Screen',
      description: 'Main entrance digital signage',
      code: 'PTG-DEMO01',
      orientation: PointOrientation.LANDSCAPE,
      resolution: '1920x1080',
      location: 'Building A - Main Lobby',
      status: PointStatus.ONLINE,
      isActive: true,
      tenantId: demoTenant.id,
      lastHeartbeat: new Date(),
    },
  });
  console.log(`Created point: ${point1.name}`);

  const point2 = await prisma.point.upsert({
    where: { code: 'PTG-DEMO02' },
    update: {},
    create: {
      name: 'Cafeteria Menu',
      description: 'Digital menu board',
      code: 'PTG-DEMO02',
      orientation: PointOrientation.PORTRAIT,
      resolution: '1080x1920',
      location: 'Building A - Cafeteria',
      status: PointStatus.PENDING,
      isActive: true,
      tenantId: demoTenant.id,
    },
  });
  console.log(`Created point: ${point2.name}`);

  // Create Demo Content
  const content1 = await prisma.content.create({
    data: {
      name: 'Welcome Banner',
      description: 'Welcome message for visitors',
      type: ContentType.IMAGE,
      fileUrl: 'https://picsum.photos/1920/1080',
      thumbnailUrl: 'https://picsum.photos/320/180',
      mimeType: 'image/jpeg',
      width: 1920,
      height: 1080,
      status: 'READY',
      isActive: true,
      tenantId: demoTenant.id,
    },
  });
  console.log(`Created content: ${content1.name}`);

  const content2 = await prisma.content.create({
    data: {
      name: 'Company News',
      description: 'Latest company announcements',
      type: ContentType.RSS,
      rssUrl: 'https://example.com/news.rss',
      status: 'READY',
      isActive: true,
      tenantId: demoTenant.id,
    },
  });
  console.log(`Created content: ${content2.name}`);

  const content3 = await prisma.content.create({
    data: {
      name: 'Weather Widget',
      description: 'Local weather information',
      type: ContentType.WEATHER,
      weatherCity: 'New York',
      status: 'READY',
      isActive: true,
      tenantId: demoTenant.id,
    },
  });
  console.log(`Created content: ${content3.name}`);

  // Create Demo Playlist
  const playlist = await prisma.playlist.create({
    data: {
      name: 'Main Lobby Playlist',
      description: 'Default playlist for lobby screen',
      isRandom: false,
      isActive: true,
      tenantId: demoTenant.id,
      items: {
        create: [
          {
            order: 1,
            duration: 15,
            contentId: content1.id,
            transition: 'FADE',
          },
          {
            order: 2,
            duration: 30,
            contentId: content2.id,
            transition: 'SLIDE_LEFT',
          },
          {
            order: 3,
            duration: 20,
            contentId: content3.id,
            transition: 'FADE',
          },
        ],
      },
    },
  });

  // Update playlist stats
  await prisma.playlist.update({
    where: { id: playlist.id },
    data: {
      itemCount: 3,
      totalDuration: 65,
    },
  });
  console.log(`Created playlist: ${playlist.name}`);

  // Assign playlist to point
  await prisma.pointPlaylist.create({
    data: {
      pointId: point1.id,
      playlistId: playlist.id,
      priority: 1,
    },
  });
  console.log(`Assigned playlist to point: ${point1.name}`);

  // Create Demo Price Table
  const priceTable = await prisma.priceTable.create({
    data: {
      name: 'Cafeteria Menu',
      description: 'Daily menu with prices',
      theme: 'modern',
      showImages: true,
      isActive: true,
      tenantId: demoTenant.id,
      categories: {
        create: [
          {
            name: 'Main Dishes',
            order: 1,
            items: {
              create: [
                { name: 'Grilled Chicken', description: 'With rice and salad', price: 15.99, order: 1 },
                { name: 'Beef Steak', description: 'With fries and vegetables', price: 22.99, order: 2 },
                { name: 'Fish & Chips', description: 'Beer-battered cod', price: 18.99, order: 3 },
              ],
            },
          },
          {
            name: 'Beverages',
            order: 2,
            items: {
              create: [
                { name: 'Soft Drinks', description: 'Coke, Sprite, Fanta', price: 2.99, order: 1 },
                { name: 'Fresh Juice', description: 'Orange, Apple, Grape', price: 4.99, order: 2 },
                { name: 'Coffee', description: 'Espresso or Americano', price: 3.49, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created price table: ${priceTable.name}`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
