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
    IconButton,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Engineering as SurveyorIcon,
    FlashOn as ZapIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function SurveyorLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('surveyor@claimnova.in'); // Placeholder if seeded, otherwise empty
    const [password, setPassword] = useState('Admin@1234');
    const [showPassword, setShowPassword] = useState(false);
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
                if (data.user.role === 'surveyor' || data.user.role === 'admin') {
                    router.push('/surveyor');
                } else {
                    setError('Access denied: Unauthorized role');
                    setLoading(false);
                }
            } else {
                setError(data.error || 'Login failed');
                setLoading(false);
            }
        } catch (err) {
            setError('System offline. Pulse check failed.');
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
                    maxWidth: 420,
                    borderRadius: '28px',
                    boxShadow: '0 20px 40px rgba(30, 58, 95, 0.1)',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 1)'
                }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Logo variant="dark" />
                        <Typography variant="h5" fontWeight="900" sx={{ color: '#1E3A5F', mt: 3, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Surveyor Portal
                        </Typography>
                        <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '13px' }}>
                            Field Inspection & Validation Node
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontWeight: 700 }}>{error}</Alert>}

                    <form onSubmit={handleLogin}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Surveyor Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Access Key"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Enter Field Node'}
                            </Button>
                        </Stack>
                    </form>

                    <Divider sx={{ my: 4 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800 }}>DEBUG CREDENTIALS</Typography>
                    </Divider>

                    <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <Typography sx={{ fontSize: '11px', color: '#64748B', fontWeight: 700, mb: 1 }}>
                            Use global officer account:
                        </Typography>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#1E3A5F' }}>officer@claimnova.in</Typography>
                            <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#1E3A5F' }}>Admin@1234</Typography>
                        </Stack>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
}
