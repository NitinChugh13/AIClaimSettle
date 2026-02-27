'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { findPolicy, generateClaimNumber } from '@/lib/demo-data';
import type { Policy } from '@/types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Grid,
    Divider,
    Avatar,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import {
    Shield as ShieldIcon,
    Info as InfoIcon,
    ErrorOutline as AlertIcon,
    ChevronRight as ChevronRightIcon,
    Numbers as HashIcon,
    ArrowForward as ArrowRightIcon,
    DirectionsCar as CarIcon,
    Assignment as PolicyIcon
} from '@mui/icons-material';

const schema = z.object({
    policyNumber: z.string().min(5, 'Enter your policy number'),
    vehicleReg: z.string().min(4, 'Enter your vehicle registration number'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    onComplete: (policy: Policy, claimNumber: string) => void;
}

export default function PolicyVerificationStep({ onComplete }: Props) {
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foundPolicy, setFoundPolicy] = useState<Policy | null>(null);
    const [claimNumber] = useState(generateClaimNumber());

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setIsVerifying(true);
        setError(null);

        await new Promise(r => setTimeout(r, 1500));

        const policy = findPolicy(values.policyNumber.trim(), values.vehicleReg.trim());

        if (!policy) {
            setError('No active policy found for this combination. Please check your credentials.');
            setIsVerifying(false);
            return;
        }

        if (policy.status !== 'active') {
            setError(`Your policy is ${policy.status}. Only active policies are eligible for claims.`);
            setIsVerifying(false);
            return;
        }

        setFoundPolicy(policy);
        setIsVerifying(false);
    };

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
                    Sync your coverage details to begin the claim process.
                </Typography>
            </Box>

            {/* Demo hint */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Paper sx={{
                    p: 2.5,
                    mb: 4,
                    borderRadius: '16px',
                    bgcolor: 'rgba(229, 160, 32, 0.04)',
                    border: '1px solid rgba(229, 160, 32, 0.2)',
                    borderLeft: '4px solid #E5A020'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(229, 160, 32, 0.1)', color: '#E5A020', width: 32, height: 32 }}>
                            <InfoIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#92400E', display: 'block', mb: 1 }}>
                                Demo Credentials
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#78350F', fontWeight: 600, width: 34, mt: 0.2 }}>POL:</Typography>
                                    <Typography variant="caption" sx={{
                                        color: '#78350F',
                                        fontFamily: 'monospace',
                                        bgcolor: 'rgba(229, 160, 32, 0.08)',
                                        px: 0.5,
                                        borderRadius: 0.5,
                                        wordBreak: 'break-all',
                                        lineHeight: 1.4
                                    }}>
                                        SecureShield Insurance/2024/MH/001234
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#78350F', fontWeight: 600, width: 34 }}>REG:</Typography>
                                    <Typography variant="caption" sx={{ color: '#78350F', fontFamily: 'monospace', bgcolor: 'rgba(229, 160, 32, 0.08)', px: 0.5, borderRadius: 0.5 }}>MH02AB1234</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>

            <AnimatePresence mode="wait">
                {!foundPolicy ? (
                    <motion.div
                        key="verify-form"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                        <Paper sx={{ p: 4, borderRadius: '20px', boxShadow: '0 4px 24px rgba(30, 58, 95, 0.08)', border: '1px solid #CBD8EA' }}>
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Policy Number"
                                    placeholder="e.g. SecureShield Insurance/2024/MH/001234"
                                    {...register('policyNumber')}
                                    error={!!errors.policyNumber}
                                    helperText={errors.policyNumber?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PolicyIcon sx={{ color: '#8DA5BE' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Vehicle Registration Number"
                                    placeholder="e.g. MH02AB1234"
                                    {...register('vehicleReg')}
                                    error={!!errors.vehicleReg}
                                    helperText={errors.vehicleReg?.message}
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CarIcon sx={{ color: '#8DA5BE' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: '10px' }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isVerifying}
                                    endIcon={!isVerifying && <ChevronRightIcon />}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: '12px',
                                        bgcolor: '#2D5F9E',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        boxShadow: '0 6px 20px rgba(45, 95, 158, 0.2)',
                                        '&:hover': { bgcolor: '#1E3A5F', transform: 'translateY(-2px)' },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isVerifying ? <CircularProgress size={24} color="inherit" /> : 'Verify Policy'}
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>
                ) : (
                    /* Policy found */
                    <motion.div
                        key="policy-details"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Paper sx={{ p: 4, borderRadius: '20px', border: '1.5px solid rgba(15, 157, 106, 0.3)', boxShadow: '0 8px 32px rgba(15, 157, 106, 0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pb: 2, borderBottom: '1px solid rgba(15, 157, 106, 0.1)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(15, 157, 106, 0.1)', color: '#0F9D6A', width: 48, height: 48 }}>
                                        <ShieldIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#065F46' }}>Policy Verified</Typography>
                                        <Typography variant="caption" fontWeight="bold" sx={{ color: '#0F9D6A', textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Coverage Active
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ bgcolor: 'rgba(15, 157, 106, 0.1)', color: '#0F9D6A', px: 2, py: 0.5, borderRadius: '10px', fontWeight: 800 }}>
                                    {foundPolicy.status.toUpperCase()}
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {[
                                    { label: 'Policyholder', value: foundPolicy.holder_name },
                                    { label: 'Vehicle Model', value: foundPolicy.vehicle_model },
                                    { label: 'Registration No.', value: foundPolicy.vehicle_registration, mono: true, highlight: true },
                                    { label: 'IDV Value', value: `₹${foundPolicy.idv.toLocaleString('en-IN')}` },
                                    { label: 'Policy Expiry', value: format(new Date(foundPolicy.policy_end_date), 'dd MMM yyyy') },
                                    { label: 'Zero Depreciation', value: foundPolicy.zero_depreciation ? 'Included' : 'Excluded', success: foundPolicy.zero_depreciation },
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

                        <Paper sx={{ p: 2.5, mt: 3, borderRadius: '16px', bgcolor: 'rgba(45, 95, 158, 0.04)', border: '1px solid rgba(45, 95, 158, 0.12)', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(45, 95, 158, 0.1)', color: '#2D5F9E', width: 44, height: 44, borderRadius: '12px' }}>
                                <HashIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#2D5F9E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                                    Your Claim ID
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ color: '#1E3A5F', fontFamily: 'monospace' }}>
                                    {claimNumber}
                                </Typography>
                            </Box>
                        </Paper>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                            <Button
                                onClick={() => onComplete(foundPolicy, claimNumber)}
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
                                Continue to Step 2
                            </Button>
                            <Button
                                onClick={() => setFoundPolicy(null)}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderRadius: '12px',
                                    borderColor: '#8DA5BE',
                                    color: '#5B7692',
                                    fontWeight: 600,
                                    '&:hover': { borderColor: '#2D5F9E', color: '#2D5F9E' }
                                }}
                            >
                                Use Different Policy
                            </Button>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}
