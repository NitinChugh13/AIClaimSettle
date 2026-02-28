'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClaimFormData } from '@/app/claim/new/page';
import type { AIDamageItem } from '@/types';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Avatar,
    Checkbox,
    FormControlLabel,
    Tabs,
    Tab,
    Chip,
    Divider,
    Stack,
    IconButton
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ArrowForward as ArrowRightIcon,
    TrendingDown as TrendingDownIcon,
    Warning as AlertTriangleIcon,
    CheckCircle as CheckCircleIcon,
    Shield as ShieldCheckIcon,
    CreditCard as CreditCardIcon,
    Assignment as ClipboardListIcon,
    ReportProblem as ShieldAlertIcon,
    CurrencyRupee as IndianRupeeIcon,
    Info as InfoIcon,
    Insights as ActivityIcon,
    ErrorOutline as AlertCircleIcon
} from '@mui/icons-material';

interface Props {
    formData: ClaimFormData;
    onSubmit: () => void;
    onBack: () => void;
}

function DamageItemCard({ item }: { item: AIDamageItem }) {
    const sevConfig: Record<string, { bg: string; color: string; bgcolor: string }> = {
        minor: { bg: 'rgba(59,130,196,0.08)', color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' },
        moderate: { bg: 'rgba(229,160,32,0.08)', color: '#92400E', bgcolor: 'rgba(229, 160, 32, 0.05)' },
        severe: { bg: 'rgba(214,64,69,0.08)', color: '#D32F2F', bgcolor: 'rgba(214, 64, 69, 0.05)' },
    };
    const sev = sevConfig[item.damage_severity] || sevConfig.minor;

    return (
        <Paper sx={{
            p: 3, borderRadius: '16px', border: '1px solid #CBD8EA',
            boxShadow: '0 2px 8px rgba(30, 58, 95, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#2D5F9E', boxShadow: '0 4px 16px rgba(30, 58, 95, 0.1)' }
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1E3A5F', mb: 1 }}>{item.part_name}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                            label={item.damage_severity.toUpperCase()}
                            size="small"
                            sx={{ bgcolor: sev.bg, color: sev.color, fontWeight: 800, fontSize: '0.65rem' }}
                        />
                        <Chip
                            label={item.ai_recommendation.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 800, fontSize: '0.65rem', borderColor: '#CBD8EA', color: '#5B7692' }}
                        />
                    </Stack>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>Net Estimate</Typography>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1E3A5F' }}>₹{item.subtotal_net.toLocaleString('en-IN')}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>AI Confidence</Typography>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2D5F9E' }}>{item.confidence.toFixed(0)}%</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFD', borderRadius: '12px', border: '1px solid #CBD8EA', minWidth: 140 }}>
                    <Stack spacing={0.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: '#5B7692' }}>OEM PRICE</Typography>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: '#1E3A5F' }}>₹{item.oem_price.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: '#5B7692' }}>LABOR</Typography>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: '#1E3A5F' }}>₹{item.labor_cost.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Divider sx={{ my: 0.5, borderColor: '#CBD8EA' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: '#D32F2F' }}>DEPR.</Typography>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: '#D32F2F' }}>-{item.depreciation_rate}%</Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Paper>
    );
}

