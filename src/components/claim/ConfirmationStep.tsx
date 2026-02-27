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
    Divider,
    Stack,
    IconButton,
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
    Shield as ShieldCheckIcon,
    Launch as ExternalLinkIcon
} from '@mui/icons-material';

interface Props {
    formData: ClaimFormData;
}

export default function ConfirmationStep({ formData }: Props) {
    const router = useRouter();
    const [bankAccount, setBankAccount] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [submittingBank, setSubmittingBank] = useState(false);
    const [bankSubmitted, setBankSubmitted] = useState(false);

    const analysis = formData.aiAnalysis!;
    const isAutoApproved = analysis.recommendation === 'auto_approve';
    const amount = analysis.total_estimate.final_claim_amount;
    const now = new Date();

    const handleDownloadReport = () => {
        generateClaimReport({
            claimId: formData.claimNumber || 'N/A',
            policyNumber: formData.policy?.policy_number || 'N/A',
            holderName: formData.policy?.holder_name || 'N/A',
            vehicleModel: formData.policy?.vehicle_model || 'N/A',
            vehicleReg: formData.policy?.vehicle_registration || 'N/A',
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
        toast.success('Report downloaded successfully');
    };

    const handleBankSubmit = async () => {
        setSubmittingBank(true);
        try {
            const res = await fetch(`/api/claims/${formData.claimNumber}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bankDetails: { account: bankAccount, ifsc },
                    status: isAutoApproved ? 'settled' : undefined,
                }),
            });
            if (res.ok) {
                setBankSubmitted(true);
                toast.success('Bank details saved for settlement');
            } else {
                toast.error('Failed to save bank details');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setSubmittingBank(false);
        }
    };

    const timeline = [
        { done: true, label: 'Policy Verified', time: format(now, 'hh:mm a'), icon: ActivityIcon },
        { done: true, label: 'Evidence Validated', time: format(now, 'hh:mm a'), note: `${analysis.confidence_score.toFixed(0)}% accuracy`, icon: ZapIcon },
        {
            done: isAutoApproved,
            label: isAutoApproved ? 'Auto-Approved' : 'Queued for Officer Review',
            time: isAutoApproved ? format(now, 'hh:mm a') : 'T+30m',
            icon: isAutoApproved ? ShieldCheckIcon : ClockIcon,
        },
        { done: bankSubmitted, label: 'Bank Details Linked', time: bankSubmitted ? 'Active' : 'Awaiting', icon: CreditCardIcon },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: 680, mx: 'auto' }}>
            {/* Success header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
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
                    Claim Submitted!
                </Typography>
                <Typography variant="body2" sx={{ color: '#5B7692', maxWidth: 360, mx: 'auto' }}>
                    Your claim has been queued for settlement processing.
                </Typography>
            </Box>

            {/* Summary stats */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: '20px', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                <Grid container spacing={4}>
                    {[
                        { label: 'Claim ID', val: formData.claimNumber, mono: true, color: '#2D5F9E' },
                        {
                            label: 'Status', val: isAutoApproved ? 'Auto-Approved' : 'Pending Review',
                            badge: true, isGreen: isAutoApproved,
                        },
                        { label: 'Settlement Amount', val: `₹${amount.toLocaleString()}`, color: '#1E3A5F' },
                        { label: 'Payment Mode', val: 'Instant NEFT', color: '#1E3A5F' },
                    ].map((item: any) => (
                        <Grid size={{ xs: 6 }} key={item.label}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>{item.label}</Typography>
                            {item.badge ? (
                                <Chip
                                    label={item.val.toUpperCase()}
                                    size="small"
                                    sx={{
                                        fontWeight: 900, fontSize: '0.65rem',
                                        bgcolor: item.isGreen ? 'rgba(15, 157, 106, 0.1)' : 'rgba(229, 160, 32, 0.1)',
                                        color: item.isGreen ? '#0F9D6A' : '#92400E'
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
                    <AnimatePresence mode="wait">
                        {!bankSubmitted ? (
                            <motion.div
                                key="bank-form"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                                    <Box sx={{ bgcolor: 'rgba(240, 246, 255, 0.6)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #CBD8EA' }}>
                                        <Avatar sx={{ bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', width: 40, height: 40, borderRadius: '10px' }}>
                                            <CreditCardIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1E3A5F' }}>Settlement Details</Typography>
                                            <Typography variant="caption" sx={{ color: '#5B7692', display: 'block' }}>Link account for direct transfer</Typography>
                                        </Box>
                                    </Box>
                                    <Stack spacing={2.5} sx={{ p: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Account Number"
                                            placeholder="Enter account number"
                                            value={bankAccount}
                                            onChange={e => setBankAccount(e.target.value)}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="IFSC Code"
                                            placeholder="e.g. HDFC0001234"
                                            value={ifsc}
                                            onChange={e => setIfsc(e.target.value.toUpperCase())}
                                            inputProps={{ style: { textTransform: 'uppercase', fontFamily: 'monospace' } }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                        <Button
                                            disabled={bankAccount.length < 8 || ifsc.length < 11 || submittingBank}
                                            onClick={handleBankSubmit}
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                py: 1.5, borderRadius: '12px', bgcolor: '#2D5F9E', fontWeight: 800,
                                                '&:hover': { bgcolor: '#1E3A5F' }
                                            }}
                                        >
                                            {submittingBank ? <CircularProgress size={20} color="inherit" /> : 'Activate Settlement'}
                                        </Button>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="bank-done"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '20px', bgcolor: 'rgba(15, 157, 106, 0.04)', border: '1.5px solid rgba(15, 157, 106, 0.2)' }}>
                                    <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'rgba(15, 157, 106, 0.1)', color: '#0F9D6A' }}>
                                        <ShieldCheckIcon sx={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#065F46', mb: 0.5 }}>Bank Linked!</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F9D6A', textTransform: 'uppercase', letterSpacing: 1 }}>Settlement initiated — within 24 hours</Typography>
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1.2, mb: 3, display: 'block' }}>Claim Timeline</Typography>
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

            {/* Actions */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReport}
                    sx={{ py: 1.5, borderRadius: '12px', borderColor: '#CBD8EA', color: '#5B7692', fontWeight: 700, '&:hover': { borderColor: '#2D5F9E', color: '#2D5F9E' } }}
                >
                    Download Report
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<WhatsAppIcon />}
                    sx={{ py: 1.5, borderRadius: '12px', borderColor: '#CBD8EA', color: '#5B7692', fontWeight: 700, '&:hover': { borderColor: '#25D366', color: '#25D366' } }}
                >
                    WhatsApp Update
                </Button>
            </Stack>
            <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowRightIcon />}
                onClick={() => router.push('/claim/track')}
                sx={{
                    py: 2, borderRadius: '12px', bgcolor: '#1E3A5F', fontWeight: 800, fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(30, 58, 95, 0.2)',
                    '&:hover': { bgcolor: '#152D4A', transform: 'translateY(-2px)' }
                }}
            >
                Track Your Claim
            </Button>
        </Box>
    );
}
