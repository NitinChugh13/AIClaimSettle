'use client';

import { useState, useEffect } from 'react';
import type { Policy } from '@/types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Avatar,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Shield as ShieldIcon,
    ChevronRight as ChevronRightIcon,
    ArrowForward as ArrowRightIcon,
    DirectionsCar as CarIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { toast } from 'sonner';

interface Props {
    onComplete: (policy: Policy) => void;
}

export default function PolicyVerificationStep({ onComplete }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [policy, setPolicy] = useState<Policy | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const res = await fetch('/api/policies/my-policy');
                if (res.ok) {
                    const data = await res.json();
                    setPolicy(data.policy);
                } else {
                    setError('No active policy found. Please link your policy in settings first.');
                }
            } catch (err) {
                setError('Failed to load policy details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolicy();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                <CircularProgress size={40} sx={{ color: '#2D5F9E', mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#5B7692' }}>Fetching your policy details...</Typography>
            </Box>
        );
    }

    if (error || !policy) {
        return (
            <Box sx={{ py: 4 }}>
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                    {error || 'Policy not found'}
                </Alert>
                <Button
                    href="/onboarding"
                    component="a"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, borderRadius: '12px', bgcolor: '#2D5F9E' }}
                >
                    Link Policy Now
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{
                    fontFamily: '"DM Serif Display", serif',
                    color: '#1E3A5F',
                    mb: 1,
                    fontWeight: 700
                }}>
                    Policy Verification
                </Typography>
                <Typography variant="body2" sx={{ color: '#5B7692' }}>
                    Your linked policy has been verified for this claim.
                </Typography>
            </Box>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Paper sx={{ p: 4, borderRadius: '20px', border: '1.5px solid rgba(15, 157, 106, 0.3)', boxShadow: '0 8px 32px rgba(15, 157, 106, 0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pb: 2, borderBottom: '1px solid rgba(15, 157, 106, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(15, 157, 106, 0.1)', color: '#0F9D6A', width: 48, height: 48 }}>
                                <CheckCircleIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#065F46' }}>Policy Verified ✅</Typography>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#0F9D6A', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {policy.policy_number}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" sx={{ bgcolor: 'rgba(15, 157, 106, 0.1)', color: '#0F9D6A', px: 2, py: 0.5, borderRadius: '10px', fontWeight: 800 }}>
                            ACTIVE
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {[
                            { label: 'Policyholder', value: policy.holder_name },
                            { label: 'Vehicle Model', value: `${policy.vehicle_make} ${policy.vehicle_model}` },
                            { label: 'Registration No.', value: policy.vehicle_number || (policy as any).vehicle_registration, mono: true, highlight: true },
                            { label: 'IDV Value', value: `₹${Number(policy.idv_value || (policy as any).idv).toLocaleString('en-IN')}` },
                            { label: 'Policy Expiry', value: format(new Date(policy.policy_end_date), 'dd MMM yyyy') },
                            { label: 'Zero Depreciation', value: policy.zero_depreciation ? 'Included' : 'Excluded', success: policy.zero_depreciation },
                        ].map(item => (
                            <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                                <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                                    {item.label}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" sx={{
                                    fontFamily: item.mono ? 'monospace' : 'inherit',
                                    color: item.highlight ? '#2D5F9E' : item.success !== undefined ? (item.success ? '#0F9D6A' : '#D32F2F') : '#1E3A5F'
                                }}>
                                    {item.value}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                <Box sx={{ mt: 4 }}>
                    <Button
                        onClick={() => onComplete(policy)}
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowRightIcon />}
                        sx={{
                            py: 2,
                            borderRadius: '12px',
                            bgcolor: '#2D5F9E',
                            fontWeight: 700,
                            boxShadow: '0 6px 20px rgba(45, 95, 158, 0.2)',
                            '&:hover': { bgcolor: '#1E3A5F', transform: 'translateY(-2px)' }
                        }}
                    >
                        Confirm Details & Proceed
                    </Button>
                </Box>
            </motion.div>
        </Box>
    );
}
