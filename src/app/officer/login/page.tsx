'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    Email as EmailIcon,
    Lock as LockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function OfficerLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('officer', JSON.stringify({
                    id: data.user.id,
                    email: data.user.email,
                    role: 'officer'
                }));
                router.push('/officer/dashboard');
            } else {
                setError(data.error || 'Login failed');
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
                            Officer Portal
                        </Typography>
                        <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '13px' }}>
                            Claims Review Center
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontWeight: 700 }}>{error}</Alert>}

                    <form onSubmit={handleLogin}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Officer Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Security Password"
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
                                    bgcolor: '#0284C7',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    '&:hover': { bgcolor: '#0369A1' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Access Review Center'}
                            </Button>
                        </Stack>
                    </form>

                </Paper>
            </motion.div>
        </Box>
    );
}
