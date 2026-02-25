'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    Grid,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import {
    LocationOn as MapPinIcon,
    CalendarToday as CalendarIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    HelpOutline as HelpIcon,
} from '@mui/icons-material';
import type { Policy } from '@/types';
import type { ClaimFormData } from '@/app/claim/new/page';

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
    { value: 'flood', label: '🌊 Flood / Waterlogging' },
    { value: 'fire', label: '🔥 Fire' },
    { value: 'theft', label: '🔓 Theft / Attempted Theft' },
    { value: 'vandalism', label: '💢 Vandalism / Malicious Damage' },
    { value: 'hail', label: '🌨️ Hail / Natural Calamity' },
    { value: 'other', label: '📋 Other' },
];

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

export default function IncidentDetailsStep({ policy, onComplete, onBack }: Props) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<FormValues>({
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
        <Box sx={{ maxWidth: 640, mx: 'auto', p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>Incident Details</Typography>
                <Typography variant="body1" color="text.secondary">
                    Tell us what happened to your {policy.vehicle_make} {policy.vehicle_model}
                </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarIcon color="primary" fontSize="small" />
                                    <Typography variant="h6" fontWeight="bold">When & Where</Typography>
                                </Box>
                            }
                            sx={{ pb: 1 }}
                        />
                        <CardContent sx={{ pt: 1 }}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        label="Date of Incident *"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            max: todayStr(),
                                            min: policy.policy_start_date,
                                        }}
                                        {...register('incidentDate')}
                                        error={!!errors.incidentDate}
                                        helperText={errors.incidentDate?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        label="Time of Incident *"
                                        type="time"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        {...register('incidentTime')}
                                        error={!!errors.incidentTime}
                                        helperText={errors.incidentTime?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }} >
                                    <TextField
                                        label="Location of Incident *"
                                        placeholder="e.g. NH-48, near Kharghar, Navi Mumbai"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MapPinIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        {...register('incidentLocation')}
                                        error={!!errors.incidentLocation}
                                        helperText={errors.incidentLocation?.message}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HelpIcon color="primary" fontSize="small" />
                                    <Typography variant="h6" fontWeight="bold">What Happened?</Typography>
                                </Box>
                            }
                            sx={{ pb: 1 }}
                        />
                        <CardContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Controller
                                name="incidentType"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Type of Incident *"
                                        fullWidth
                                    >
                                        {INCIDENT_TYPES.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            <TextField
                                label="Describe the Incident *"
                                multiline
                                rows={4}
                                placeholder="Describe what happened in detail — direction of impact, speed, road conditions, other vehicles involved, injuries, etc."
                                fullWidth
                                {...register('incidentDescription')}
                                error={!!errors.incidentDescription}
                                helperText={
                                    errors.incidentDescription?.message ||
                                    <Box component="span" sx={{ color: description.length >= 50 ? 'success.main' : 'text.secondary' }}>
                                        ({description.length}/50 min)
                                    </Box>
                                }
                            />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: firFiled === 'yes' ? 6 : 12 }} >
                                    <Controller
                                        name="firFiled"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="FIR Filed?"
                                                fullWidth
                                            >
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                {firFiled === 'yes' && (
                                    <Grid size={{ xs: 12, sm: 6 }} >
                                        <TextField
                                            label="FIR Number"
                                            placeholder="FIR/2024/XXXXX"
                                            fullWidth
                                            {...register('firNumber')}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<ChevronRightIcon />}
                            sx={{ flex: 1, py: 1.5, fontWeight: 'bold' }}
                        >
                            Next: Upload Photos
                        </Button>
                    </Box>

                </Box>
            </form>
        </Box>
    );
}
