import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- 🐾 Starting Seeder ---');

    // 1. Limpar dados existentes
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // 2. Criar Users
    const userPromises = Array.from({ length: 20 }).map((_, i) => {
        return prisma.user.create({
            data: {
                name: `Dog Lover ${i + 1}`,
                email: `user${i + 1}@example.com`,
            },
        });
    });

    const users = await Promise.all(userPromises);
    console.log(`✅ ${users.length} users created`);

    // 3. Criar Cursos
    const coursesData = [
        {
            title: 'Noções básicas para filhotes: socialização',
            description: 'A base para todo cão feliz. Aprenda a apresentar seu filhote ao mundo.',
            price: 49.90,
            availableSlots: 10,
            sortOrder: 1,
        },
        {
            title: 'Obediência Intermediária',
            description: 'Domine os comandos "Fica", "Vem" e "Junto" em ambientes com distrações.',
            price: 75.00,
            availableSlots: 5, // Quase cheio para testares a race condition
            sortOrder: 2,
        },
        {
            title: 'Truques Avançados e Agility',
            description: 'Ensine seu cão a saltar obstáculos, rolar e completar circuitos de agility.',
            price: 120.00,
            availableSlots: 3, // Simular curso esgotado
            sortOrder: 3,
        },
        {
            title: 'Modificação Comportamental Especializada',
            description: 'Compreendendo a psicologia complexa e os comportamentos reativos.',
            price: 200.00,
            availableSlots: 20,
            sortOrder: 4,
        },
    ];

    for (const course of coursesData) {
        await prisma.course.create({ data: course });
    }

    console.log('✅ Courses created with hierarchy');
    console.log('--- 🐾 Seeding Finished! ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });