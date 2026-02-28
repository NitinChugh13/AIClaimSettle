'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Admin authentication successful');
                router.push('/admin');
            } else {
                toast.error(data.error || 'Invalid credentials');
            }
        } catch (error) {
            toast.error('Network error during login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-x-hidden"
            style={{
                background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
                backgroundSize: 'Cover',
            }}
        >
            {/* Background Orbs */}
            <div
                className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
                style={{
                    background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)',
                    zIndex: 0,
                }}
            />
            <div
                className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
                style={{
                    background: 'radial-gradient(circle, #1E3A5F 0%, transparent 70%)',
                    zIndex: 0,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md mx-auto z-10 relative"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                        <Logo variant="dark" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Admin Portal</h1>
                    <p className="text-gray-500 mt-2 font-medium tracking-wide border-t border-gray-100 pt-2 mx-auto max-w-[200px]">ClaimNova Administration</p>
                </div>

                {/* Glass Card */}
                <div
                    className="border border-white/40 shadow-2xl relative bg-white/80 backdrop-blur-xl p-10 rounded-[32px] overflow-hidden"
                >
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@claimnova.in"
                                    className="h-12 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Security Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !email || !password}
                            className="w-full h-12 bg-[#1E3A5F] hover:bg-[#152D4A] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/10"
                        >
                            {isSubmitting ? 'Verifying...' : 'Access Administration'}
                        </Button>

                        <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Developer Access</p>
                            <p className="text-sm font-mono text-gray-600">admin@claimnova.in / Admin@1234</p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
