'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    AppBar,
    Toolbar,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Avatar,
    Divider,
    IconButton
} from '@mui/material';
import {
    Check as CheckIcon,
    Shield as ShieldIcon,
    Search as SearchIcon,
    CameraAlt as CameraIcon,
    FlashOn as FlashOnIcon,
    Assignment as FileCheckIcon,
    Celebration as PartyPopperIcon,
    Lock as LockIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PolicyVerificationStep from '@/components/claim/PolicyVerificationStep';
import IncidentDetailsStep from '@/components/claim/IncidentDetailsStep';
import PhotoUploadStep from '@/components/claim/PhotoUploadStep';
import AIProcessingStep from '@/components/claim/AIProcessingStep';
import ResultsStep from '@/components/claim/ResultsStep';
import ConfirmationStep from '@/components/claim/ConfirmationStep';
import type { Policy, UploadedPhoto, AIAnalysisResult } from '@/types';
import Logo from '@/components/Logo';
import Link from 'next/link';

const STEPS = [
    { label: 'Policy', icon: ShieldIcon },
    { label: 'Incident', icon: SearchIcon },
    { label: 'Photos', icon: CameraIcon },
    { label: 'Nova AI', icon: FlashOnIcon },
    { label: 'Review', icon: FileCheckIcon },
    { label: 'Submit', icon: PartyPopperIcon },
];

export interface ClaimFormData {
    policy?: Policy;
    claimNumber?: string;
    incidentDate?: string;
    incidentTime?: string;
    incidentLocation?: string;
    incidentDescription?: string;
    incidentType?: string;
    firFiled?: boolean;
    firNumber?: string;
    photos?: UploadedPhoto[];
    aiAnalysis?: AIAnalysisResult;
}

export default function NewClaimPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<ClaimFormData>({});

    const updateFormData = (data: Partial<ClaimFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F0F6FF' }} className="page-gradient-static">
            {/* Header */}
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #CBD8EA' }}>
                <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1200px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Logo variant="dark" />
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 0.5, borderRadius: '20px', bgcolor: 'rgba(15, 157, 106, 0.08)', color: '#0F9D6A', border: '1px solid rgba(15, 157, 106, 0.25)' }}>
                        <LockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight="bold">SECURED & ENCRYPTED</Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* Stepper Bar */}
                <Paper sx={{ p: 2, mb: 6, borderRadius: '20px', boxShadow: '0 4px 20px rgba(30, 58, 95, 0.08)', border: '1px solid #CBD8EA' }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ '& .MuiStepConnector-line': { borderColor: '#CBD8EA', borderTopWidth: '2px' } }}>
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = activeStep > index;
                            const isActive = activeStep === index;

                            return (
                                <Step key={step.label}>
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <Box
                                                sx={{
                                                    width: 40, height: 40, borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    bgcolor: isCompleted ? '#0F9D6A' : isActive ? '#2D5F9E' : '#F0F6FF',
                                                    color: isCompleted || isActive ? 'white' : '#8DA5BE',
                                                    border: `2px solid ${isCompleted ? '#0F9D6A' : isActive ? '#2D5F9E' : '#CBD8EA'}`,
                                                    boxShadow: isActive ? '0 0 0 4px rgba(45, 95, 158, 0.15)' : 'none',
                                                    transition: 'all 0.3s ease',
                                                    zIndex: 1
                                                }}
                                            >
                                                {isCompleted ? <CheckIcon sx={{ fontSize: 20 }} /> : <Icon sx={{ fontSize: 20 }} />}
                                            </Box>
                                        )}
                                    >
                                        <Typography variant="caption" fontWeight="800" sx={{
                                            color: isCompleted ? '#0F9D6A' : isActive ? '#2D5F9E' : '#8DA5BE',
                                            textTransform: 'uppercase', letterSpacing: 0.5, mt: 1, display: 'block'
                                        }}>
                                            {step.label}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Paper>

                {/* Step Content */}
                <Box sx={{ position: 'relative', minHeight: '500px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeStep === 0 && (
                                <PolicyVerificationStep
                                    onComplete={(policy, claimNumber) => {
                                        updateFormData({ policy, claimNumber });
                                        handleNext();
                                    }}
                                />
                            )}
                            {activeStep === 1 && (
                                <IncidentDetailsStep
                                    policy={formData.policy!}
                                    onComplete={(data) => {
                                        updateFormData(data);
                                        handleNext();
                                    }}
                                    onBack={handleBack}
                                />
                            )}
                            {activeStep === 2 && (
                                <PhotoUploadStep
                                    onComplete={(photos) => {
                                        updateFormData({ photos });
                                        handleNext();
                                    }}
                                    onBack={handleBack}
                                />
                            )}
                            {activeStep === 3 && (
                                <AIProcessingStep
                                    formData={formData}
                                    onComplete={(analysis) => {
                                        updateFormData({ aiAnalysis: analysis });
                                        handleNext();
                                    }}
                                    onBack={handleBack}
                                />
                            )}
                            {activeStep === 4 && (
                                <ResultsStep
                                    formData={formData}
                                    onSubmit={async () => {
                                        try {
                                            const res = await fetch('/api/claims', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    formData,
                                                    analysis: formData.aiAnalysis,
                                                }),
                                            });
                                            if (res.ok) {
                                                handleNext();
                                            } else {
                                                handleNext(); // Proceed anyway for demo
                                            }
                                        } catch (e) {
                                            handleNext();
                                        }
                                    }}
                                    onBack={handleBack}
                                />
                            )}
                            {activeStep === 5 && (
                                <ConfirmationStep formData={formData} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Container>
        </Box>
    );
}
