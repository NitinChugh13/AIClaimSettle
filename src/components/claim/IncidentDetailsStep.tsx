'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Policy } from '@/types';
import type { ClaimFormData } from '@/app/claim/new/page';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    InputAdornment,
    FormHelperText
} from '@mui/material';
import {
    LocationOn as MapPinIcon,
    CalendarMonth as CalendarIcon,
    AccessTime as ClockIcon,
    ChevronLeft as ChevronLeftIcon,
    ArrowForward as ArrowRightIcon,
    ErrorOutline as AlertCircleIcon,
    AccountBalance as LandmarkIcon,
    ChatBubbleOutline as MessageSquareIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
    incidentDate: z.string().min(1, 'Select date of incident'),
    incidentTime: z.string().min(1, 'Enter time of incident'),
    incidentLocation: z.string().min(5, 'Describe the location'),
    incidentDescription: z.string().min(50, 'Please describe in at least 50 characters'),
    incidentType: z.enum(['accident', 'flood', 'fire', 'theft', 'vandalism', 'hail', 'other']),
    firFiled: z.enum(['yes', 'no']),
    firNumber: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    policy: Policy;
    onComplete: (data: Partial<ClaimFormData>) => void;
    onBack: () => void;
}

const INCIDENT_TYPES = [
    { value: 'accident', label: '🚗 Road Accident' },
    { value: 'flood', label: '🌊 Flood / Water' },
    { value: 'fire', label: '🔥 Fire Damage' },
    { value: 'theft', label: '🔓 Theft / Break-in' },
    { value: 'vandalism', label: '💢 Vandalism' },
    { value: 'hail', label: '🌨️ Hail / Nature' },
    { value: 'other', label: '📋 Other' },
];

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

export default function IncidentDetailsStep({ policy, onComplete, onBack }: Props) {
    const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            incidentDate: todayStr(),
            incidentType: 'accident',
            firFiled: 'no',
        },
    });

    const firFiled = watch('firFiled');
    const description = watch('incidentDescription') ?? '';

    const onSubmit = (values: FormValues) => {
        onComplete({
            incidentDate: values.incidentDate,
            incidentTime: values.incidentTime,
            incidentLocation: values.incidentLocation,
            incidentDescription: values.incidentDescription,
            incidentType: values.incidentType,
            firFiled: values.firFiled === 'yes',
            firNumber: values.firNumber,
        });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{
                    fontFamily: '"DM Serif Display", serif',
                    color: '#1E3A5F',
                    mb: 1,
                    fontWeight: 700
                }}>
                    Events & Timeline
                </Typography>
                <Typography variant="body2" sx={{ color: '#5B7692' }}>
                    Reconstruct the incident details for our evaluation engine.
                </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Chronology & Location */}
                <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                    <Box sx={{ bgcolor: 'rgba(240, 246, 255, 0.6)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #CBD8EA' }}>
                        <Avatar sx={{ bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', width: 40, height: 40, border: '1px solid rgba(45, 95, 158, 0.15)', borderRadius: '10px' }}>
                            <MapPinIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1E3A5F' }}>Chronology & Location</Typography>
                    </Box>
                    <Grid container spacing={3} sx={{ p: 4 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Event Date"
                                {...register('incidentDate')}
                                error={!!errors.incidentDate}
                                helperText={errors.incidentDate?.message}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon sx={{ color: '#8DA5BE' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="time"
                                label="Event Time"
                                {...register('incidentTime')}
                                error={!!errors.incidentTime}
                                helperText={errors.incidentTime?.message}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ClockIcon sx={{ color: '#8DA5BE' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Precise Location"
                                placeholder="e.g. NH-48, Sector 15, Navi Mumbai"
                                {...register('incidentLocation')}
                                error={!!errors.incidentLocation}
                                helperText={errors.incidentLocation?.message}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MapPinIcon sx={{ color: '#8DA5BE' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Incident Reconstruction */}
                <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #CBD8EA', boxShadow: '0 4px 12px rgba(30, 58, 95, 0.05)' }}>
                    <Box sx={{ bgcolor: 'rgba(240, 246, 255, 0.6)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #CBD8EA' }}>
                        <Avatar sx={{ bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', width: 40, height: 40, border: '1px solid rgba(45, 95, 158, 0.15)', borderRadius: '10px' }}>
                            <MessageSquareIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1E3A5F' }}>Incident Reconstruction</Typography>
                    </Box>
                    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <FormControl fullWidth error={!!errors.incidentType}>
                            <InputLabel>Incident Classification</InputLabel>
                            <Controller
                                name="incidentType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Incident Classification"
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        {INCIDENT_TYPES.map(type => (
                                            <MenuItem key={type.value} value={type.value}>
                                                <Typography variant="body2" fontWeight="bold">{type.label}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.incidentType && <FormHelperText>{errors.incidentType.message}</FormHelperText>}
                        </FormControl>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#5B7692', textTransform: 'uppercase' }}>Detailed Event Log</Typography>
                                <Typography variant="caption" sx={{
                                    fontWeight: 800,
                                    px: 1.5, py: 0.5, borderRadius: '12px',
                                    bgcolor: description.length >= 50 ? 'rgba(15, 157, 106, 0.08)' : 'rgba(141, 165, 190, 0.08)',
                                    color: description.length >= 50 ? '#0F9D6A' : '#8DA5BE'
                                }}>
                                    {description.length} / 50 CHARS
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Describe the incident — direction of impact, weather conditions, other vehicles involved, etc."
                                {...register('incidentDescription')}
                                error={!!errors.incidentDescription}
                                helperText={errors.incidentDescription?.message}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Box>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth error={!!errors.firFiled}>
                                    <InputLabel>Police Reporting (FIR)</InputLabel>
                                    <Controller
                                        name="firFiled"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Police Reporting (FIR)"
                                                sx={{ borderRadius: '12px' }}
                                            >
                                                <MenuItem value="yes"><Typography variant="body2" fontWeight="bold">Yes, FIR Filed</Typography></MenuItem>
                                                <MenuItem value="no"><Typography variant="body2" fontWeight="bold">No, Not Filed</Typography></MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            {firFiled === 'yes' && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                        <TextField
                                            fullWidth
                                            label="FIR Identifier"
                                            placeholder="FIR/2024/XXXXX"
                                            {...register('firNumber')}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LandmarkIcon sx={{ color: '#8DA5BE' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Paper>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Button
                        onClick={onBack}
                        variant="outlined"
                        startIcon={<ChevronLeftIcon />}
                        sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: '12px',
                            borderColor: '#8DA5BE',
                            color: '#5B7692',
                            fontWeight: 600,
                            '&:hover': { borderColor: '#2D5F9E', color: '#2D5F9E' }
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowRightIcon />}
                        sx={{
                            py: 1.8,
                            borderRadius: '12px',
                            bgcolor: '#2D5F9E',
                            fontWeight: 700,
                            boxShadow: '0 6px 20px rgba(45, 95, 158, 0.2)',
                            '&:hover': { bgcolor: '#1E3A5F', transform: 'translateY(-2px)' }
                        }}
                    >
                        Continue to Photo Upload
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
