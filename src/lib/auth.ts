import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const SESSION_COOKIE_NAME = 'saas_session_id';
const SESSION_EXPIRY_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // Store in DB
    await prisma.session.create({
        data: {
            id: sessionId,
            userId,
            expiresAt,
        },
    });

    // Set Cookie - Await cookies() for Next.js 15
    (await cookies()).set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    });
}

export async function getSession() {
    const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) return null;

    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        return null;
    }

    // Optional: Rotate session if close to expiry
    return session;
}

export async function logout() {
    const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (sessionId) {
        await prisma.session.delete({ where: { id: sessionId } }).catch(() => { });
    }
    (await cookies()).delete(SESSION_COOKIE_NAME);
    redirect('/login');
}

export async function requireAuth() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }
    return session;
}

export async function requireAdmin() {
    const session = await getSession();
    if (!session || !session.user.isGlobalAdmin) {
        redirect('/dashboard'); // or /unauthorized
    }
    return session;
}
