'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, Car, Calendar, CreditCard, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function OnboardingPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [policyNumber, setPolicyNumber] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifiedPolicy, setVerifiedPolicy] = useState<any>(null);
    const [isLinking, setIsLinking] = useState(false);

    // Redirect if already has policy linked
    useEffect(() => {
        if (user?.policy_verified) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        try {
            const res = await fetch('/api/policies/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    policy_number: policyNumber.trim().toUpperCase(),
                    vehicle_number: vehicleNumber.trim().toUpperCase()
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setVerifiedPolicy(data.policy);
                toast.success('Policy verified successfully!');
            } else {
                toast.error(data.error || 'Verification failed');
            }
        } catch (error) {
            toast.error('Network error during verification');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleLinkPolicy = async () => {
        if (!verifiedPolicy) return;
        setIsLinking(true);
        try {
            const res = await fetch('/api/auth/update-policy', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    policy_id: verifiedPolicy.id,
                    policy_number: verifiedPolicy.policy_number
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Policy linked to your account!');
                await refreshUser();
                router.push('/dashboard');
            } else {
                toast.error(data.error || 'Failed to link policy');
            }
        } catch (error) {
            toast.error('Network error linking policy');
        } finally {
            setIsLinking(false);
        }
    };

    return (
        <div
            className="min-h-screen relative flex items-center justify-center px-4 py-20 overflow-x-hidden"
            style={{
                background: 'linear-gradient(135deg, #C8DEFF 0%, #EAF2FF 35%, #F0F6FF 65%, #D6E8FF 100%)',
                backgroundSize: '300% 300%',
                animation: 'gradientShift 12s ease infinite',
            }}
        >
            {/* Background Orbs */}
            <div
                className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,196,0.25) 0%, transparent 70%)',
                    zIndex: 0,
                    animation: 'floatOrb 8s ease-in-out infinite'
                }}
            />
            <div
                className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(30,58,95,0.20) 0%, transparent 70%)',
                    zIndex: 0,
                    animation: 'floatOrb 10s ease-in-out infinite reverse'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg mx-auto z-10 relative"
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Logo variant="dark" />
                    <h1 style={{ marginTop: '24px', fontSize: '30px', fontWeight: 700, color: '#111827' }}>
                        Link Your Insurance Policy
                    </h1>
                    <p style={{ marginTop: '8px', color: '#6B7280' }}>
                        Connect your active motor policy to access your dashboard
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!verifiedPolicy ? (
                        <motion.div
                            key="verify-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[32px] p-8 sm:p-10"
                            style={{
                                background: 'rgba(255, 255, 255, 0.90)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                                <div style={{ padding: '16px', borderRadius: '999px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                                    <Shield size={32} />
                                </div>
                            </div>

                            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Label htmlFor="policyNum">Policy Number</Label>
                                    <Input
                                        id="policyNum"
                                        placeholder="POL-MH-2024-00142"
                                        value={policyNumber}
                                        onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())}
                                        required
                                        className="rounded-xl border-gray-200 h-13"
                                        style={{ height: '52px' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Label htmlFor="vehicleNum">Vehicle Registration Number</Label>
                                    <Input
                                        id="vehicleNum"
                                        placeholder="MH12AB1234"
                                        value={vehicleNumber}
                                        onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                                        required
                                        className="rounded-xl border-gray-200 h-13"
                                        style={{ height: '52px' }}
                                    />
                                    <p style={{ fontSize: '12px', color: '#6B7280' }}>
                                        Check your policy document for the exact vehicle number.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isVerifying}
                                    style={{ height: '52px', background: '#2563EB', color: 'white', borderRadius: '12px' }}
                                    className="w-full font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying Policy...
                                        </>
                                    ) : (
                                        'Verify & Link Policy'
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="policy-card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[32px] overflow-hidden"
                            style={{
                                background: 'rgba(255, 255, 255, 0.90)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                            }}
                        >
                            <div style={{ background: 'linear-gradient(to right, #2563EB, #3B82F6)', padding: '24px', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CheckCircle2 size={24} />
                                    <span style={{ fontWeight: 600 }}>Policy Verified Successfully!</span>
                                </div>
                            </div>

                            <div style={{ padding: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F3F4F6' }}>
                                            <Car size={20} color="#4B5563" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehicle Details</p>
                                            <p style={{ fontWeight: 600, fontSize: '16px' }}>
                                                {verifiedPolicy.vehicle_make} {verifiedPolicy.vehicle_model} ({verifiedPolicy.vehicle_year})
                                            </p>
                                            <p style={{ color: '#4B5563' }}>{verifiedPolicy.vehicle_number}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <Shield size={18} color="#2563EB" style={{ marginTop: '2px' }} />
                                            <div>
                                                <p style={{ fontSize: '12px', color: '#6B7280' }}>Insurer</p>
                                                <p style={{ fontWeight: 600, fontSize: '14px' }}>{verifiedPolicy.insurer_name}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <Calendar size={18} color="#2563EB" style={{ marginTop: '2px' }} />
                                            <div>
                                                <p style={{ fontSize: '12px', color: '#6B7280' }}>Valid Till</p>
                                                <p style={{ fontWeight: 600, fontSize: '14px' }}>{new Date(verifiedPolicy.policy_end_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Policy Type:</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{verifiedPolicy.policy_type}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>IDV Value:</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>₹{Number(verifiedPolicy.idv_value).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                                    <Button
                                        onClick={handleLinkPolicy}
                                        disabled={isLinking}
                                        style={{ height: '52px', background: '#2563EB', color: 'white', borderRadius: '12px' }}
                                        className="w-full font-semibold hover:bg-blue-600 transition-all"
                                    >
                                        {isLinking ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Linking Account...
                                            </>
                                        ) : (
                                            <>
                                                Continue to Dashboard
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setVerifiedPolicy(null)}
                                        style={{ color: '#4B5563' }}
                                    >
                                        Correct Details
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        Need help finding your details? <Link href="#" style={{ color: '#2563EB' }}>Contact Support</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
