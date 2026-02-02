'use client';

import { useTransition, useState } from 'react';
import { createUserAction } from '@/actions/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// toast is deprecated but sonner is installed as sonner.tsx
import { toast } from "sonner"; // Assuming you have a toast wrapper or using it directly

export default function CreateUserForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await createUserAction(null, formData);
            if (result?.error) {
                setError(result.error);
                // toast.error(result.error);
            } else {
                // toast.success("User created!");
                // Close dialog logic would go here if we lifted state up
                // For now, page revalidates so users see new entry
            }
        });
    }

    return (
        <form action={onSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="USER">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">Standard User</SelectItem>
                        <SelectItem value="ADMIN">Administrator</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Account"}
            </Button>
        </form>
    );
}
