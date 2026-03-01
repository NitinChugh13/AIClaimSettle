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
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Badge as LicenseIcon,
    PhoneIphone as MobileIcon,
    Engineering as SurveyorIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function SurveyorLoginPage() {
    const router = useRouter();
    const [license_number, setLicense] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/surveyor/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ license_number, mobile }),
            });

            const data = await res.json();

            if (data.success) {
                // Save for dashboard persistence
                localStorage.setItem('surveyor', JSON.stringify({
                    id: data.user.id,
                    full_name: data.user.full_name,
                    email: data.user.email,
                    license_number: data.user.license_number,
                    role: 'surveyor'
                }));
                router.push('/surveyor');
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
                                label="License Number"
                                value={license_number}
                                onChange={(e) => setLicense(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LicenseIcon sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><MobileIcon sx={{ color: '#94A3B8' }} /></InputAdornment>,
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


                </Paper>
            </motion.div>
        </Box>
    );
}
