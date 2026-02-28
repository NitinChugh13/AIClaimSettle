'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const router = useRouter();
    const { user, login } = useAuth();

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            router.push('/dashboard'); // or onboarding
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mobile.length !== 10) {
            toast.error('Mobile number must be 10 digits');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Login successful!');
                login(data.user);
                // Redirect is handled by the useEffect above
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
                background: 'linear-gradient(135deg, #C8DEFF 0%, #EAF2FF 35%, #F0F6FF 65%, #D6E8FF 100%)',
                backgroundSize: '300% 300%',
                animation: 'gradientShift 12s ease infinite',
            }}
        >

            {/* Orb 1 - Top Left */}
            <div
                className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,196,0.25) 0%, transparent 70%)',
                    zIndex: 0,
                    animation: 'floatOrb 8s ease-in-out infinite'
                }}
            />

            {/* Orb 2 - Bottom Right */}
            <div
                className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(30,58,95,0.20) 0%, transparent 70%)',
                    zIndex: 0,
                    animation: 'floatOrb 10s ease-in-out infinite reverse'
                }}
            />

            {/* Orb 3 - Center subtle */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(100,160,255,0.15) 0%, transparent 60%)',
                    zIndex: 0,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md mx-auto z-10 relative"
            >
                {/* Logo Area */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <Link href="/" className="inline-block relative group">
                        <Logo variant="dark" />
                        <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>
                    <h1 style={{ marginTop: '24px', fontSize: '30px', fontFamily: 'serif', color: '#111827', lineHeight: '1.2' }}>Welcome back</h1>
                    <p style={{ marginTop: '8px', color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>Please enter your details to sign in</p>
                </div>

                {/* Glass Card */}
                <div
                    className="border border-[#CBD8EA]/60 shadow-[0_8px_40px_rgba(30,58,95,0.12)] relative"
                    style={{
                        background: 'rgba(255, 255, 255, 0.90)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        padding: '48px',
                        borderRadius: '32px',
                        overflow: 'hidden'
                    }}
                >

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <div style={{ position: 'relative' }}>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 16px',
                                            fontWeight: 500,
                                            color: '#6B7280',
                                            backgroundColor: 'rgba(249, 250, 251, 0.5)',
                                            borderRight: '1px solid #E5E7EB',
                                            borderTopLeftRadius: '12px',
                                            borderBottomLeftRadius: '12px',
                                            zIndex: 10
                                        }}
                                    >
                                        +91
                                    </div>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        required
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                        placeholder="9876543210"
                                        className="border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                                        style={{ height: '52px', paddingLeft: '72px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toast.info("Forgot password flow coming soon");
                                        }}
                                        style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB' }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                                    style={{ height: '52px' }}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || mobile.length !== 10 || !password}
                            className="w-full text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
                            style={{ height: '52px', border: 'none' }}
                        >
                            {isSubmitting ? 'Signing in...' : 'Login to Dashboard'}
                        </Button>

                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <p style={{ fontSize: '14px', color: '#6B7280' }}>
                                Don't have an account?{' '}
                                <Link href="/register" style={{ color: '#2563EB', fontWeight: 600 }}>
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
