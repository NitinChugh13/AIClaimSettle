'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OtpInput } from '@/components/auth/OtpInput';
import Logo from '@/components/Logo';

export default function RegisterPage() {
    const router = useRouter();
    const { user, login } = useAuth();

    // Step 1 State
    const [step, setStep] = useState<1 | 2>(1);
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step 2 State
    const [otpCode, setOtpCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (user) {
            router.push('/dashboard'); // or onboarding
        }
    }, [user, router]);

    // Timer for OTP Resend
    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (step === 2 && timeLeft === 0) {
            setCanResend(true);
        }
    }, [step, timeLeft]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, mobile, email, password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(data.message || 'OTP sent to your mobile');
                setStep(2);
                setTimeLeft(30);
                setCanResend(false);
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('Network error during registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpCode.length !== 6) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/verify-register-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp_code: otpCode }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Account created successfully!');
                login(data.user);
                // Redirect will be handled by the useEffect above
            } else {
                toast.error(data.error || 'Invalid OTP');
            }
        } catch (error) {
            toast.error('Network error verifying OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, purpose: 'register' }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('OTP resent successfully');
                setTimeLeft(30);
                setCanResend(false);
            } else {
                toast.error(data.error || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error('Network error resending OTP');
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
                    <h1 style={{ marginTop: '24px', fontSize: '30px', fontFamily: 'serif', color: '#111827', lineHeight: '1.2' }}>Create your account</h1>
                    <p style={{ marginTop: '8px', color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>Join ClaimNova for instant claim settlements</p>
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

                    {/* Multi-step progress indicator */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                        <div style={{ height: '4px', flex: 1, borderRadius: '999px', backgroundColor: step >= 1 ? '#2563EB' : '#E5E7EB', transition: 'background-color 0.5s' }} />
                        <div style={{ height: '4px', flex: 1, borderRadius: '999px', backgroundColor: step >= 2 ? '#2563EB' : '#E5E7EB', transition: 'background-color 0.5s' }} />
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleRegister}
                                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Rahul Sharma"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                                            style={{ height: '52px' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{
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
                                            }}>
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
                                        <Label htmlFor="email">Email <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>(Optional)</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="rahul@example.com"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                                            style={{ height: '52px' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                minLength={8}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                                                style={{ height: '52px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <Label htmlFor="confirmPassword">Confirm</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                required
                                                minLength={8}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl ${confirmPassword && password !== confirmPassword ? 'border-red-400' : ''}`}
                                                style={{ height: '52px' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || password !== confirmPassword || mobile.length !== 10}
                                    className="w-full text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
                                    style={{ height: '52px', border: 'none' }}
                                >
                                    {isSubmitting ? 'Sending OTP...' : 'Send OTP & Continue'}
                                </Button>

                                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                    <p style={{ fontSize: '14px', color: '#6B7280' }}>
                                        Already have an account?{' '}
                                        <Link href="/login" style={{ color: '#2563EB', fontWeight: 600 }}>
                                            Login here
                                        </Link>
                                    </p>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                            >
                                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Verify your mobile</h2>
                                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                                        We sent a 6-digit code to <span style={{ fontWeight: 600, color: '#374151' }}>+91 *****{mobile.slice(-4)}</span>
                                    </p>
                                    <button
                                        onClick={() => setStep(1)}
                                        style={{ fontSize: '12px', color: '#2563EB', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Wrong number? Edit
                                    </button>
                                </div>

                                <div className="py-4">
                                    <OtpInput
                                        length={6}
                                        onComplete={(code) => {
                                            setOtpCode(code);
                                            // Optional UX enhancement: Automatically submit here
                                        }}
                                        onChange={setOtpCode}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <Button
                                        onClick={handleVerifyOtp}
                                        disabled={isSubmitting || otpCode.length !== 6}
                                        className="w-full text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
                                        style={{ height: '52px', border: 'none' }}
                                    >
                                        {isSubmitting ? 'Verifying...' : 'Verify & Create Account'}
                                    </Button>

                                    <div className="text-center">
                                        {timeLeft > 0 ? (
                                            <p className="text-sm text-gray-500">
                                                Resend code in <span className="font-medium text-gray-700 text-mono">00:{timeLeft.toString().padStart(2, '0')}</span>
                                            </p>
                                        ) : (
                                            <button
                                                onClick={handleResendOtp}
                                                disabled={!canResend || isSubmitting}
                                                className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
