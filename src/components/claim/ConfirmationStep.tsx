'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClaimFormData } from '@/app/claim/new/page';
import { format } from 'date-fns';
import { generateClaimReport } from '@/lib/pdf-generator';
import { toast } from 'sonner';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Avatar,
    TextField,
    CircularProgress,
    Stack,
    Chip
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    FileDownload as DownloadIcon,
    WhatsApp as WhatsAppIcon,
    AccessTime as ClockIcon,
    ArrowForward as ArrowRightIcon,
    FlashOn as ZapIcon,
    AccountBalanceWallet as CreditCardIcon,
    Insights as ActivityIcon,
    Shield as ShieldCheckIcon
} from '@mui/icons-material';

interface Props {
    formData: ClaimFormData;
}

export default function ConfirmationStep({ formData }: Props) {
    const router = useRouter();
    const analysis = formData.aiAnalysis!;
    const isAutoApproved = analysis.recommendation === 'auto_approve';
    const amount = analysis.total_estimate.final_claim_amount;
    const now = new Date();

    const handleDownloadReport = () => {
        if (!generateClaimReport) {
            toast.error('PDF Generator not initialized');
            return;
        }

        generateClaimReport({
            claimId: formData.claimNumber || 'N/A',
            policyNumber: formData.policy?.policy_number || 'N/A',
            holderName: formData.policy?.holder_name || 'N/A',
            vehicleModel: formData.policy?.vehicle_model || 'N/A',
            vehicleReg: formData.policy?.vehicle_number || 'N/A',
            incidentType: formData.incidentType || 'N/A',
            incidentDate: formData.incidentDate || format(new Date(), 'yyyy-MM-dd'),
            incidentLocation: formData.incidentLocation || 'N/A',
            totalAmount: amount,
            damageItems: analysis.damage_items.map(item => ({
                partName: item.part_name,
                severity: item.damage_severity,
                action: item.ai_recommendation,
                netSubtotal: item.subtotal_net,
            })),
            status: isAutoApproved ? 'Approved' : 'Pending Review',
        });
        toast.success('IRDA-Compliant Report Generated');
    };

    const timeline = [
        { done: true, label: 'Policy Verified', time: format(now, 'hh:mm a'), icon: ActivityIcon },
        { done: true, label: 'Evidence Synced', time: format(now, 'hh:mm a'), note: `${analysis.confidence_score}% Match`, icon: ZapIcon },
        {
            done: true,
            label: isAutoApproved ? 'Auto-Approved' : 'Officer Review Initialized',
            time: format(now, 'hh:mm a'),
            icon: isAutoApproved ? ShieldCheckIcon : ClockIcon,
        },
        { done: true, label: 'Protocol Finalized', time: format(now, 'hh:mm a'), icon: ShieldCheckIcon },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: 680, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Avatar sx={{
                        width: 80, height: 80, mx: 'auto', mb: 3,
                        bgcolor: 'rgba(15, 157, 106, 0.08)',
                        border: '2px solid rgba(15, 157, 106, 0.3)',
                        boxShadow: '0 8px 24px rgba(15, 157, 106, 0.12)',
                        color: '#0F9D6A'
                    }}>
                        <CheckCircleIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                </motion.div>
                <Typography variant="h4" sx={{
                    fontFamily: '"DM Serif Display", serif',
                    color: '#1E3A5F',
                    mb: 1,
                    fontWeight: 700
                }}>
                    Claim Locked & Validated
                </Typography>
                <Typography variant="body2" sx={{ color: '#5B7692', maxWidth: 360, mx: 'auto' }}>
                    Your claim protocol has been successfully transmitted to the insurer nodes.
                </Typography>
            </Box>

            <Paper sx={{ p: 4, mb: 4, borderRadius: '20px', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                <Grid container spacing={4}>
                    {[
                        { label: 'Protocol ID', val: formData.claimNumber, mono: true, color: '#2D5F9E' },
                        {
                            label: 'Vector State', val: isAutoApproved ? 'Approved' : 'Awaiting Review',
                            badge: true, isGreen: isAutoApproved,
                        },
                        { label: 'Settlement Node', val: `₹${Math.round(amount).toLocaleString()}`, color: '#1E3A5F' },
                        { label: 'Transfer Channel', val: 'Direct NEFT', color: '#1E3A5F' },
                    ].map((item: any) => (
                        <Grid size={{ xs: 6 }} key={item.label}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>{item.label}</Typography>
                            {item.badge ? (
                                <Chip
                                    label={item.val.toUpperCase()}
                                    size="small"
                                    sx={{
                                        fontWeight: 900, fontSize: '0.65rem',
                                        bgcolor: item.isGreen ? 'rgba(15, 157, 106, 0.1)' : 'rgba(45, 95, 158, 0.1)',
                                        color: item.isGreen ? '#0F9D6A' : '#2D5F9E'
                                    }}
                                />
                            ) : (
                                <Typography variant="h6" fontWeight="bold" sx={{ color: item.color, fontFamily: item.mono ? 'monospace' : 'inherit' }}>{item.val}</Typography>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Paper sx={{
                            p: 4,
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, rgba(15, 157, 106, 0.05) 0%, rgba(15, 157, 106, 0.02) 100%)',
                            border: '1.5px solid rgba(15, 157, 106, 0.2)',
                            boxShadow: '0 10px 30px rgba(15, 157, 106, 0.08)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, opacity: 0.1 }}>
                                <CheckCircleIcon sx={{ fontSize: 120 }} />
                            </Box>

                            <Avatar sx={{
                                width: 64, height: 64, mx: 'auto', mb: 2,
                                bgcolor: '#0F9D6A', color: 'white',
                                boxShadow: '0 4px 12px rgba(15, 157, 106, 0.3)'
                            }}>
                                <CheckCircleIcon sx={{ fontSize: 32 }} />
                            </Avatar>

                            <Typography variant="h5" fontWeight="900" sx={{ color: '#065F46', mb: 1 }}>
                                Claim Submitted Successfully!
                            </Typography>

                            <Stack spacing={1.5} sx={{ my: 3, textAlign: 'left', bgcolor: 'rgba(255,255,255,0.5)', p: 2.5, borderRadius: '16px', border: '1px solid rgba(15,157,106,0.1)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#5B7692', textTransform: 'uppercase' }}>Claim Identifier</Typography>
                                    <Typography variant="body2" fontWeight="900" sx={{ color: '#1E3A5F', fontFamily: 'monospace' }}>{formData.claimNumber}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#5B7692', textTransform: 'uppercase' }}>AI Valuation</Typography>
                                    <Typography variant="body2" fontWeight="900" sx={{ color: '#0F9D6A' }}>₹{Math.round(amount).toLocaleString('en-IN')}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#5B7692', textTransform: 'uppercase' }}>Protocol Status</Typography>
                                    <Chip
                                        label="UNDER REVIEW"
                                        size="small"
                                        sx={{ height: 20, bgcolor: 'rgba(229, 160, 32, 0.1)', color: '#92400E', fontWeight: 900, fontSize: '0.6rem' }}
                                    />
                                </Box>
                            </Stack>

                            <Typography variant="body2" sx={{ color: '#5B7692', fontStyle: 'italic', mb: 0 }}>
                                "Our officer node will reconstruct and review your claim within 24-48 hours."
                            </Typography>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1.2, mb: 3, display: 'block' }}>Sync Timeline</Typography>
                        <Stack spacing={0}>
                            {timeline.map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                                    {i < timeline.length - 1 && (
                                        <Box sx={{
                                            position: 'absolute', left: 17, top: 36, bottom: -4,
                                            width: 2, bgcolor: item.done ? 'rgba(15, 157, 106, 0.3)' : '#CBD8EA',
                                            zIndex: 0
                                        }} />
                                    )}
                                    <Avatar sx={{
                                        width: 36, height: 36, borderRadius: '10px',
                                        bgcolor: item.done ? 'rgba(15, 157, 106, 0.08)' : 'white',
                                        color: item.done ? '#0F9D6A' : '#8DA5BE',
                                        border: `2px solid ${item.done ? 'rgba(15, 157, 106, 0.3)' : '#CBD8EA'}`,
                                        zIndex: 1
                                    }}>
                                        <item.icon sx={{ fontSize: 16 }} />
                                    </Avatar>
                                    <Box sx={{ pb: 3, mt: 0.5 }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ color: item.done ? '#1E3A5F' : '#8DA5BE', display: 'block', lineHeight: 1 }}>{item.label}</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem', color: item.done ? '#0F9D6A' : '#8DA5BE' }}>{item.time}</Typography>
                                            {item.note && <Chip label={item.note.toUpperCase()} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 900, bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E' }} />}
                                        </Stack>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReport}
                    sx={{ py: 1.5, borderRadius: '12px', borderColor: '#CBD8EA', color: '#5B7692', fontWeight: 700, '&:hover': { borderColor: '#2D5F9E', color: '#2D5F9E' } }}
                >
                    IRDA Evidence Pack
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<WhatsAppIcon />}
                    sx={{ py: 1.5, borderRadius: '12px', borderColor: '#CBD8EA', color: '#5B7692', fontWeight: 700, '&:hover': { borderColor: '#25D366', color: '#25D366' } }}
                >
                    WhatsApp Report
                </Button>
            </Stack>
            <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowRightIcon />}
                onClick={() => router.push('/dashboard')}
                sx={{
                    py: 2, borderRadius: '12px', bgcolor: '#1E3A5F', fontWeight: 800, fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(30, 58, 95, 0.2)',
                    '&:hover': { bgcolor: '#152D4A', transform: 'translateY(-2px)' }
                }}
            >
                Return to Command Center
            </Button>
        </Box>
    );
}
