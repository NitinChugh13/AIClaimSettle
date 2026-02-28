'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClaimFormData } from '@/app/claim/new/page';
import type { AIAnalysisResult } from '@/types';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    CircularProgress,
    Avatar,
    Stack,
    Alert
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    ArrowForward as ArrowRightIcon,
    AutoFixHigh as LoaderIcon,
    Search as SearchCodeIcon,
    Insights as ActivityIcon,
    Storage as DatabaseIcon,
    Code as BinaryIcon,
    Fingerprint as FingerprintIcon,
    QrCodeScanner as ScanIcon,
    Shield as ShieldCheckIcon
} from '@mui/icons-material';

interface Props {
    claimId: string;
    formData: ClaimFormData;
    onComplete: (analysis: AIAnalysisResult) => void;
    onBack: () => void;
}

const PROCESSING_STEPS = [
    { id: 1, text: 'Scanning Optical Evidence Nodes...', icon: ScanIcon, delay: 500 },
    { id: 2, text: 'Executing Geometry Segmentation...', icon: BinaryIcon, delay: 1500 },
    { id: 3, text: 'Syncing OEM Component Pricing...', icon: DatabaseIcon, delay: 3000 },
    { id: 4, text: 'Calculating Material Depreciation...', icon: ActivityIcon, delay: 4500 },
    { id: 5, text: 'Engaging Fraud Detection Neural Net...', icon: FingerprintIcon, delay: 6000 },
    { id: 6, text: 'Finalizing IRDA-Compliant Assessment...', icon: SearchCodeIcon, delay: 7500 },
];

