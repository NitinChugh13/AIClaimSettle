'use client';

import { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Container,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import PolicyVerificationStep from '@/components/claim/PolicyVerificationStep';
import IncidentDetailsStep from '@/components/claim/IncidentDetailsStep';
import PhotoUploadStep from '@/components/claim/PhotoUploadStep';
import AIProcessingStep from '@/components/claim/AIProcessingStep';
import ResultsStep from '@/components/claim/ResultsStep';
import ConfirmationStep from '@/components/claim/ConfirmationStep';
import type { Policy, UploadedPhoto, AIAnalysisResult } from '@/types';

const STEPS = [
    'Policy',
    'Incident',
    'Photos',
    'Analysis',
    'Review',
    'Settlement',
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
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            {/* Progress stepper */}
            <Box sx={{ width: '100%', mb: 8, display: { xs: 'none', sm: 'block' } }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {STEPS.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: { optional?: React.ReactNode } = {};
                        if (activeStep > index) {
                            stepProps.completed = true;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel
                                    {...labelProps}
                                    StepIconComponent={(props) => (
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: props.completed ? 'success.main' : props.active ? 'primary.main' : 'rgba(0,0,0,0.08)',
                                                color: props.completed || props.active ? 'white' : 'text.disabled',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem',
                                                transition: 'all 0.3s',
                                                ...(props.active && { boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.2)' }),
                                            }}
                                        >
                                            {props.completed ? <CheckIcon fontSize="small" /> : String(props.icon)}
                                        </Box>
                                    )}
                                >
                                    <Box sx={{ color: activeStep >= index ? 'text.primary' : 'text.disabled', fontWeight: activeStep === index ? 'bold' : 'normal' }}>
                                        {label}
                                    </Box>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Box>

            {/* Mobile stepper fallback */}
            <Box sx={{ width: '100%', mb: 4, display: { xs: 'block', sm: 'none' }, textAlign: 'center' }}>
                <Box sx={{ color: 'text.secondary', typography: 'caption', fontWeight: 'bold' }}>
                    Step {activeStep + 1} of {STEPS.length}
                </Box>
                <Box sx={{ color: 'text.primary', typography: 'subtitle1', fontWeight: 'bold' }}>
                    {STEPS[activeStep]}
                </Box>
            </Box>

            {/* Step content */}
            <Box sx={{ position: 'relative', minHeight: 400 }}>
                <Box sx={{
                    animation: 'fadeIn 0.5s ease-out',
                    '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                    }
                }}>
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
                                        console.error('Failed to submit claim');
                                        handleNext(); // fallback next
                                    }
                                } catch (e) {
                                    console.error('API Error', e);
                                    handleNext(); // fallback next
                                }
                            }}
                            onBack={handleBack}
                        />
                    )}
                    {activeStep === 5 && (
                        <ConfirmationStep formData={formData} />
                    )}
                </Box>
            </Box>
        </Container>
    );
}
