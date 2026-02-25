'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    LinearProgress,
    IconButton,
    Alert,
    AlertTitle,
} from '@mui/material';
import {
    Upload as UploadIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    WarningAmber as AlertTriangleIcon,
    CameraAlt as CameraIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import type { UploadedPhoto, PhotoType } from '@/types';
import { toast } from 'sonner';

const REQUIRED_PHOTOS: { type: PhotoType; label: string; description: string; mandatory: boolean }[] = [
    { type: 'front', label: 'Front View', description: 'Full front of vehicle visible', mandatory: true },
    { type: 'rear', label: 'Rear View', description: 'Full rear of vehicle visible', mandatory: true },
    { type: 'left_side', label: 'Left Side', description: 'Full left side from front to rear', mandatory: true },
    { type: 'right_side', label: 'Right Side', description: 'Full right side from front to rear', mandatory: true },
    { type: 'damage_closeup', label: 'Damage Close-up', description: 'Close-up of damaged area(s)', mandatory: true },
    { type: 'odometer', label: 'Odometer', description: 'Current reading on odometer', mandatory: true },
    { type: 'rc_book', label: 'RC Book', description: 'Vehicle Registration Certificate', mandatory: true },
    { type: 'driving_license', label: 'Driving License', description: 'Valid driving license', mandatory: true },
    { type: 'insurance_policy', label: 'Policy Document', description: 'Insurance policy document', mandatory: true },
    { type: 'spot_photo', label: 'Spot / Scene', description: 'Photo of accident location', mandatory: false },
];

const MANDATORY_TYPES = REQUIRED_PHOTOS.filter(p => p.mandatory).map(p => p.type);

interface Props {
    onComplete: (photos: UploadedPhoto[]) => void;
    onBack: () => void;
}

export default function PhotoUploadStep({ onComplete, onBack }: Props) {
    const [photos, setPhotos] = useState<Record<string, UploadedPhoto>>({});
    const [selectedSlot, setSelectedSlot] = useState<PhotoType>('front');
    const [isUploading, setIsUploading] = useState(false);

    const uploadedTypes = Object.keys(photos) as PhotoType[];
    const mandatoryComplete = MANDATORY_TYPES.every(t => uploadedTypes.includes(t));
    const totalProgress = Math.round((uploadedTypes.length / REQUIRED_PHOTOS.length) * 100);
    const mandatoryProgress = Math.round(
        (uploadedTypes.filter(t => MANDATORY_TYPES.includes(t)).length / MANDATORY_TYPES.length) * 100
    );

    const processFile = async (file: File, type: PhotoType): Promise<UploadedPhoto> => {
        // Create preview
        const preview = URL.createObjectURL(file);

        // Basic quality scoring (in production: use AI)
        const quality_score = Math.floor(Math.random() * 3) + 7; // 7-9 for demo
        const quality_feedback = quality_score >= 8 ? 'Good quality' : 'Acceptable quality';

        // Base64 encoding for API
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

        return {
            file,
            preview,
            type,
            quality_score,
            quality_feedback,
            base64,
        };
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setIsUploading(true);

        const file = acceptedFiles[0];

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload image files only');
            setIsUploading(false);
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            setIsUploading(false);
            return;
        }

        try {
            const photo = await processFile(file, selectedSlot);
            setPhotos(prev => ({ ...prev, [selectedSlot]: photo }));
            toast.success(`${REQUIRED_PHOTOS.find(p => p.type === selectedSlot)?.label} uploaded successfully`);

            // Auto-advance slot
            const currentIdx = REQUIRED_PHOTOS.findIndex(p => p.type === selectedSlot);
            const nextSlot = REQUIRED_PHOTOS.slice(currentIdx + 1).find(p => !photos[p.type]);
            if (nextSlot) setSelectedSlot(nextSlot.type);
        } catch (err) {
            toast.error('Failed to process photo');
        }

        setIsUploading(false);
    }, [selectedSlot, photos]);

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

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>Upload Damage Photos</Typography>
                <Typography variant="body1" color="text.secondary">
                    Our AI needs clear photos to assess damage accurately
                </Typography>
            </Box>

            {/* Progress */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="500">
                            Mandatory photos: {uploadedTypes.filter(t => MANDATORY_TYPES.includes(t)).length}/{MANDATORY_TYPES.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total: {uploadedTypes.length}/{REQUIRED_PHOTOS.length}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={mandatoryProgress}
                        sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: mandatoryProgress === 100 ? 'success.main' : 'primary.main' } }}
                    />
                </CardContent>
            </Card>

            <Grid container spacing={4}>
                {/* Photo slots */}
                <Grid size={{ xs: 12, md: 6 }} >
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>Photo Checklist</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {REQUIRED_PHOTOS.map(slot => {
                            const uploaded = photos[slot.type];
                            const isActive = selectedSlot === slot.type;
                            return (
                                <Box
                                    key={slot.type}
                                    onClick={() => !uploaded && setSelectedSlot(slot.type)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2,
                                        borderRadius: 3,
                                        border: '2px solid',
                                        cursor: uploaded ? 'default' : 'pointer',
                                        bgcolor: uploaded ? '#ecfdf5' : isActive ? 'rgba(37, 99, 235, 0.04)' : 'background.paper',
                                        borderColor: uploaded ? '#a7f3d0' : isActive ? 'primary.main' : 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: uploaded ? '#a7f3d0' : 'primary.light' },
                                    }}
                                >
                                    <Box sx={{ width: 44, height: 44, borderRadius: 2, overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {uploaded ? (
                                            <img src={uploaded.preview} alt={slot.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <ImageIcon sx={{ color: 'text.disabled' }} />
                                        )}
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">{slot.label}</Typography>
                                            {slot.mandatory && <Chip label="Required" size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', color: 'primary.main', borderColor: 'primary.light' }} />}
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{slot.description}</Typography>
                                    </Box>
                                    <Box sx={{ flexShrink: 0 }}>
                                        {uploaded ? (
                                            <IconButton
                                                size="small"
                                                onClick={(e) => { e.stopPropagation(); removePhoto(slot.type); }}
                                                sx={{ bgcolor: '#fee2e2', color: '#ef4444', '&:hover': { bgcolor: '#fecaca' } }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        ) : isActive ? (
                                            <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CameraIcon sx={{ color: 'white', fontSize: 16 }} />
                                            </Box>
                                        ) : (
                                            <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.05)' }} />
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Grid>

                {/* Upload zone */}
                <Grid size={{ xs: 12, md: 6 }} >
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Uploading:</Typography>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                            {REQUIRED_PHOTOS.find(p => p.type === selectedSlot)?.label}
                        </Typography>
                    </Box>

                    {photos[selectedSlot] ? (
                        <Card elevation={0} sx={{ border: '2px solid', borderColor: '#a7f3d0', borderRadius: 3 }}>
                            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                <Box
                                    component="img"
                                    src={photos[selectedSlot].preview}
                                    alt="Uploaded"
                                    sx={{ width: '100%', height: 250, objectFit: 'contain', borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)', mb: 3 }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                                        <CheckIcon fontSize="small" />
                                        <Typography variant="body2" fontWeight="bold">Quality: {photos[selectedSlot].quality_feedback}</Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CloseIcon />}
                                        onClick={() => removePhoto(selectedSlot)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <Box
                            {...getRootProps()}
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                cursor: 'pointer',
                                borderRadius: 4,
                                border: '2px dashed',
                                borderColor: isDragActive ? 'primary.main' : 'divider',
                                bgcolor: isDragActive ? 'rgba(37, 99, 235, 0.05)' : 'rgba(0,0,0,0.02)',
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: 'primary.light', bgcolor: 'rgba(37, 99, 235, 0.02)' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <input {...getInputProps()} />
                            <Box sx={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDragActive ? '#dbeafe' : 'background.paper', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <UploadIcon sx={{ color: isDragActive ? 'primary.main' : 'text.secondary', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight="bold">{isDragActive ? 'Drop photo here' : 'Drag & drop or click to upload'}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>JPG, PNG, HEIC up to 10MB</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isUploading}
                                startIcon={<CameraIcon />}
                                sx={{ mt: 1, fontWeight: 'bold' }}
                            >
                                {isUploading ? 'Processing...' : 'Browse Files'}
                            </Button>
                        </Box>
                    )}

                    <Alert severity="warning" sx={{ mt: 4, borderRadius: 2 }}>
                        <AlertTitle sx={{ fontWeight: 'bold' }}>Tips for better AI assessment:</AlertTitle>
                        <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem' }}>
                            <li>Take photos in good lighting</li>
                            <li>Keep camera steady — avoid blurry photos</li>
                            <li>Capture damaged areas from multiple angles</li>
                            <li>Include reference objects for scale</li>
                        </ul>
                    </Alert>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 6 }}>
                <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    onClick={onBack}
                    startIcon={<ChevronLeftIcon />}
                    sx={{ flex: 1, py: 1.5, fontWeight: 'bold' }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={() => onComplete(Object.values(photos))}
                    disabled={!mandatoryComplete}
                    color={mandatoryComplete ? 'primary' : 'inherit'}
                    endIcon={mandatoryComplete ? <ChevronRightIcon /> : null}
                    sx={{ flex: 1, py: 1.5, fontWeight: 'bold' }}
                >
                    {mandatoryComplete ? (
                        'Analyse Damage'
                    ) : (
                        `Upload ${MANDATORY_TYPES.length - uploadedTypes.filter(t => MANDATORY_TYPES.includes(t)).length} More Required Photos`
                    )}
                </Button>
            </Box>
        </Box>
    );
}
