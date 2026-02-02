'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, createSession, logout as logoutLib } from '@/lib/auth';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function loginAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData);
    const result = loginSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid email or password format." };
    }

    const { email, password } = result.data;

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
        // Security: Generic error
        return { error: "Invalid credentials." };
    }

    if (user.isSuspended) {
        return { error: "Account suspended. Contact support." };
    }

    // Create Session
    await createSession(user.id);

    redirect('/dashboard');
}

export async function logoutAction() {
    await logoutLib();
}
