'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const createUserSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['USER', 'ADMIN']),
    badgeId: z.string().optional(),
    department: z.string().optional(),
    clearanceLevel: z.string().default("LEVEL_1"),
});

export async function createUserAction(prevState: any, formData: FormData) {
    // Ensure only admins can create users
    await requireAdmin();

    const data = Object.fromEntries(formData);
    const result = createUserSchema.safeParse(data);

    if (!result.success) {
        return { error: "Validation failed. Check your inputs." };
    }

    const { fullName, email, password, role, badgeId, department, clearanceLevel } = result.data;

    try {
        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { error: "User with this email already exists." };
        }

        const hashedPassword = await hashPassword(password);

        // Create User
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash: hashedPassword,
                isGlobalAdmin: role === 'ADMIN',
                badgeId,
                department,
                clearanceLevel,
            }
        });

        // Add to default org
        const defaultOrg = await prisma.organization.findFirst({ where: { slug: 'default-org' } });
        if (defaultOrg) {
            await prisma.member.create({
                data: {
                    userId: user.id,
                    organizationId: defaultOrg.id
                }
            });
        }

        revalidatePath('/dashboard/users');
        return { success: true, message: "User created successfully." };

    } catch (e) {
        console.error(e);
        return { error: "Database error. Failed to create user." };
    }
}
