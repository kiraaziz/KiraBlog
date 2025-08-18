import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function seedSettings() {
  // Read settings.json
  const settingsPath = path.join(process.cwd(), 'seed', 'settings.json');
  const settingsRaw = fs.readFileSync(settingsPath, 'utf-8');
  const settings = JSON.parse(settingsRaw);

  for (const setting of settings) {
    // Upsert by key
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
      },
      create: {
        key: setting.key,
        value: setting.value,
        createdAt: setting.createdAt ? new Date(setting.createdAt) : undefined,
      },
    });
  }
}

export async function GET() {
  try {
    await seedSettings();
    return NextResponse.json({ message: 'Settings seeded successfully.' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
