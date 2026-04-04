'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    Button as MuiButton,
    Alert,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import {
    Person as PersonIcon,
    PhoneIphone as PhoneIcon,
    Email as EmailIcon,
    Lock as LockIcon,
} from '@mui/icons-material';

import { useAuth } from '@/context/AuthContext';
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
    const [error, setError] = useState('');

    // Step 2 State
    const [otpCode, setOtpCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
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
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
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
                setStep(2);
                setTimeLeft(30);
                setCanResend(false);
                setError('');
            } else {
                setError(data.error || 'Registration failed');
                setIsSubmitting(false);
            }
        } catch (error) {
            setError('Network error during registration');
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpCode.length !== 6) return;

        setError('');
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/verify-register-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp_code: otpCode }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                login(data.user);
                // Redirect will be handled by the useEffect above
            } else {
                setError(data.error || 'Invalid OTP');
                setIsSubmitting(false);
            }
        } catch (error) {
            setError('Network error verifying OTP');
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, purpose: 'register' }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setTimeLeft(30);
                setCanResend(false);
            } else {
                setError(data.error || 'Failed to resend OTP');
            }
        } catch (error) {
            setError('Network error resending OTP');
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
                {/* Glass Card - Surveyor Style */}
                <Paper
                    sx={{
                        p: 4.5,
                        width: '100%',
                        maxWidth: 480,
                        borderRadius: '28px',
                        boxShadow: '0 20px 40px rgba(30, 58, 95, 0.1)',
                        backdropFilter: 'blur(10px)',
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 1)'
                    }}
                >
                    {/* Logo Area */}
                    <Box sx={{ textAlign: 'center', marginBottom: '32px' }}>
                        <Link href="/" className="inline-block relative group">
                            <Logo variant="dark" />
                            <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </Link>
                        <Typography variant="h4" sx={{ marginTop: '20px', fontFamily: 'serif', color: '#111827', fontWeight: 600 }}>
                            Create your account
                        </Typography>
                        <Typography sx={{ marginTop: '8px', color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>
                            Join ClaimNova for instant claim settlements
                        </Typography>
                    </Box>

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
                                aria-label="User registration form step 1"
                                noValidate
                            >
                                <Stack spacing={3}>
                                    {error && (
                                        <Alert severity="error" sx={{ borderRadius: '12px' }}>
                                            {error}
                                        </Alert>
                                    )}

                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        id="fullName"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Rahul Sharma"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '52px',
                                                borderRadius: '14px',
                                                backgroundColor: '#fff',
                                                '& fieldset': { borderColor: '#E5E7EB' },
                                                '&:hover fieldset': { borderColor: '#2563EB' },
                                                '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                                            },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Mobile Number"
                                        id="mobile"
                                        type="tel"
                                        required
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                        placeholder="9876543210"
                                        inputProps={{
                                            pattern: '[0-9]{10}',
                                            maxLength: 10,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                            prefix: '+91 ',
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '52px',
                                                borderRadius: '14px',
                                                backgroundColor: '#fff',
                                                '& fieldset': { borderColor: '#E5E7EB' },
                                                '&:hover fieldset': { borderColor: '#2563EB' },
                                                '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                                            },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Email (Optional)"
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="rahul@example.com"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '52px',
                                                borderRadius: '14px',
                                                backgroundColor: '#fff',
                                                '& fieldset': { borderColor: '#E5E7EB' },
                                                '&:hover fieldset': { borderColor: '#2563EB' },
                                                '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                                            },
                                        }}
                                    />

                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            inputProps={{
                                                minLength: 8,
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    height: '52px',
                                                    borderRadius: '14px',
                                                    backgroundColor: '#fff',
                                                    '& fieldset': { borderColor: '#E5E7EB' },
                                                    '&:hover fieldset': { borderColor: '#2563EB' },
                                                    '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Confirm"
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            error={!!(confirmPassword && password !== confirmPassword)}
                                            inputProps={{
                                                minLength: 8,
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    height: '52px',
                                                    borderRadius: '14px',
                                                    backgroundColor: '#fff',
                                                    '& fieldset': { borderColor: '#E5E7EB' },
                                                    '&:hover fieldset': { borderColor: '#2563EB' },
                                                    '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                                                    '&.Mui-error fieldset': { borderColor: '#EF4444' },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {confirmPassword && password !== confirmPassword && (
                                        <Typography sx={{ color: '#DC2626', fontSize: '14px', fontWeight: 500 }}>
                                            Passwords do not match
                                        </Typography>
                                    )}

                                    <MuiButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isSubmitting || password !== confirmPassword || mobile.length !== 10}
                                        sx={{
                                            height: '52px',
                                            backgroundColor: '#2563EB',
                                            color: '#fff',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            borderRadius: '14px',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                            '&:hover': {
                                                backgroundColor: '#1D4ED8',
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#D1D5DB',
                                                color: '#fff',
                                            },
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress size={24} sx={{ color: 'inherit' }} />
                                        ) : (
                                            'Send OTP & Continue'
                                        )}
                                    </MuiButton>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                                            Already have an account?{' '}
                                            <Link href="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                                                Login here
                                            </Link>
                                        </Typography>
                                    </Box>
                                </Stack>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Stack spacing={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                                            Verify your mobile
                                        </Typography>
                                        <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
                                            We sent a 6-digit code to <span style={{ fontWeight: 600, color: '#374151' }}>+91 *****{mobile.slice(-4)}</span>
                                        </Typography>
                                        <MuiButton
                                            onClick={() => setStep(1)}
                                            sx={{
                                                mt: 1,
                                                fontSize: '12px',
                                                color: '#2563EB',
                                                fontWeight: 500,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    background: 'transparent',
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Wrong number? Edit
                                        </MuiButton>
                                    </Box>

                                    {error && (
                                        <Alert severity="error" sx={{ borderRadius: '12px' }}>
                                            {error}
                                        </Alert>
                                    )}

                                    <Box sx={{ py: 2 }}>
                                        <label htmlFor="otpInput" className="sr-only">Enter 6-digit OTP code</label>
                                        <OtpInput
                                            length={6}
                                            onComplete={(code) => {
                                                setOtpCode(code);
                                            }}
                                            onChange={setOtpCode}
                                            disabled={isSubmitting}
                                        />
                                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#6B7280', textAlign: 'center' }}>
                                            Enter the 6-digit code sent to your phone
                                        </Typography>
                                    </Box>

                                    <MuiButton
                                        onClick={handleVerifyOtp}
                                        fullWidth
                                        variant="contained"
                                        disabled={isSubmitting || otpCode.length !== 6}
                                        sx={{
                                            height: '52px',
                                            backgroundColor: '#2563EB',
                                            color: '#fff',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            borderRadius: '14px',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                            '&:hover': {
                                                backgroundColor: '#1D4ED8',
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#D1D5DB',
                                                color: '#fff',
                                            },
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress size={24} sx={{ color: 'inherit' }} />
                                        ) : (
                                            'Verify & Create Account'
                                        )}
                                    </MuiButton>

                                    <Box sx={{ textAlign: 'center' }}>
                                        {timeLeft > 0 ? (
                                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                                Resend code in{' '}
                                                <span style={{ fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>
                                                    00:{timeLeft.toString().padStart(2, '0')}
                                                </span>
                                            </Typography>
                                        ) : (
                                            <MuiButton
                                                onClick={handleResendOtp}
                                                disabled={!canResend || isSubmitting}
                                                sx={{
                                                    fontSize: '14px',
                                                    color: '#2563EB',
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        color: '#1D4ED8',
                                                    },
                                                    '&:disabled': {
                                                        color: '#D1D5DB',
                                                    },
                                                }}
                                            >
                                                Resend OTP
                                            </MuiButton>
                                        )}
                                    </Box>
                                </Stack>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Paper>
            </motion.div>
        </div>
    );
}
