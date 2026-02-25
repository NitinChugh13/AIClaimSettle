'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    CircularProgress,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Download as DownloadIcon,
    WhatsApp as WhatsAppIcon,
    AccessTime as ClockIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import type { ClaimFormData } from '@/app/claim/new/page';
import { format } from 'date-fns';
import { generateClaimReport } from '@/lib/pdf-generator';
import { toast } from 'sonner';

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
                netSubtotal: item.subtotal_net
            })),
            status: isAutoApproved ? 'Approved' : 'Pending Review'
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
                    status: isAutoApproved ? 'settled' : undefined
                }),
            });
            if (res.ok) {
                setBankSubmitted(true);
                toast.success('Bank details saved for settlement');
            } else {
                toast.error('Failed to save bank details');
            }
        } catch (e) {
            toast.error('Network error');
        } finally {
            setSubmittingBank(false);
        }
    };

    const timeline = [
        { done: true, label: 'Claim Submitted', time: format(now, 'dd MMM yyyy, hh:mm a') },
        { done: true, label: 'AI Analysis Complete', time: format(now, 'dd MMM yyyy, hh:mm a'), note: `${analysis.confidence_score.toFixed(0)}% confidence` },
        {
            done: isAutoApproved,
            label: isAutoApproved ? 'Auto-Approved' : 'Sent to Officer Review',
            time: isAutoApproved ? format(now, 'dd MMM yyyy, hh:mm a') : 'Within 30 minutes',
        },
        { done: bankSubmitted, label: 'Bank Details Verified', time: bankSubmitted ? 'Just now' : 'Pending' },
        { done: false, label: 'Payment Processing', time: 'Expected: ' + format(new Date(Date.now() + 86400000), 'dd MMM yyyy') },
        { done: false, label: 'Settlement Complete', time: 'Expected: ' + format(new Date(Date.now() + 2 * 86400000), 'dd MMM yyyy') },
    ];

    return (
        <Box sx={{ maxWidth: 640, mx: 'auto', p: 2 }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ width: 80, height: 80, mx: 'auto', borderRadius: '50%', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Claim Submitted!</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your claim has been received and is being processed
                    </Typography>
                </Box>
            </motion.div>

            {/* Summary */}
            <Card elevation={0} sx={{ mb: 4, border: '1px solid #a7f3d0', bgcolor: '#ecfdf5', borderRadius: 3 }}>
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 6 }} >
                            <Typography variant="caption" sx={{ color: '#047857', display: 'block' }}>Claim Reference</Typography>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>{formData.claimNumber}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <Typography variant="caption" sx={{ color: '#047857', display: 'block' }}>Status</Typography>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isAutoApproved ? '#047857' : '#b45309' }}>
                                {isAutoApproved ? '✅ AUTO-APPROVED' : '⏳ UNDER REVIEW'}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <Typography variant="caption" sx={{ color: '#047857', display: 'block' }}>Estimated Settlement</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">₹{amount.toLocaleString('en-IN')}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <Typography variant="caption" sx={{ color: '#047857', display: 'block' }}>Settlement Mode</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">Bank Transfer</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Bank details form */}
            {!bankSubmitted && (
                <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={3}>Enter Bank Details for Payment</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Account Number"
                                placeholder="e.g. 012345678901"
                                value={bankAccount}
                                onChange={e => setBankAccount(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                label="IFSC Code"
                                placeholder="e.g. SBIN0001234"
                                value={ifsc}
                                onChange={e => setIfsc(e.target.value.toUpperCase())}
                                fullWidth
                                variant="outlined"
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={bankAccount.length < 8 || ifsc.length < 11 || submittingBank}
                                onClick={handleBankSubmit}
                                sx={{ py: 1.5, fontWeight: 'bold' }}
                            >
                                {submittingBank ? <CircularProgress size={24} color="inherit" /> : 'Save Bank Details'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {bankSubmitted && (
                <Card elevation={0} sx={{ mb: 4, border: '1px solid #bfdbfe', bgcolor: '#eff6ff', borderRadius: 3 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1d4ed8' }}>
                            <CheckCircleIcon fontSize="small" />
                            <Typography variant="body2" fontWeight="500">Bank details saved. Payment will be processed within 2 working days.</Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Timeline */}
            <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                        <ClockIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Claim Timeline</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {timeline.map((item, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 2, position: 'relative', pb: i < timeline.length - 1 ? 3 : 0 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{
                                        width: 14, height: 14, borderRadius: '50%', mt: 0.5, flexShrink: 0, zIndex: 1,
                                        bgcolor: item.done ? 'success.main' : 'rgba(0,0,0,0.1)'
                                    }} />
                                    {i < timeline.length - 1 && (
                                        <Box sx={{ position: 'absolute', top: 12, bottom: 0, left: 6, width: 2, bgcolor: item.done ? 'success.light' : 'rgba(0,0,0,0.05)', opacity: 0.5 }} />
                                    )}
                                </Box>
                                <Box sx={{ pb: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={item.done ? 'bold' : 'normal'} color={item.done ? 'text.primary' : 'text.disabled'}>
                                        {item.label}
                                    </Typography>
                                    {item.note && <Typography variant="caption" display="block" color="text.secondary">{item.note}</Typography>}
                                    <Typography variant="caption" display="block" color="text.disabled">{item.time}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Actions */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }} >
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        startIcon={<DownloadIcon />}
                        sx={{ py: 1.5, fontWeight: 'bold' }}
                        onClick={handleDownloadReport}
                    >
                        Download Report
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                    <Button variant="outlined" color="success" fullWidth startIcon={<WhatsAppIcon />} sx={{ py: 1.5, fontWeight: 'bold' }}>
                        Share on WhatsApp
                    </Button>
                </Grid>
            </Grid>

            <Button
                variant="text"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push('/claim/track')}
                sx={{ color: 'text.secondary', py: 1.5 }}
            >
                Track Claim Status
            </Button>
        </Box>
    );
}
