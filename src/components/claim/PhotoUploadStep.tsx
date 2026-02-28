'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    LinearProgress,
    Avatar,
    IconButton,
    Divider,
    Stack,
    CircularProgress
} from '@mui/material';
import {
    PhotoCamera as CameraIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    ChevronLeft as ChevronLeftIcon,
    FlashOn as FlashOnIcon,
    Visibility as EyeIcon,
    QrCodeScanner as ScanIcon,
    Description as FileTextIcon,
    LocationOn as MapPinIcon,
    Memory as MemoryIcon,
    ArrowForward as ArrowRightIcon
} from '@mui/icons-material';
import type { UploadedPhoto, PhotoType } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const REQUIRED_PHOTOS: { type: PhotoType; label: string; description: string; mandatory: boolean; icon: any }[] = [
    { type: 'front', label: 'Front View', description: 'Full frontal orientation', mandatory: true, icon: EyeIcon },
    { type: 'rear', label: 'Rear View', description: 'Full rear orientation', mandatory: true, icon: EyeIcon },
    { type: 'left_side', label: 'Left Side', description: 'Full left flank', mandatory: true, icon: EyeIcon },
    { type: 'right_side', label: 'Right Side', description: 'Full right flank', mandatory: true, icon: EyeIcon },
    { type: 'damage_closeup', label: 'Impact Macro', description: 'Close-up of damage', mandatory: true, icon: ScanIcon },
    { type: 'odometer', label: 'Odometer', description: 'Mileage verification', mandatory: true, icon: MemoryIcon },
    { type: 'rc_book', label: 'RC Book', description: 'Vehicle identity file', mandatory: true, icon: FileTextIcon },
    { type: 'driving_license', label: 'Operator ID', description: 'Valid driving permit', mandatory: true, icon: FileTextIcon },
    { type: 'insurance_policy', label: 'Policy Node', description: 'Coverage document', mandatory: true, icon: ShieldIcon },
    { type: 'spot_photo', label: 'Incident Node', description: 'Environment scan', mandatory: false, icon: MapPinIcon },
];

import { Shield as ShieldIcon } from '@mui/icons-material';

const MANDATORY_TYPES = REQUIRED_PHOTOS.filter(p => p.mandatory).map(p => p.type);

interface Props {
    claimId: string;
    onComplete: (photos: UploadedPhoto[]) => void;
    onBack: () => void;
}