export default function ResultsStep({ formData, onSubmit, onBack }: Props) {
    const [agreed, setAgreed] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const analysis = formData.aiAnalysis;
    const policy = formData.policy;

    if (!analysis || !policy) {
        return (
            <Box sx={{ width: '100%', textAlign: 'center', p: 8 }}>
                <AlertCircleIcon sx={{ fontSize: 48, color: '#D32F2F', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Analysis Data Missing</Typography>
                <Typography variant="body2" sx={{ color: '#5B7692', mb: 4 }}>We couldn't retrieve the analysis data. Please try again.</Typography>
                <Button onClick={onBack} variant="contained" sx={{ bgcolor: '#1E3A5F' }}>Go Back</Button>
            </Box>
        );
    }

    const est = analysis.total_estimate;
    const ai_approved_amount = est.final_claim_amount;

    const recConfig = {
        auto_approve: { title: 'Auto-Approval Confirmed', icon: ShieldCheckIcon, isGreen: true },
        manual_review: { title: 'Officer Validation Required', icon: InfoIcon, isGreen: false },
        escalate: { title: 'Anomalies Detected — Escalated', icon: AlertTriangleIcon, isGreen: false },
        reject: { title: 'Claim Flagged for Rejection', icon: ShieldAlertIcon, isGreen: false },
    }[analysis.recommendation] || { title: 'Status Unknown', icon: InfoIcon, isGreen: false };

    const Icon = recConfig.icon;

    const tabLabels = [
        { label: `Damage Items (${analysis.damage_items.length})`, icon: <ClipboardListIcon sx={{ fontSize: 18 }} /> },
        { label: 'Financial Breakdown', icon: <CreditCardIcon sx={{ fontSize: 18 }} /> },
        { label: `Warnings (${analysis.fraud_indicators.length})`, icon: <ShieldAlertIcon sx={{ fontSize: 18 }} />, disabled: analysis.fraud_indicators.length === 0 },
    ];

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
                    Assessment Results
                </Typography>
                <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#5B7692' }}>{policy.vehicle_make} {policy.vehicle_model}</Typography>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#CBD8EA' }} />
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#2D5F9E' }}>Claim #{formData.claimNumber}</Typography>
                </Stack>
            </Box>

            {/* Top metrics */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 4 }} >
                    <Paper sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #CBD8EA', boxShadow: '0 2px 8px rgba(30, 58, 95, 0.05)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#8DA5BE', display: 'block', mb: 0.5 }}>AI Accuracy</Typography>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#2D5F9E', letterSpacing: -0.5 }}>{analysis.confidence_score.toFixed(0)}%</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 4 }} >
                    <Paper sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #CBD8EA', boxShadow: '0 2px 8px rgba(30, 58, 95, 0.05)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#8DA5BE', display: 'block', mb: 0.5 }}>AI Valuation</Typography>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#0F9D6A', letterSpacing: -0.5 }}>₹{ai_approved_amount.toLocaleString('en-IN')}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 4 }} >
                    <Paper sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #CBD8EA', boxShadow: '0 2px 8px rgba(30, 58, 95, 0.05)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#8DA5BE', display: 'block', mb: 0.5 }}>Risk Level</Typography>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#1E3A5F', letterSpacing: -0.5 }}>{analysis.fraud_indicators.length === 0 ? 'Low' : 'Moderate'}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recommendation banner */}
            <Paper sx={{
                p: 3, borderRadius: '16px', mb: 4,
                border: `1.5px solid ${recConfig.isGreen ? 'rgba(15,157,106,0.3)' : 'rgba(45,95,158,0.3)'}`,
                bgcolor: recConfig.isGreen ? 'rgba(15, 157, 106, 0.04)' : 'rgba(45, 95, 158, 0.04)',
                display: 'flex', alignItems: 'center', gap: 3
            }}>
                <Avatar sx={{
                    width: 48, height: 48, borderRadius: '12px',
                    bgcolor: recConfig.isGreen ? 'rgba(15, 157, 106, 0.1)' : 'rgba(45, 95, 158, 0.1)',
                    color: recConfig.isGreen ? '#0F9D6A' : '#2D5F9E'
                }}>
                    <Icon sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: recConfig.isGreen ? '#065F46' : '#1E3A5F', mb: 0.5 }}>{recConfig.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#5B7692', lineHeight: 1.5 }}>{analysis.recommendation_reason}</Typography>
                </Box>
            </Paper>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                sx={{
                    mb: 3, borderBottom: '1px solid #CBD8EA',
                    '& .MuiTab-root': {
                        minWidth: 0, px: 2, fontSize: '0.85rem', fontWeight: 800, color: '#8DA5BE',
                        textTransform: 'none',
                        '&.Mui-selected': { color: '#2D5F9E' }
                    },
                    '& .MuiTabs-indicator': { bgcolor: '#2D5F9E', height: 3, borderRadius: '3px 3px 0 0' }
                }}
            >
                {tabLabels.map((tab, i) => (
                    <Tab key={i} icon={tab.icon} iconPosition="start" label={tab.label} disabled={tab.disabled} />
                ))}
            </Tabs>

            {/* Tab content */}
            <Box sx={{ minHeight: 400 }}>
                <AnimatePresence mode="wait">
                    {activeTab === 0 && (
                        <motion.div key="items" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <Stack spacing={2}>
                                {analysis.damage_items.map((item, i) => <DamageItemCard key={i} item={item} />)}
                            </Stack>
                        </motion.div>
                    )}

                    {activeTab === 1 && (
                        <motion.div key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                                <Box sx={{ bgcolor: 'rgba(240, 246, 255, 0.6)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #CBD8EA' }}>
                                    <TrendingDownIcon sx={{ fontSize: 20, color: '#2D5F9E' }} />
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1E3A5F' }}>Financial Breakdown</Typography>
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    {[
                                        { label: 'Gross Repair Cost', val: est.gross_repair_cost, minus: false },
                                        { label: 'Depreciation Deduction', val: -est.total_depreciation, minus: true },
                                        { label: 'Net Repair Value', val: est.net_repair_cost, minus: false, highlight: true },
                                        { label: 'Compulsory Deductible', val: -est.compulsory_deductible, minus: true },
                                    ].map((row, i) => (
                                        <Box key={i} sx={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            px: 2, py: 1.5, borderRadius: '10px', mb: row.highlight ? 1 : 0,
                                            bgcolor: row.highlight ? 'rgba(45, 95, 158, 0.04)' : 'transparent'
                                        }}>
                                            <Typography variant="caption" sx={{
                                                fontWeight: row.highlight ? 800 : 600,
                                                color: row.highlight ? '#1E3A5F' : '#5B7692',
                                                textTransform: 'uppercase', letterSpacing: 0.5
                                            }}>{row.label}</Typography>
                                            <Typography variant="body1" fontWeight="bold" sx={{ color: row.minus ? '#D32F2F' : '#1E3A5F' }}>
                                                ₹{Math.abs(row.val).toLocaleString('en-IN')}
                                            </Typography>
                                        </Box>
                                    ))}

                                    <Paper sx={{
                                        mt: 2, p: 3, borderRadius: '16px',
                                        bgcolor: 'rgba(15, 157, 106, 0.05)',
                                        border: '1.5px solid rgba(15, 157, 106, 0.2)',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F9D6A', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>Final Settlement Payable</Typography>
                                            <Typography variant="h4" fontWeight="900" sx={{ color: '#065F46', letterSpacing: -1 }}>₹{ai_approved_amount.toLocaleString('en-IN')}</Typography>
                                        </Box>
                                        <Chip
                                            label={est.limit_check.toUpperCase()}
                                            sx={{ bgcolor: 'rgba(15, 157, 106, 0.1)', color: '#0F9D6A', fontWeight: 900, fontSize: '0.65rem' }}
                                        />
                                    </Paper>
                                </Box>
                            </Paper>
                        </motion.div>
                    )}

                    {activeTab === 2 && (
                        <motion.div key="flags" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <Stack spacing={2}>
                                {analysis.fraud_indicators.map((flag, i) => (
                                    <Paper key={i} sx={{
                                        p: 3, borderRadius: '16px', border: '1.5px solid rgba(211, 47, 47, 0.15)',
                                        bgcolor: 'rgba(211, 47, 47, 0.02)', position: 'relative', overflow: 'hidden'
                                    }}>
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: 'rgba(211, 47, 47, 0.3)' }} />
                                        <Stack direction="row" spacing={2.5}>
                                            <Avatar sx={{ bgcolor: 'rgba(211, 47, 47, 0.08)', color: '#D32F2F', borderRadius: '12px' }}>
                                                <AlertTriangleIcon />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#D32F2F', mb: 0.5, textTransform: 'capitalize' }}>{flag.type.replace(/_/g, ' ')}</Typography>
                                                <Typography variant="body2" sx={{ color: '#5B7692', mb: 1.5, lineHeight: 1.5 }}>{flag.description}</Typography>
                                                <Chip
                                                    icon={<ActivityIcon sx={{ fontSize: '14px !important' }} />}
                                                    label={`CONFIDENCE: ${flag.confidence}%`}
                                                    size="small"
                                                    sx={{ bgcolor: 'rgba(211, 47, 47, 0.06)', color: '#D32F2F', fontWeight: 800, fontSize: '0.65rem', border: '1px solid rgba(211, 47, 47, 0.15)' }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                                <Paper sx={{ p: 2.5, borderRadius: '12px', border: '1.5px dashed #CBD8EA', bgcolor: '#F8FAFD', textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Flags are advisory. Officer portal override is available.
                                    </Typography>
                                </Paper>
                            </Stack>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Consent */}
            <Paper sx={{ mt: 5, p: 3, borderRadius: '16px', bgcolor: '#F8FAFD', border: '1px solid #CBD8EA' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            sx={{ color: '#CBD8EA', '&.Mui-checked': { color: '#2D5F9E' } }}
                        />
                    }
                    label={
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1E3A5F', mb: 0.5 }}>Digital Declaration</Typography>
                            <Typography variant="caption" sx={{ color: '#5B7692', lineHeight: 1.5, display: 'block' }}>
                                I confirm that all evidence and information provided is authentic. Submitting false claims is a violation of IRDA guidelines and may result in legal action.
                            </Typography>
                        </Box>
                    }
                    sx={{ alignItems: 'flex-start', m: 0 }}
                />
            </Paper>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 4, borderTop: '1px solid #CBD8EA' }}>
                <Button
                    onClick={onBack}
                    variant="outlined"
                    startIcon={<ChevronLeftIcon />}
                    sx={{
                        px: 4, py: 1.5, borderRadius: '12px', borderColor: '#CBD8EA', color: '#5B7692', fontWeight: 600,
                        '&:hover': { borderColor: '#2D5F9E', color: '#2D5F9E' }
                    }}
                >
                    Back
                </Button>
                <Button
                    disabled={!agreed}
                    onClick={onSubmit}
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowRightIcon />}
                    sx={{
                        py: 1.8, borderRadius: '12px', bgcolor: agreed ? '#2D5F9E' : '#F0F6FF',
                        color: agreed ? 'white' : '#8DA5BE', fontWeight: 800,
                        boxShadow: agreed ? '0 6px 20px rgba(45, 95, 158, 0.2)' : 'none',
                        '&:hover': { bgcolor: agreed ? '#1E3A5F' : '#F0F6FF', transform: agreed ? 'translateY(-2px)' : 'none' },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Authorize Claim Submission
                </Button>
            </Box>
        </Box>
    );
}
