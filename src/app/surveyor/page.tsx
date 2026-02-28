'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Stack,
    Avatar,
    Divider,
    TextField,
    CircularProgress,
    IconButton,
    Paper,
    Container
} from '@mui/material';
import {
    Engineering as SurveyorIcon,
    DirectionsCar as CarIcon,
    LocationOn as LocationIcon,
    Event as EventIcon,
    Assignment as ReportIcon,
    CheckCircle as SuccessIcon,
    ArrowBack as BackIcon,
    PhotoLibrary as PhotoIcon,
    AttachMoney as MoneyIcon,
    Description as NotesIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function SurveyorDashboard() {
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    // Report Form States
    const [reportDetails, setReportDetails] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState('');

    const fetchAssignments = async () => {
        try {
            const res = await fetch('/api/surveyor/assignments');
            const data = await res.json();
            if (data.success) {
                setAssignments(data.assignments);
            }
        } catch (error) {
            toast.error('Network failure: Unable to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleSubmitReport = async () => {
        if (!reportDetails || !estimatedAmount) {
            toast.warning('Evidence required: Complete all report fields');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/surveyor/assignments/${selected.id}/report`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report_details: reportDetails,
                    surveyor_estimated_amount: parseFloat(estimatedAmount)
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Inspection synchronized with main ledger');
                setSelected(null);
                setReportDetails('');
                setEstimatedAmount('');
                fetchAssignments();
            } else {
                toast.error(data.error || 'Sync failed');
            }
        } catch (error) {
            toast.error('Protocol error: Unable to transmit report');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 2 }}>
                <CircularProgress sx={{ color: '#1E3A5F' }} />
                <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                    Syncing Field Assignments...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
            <Box sx={{ bgcolor: '#1E3A5F', pt: 6, pb: 10, color: 'white' }}>
                <Container maxWidth="md">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.02em', mb: 1 }}>FIELD UNIT 77</Typography>
                            <Typography sx={{ opacity: 0.8, fontWeight: 700, fontSize: '14px' }}>Active Surface Inspections: {assignments.filter(a => a.status === 'pending').length}</Typography>
                        </Box>
                        <SurveyorIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: -6 }}>
                <AnimatePresence mode="wait">
                    {!selected ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <Stack spacing={3}>
                                {assignments.map((assignment) => (
                                    <Card
                                        key={assignment.id}
                                        sx={{
                                            borderRadius: '24px',
                                            border: '1px solid #E2E8F0',
                                            overflow: 'hidden',
                                            cursor: assignment.status === 'pending' ? 'pointer' : 'default',
                                            transition: 'transform 0.2s',
                                            '&:hover': assignment.status === 'pending' ? { transform: 'scale(1.01)' } : {}
                                        }}
                                        onClick={() => assignment.status === 'pending' && setSelected(assignment)}
                                    >
                                        <CardContent sx={{ p: 4 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                                                <Box>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>Transaction Packet</Typography>
                                                    <Typography variant="h6" fontWeight="900" sx={{ color: '#1E3A5F' }}>{assignment.claims?.claim_number}</Typography>
                                                </Box>
                                                <Chip
                                                    label={assignment.status.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 900, borderRadius: '8px',
                                                        bgcolor: assignment.status === 'pending' ? '#FFF7ED' : '#ECFDF5',
                                                        color: assignment.status === 'pending' ? '#F97316' : '#10B981'
                                                    }}
                                                />
                                            </Stack>

                                            <Grid container spacing={4}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Stack spacing={2}>
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: 'rgba(30, 58, 95, 0.05)', color: '#1E3A5F' }}><CarIcon /></Avatar>
                                                            <Box>
                                                                <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8' }}>VEHICLE</Typography>
                                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E3A5F' }}>{assignment.claims?.policies?.vehicle_make} {assignment.claims?.policies?.vehicle_model}</Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: 'rgba(30, 58, 95, 0.05)', color: '#1E3A5F' }}><LocationIcon /></Avatar>
                                                            <Box>
                                                                <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8' }}>INCIDENT VECTOR</Typography>
                                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E3A5F' }}>{assignment.claims?.incident_location}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Stack>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }} sx={{ borderLeft: { sm: '1px solid #F1F5F9' } }}>
                                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'rgba(30, 58, 95, 0.05)', color: '#1E3A5F' }}><EventIcon /></Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8' }}>SCHEDULED SLOTTING</Typography>
                                                            <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E3A5F' }}>{format(new Date(assignment.inspection_date), 'MMMM dd, yyyy')}</Typography>
                                                        </Box>
                                                    </Box>
                                                    {assignment.status === 'pending' && (
                                                        <Button variant="contained" fullWidth sx={{ borderRadius: '12px', bgcolor: '#1E3A5F', fontWeight: 900 }}>INITIALIZE REPORT</Button>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                                {assignments.length === 0 && (
                                    <Box sx={{ py: 10, textAlign: 'center' }}>
                                        <SuccessIcon sx={{ fontSize: 64, color: '#E2E8F0', mb: 2 }} />
                                        <Typography sx={{ color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase' }}>No pending inspections</Typography>
                                    </Box>
                                )}
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Card sx={{ borderRadius: '28px', border: '1px solid #E2E8F0', p: 4 }}>
                                <Button startIcon={<BackIcon />} onClick={() => setSelected(null)} sx={{ color: '#64748B', fontWeight: 800, mb: 4 }}>ABORT REPORT</Button>

                                <Typography variant="h5" fontWeight="900" sx={{ color: '#1E3A5F', mb: 1 }}>SURFACE INSPECTION REPORT</Typography>
                                <Typography sx={{ color: '#64748B', fontWeight: 700, mb: 4 }}>TX ID: {selected.claims?.claim_number}</Typography>

                                <Grid container spacing={4}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={6}
                                                label="Field Observations & Damage Diagnostics"
                                                placeholder="Describe damage severity, impact points, and structural integrity..."
                                                value={reportDetails}
                                                onChange={e => setReportDetails(e.target.value)}
                                                InputProps={{ startAdornment: <NotesIcon sx={{ mr: 1.5, color: '#CBD5E1', mt: 1 }} /> }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Estimated Repair Cost (₹)"
                                                type="number"
                                                value={estimatedAmount}
                                                onChange={e => setEstimatedAmount(e.target.value)}
                                                InputProps={{ startAdornment: <MoneyIcon sx={{ mr: 1.5, color: '#CBD5E1' }} /> }}
                                            />
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                disabled={submitting}
                                                onClick={handleSubmitReport}
                                                sx={{ height: 56, borderRadius: '16px', bgcolor: '#10B981', fontWeight: 900, textTransform: 'uppercase' }}
                                            >
                                                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Commit to Ledger'}
                                            </Button>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                            <Typography sx={{ fontWeight: 900, color: '#1E3A5F', mb: 3, textTransform: 'uppercase', fontSize: '12px' }}>Incident Context Preview</Typography>
                                            <Stack spacing={3}>
                                                <Box>
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#94A3B8' }}>HOLDER</Typography>
                                                    <Typography sx={{ fontWeight: 700, color: '#1E3A5F' }}>{selected.claims?.users?.full_name}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#94A3B8' }}>VEHICLE NODE</Typography>
                                                    <Typography sx={{ fontWeight: 700, color: '#1E3A5F' }}>{selected.claims?.policies?.vehicle_make} {selected.claims?.policies?.vehicle_model} ({selected.claims?.policies?.vehicle_number})</Typography>
                                                </Box>
                                                <Divider />
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <PhotoIcon sx={{ color: '#2D5F9E' }} />
                                                    <Typography sx={{ fontWeight: 800, color: '#2D5F9E' }}>Dossier Photos Linked</Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </Box>
    );
}