export default function PhotoUploadStep({ claimId, onComplete, onBack }: Props) {
    const [photos, setPhotos] = useState<Record<string, UploadedPhoto>>({});
    const [selectedSlot, setSelectedSlot] = useState<PhotoType>('front');
    const [isUploading, setIsUploading] = useState(false);

    const uploadedTypes = Object.keys(photos) as PhotoType[];
    const mandatoryComplete = MANDATORY_TYPES.every(t => uploadedTypes.includes(t));
    const mandatoryProgress = Math.round(
        (uploadedTypes.filter(t => MANDATORY_TYPES.includes(t)).length / MANDATORY_TYPES.length) * 100
    );

    const uploadFile = async (file: File, type: PhotoType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', type);

        const res = await fetch(`/api/claims/${claimId}/upload-document`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to upload photo');
        }

        return await res.json();
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setIsUploading(true);

        const file = acceptedFiles[0];
        if (!file.type.startsWith('image/')) {
            toast.error('Invalid format. Use images only.');
            setIsUploading(false);
            return;
        }

        try {
            const preview = URL.createObjectURL(file);
            const uploadResult = await uploadFile(file, selectedSlot);

            const photo: UploadedPhoto = {
                file,
                preview,
                type: selectedSlot,
                quality_score: 9.0, // Mock AI quality
                quality_feedback: 'Optimal Clarity'
            };

            setPhotos(prev => ({ ...prev, [selectedSlot]: photo }));
            toast.success(`Photo for ${selectedSlot} uploaded successfully`);

            const currentIdx = REQUIRED_PHOTOS.findIndex(p => p.type === selectedSlot);
            const nextSlot = REQUIRED_PHOTOS.slice(currentIdx + 1).find(p => !photos[p.type]);
            if (nextSlot) setSelectedSlot(nextSlot.type);
        } catch (err: any) {
            toast.error(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [selectedSlot, photos, claimId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.heic', '.webp'] },
        multiple: false,
    });

    const removePhoto = (type: PhotoType) => {
        setPhotos(prev => {
            const next = { ...prev };
            if (next[type]) {
                URL.revokeObjectURL(next[type].preview);
                delete next[type];
            }
            return next;
        });
    };

    const handleDemoUpload = async () => {
        setIsUploading(true);
        toast.info('Neural Matrix: Initializing Demo Proofs...');

        try {
            const sampleImages: Record<string, string> = {
                front: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=400',
                rear: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400',
                left_side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400',
                right_side: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400',
                damage_closeup: 'https://images.unsplash.com/photo-1590362891175-3174685a3c9e?q=80&w=400',
                odometer: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400',
                rc_book: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400',
                driving_license: 'https://images.unsplash.com/photo-1589149028045-802526747209?q=80&w=400',
                insurance_policy: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400',
                spot_photo: 'https://images.unsplash.com/photo-1469811639444-2425b9041f5a?q=80&w=400',
            };

            const demoPhotos: Record<string, UploadedPhoto> = {};

            // For Demo, we'll fetch one image and upload it for all mandatory slots
            // to show it works with the real API
            const response = await fetch(sampleImages.front);
            const blob = await response.blob();
            const file = new File([blob], 'demo.jpg', { type: 'image/jpeg' });

            for (const slot of REQUIRED_PHOTOS) {
                if (!slot.mandatory) continue;

                await uploadFile(file, slot.type);
                demoPhotos[slot.type] = {
                    file,
                    preview: sampleImages[slot.type],
                    type: slot.type,
                    quality_score: 9.5,
                    quality_feedback: 'Optimal Clarity (Demo)'
                };
                setPhotos(prev => ({ ...prev, [slot.type]: demoPhotos[slot.type] }));
            }

            toast.success('Matrix Sync Complete - Real Document Nodes Linked');
        } catch (err) {
            toast.error('Demo load failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', mb: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{
                    fontFamily: '"DM Serif Display", serif',
                    color: '#1E3A5F',
                    mb: 1,
                    fontWeight: 700
                }}>
                    Evidence Documentation
                </Typography>
                <Typography variant="body2" sx={{ color: '#5B7692', maxWidth: 480, mx: 'auto', mb: 2 }}>
                    Synchronize visual evidence for real-time AI damage analysis and validation.
                </Typography>
                <Button
                    onClick={handleDemoUpload}
                    variant="outlined"
                    size="small"
                    disabled={isUploading}
                    startIcon={isUploading ? <CircularProgress size={14} color="inherit" /> : <FlashOnIcon sx={{ fontSize: 14 }} />}
                    sx={{
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: 1.2,
                        borderColor: 'rgba(45, 95, 158, 0.2)',
                        color: '#2D5F9E',
                        '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.05)', borderColor: '#2D5F9E' }
                    }}
                >
                    AUTO-LINK DEMO PROOFS
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 4, borderRadius: '20px', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#8DA5BE', mb: 0.5, display: 'block' }}>
                            Upload Progress
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="h4" fontWeight="800" sx={{ color: '#1E3A5F' }}>{mandatoryProgress}%</Typography>
                            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', borderColor: '#CBD8EA' }} />
                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#5B7692' }}>
                                {uploadedTypes.filter(t => MANDATORY_TYPES.includes(t)).length} / {MANDATORY_TYPES.length} Required Proofs
                            </Typography>
                        </Stack>
                    </Box>
                    <Typography variant="caption" fontWeight="800" sx={{ color: '#8DA5BE', textTransform: 'uppercase' }}>
                        Total Nodes: {uploadedTypes.length}/{REQUIRED_PHOTOS.length}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={mandatoryProgress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(141, 165, 190, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: mandatoryProgress === 100 ? '#0F9D6A' : '#2D5F9E',
                            borderRadius: 4
                        }
                    }}
                />
            </Paper>

            <Stack spacing={4}>
                <Box>
                    <AnimatePresence mode="wait">
                        {photos[selectedSlot] ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #CBD8EA', boxShadow: '0 8px 32px rgba(30, 58, 95, 0.08)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', width: 44, height: 44, borderRadius: '12px', border: '1px solid rgba(45, 95, 158, 0.15)' }}>
                                            <CameraIcon />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#1E3A5F' }}>
                                            {REQUIRED_PHOTOS.find(p => p.type === selectedSlot)?.label}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        position: 'relative',
                                        aspectRatio: '16/10',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        bgcolor: '#F0F6FF',
                                        border: '1px solid #CBD8EA',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                        '&:hover .overlay': { opacity: 1 }
                                    }}>
                                        <img src={photos[selectedSlot].preview} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Preview" />
                                        <Box className="overlay" sx={{
                                            position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: 0, transition: 'opacity 0.3s ease', backdropFilter: 'blur(2px)'
                                        }}>
                                            <Button
                                                variant="contained"
                                                disabled={isUploading}
                                                startIcon={<CloseIcon />}
                                                onClick={() => removePhoto(selectedSlot)}
                                                sx={{ bgcolor: 'white', color: '#1E3A5F', fontWeight: 'bold', '&:hover': { bgcolor: '#F0F6FF' } }}
                                            >
                                                Change Image
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <Paper sx={{ p: 2.5, bgcolor: 'rgba(15, 157, 106, 0.04)', borderRadius: '12px', border: '1px solid rgba(15, 157, 106, 0.15)' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#0F9D6A', display: 'block', mb: 0.5 }}>Sync State</Typography>
                                                <Typography variant="h5" fontWeight="800" sx={{ color: '#065F46' }}>
                                                    SECURED<Typography component="span" variant="body2" sx={{ ml: 1, opacity: 0.6 }}>AWS/S3</Typography>
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Paper sx={{ p: 2.5, bgcolor: 'rgba(45, 95, 158, 0.04)', borderRadius: '12px', border: '1px solid rgba(45, 95, 158, 0.15)' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#2D5F9E', display: 'block', mb: 0.5 }}>Network Node</Typography>
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1E3A5F' }}>{selectedSlot.toUpperCase()}</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            disabled={isUploading}
                                            onClick={() => removePhoto(selectedSlot)}
                                            sx={{ borderRadius: '12px', py: 1.5, borderColor: '#CBD8EA', color: '#5B7692', fontWeight: 700, '&:hover': { borderColor: '#D32F2F', color: '#D32F2F' } }}
                                        >
                                            Discard
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            disabled={isUploading}
                                            onClick={() => {
                                                const currentIdx = REQUIRED_PHOTOS.findIndex(p => p.type === selectedSlot);
                                                const nextSlot = REQUIRED_PHOTOS.slice(currentIdx + 1).find(p => !photos[p.type]);
                                                if (nextSlot) setSelectedSlot(nextSlot.type);
                                            }}
                                            sx={{ borderRadius: '12px', py: 1.5, bgcolor: '#2D5F9E', fontWeight: 800, boxShadow: '0 4px 12px rgba(45, 95, 158, 0.2)', '&:hover': { bgcolor: '#1E3A5F' } }}
                                        >
                                            Next Document Node
                                        </Button>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        height: 320,
                                        bgcolor: isDragActive ? 'rgba(45, 95, 158, 0.03)' : '#FAFCFF',
                                        border: `2px dashed ${isDragActive ? '#2D5F9E' : '#CBD8EA'}`,
                                        borderRadius: '24px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        p: 4, cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center',
                                        '&:hover': { borderColor: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.02)' }
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isUploading ? (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <CircularProgress sx={{ mb: 2 }} />
                                            <Typography variant="body2" fontWeight="bold">Synchronizing Evidence Node...</Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography variant="caption" sx={{ px: 2, py: 0.5, borderRadius: '20px', bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
                                                Awaiting: {REQUIRED_PHOTOS.find(p => p.type === selectedSlot)?.label}
                                            </Typography>
                                            <Avatar sx={{ bgcolor: 'rgba(45, 95, 158, 0.06)', color: '#2D5F9E', width: 72, height: 72, mb: 2, border: '1px solid rgba(45, 95, 158, 0.1)' }}>
                                                <CameraIcon sx={{ fontSize: 32 }} />
                                            </Avatar>
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1E3A5F', mb: 0.5 }}>Upload Proof Node</Typography>
                                            <Typography variant="body2" sx={{ color: '#8DA5BE', mb: 3 }}>Drag and drop, or click to browse</Typography>
                                            <Button variant="contained" sx={{ bgcolor: '#2D5F9E', borderRadius: '12px', px: 4, fontWeight: 'bold' }}>Select Evidence</Button>
                                        </>
                                    )}
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#5B7692', letterSpacing: 1 }}>Sync Manifest</Typography>
                        <Typography variant="caption" fontWeight="bold" sx={{ color: '#8DA5BE' }}>{uploadedTypes.length} / {REQUIRED_PHOTOS.length} SYNCED</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {REQUIRED_PHOTOS.map(slot => {
                            const uploaded = photos[slot.type];
                            const isActive = selectedSlot === slot.type;
                            return (
                                <Grid size={{ xs: 12, sm: 6 }} key={slot.type}>
                                    <Paper
                                        onClick={() => !uploaded && setSelectedSlot(slot.type)}
                                        sx={{
                                            p: 2, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                                            border: `1.5px solid ${uploaded ? 'rgba(15, 157, 106, 0.3)' : isActive ? '#2D5F9E' : '#CBD8EA'}`,
                                            bgcolor: uploaded ? 'rgba(15, 157, 106, 0.04)' : isActive ? 'rgba(45, 95, 158, 0.04)' : 'white',
                                            transition: 'all 0.2s ease',
                                            boxShadow: isActive ? '0 0 0 4px rgba(45, 95, 158, 0.1)' : 'none',
                                            '&:hover': { bgcolor: uploaded ? 'rgba(15, 157, 106, 0.06)' : isActive ? 'rgba(45, 95, 158, 0.06)' : '#FAFCFF' }
                                        }}
                                    >
                                        <Avatar sx={{
                                            width: 40, height: 40, borderRadius: '10px',
                                            bgcolor: uploaded ? 'rgba(15, 157, 106, 0.1)' : isActive ? '#2D5F9E' : '#F0F6FF',
                                            color: uploaded ? '#0F9D6A' : isActive ? 'white' : '#8DA5BE',
                                            transition: 'all 0.2s'
                                        }}>
                                            {uploaded ? <CheckIcon sx={{ fontSize: 20 }} /> : <slot.icon sx={{ fontSize: 20 }} />}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: uploaded ? '#065F46' : '#1E3A5F' }}>{slot.label}</Typography>
                                                {slot.mandatory && !uploaded && (<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#D32F2F' }} />)}
                                            </Stack>
                                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: uploaded ? '#0F9D6A' : '#8DA5BE', letterSpacing: 0.5 }}>
                                                {uploaded ? 'Verified Sync' : slot.description}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Stack>

            <Box sx={{ display: 'flex', gap: 2, mt: 5, pt: 4, borderTop: '1px solid #CBD8EA' }}>
                <Button
                    onClick={onBack}
                    variant="outlined"
                    sx={{
                        px: 4, py: 1.5, borderRadius: '12px', borderColor: '#CBD8EA', color: '#5B7692', fontWeight: 600,
                        '&:hover': { borderColor: '#2D5F9E', color: '#2D5F9E' }
                    }}
                >
                    Back
                </Button>
                <Button
                    onClick={() => onComplete(Object.values(photos))}
                    disabled={!mandatoryComplete || isUploading}
                    variant="contained"
                    fullWidth
                    endIcon={mandatoryComplete && <ArrowRightIcon />}
                    sx={{
                        py: 1.8, borderRadius: '12px', bgcolor: mandatoryComplete ? '#2D5F9E' : '#F0F6FF',
                        color: mandatoryComplete ? 'white' : '#8DA5BE', fontWeight: 800,
                        boxShadow: mandatoryComplete ? '0 6px 20px rgba(45, 95, 158, 0.2)' : 'none',
                        '&:hover': { bgcolor: mandatoryComplete ? '#1E3A5F' : '#F0F6FF', transform: mandatoryComplete ? 'translateY(-2px)' : 'none' },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {mandatoryComplete ? 'Authorize AI Damage Assessment' : 'Upload Evidence Nodes'}
                </Button>
            </Box>
        </Box>
    );
}
