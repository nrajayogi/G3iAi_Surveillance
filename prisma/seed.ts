import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);

    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash: hashedPassword,
            fullName: 'Super Admin',
            isGlobalAdmin: true,
        },
    });

    console.log('User created:', user.email);

    // 2. Create Default Organization
    const org = await prisma.organization.upsert({
        where: { slug: 'default-org' },
        update: {},
        create: {
            name: 'Default Organization',
            slug: 'default-org',
        },
    });

    // 3. Create Owner Role
    const role = await prisma.role.upsert({
        where: {
            organizationId_name: {
                organizationId: org.id,
                name: 'Owner',
            }
        },
        update: {},
        create: {
            name: 'Owner',
            description: 'Organization Owner with full access',
            permissions: JSON.stringify(['*']),
            organizationId: org.id,
        },
    });

    // 4. Link User to Org
    const member = await prisma.member.upsert({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId: org.id,
            }
        },
        update: {},
        create: {
            userId: user.id,
            organizationId: org.id,
        },
    });

    // Link Member to Role
    await prisma.memberRole.upsert({
        where: {
            memberId_roleId: {
                memberId: member.id,
                roleId: role.id,
            }
        },
        update: {},
        create: {
            memberId: member.id,
            roleId: role.id,
        },
    });

    console.log('Seeding finished successfully.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
