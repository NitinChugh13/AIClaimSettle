'use client';

import { useState } from 'react';
import type { ClaimFormData } from '@/app/claim/new/page';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Avatar,
    Chip,
    Divider,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    CheckCircle as CheckCircleIcon,
    Assignment as ClipboardListIcon,
    Info as InfoIcon,
    FlashOn as FlashOnIcon,
    ErrorOutline as AlertCircleIcon
} from '@mui/icons-material';
import { toast } from 'sonner';

interface Props {
    formData: ClaimFormData;
    onSubmit: () => void;
    onBack: () => void;
}

export default function ResultsStep({ formData, onSubmit, onBack }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const analysis = formData.aiAnalysis;
    const policy = formData.policy;
    const claimId = formData.claimId;

    if (!analysis || !policy || !claimId) {
        return (
            <Box sx={{ width: '100%', textAlign: 'center', p: 8 }}>
                <AlertCircleIcon sx={{ fontSize: 48, color: '#D32F2F', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Analysis Data Missing</Typography>
                <Typography variant="body2" sx={{ color: '#5B7692', mb: 4 }}>We couldn't retrieve the analysis data. Please try again.</Typography>
                <Button onClick={onBack} variant="contained" sx={{ bgcolor: '#1E3A5F' }}>Go Back</Button>
            </Box>
        );
    }

    const ai_approved_amount = analysis.total_estimate.final_claim_amount;

    const handleAction = async (action: 'accept' | 'survey') => {
        setIsSubmitting(true);
        try {
            const status = action === 'accept' ? 'approved' : 'survey_requested';
            const payload: any = { status };

            if (action === 'accept') {
                payload.final_approved_amount = ai_approved_amount;
                payload.officer_notes = 'AI Settlement accepted by customer.';
            }

            const res = await fetch(`/api/claims/${claimId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                if (action === 'accept') {
                    onSubmit(); // Go to confirmation page
                } else {
                    toast.success('Survey request sent to officer');
                    window.location.href = '/dashboard';
                }
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || 'Failed to process request');
            }
        } catch (e) {
            toast.error('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 680, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{
                    fontFamily: '"DM Serif Display", serif',
                    color: '#1E3A5F',
                    mb: 1,
                    fontWeight: 700
                }}>
                    Final Assessment Review
                </Typography>
                <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#5B7692' }}>{policy.vehicle_make} {policy.vehicle_model}</Typography>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#CBD8EA' }} />
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#2D5F9E' }}>Claim #{formData.claimNumber}</Typography>
                </Stack>
            </Box>

            {/* AI Summary Card */}
            <Paper sx={{
                p: 4, mb: 4, borderRadius: '24px',
                bgcolor: 'white', border: '1px solid #CBD8EA',
                boxShadow: '0 8px 32px rgba(30, 58, 95, 0.08)'
            }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1 }}>Settlement Value</Typography>
                            <Typography variant="h4" fontWeight="900" sx={{ color: '#0F9D6A', mt: 1 }}>₹{ai_approved_amount.toLocaleString('en-IN')}</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ borderLeft: { sm: '1px solid #F0F6FF' }, borderRight: { sm: '1px solid #F0F6FF' } }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1 }}>Nova Confidence</Typography>
                            <Typography variant="h4" fontWeight="900" sx={{ color: '#2D5F9E', mt: 1 }}>{analysis.confidence_score}%</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1 }}>Risk Profile</Typography>
                            <Typography variant="h4" fontWeight="900" sx={{ color: '#1E3A5F', mt: 1 }}>
                                {analysis.fraud_indicators.length === 0 ? 'Low' : 'Moderate'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: '#F0F6FF' }} />

                <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1E3A5F', mb: 2, textTransform: 'uppercase' }}>IDENTIFIED DAMAGE</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {analysis.damage_items.map((item, idx) => (
                        <Chip
                            key={idx}
                            label={item.part_name}
                            icon={<FlashOnIcon sx={{ fontSize: '16px !important', color: '#E5A020 !important' }} />}
                            sx={{ borderRadius: '10px', fontWeight: 700, bgcolor: '#F8FAFD', border: '1px solid #CBD8EA' }}
                        />
                    ))}
                </Box>
            </Paper>

            <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 4, borderRadius: '16px' }}>
                You can choose to settle instantly based on AI assessment or request a physical survey if you prefer a manual inspection.
            </Alert>

            {/* Actions */}
            <Stack spacing={2}>
                <Button
                    disabled={isSubmitting}
                    onClick={() => handleAction('accept')}
                    variant="contained"
                    fullWidth
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                    sx={{
                        py: 2.2, borderRadius: '16px', bgcolor: '#0F9D6A', fontSize: '1.1rem',
                        color: 'white', fontWeight: 900,
                        boxShadow: '0 8px 24px rgba(15, 157, 106, 0.25)',
                        '&:hover': { bgcolor: '#0B8A5B', transform: 'translateY(-2px)' },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    Accept AI Settlement - ₹{ai_approved_amount.toLocaleString('en-IN')}
                </Button>

                <Button
                    disabled={isSubmitting}
                    onClick={() => handleAction('survey')}
                    variant="outlined"
                    fullWidth
                    startIcon={<ClipboardListIcon />}
                    sx={{
                        py: 2, borderRadius: '16px', borderColor: '#CBD8EA', color: '#1E3A5F',
                        fontWeight: 800, bgcolor: 'white',
                        '&:hover': { borderColor: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.04)' },
                        transition: 'all 0.2s'
                    }}
                >
                    Request Physical Survey
                </Button>

                <Button
                    onClick={onBack}
                    variant="text"
                    sx={{ color: '#8DA5BE', fontWeight: 700, mt: 2 }}
                >
                    Back to Evidence Review
                </Button>
            </Stack>
        </Box>
    );
}
