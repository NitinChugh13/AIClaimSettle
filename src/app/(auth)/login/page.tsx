'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    InputAdornment,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    PhoneIphone as PhoneIcon,
    Lock as LockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const router = useRouter();
    const { user, login } = useAuth();

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (mobile.length !== 10) {
            setError('Mobile number must be 10 digits');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                login(data.user);
                // Redirect is handled by the useEffect above
            } else {
                setError(data.error || 'Invalid credentials');
                setLoading(false);
            }
        } catch (err) {
            setError('Network error during login');
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F0F6FF',
            p: 3
        }} className="page-gradient-static">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Paper sx={{
                    p: 4.5,
                    width: '100%',
                    maxWidth: 480,
                    borderRadius: '28px',
                    boxShadow: '0 20px 40px rgba(30, 58, 95, 0.1)',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 1)'
                }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Logo variant="dark" />
                        <Typography variant="h5" fontWeight="900" sx={{ color: '#1E3A5F', mt: 3, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            User Portal
                        </Typography>
                        <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '13px' }}>
                            Claim Management Hub
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontWeight: 700 }}>{error}</Alert>}

                    <form onSubmit={handleLogin}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                inputProps={{
                                    maxLength: 10,
                                    pattern: '[0-9]{10}',
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    height: 52,
                                    borderRadius: '14px',
                                    bgcolor: '#1E3A5F',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    '&:hover': { bgcolor: '#2D5F9E' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login to Dashboard'}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 1 }}>
                                <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                                    Don't have an account?{' '}
                                    <Link href="/register" style={{ color: '#1E3A5F', fontWeight: 600, textDecoration: 'none' }}>
                                        Register here
                                    </Link>
                                </Typography>
                            </Box>
                        </Stack>
                    </form>

                </Paper>
            </motion.div>
        </Box>
    );
}
