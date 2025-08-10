import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function handleLogin(formData: FormData) {
    'use server';

    const password = formData.get('password') as string;
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
        throw new Error('Admin secret not configured');
    }

    if (password === adminSecret) {
        (cookies() as any).set('admin_auth', adminSecret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,  
        });
        redirect('/admin');
    } else {
        redirect('/admin/login?error=invalid');
    }
}

export default function AdminLogin({
    searchParams,
}: {
    searchParams: { error?: string };
}) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="bg-card p-8 rounded-lg shadow-sm border max-w-sm w-full">
                <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Admin Login</h1>

                {searchParams.error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded mb-4 text-sm">
                        Invalid password
                    </div>
                )}

                <form action={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium mb-2 text-foreground">
                            Admin Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
                            placeholder="Enter admin password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}