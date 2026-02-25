'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Button,
    Alert,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    ErrorOutline as ErrorOutlineIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import type { ClaimFormData } from '@/app/claim/new/page';
import type { AIAnalysisResult } from '@/types';
import {
    getVehicleAgeMonths,
    getDepreciationRate,
    getCityTier,
    getLaborRate,
    getCompulsoryDeductible,
} from '@/lib/pricing/depreciation';

interface Props {
    formData: ClaimFormData;
    onComplete: (analysis: AIAnalysisResult) => void;
    onBack: () => void;
}

const PROCESSING_STEPS = [
    { id: 1, text: 'Analysing photo quality & metadata...', delay: 500 },
    { id: 2, text: 'Detecting vehicle & damaged parts...', delay: 2000 },
    { id: 3, text: 'Calculating OEM & local part prices...', delay: 4000 },
    { id: 4, text: 'Applying IRDAI depreciation schedule...', delay: 5500 },
    { id: 5, text: 'Running fraud detection checks...', delay: 7000 },
    { id: 6, text: 'Generating assessment report...', delay: 8500 },
];



export default function AIProcessingStep({ formData, onComplete, onBack }: Props) {
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [done, setDone] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const runProcessing = async () => {
            try {
                // Call Production AI API
                const res = await fetch('/api/ai/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        policy: formData.policy,
                        incidentType: formData.incidentType,
                        incidentLocation: formData.incidentLocation,
                        photoCount: formData.photos?.length ?? 0,
                        photos: formData.photos?.slice(0, 3).map(p => ({ base64: p.base64, mediaType: p.type })) || [],
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.details || errorData.error || 'AI Analysis Service Unavailable');
                }

                const result: AIAnalysisResult = await res.json();

                // Animate through steps
                for (let i = 0; i < PROCESSING_STEPS.length; i++) {
                    await new Promise(r => setTimeout(r, PROCESSING_STEPS[i].delay - (i > 0 ? PROCESSING_STEPS[i - 1].delay : 0)));
                    if (cancelled) return;
                    setCompletedSteps(prev => [...prev, PROCESSING_STEPS[i].id]);
                    setCurrentIdx(i + 1);
                }

                await new Promise(r => setTimeout(r, 500));
                if (!cancelled) {
                    setAnalysis(result);
                    setDone(true);
                }
            } catch (err: any) {
                if (!cancelled) {
                    console.error('AI Processing Error:', err);
                    setError(err.message || 'An error occurred during AI analysis. Please try again.');
                    // Stop animation steps
                    setCompletedSteps([]);
                    setDone(false);
                }
            }
        };

        runProcessing();
        return () => { cancelled = true; };
    }, [formData]);

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center', p: 2 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ width: 80, height: 80, mx: 'auto', borderRadius: '50%', bgcolor: done ? '#ecfdf5' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {done ? (
                        <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981' }} />
                    ) : (
                        <CircularProgress sx={{ color: '#1e3a8a' }} size={40} thickness={4} />
                    )}
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {done ? 'Analysis Complete!' : 'AI Analysing Your Claim...'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {done
                        ? 'Your damage assessment is ready for review.'
                        : 'Claude AI is reviewing your photos and calculating repair estimates.'}
                </Typography>
            </Box>

            <Card elevation={0} sx={{ mb: 4, textAlign: 'left', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, '&:last-child': { pb: 3 } }}>
                    {PROCESSING_STEPS.map((step, idx) => {
                        const isCompleted = completedSteps.includes(step.id);
                        const isCurrent = idx === currentIdx;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0.4 }}
                                animate={{ opacity: isCompleted || isCurrent ? 1 : 0.4 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        bgcolor: isCompleted ? 'success.main' : isCurrent ? 'primary.main' : 'rgba(0,0,0,0.08)'
                                    }}>
                                        {isCompleted ? (
                                            <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />
                                        ) : isCurrent ? (
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                {[0, 1, 2].map(j => (
                                                    <Box key={j} sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'white', animation: 'pulse 1.5s infinite', animationDelay: `${j * 0.2}s` }} />
                                                ))}
                                            </Box>
                                        ) : null}
                                    </Box>
                                    <Typography variant="body2" sx={{ color: isCompleted || isCurrent ? 'text.primary' : 'text.disabled', fontWeight: isCompleted || isCurrent ? 500 : 400 }}>
                                        {step.text}
                                    </Typography>
                                </Box>
                            </motion.div>
                        );
                    })}
                </CardContent>
            </Card>

            {!done && (
                <Typography variant="caption" color="text.secondary">Estimated time: ~10 seconds</Typography>
            )}

            {done && analysis && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        mb: 3,
                        fontWeight: 'bold',
                        typography: 'body2',
                        ...(analysis.recommendation === 'auto_approve' && { bgcolor: '#ecfdf5', color: '#047857', border: '1px solid #10b981' }),
                        ...(analysis.recommendation === 'manual_review' && { bgcolor: '#fffbeb', color: '#b45309', border: '1px solid #f59e0b' }),
                        ...(analysis.recommendation === 'escalate' && { bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #ef4444' }),
                        ...(analysis.recommendation === 'reject' && { bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #ef4444' }),
                    }}>
                        {analysis.recommendation === 'auto_approve' && '✅ Eligible for Auto-Approval'}
                        {analysis.recommendation === 'manual_review' && '⏳ Recommended for Officer Review'}
                        {analysis.recommendation === 'escalate' && '⚠️ Requires Officer Escalation'}
                        {analysis.recommendation === 'reject' && '❌ Claim Not Eligible'}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 1.5 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Estimated Payable</Typography>
                            <Typography variant="body1" fontWeight="bold">₹{analysis.total_estimate.final_claim_amount.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 1.5 }}>
                            <Typography variant="caption" color="text.secondary" display="block">AI Confidence</Typography>
                            <Typography variant="body1" fontWeight="bold">{analysis.confidence_score.toFixed(0)}%</Typography>
                        </Box>
                        <Box sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 1.5 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Fraud Risk</Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">LOW</Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        endIcon={<ChevronRightIcon />}
                        onClick={() => onComplete(analysis)}
                        sx={{ py: 1.5, fontWeight: 'bold' }}
                    >
                        View Detailed Results
                    </Button>
                </motion.div>
            )}

            {error && (
                <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mt: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}
