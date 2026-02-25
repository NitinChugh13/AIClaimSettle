'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Chip,
    Alert,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { findPolicy, generateClaimNumber } from '@/lib/demo-data';
import type { Policy } from '@/types';
import { format } from 'date-fns';

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

        // Simulate API call delay
        await new Promise(r => setTimeout(r, 1500));

        const policy = findPolicy(values.policyNumber.trim(), values.vehicleReg.trim());

        if (!policy) {
            setError('No active policy found for this combination. Please check your policy number and vehicle registration.');
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
        <Box sx={{ maxWidth: 640, mx: 'auto', p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>Verify Your Policy</Typography>
                <Typography variant="body1" color="text.secondary">
                    Enter your policy details to begin your claim
                </Typography>
            </Box>

            {/* Demo hint */}
            <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
                <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
                    🔶 Demo Mode — Use these test credentials:
                </Typography>
                <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    <Box>Policy: <strong>UIIC/2024/MH/001234</strong> | Reg: <strong>MH02AB1234</strong></Box>
                    <Box>Policy: <strong>OIC/2024/DL/005678</strong> | Reg: <strong>DL8CAF5678</strong></Box>
                </Box>
            </Alert>

            {!foundPolicy ? (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    id="policyNumber"
                                    label="Policy Number"
                                    placeholder="e.g. UIIC/2024/MH/001234"
                                    fullWidth
                                    variant="outlined"
                                    {...register('policyNumber')}
                                    error={!!errors.policyNumber}
                                    helperText={errors.policyNumber?.message}
                                />

                                <TextField
                                    id="vehicleReg"
                                    label="Vehicle Registration Number"
                                    placeholder="e.g. MH02AB1234"
                                    fullWidth
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                    {...register('vehicleReg')}
                                    error={!!errors.vehicleReg}
                                    helperText={errors.vehicleReg?.message}
                                />

                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={isVerifying}
                                    startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                    sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify Policy'}
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                /* Policy found card */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: '#a7f3d0', bgcolor: '#ecfdf5', borderRadius: 3 }}>
                        <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <CheckCircleIcon color="success" />
                                <Typography variant="h6" fontWeight="bold" color="success.dark">Policy Verified</Typography>
                                <Chip
                                    label={foundPolicy.status.toUpperCase()}
                                    size="small"
                                    color="success"
                                    sx={{ ml: 'auto', fontWeight: 'bold' }}
                                />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 6, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">Policyholder</Typography>
                                    <Typography variant="body2" fontWeight="bold">{foundPolicy.holder_name}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">Policy Number</Typography>
                                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>{foundPolicy.policy_number}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">Vehicle</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {foundPolicy.vehicle_make} {foundPolicy.vehicle_model} ({foundPolicy.vehicle_year})
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">Registration</Typography>
                                    <Typography variant="body2" fontWeight="bold">{foundPolicy.vehicle_registration}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">Insurer</Typography>
                                    <Typography variant="body2" fontWeight="bold">{foundPolicy.insurer_name}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">IDV</Typography>
                                    <Typography variant="body2" fontWeight="bold">₹{foundPolicy.idv.toLocaleString('en-IN')}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">Valid Till</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {format(new Date(foundPolicy.policy_end_date), 'dd MMM yyyy')}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }} >
                                    <Typography variant="caption" color="text.secondary" display="block">Zero Depreciation</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {foundPolicy.zero_depreciation ? '✅ Yes' : '❌ No'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: '#bfdbfe', bgcolor: '#eff6ff', borderRadius: 3 }}>
                        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:last-child': { pb: 3 } }}>
                            <Box>
                                <Typography variant="caption" color="primary.main" fontWeight="bold">Your Claim Reference</Typography>
                                <Typography variant="h5" fontWeight="bold" color="primary.dark" sx={{ fontFamily: 'monospace', mt: 0.5 }}>{claimNumber}</Typography>
                            </Box>
                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CarIcon color="primary" />
                            </Box>
                        </CardContent>
                    </Card>

                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        endIcon={<CheckCircleIcon />}
                        onClick={() => onComplete(foundPolicy, claimNumber)}
                        sx={{ py: 1.5, fontWeight: 'bold' }}
                    >
                        Proceed to Incident Details
                    </Button>

                    <Button
                        variant="text"
                        color="inherit"
                        onClick={() => setFoundPolicy(null)}
                        sx={{ color: 'text.secondary' }}
                    >
                        Search Different Policy
                    </Button>
                </Box>
            )}
        </Box>
    );
}