export default function AIProcessingStep({ claimId, formData, onComplete, onBack }: Props) {
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [done, setDone] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const runAnalysis = async () => {
            try {
                // Start timing and processing steps
                const processingPromise = (async () => {
                    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
                        const wait = PROCESSING_STEPS[i].delay - (i > 0 ? PROCESSING_STEPS[i - 1].delay : 0);
                        await new Promise(r => setTimeout(r, wait));
                        if (cancelled) return;
                        setCompletedSteps(prev => [...prev, PROCESSING_STEPS[i].id]);
                        setCurrentIdx(i + 1);
                    }
                })();

                // Call the real API
                const res = await fetch(`/api/claims/${claimId}/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'AI analysis failed');
                }

                const result = await res.json();

                // Wait for processing UI to catch up if needed
                await processingPromise;

                if (!cancelled) {
                    setAnalysis(result.analysis);
                    setDone(true);
                }
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message || 'Analysis failed. Please retry.');
                    setDone(false);
                }
            }
        };

        runAnalysis();
        return () => { cancelled = true; };
    }, [claimId]);

    return (
        <Box sx={{ width: '100%', maxWidth: 680, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <AnimatePresence mode="wait">
                    {done ? (
                        <motion.div
                            key="done"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <Avatar sx={{
                                width: 80, height: 80, mx: 'auto', mb: 3,
                                bgcolor: 'rgba(15, 157, 106, 0.1)',
                                border: '2px solid rgba(15, 157, 106, 0.4)',
                                boxShadow: '0 8px 24px rgba(15, 157, 106, 0.15)',
                                color: '#0F9D6A'
                            }}>
                                <CheckCircleIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                        </motion.div>
                    ) : (
                        <motion.div key="processing">
                            <Box sx={{ position: 'relative', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                                <CircularProgress
                                    size={80}
                                    thickness={2}
                                    sx={{ color: '#2D5F9E', position: 'absolute', top: 0, left: 0 }}
                                />
                                <Avatar sx={{
                                    width: 80, height: 80,
                                    bgcolor: 'rgba(45, 95, 158, 0.06)',
                                    color: '#2D5F9E'
                                }}>
                                    <LoaderIcon sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Typography variant="h4" sx={{
                    fontFamily: '"DM Serif Display", serif',
                    color: '#1E3A5F',
                    mb: 1,
                    fontWeight: 700
                }}>
                    {done ? 'Analysis Finalized' : 'Neuronal Analytics'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5B7692', maxWidth: 400, mx: 'auto' }}>
                    {done
                        ? 'Your IRDA-compliant damage assessment is ready for review.'
                        : 'Engaging Groq AI for real-time visual assessment...'}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper sx={{
                        borderRadius: '20px', overflow: 'hidden', border: '1px solid #CBD8EA',
                        boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)'
                    }}>
                        <Box sx={{ bgcolor: 'rgba(240, 246, 255, 0.6)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #CBD8EA' }}>
                            <ActivityIcon sx={{ fontSize: 20, color: '#2D5F9E' }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, color: '#8DA5BE' }}>
                                Analysis Stack
                            </Typography>
                        </Box>
                        <Stack spacing={2.5} sx={{ p: 3 }}>
                            {PROCESSING_STEPS.map((step, idx) => {
                                const isCompleted = completedSteps.includes(step.id);
                                const isCurrent = idx === currentIdx;
                                const StepIcon = step.icon;

                                return (
                                    <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{
                                            width: 36, height: 36, borderRadius: '10px',
                                            border: `2px solid ${isCompleted ? '#0F9D6A' : isCurrent ? '#2D5F9E' : '#CBD8EA'}`,
                                            bgcolor: isCompleted ? 'rgba(15, 157, 106, 0.06)' : isCurrent ? 'rgba(45, 95, 158, 0.06)' : '#FAFCFF',
                                            color: isCompleted ? '#0F9D6A' : isCurrent ? '#2D5F9E' : '#8DA5BE',
                                            transition: 'all 0.3s'
                                        }}>
                                            {isCompleted ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : <StepIcon sx={{ fontSize: 16 }} />}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight="bold" sx={{
                                                color: isCompleted ? '#0F9D6A' : isCurrent ? '#1E3A5F' : '#8DA5BE',
                                                transition: 'color 0.3s'
                                            }}>
                                                {step.text}
                                            </Typography>
                                            {isCurrent && (
                                                <Box sx={{ height: 3, width: 80, bgcolor: '#F0F6FF', borderRadius: 4, overflow: 'hidden', mt: 0.5 }}>
                                                    <motion.div
                                                        animate={{ x: [-80, 80] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        style={{ width: '100%', height: '100%', background: '#2D5F9E' }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <AnimatePresence mode="wait">
                        {done && analysis ? (
                            <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Stack spacing={2.5}>
                                    <Paper sx={{
                                        p: 3, borderRadius: '16px',
                                        border: `1.5px solid ${analysis.recommendation === 'auto_approve' ? 'rgba(15,157,106,0.3)' : 'rgba(45,95,158,0.3)'}`,
                                        bgcolor: analysis.recommendation === 'auto_approve' ? 'rgba(15, 157, 106, 0.04)' : 'rgba(45, 95, 158, 0.04)'
                                    }}>
                                        <Stack direction="row" spacing={2.5} alignItems="center">
                                            <Avatar sx={{
                                                width: 52, height: 52, borderRadius: '14px',
                                                bgcolor: analysis.recommendation === 'auto_approve' ? '#0F9D6A' : '#2D5F9E'
                                            }}>
                                                <ShieldCheckIcon sx={{ fontSize: 28, color: 'white' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight="800" sx={{ color: analysis.recommendation === 'auto_approve' ? '#065F46' : '#1E3A5F' }}>
                                                    {analysis.recommendation === 'auto_approve' ? 'Auto-Approved' : 'Verified'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: analysis.recommendation === 'auto_approve' ? '#0F9D6A' : '#2D5F9E' }}>
                                                    Policy Thresholds Validated
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #CBD8EA', boxShadow: '0 2px 8px rgba(30, 58, 95, 0.05)' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>Valuation</Typography>
                                                <Typography variant="h5" fontWeight="800" sx={{ color: '#1E3A5F' }}>
                                                    ₹{Math.round(analysis.total_estimate?.final_claim_amount || 0).toLocaleString()}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #CBD8EA', boxShadow: '0 2px 8px rgba(30, 58, 95, 0.05)' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>Confidence</Typography>
                                                <Typography variant="h5" fontWeight="800" sx={{ color: '#2D5F9E' }}>
                                                    {analysis.confidence_score?.toString().replace('%', '')}%
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    <Button
                                        onClick={() => onComplete(analysis)}
                                        variant="contained"
                                        fullWidth
                                        endIcon={<ArrowRightIcon />}
                                        sx={{
                                            py: 2, borderRadius: '12px', bgcolor: '#2D5F9E', fontWeight: 800,
                                            boxShadow: '0 4px 16px rgba(45, 95, 158, 0.25)',
                                            '&:hover': { bgcolor: '#1E3A5F', transform: 'translateY(-2px)' }
                                        }}
                                    >
                                        Review Final Summary
                                    </Button>
                                </Stack>
                            </motion.div>
                        ) : (
                            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Paper sx={{
                                    height: 310, borderRadius: '20px', display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', bgcolor: 'white',
                                    border: '1px solid #CBD8EA', position: 'relative', overflow: 'hidden'
                                }}>
                                    <motion.div
                                        animate={{ top: ['0%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        style={{
                                            position: 'absolute', left: 0, width: '100%', height: 2,
                                            background: 'rgba(45, 95, 158, 0.3)',
                                            boxShadow: '0 0 10px rgba(45, 95, 158, 0.5)',
                                            zIndex: 5
                                        }}
                                    />
                                    <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ opacity: 0.5, mb: 2 }}>
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [12, 24, 12] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                    style={{ width: 4, background: '#2D5F9E', borderRadius: 4 }}
                                                />
                                            ))}
                                        </Stack>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D5F9E', textTransform: 'uppercase', letterSpacing: 2.5, mb: 1, display: 'block' }}>
                                            AI ENGINE ACTIVE
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Analyzing claim data...
                                        </Typography>
                                    </Box>
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Grid>

                {error && (
                    <Grid size={{ xs: 12 }}>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Alert severity="error" sx={{ borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        </motion.div>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
