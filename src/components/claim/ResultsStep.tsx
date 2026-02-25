'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Button,
    Chip,
    Tabs,
    Tab,
    Divider,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    TrendingDown as TrendingDownIcon,
    WarningAmber as AlertTriangleIcon,
} from '@mui/icons-material';
import type { ClaimFormData } from '@/app/claim/new/page';
import type { AIDamageItem } from '@/types';

interface Props {
    formData: ClaimFormData;
    onSubmit: () => void;
    onBack: () => void;
}

function DamageItemCard({ item }: { item: AIDamageItem }) {
    const severityColors: any = {
        minor: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
        moderate: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
        severe: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
        total: { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' },
    };

    const recColors: any = {
        repair: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
        replace: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
        supplement: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    };

    const sev = severityColors[item.damage_severity] || severityColors.minor;
    const rec = recColors[item.ai_recommendation] || recColors.repair;

    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 2 }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{item.part_name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                                label={item.damage_severity.toUpperCase()}
                                size="small"
                                sx={{ bgcolor: sev.bg, color: sev.color, borderColor: sev.border, fontWeight: 'bold', fontSize: '0.65rem', height: 20 }}
                                variant="outlined"
                            />
                            <Chip
                                label={item.ai_recommendation.toUpperCase()}
                                size="small"
                                sx={{ bgcolor: rec.bg, color: rec.color, borderColor: rec.border, fontWeight: 'bold', fontSize: '0.65rem', height: 20 }}
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight="bold">₹{item.subtotal_net.toLocaleString('en-IN')}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">net payable</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 1 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">OEM Part</Typography>
                        <Typography variant="body2" fontWeight="500">₹{item.oem_price.toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Labour</Typography>
                        <Typography variant="body2" fontWeight="500">₹{item.labor_cost.toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Depreciation</Typography>
                        <Typography variant="body2" color="error.main" fontWeight="500">-₹{item.depreciation_amount.toLocaleString('en-IN')} ({item.depreciation_rate}%)</Typography>
                    </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    AI Confidence: {item.confidence.toFixed(0)}%
                </Typography>
            </CardContent>
        </Card>
    );
}

export default function ResultsStep({ formData, onSubmit, onBack }: Props) {
    const [agreed, setAgreed] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const analysis = formData.aiAnalysis!;
    const policy = formData.policy!;
    const est = analysis.total_estimate;

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const recDetails = {
        auto_approve: { text: '✅ Auto-Approval Recommended', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
        manual_review: { text: '⏳ Officer Review Recommended', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
        escalate: { text: '⚠️ Escalation Required', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
        reject: { text: '❌ Claim Not Eligible', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
    }[analysis.recommendation] || { text: 'Unknown', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>AI Damage Assessment</Typography>
                <Typography variant="body1" color="text.secondary">
                    {policy.vehicle_make} {policy.vehicle_model} {policy.vehicle_year} &mdash; Claim {formData.claimNumber}
                </Typography>
            </Box>

            {/* Summary bar */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                    <Card elevation={0} sx={{ bgcolor: 'rgba(37, 99, 235, 0.05)', borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>AI Confidence</Typography>
                            <Typography variant="h3" fontWeight="900" color="primary.main">{analysis.confidence_score.toFixed(0)}%</Typography>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <Card elevation={0} sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)', borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Estimated Payable</Typography>
                            <Typography variant="h3" fontWeight="900" color="success.main">₹{est.final_claim_amount.toLocaleString('en-IN')}</Typography>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                    <Card elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Fraud Risk</Typography>
                            <Typography variant="h3" fontWeight="900" color="text.primary">
                                {analysis.fraud_indicators.length === 0 ? 'LOW' : 'MEDIUM'}
                            </Typography>
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>

            {/* Recommendation banner */}
            <Box sx={{ p: 2, borderRadius: 2, mb: 4, bgcolor: recDetails.bg, color: recDetails.color, border: `1px solid ${recDetails.border}` }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{recDetails.text}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{analysis.recommendation_reason}</Typography>
            </Box>

            <Box sx={{ width: '100%', mb: 4 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tab label={`Damage Items (${analysis.damage_items.length})`} sx={{ fontWeight: 'bold' }} />
                    <Tab label="Financial Summary" sx={{ fontWeight: 'bold' }} />
                    {analysis.fraud_indicators.length > 0 && (
                        <Tab label={`Flags (${analysis.fraud_indicators.length})`} sx={{ fontWeight: 'bold' }} />
                    )}
                </Tabs>
            </Box>

            <Box sx={{ minHeight: 400 }}>
                {tabValue === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {analysis.damage_items.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <DamageItemCard item={item} />
                            </motion.div>
                        ))}
                    </Box>
                )}

                {tabValue === 1 && (
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingDownIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">Financial Breakdown</Typography>
                                </Box>
                            }
                            sx={{ pb: 1 }}
                        />
                        <CardContent sx={{ pt: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {[
                                    { label: 'Gross Repair / Replacement Cost', val: est.gross_repair_cost, color: 'text.primary', fontWeight: 'normal' },
                                    { label: '(-) Depreciation Applied', val: -est.total_depreciation, color: 'error.main', fontWeight: 'normal' },
                                    { label: 'Net Admissible Amount', val: est.net_repair_cost, color: 'text.primary', fontWeight: 'bold' },
                                    { label: '(-) Compulsory Deductible', val: -est.compulsory_deductible, color: 'error.main', fontWeight: 'normal' },
                                ].map((row, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                                        <Typography variant="body2" color={row.color} fontWeight={row.fontWeight}>
                                            ₹{Math.abs(row.val).toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                ))}

                                <Divider sx={{ my: 1 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">FINAL CLAIM PAYABLE</Typography>
                                    <Typography variant="h6" fontWeight="900" color="success.main">
                                        ₹{est.final_claim_amount.toLocaleString('en-IN')}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={est.limit_check}
                                    size="small"
                                    sx={{
                                        alignSelf: 'flex-start',
                                        bgcolor: est.within_limit ? '#ecfdf5' : '#fef2f2',
                                        color: est.within_limit ? '#047857' : '#b91c1c',
                                        fontWeight: 'bold',
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {tabValue === 2 && analysis.fraud_indicators.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {analysis.fraud_indicators.map((flag, i) => (
                            <Card key={i} elevation={0} sx={{ border: '1px solid #fde68a', bgcolor: '#fffbeb', borderRadius: 3 }}>
                                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <AlertTriangleIcon sx={{ color: '#d97706', mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#92400e' }}>
                                                {flag.type.replace(/_/g, ' ').toUpperCase()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#b45309', mt: 0.5 }}>
                                                {flag.description}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#d97706', mt: 1, display: 'block', fontWeight: 'bold' }}>
                                                Confidence: {flag.confidence}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                        <Typography variant="caption" color="text.secondary" align="center" display="block" mt={2}>
                            Fraud flags are advisory. A claims officer will review all flagged items.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Declaration */}
            <Card elevation={0} sx={{ mt: 4, mb: 4, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3 }}>
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                    <FormControlLabel
                        control={<Checkbox checked={agreed} onChange={e => setAgreed(e.target.checked)} color="primary" />}
                        label={
                            <Typography variant="caption" color="text.secondary">
                                I declare that the information provided and photos uploaded are true and correct to the best of my knowledge.
                                I understand that furnishing false information is an offence and may result in claim rejection and legal action.
                                I agree to the terms of the assessment generated by the AI system as per IRDAI guidelines.
                            </Typography>
                        }
                        sx={{ alignItems: 'flex-start', m: 0 }}
                    />
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onBack}
                    startIcon={<ChevronLeftIcon />}
                    sx={{ flex: 1, py: 1.5, fontWeight: 'bold' }}
                >
                    Back
                </Button>
                <Button
                    disabled={!agreed}
                    onClick={onSubmit}
                    variant="contained"
                    color="success"
                    endIcon={<ChevronRightIcon />}
                    sx={{ flex: 1, py: 1.5, fontWeight: 'bold' }}
                >
                    Submit Claim
                </Button>
            </Box>
        </Box>
    );
}
