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
    Container,
    Checkbox,
    FormControlLabel,
    FormGroup
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
    Description as NotesIcon,
    Logout as LogoutIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function SurveyorDashboard() {
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [surveyor, setSurveyor] = useState<any>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Report Form States
    const [amount, setAmount] = useState('');
    const [condition, setCondition] = useState('Moderate');
    const [fieldNotes, setFieldNotes] = useState('');
    const [checkedParts, setCheckedParts] = useState<string[]>([]);

    // Session Persistence
    useEffect(() => {
        const saved = localStorage.getItem('surveyor');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSurveyor(parsed);
                console.log('[Surveyor] Session restored:', parsed);
            } catch (e) {
                console.error("[Surveyor] Failed to parse saved session");
            }
        }
    }, []);

    const fetchAssignments = async () => {
        if (!surveyor?.id) return;
        setLoading(true);
        setError(null);
        try {
            console.log('[Surveyor] Fetching assignments for:', surveyor.id);
            const res = await fetch(`/api/surveyor/assignments`);
            const data = await res.json();

            if (data.success) {
                setAssignments(data.assignments);
                console.log('[Surveyor] Assignments fetched successfully:', data.assignments.length);
            } else {
                setError(data.error || 'Failed to sync assignments');
                console.error('[Surveyor] API Error:', data.error);
            }
        } catch (error: any) {
            console.error('[Surveyor] Network Error:', error);
            setError('Connection failure: Check your internet and try again');
            toast.error('Network failure: Unable to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (surveyor) {
            fetchAssignments();
        } else {
            setLoading(false);
        }
    }, [surveyor]);

    const handleLogout = () => {
        localStorage.removeItem('surveyor');
        setSurveyor(null);
        window.location.href = '/surveyor/login';
    };

    const handleSelect = (assignment: any) => {
        console.log('[Surveyor] Card clicked:', assignment);
        setSelectedAssignment(assignment);
        if (assignment.status === 'assigned') {
            setAmount(assignment.claims?.ai_approved_amount?.toString() || '');
            setFieldNotes('');
            setCondition('Moderate');
            setCheckedParts(assignment.claims?.ai_damaged_parts || []);
        }
    };

    const handleSubmitReport = async () => {
        if (!amount || !fieldNotes) {
            toast.warning('Input validation: Complete all report fields');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/surveyor/submit-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignment_id: selectedAssignment.id,
                    claim_id: selectedAssignment.claim_id,
                    surveyor_amount: parseFloat(amount),
                    vehicle_condition: condition,
                    damaged_parts: checkedParts,
                    field_notes: fieldNotes
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Inspection report committed successfully');
                setSelectedAssignment(null);
                fetchAssignments();
            } else {
                toast.error(data.error || 'Submission failed');
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
                <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                    Accessing Field Data Stream...
                </Typography>
            </Box>
        );
    }

    if (!surveyor) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
                <Card sx={{ p: 4, borderRadius: '24px', textAlign: 'center', maxWidth: 400 }}>
                    <WarningIcon sx={{ fontSize: 48, color: '#F59E0B', mb: 2 }} />
                    <Typography variant="h6" fontWeight="900" sx={{ color: '#1E3A5F', mb: 1 }}>Unauthorized Node</Typography>
                    <Typography sx={{ color: '#64748B', mb: 4 }}>Valid surveyor session required for field ops.</Typography>
                    <Button variant="contained" fullWidth onClick={() => window.location.href = '/surveyor/login'} sx={{ bgcolor: '#1E3A5F', borderRadius: '12px', fontWeight: 900 }}>RE-AUTHENTICATE</Button>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
            {/* Header */}
            <Box sx={{ bgcolor: '#1E3A5F', pt: 6, pb: 10, color: 'white' }}>
                <Container maxWidth="md">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.02em', mb: 1 }}>SURVEYOR: {surveyor.full_name}</Typography>
                            <Typography sx={{ opacity: 0.8, fontWeight: 700, fontSize: '14px' }}>
                                ID: {surveyor.id?.slice(0, 8)} | Active Assignments: {assignments.filter(a => a.status === 'assigned').length}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <IconButton onClick={fetchAssignments} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                                <RefreshIcon />
                            </IconButton>
                            <IconButton onClick={handleLogout} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                                <LogoutIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: -6 }}>
                {error && (
                    <Box sx={{ mb: 3, p: 3, bgcolor: '#FEF2F2', color: '#EF4444', borderRadius: '16px', border: '1px solid #FEE2E2', display: 'flex', gap: 2, alignItems: 'center' }}>
                        <WarningIcon />
                        <Typography sx={{ fontWeight: 700 }}>{error}</Typography>
                        <Button size="small" variant="outlined" color="error" onClick={fetchAssignments} sx={{ ml: 'auto' }}>Retry Sync</Button>
                    </Box>
                )}

                <AnimatePresence mode="wait">
                    {!selectedAssignment ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <Stack spacing={3}>
                                {assignments.map((assignment) => (
                                    <Card
                                        key={assignment.id}
                                        sx={{
                                            borderRadius: '24px',
                                            border: '1px solid #E2E8F0',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'scale(1.01)', boxShadow: '0 12px 24px rgba(30,58,95,0.1)' }
                                        }}
                                        onClick={() => handleSelect(assignment)}
                                    >
                                        <CardContent sx={{ p: 4 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                                                <Box>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>Transaction Packet</Typography>
                                                    <Typography variant="h6" fontWeight="900" sx={{ color: '#1E3A5F' }}>{assignment.claims?.claim_number || 'N/A'}</Typography>
                                                </Box>
                                                <Chip
                                                    label={assignment.status.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 900, borderRadius: '8px',
                                                        bgcolor: assignment.status === 'assigned' ? '#FFF7ED' : '#ECFDF5',
                                                        color: assignment.status === 'assigned' ? '#F97316' : '#10B981'
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
                                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E3A5F' }}>
                                                                    {assignment.claims?.policies?.vehicle_make} {assignment.claims?.policies?.vehicle_model}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: 'rgba(30, 58, 95, 0.05)', color: '#1E3A5F' }}><LocationIcon /></Avatar>
                                                            <Box>
                                                                <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8' }}>INCIDENT VECTOR</Typography>
                                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E3A5F' }}>{assignment.claims?.incident_location || 'rohini'}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Stack>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }} sx={{ borderLeft: { sm: '1px solid #F1F5F9' } }}>
                                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'rgba(30, 58, 95, 0.05)', color: '#1E3A5F' }}><EventIcon /></Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8' }}>SCHEDULED SLOTTING</Typography>
                                                            <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E3A5F' }}>
                                                                {assignment.inspection_date ? format(new Date(assignment.inspection_date), 'MMMM dd, yyyy') : 'No Date'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    {assignment.status === 'assigned' ? (
                                                        <Button variant="contained" fullWidth sx={{ borderRadius: '12px', bgcolor: '#1E3A5F', fontWeight: 900 }}>INITIALIZE REPORT</Button>
                                                    ) : (
                                                        <Button variant="outlined" fullWidth sx={{ borderRadius: '12px', fontWeight: 900, borderColor: '#10B981', color: '#10B981' }}>VIEW SUMMARY</Button>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                                {assignments.length === 0 && !loading && !error && (
                                    <Box sx={{ py: 10, textAlign: 'center' }}>
                                        <SuccessIcon sx={{ fontSize: 64, color: '#E2E8F0', mb: 2 }} />
                                        <Typography sx={{ color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase' }}>No pending stream assigned</Typography>
                                    </Box>
                                )}
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Card sx={{ borderRadius: '28px', border: '1px solid #E2E8F0', p: 4 }}>
                                <Button startIcon={<BackIcon />} onClick={() => setSelectedAssignment(null)} sx={{ color: '#64748B', fontWeight: 800, mb: 4 }}>
                                    {selectedAssignment.status === 'completed' ? 'BACK TO QUEUE' : 'ABORT REPORT'}
                                </Button>

                                {selectedAssignment.status === 'completed' ? (
                                    <Box>
                                        <Typography variant="h5" fontWeight="900" sx={{ color: '#1E3A5F', mb: 4 }}>REPORT SUBMITTED ✅</Typography>
                                        <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                            <Grid container spacing={4}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', mb: 1, textTransform: 'uppercase' }}>Amount</Typography>
                                                    <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#1E3A5F' }}>₹{selectedAssignment.surveyor_amount?.toLocaleString('en-IN')}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', mb: 1, textTransform: 'uppercase' }}>Condition</Typography>
                                                    <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#1E3A5F' }}>{selectedAssignment.vehicle_condition}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', mb: 1, textTransform: 'uppercase' }}>Notes</Typography>
                                                    <Typography sx={{ color: '#475569', fontWeight: 500 }}>{selectedAssignment.inspection_notes || 'No notes provided'}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', mb: 1, textTransform: 'uppercase' }}>Submitted</Typography>
                                                    <Typography sx={{ fontWeight: 700, color: '#1E3A5F' }}>
                                                        {selectedAssignment.completed_at
                                                            ? format(new Date(selectedAssignment.completed_at), 'dd MMM yyyy, HH:mm')
                                                            : 'Timestamp Unavailable'
                                                        }
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="h5" fontWeight="900" sx={{ color: '#1E3A5F', mb: 1 }}>FIELD VALIDATION NODE</Typography>
                                        <Typography sx={{ color: '#64748B', fontWeight: 700, mb: 4 }}>TX ID: {selectedAssignment.claims?.claim_number}</Typography>

                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Stack spacing={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="Adjustment Amount (₹)"
                                                        type="number"
                                                        value={amount}
                                                        onChange={e => setAmount(e.target.value)}
                                                        InputProps={{ startAdornment: <MoneyIcon sx={{ mr: 1, color: '#94A3B8' }} /> }}
                                                    />

                                                    <Box>
                                                        <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#94A3B8', mb: 1.5, textTransform: 'uppercase' }}>Structural Status</Typography>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                                            {['Good', 'Moderate', 'Severe', 'Total Loss'].map(opt => (
                                                                <Chip
                                                                    key={opt}
                                                                    label={opt}
                                                                    onClick={() => setCondition(opt)}
                                                                    sx={{
                                                                        borderRadius: '10px', fontWeight: 700,
                                                                        bgcolor: condition === opt ? '#1E3A5F' : 'white',
                                                                        color: condition === opt ? 'white' : '#64748B',
                                                                        border: '1px solid #E2E8F0',
                                                                        '&:hover': { bgcolor: condition === opt ? '#1E3A5F' : '#F1F5F9' }
                                                                    }}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </Box>

                                                    <Box>
                                                        <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#94A3B8', mb: 1, textTransform: 'uppercase' }}>Critical Points of Failure</Typography>
                                                        <FormGroup row>
                                                            {['Bumper', 'Headlight', 'Hood', 'Windshield', 'Mirror', 'Fender', 'Door'].map(part => (
                                                                <FormControlLabel
                                                                    key={part}
                                                                    control={
                                                                        <Checkbox
                                                                            size="small"
                                                                            checked={checkedParts.includes(part)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) setCheckedParts([...checkedParts, part]);
                                                                                else setCheckedParts(checkedParts.filter(p => p !== part));
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={<Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{part}</Typography>}
                                                                />
                                                            ))}
                                                        </FormGroup>
                                                    </Box>

                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={4}
                                                        label="Diagnostic Evidence Notes"
                                                        value={fieldNotes}
                                                        onChange={e => setFieldNotes(e.target.value)}
                                                    />

                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        size="large"
                                                        disabled={submitting}
                                                        onClick={handleSubmitReport}
                                                        sx={{ height: 56, borderRadius: '16px', bgcolor: '#1E3A5F', fontWeight: 900 }}
                                                    >
                                                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'COMMIT DATA TO MAINNET'}
                                                    </Button>
                                                </Stack>
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', height: '100%' }}>
                                                    <Typography sx={{ fontWeight: 900, color: '#1E3A5F', mb: 3, textTransform: 'uppercase', fontSize: '12px' }}>AI Predictive Matrix</Typography>

                                                    <Box sx={{ mb: 4, p: 2, bgcolor: 'white', borderRadius: '16px', border: '1px solid #ECF0F3' }}>
                                                        <Typography variant="body2" sx={{ color: '#475569', mb: 2, fontWeight: 600 }}>{selectedAssignment.claims?.ai_reasoning || 'No AI reasoning available'}</Typography>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                                            {selectedAssignment.claims?.ai_damaged_parts?.map((part: string) => (
                                                                <Chip key={part} label={part} size="small" sx={{ fontWeight: 800, bgcolor: '#FEF2F2', color: '#EF4444' }} />
                                                            ))}
                                                        </Stack>
                                                    </Box>

                                                    <Typography sx={{ fontWeight: 900, color: '#1E3A5F', mb: 2, textTransform: 'uppercase', fontSize: '12px' }}>Visual Evidence Dossier ({selectedAssignment.claims?.claim_documents?.length || 0})</Typography>
                                                    <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 2 }}>
                                                        {selectedAssignment.claims?.claim_documents?.map((doc: any, i: number) => (
                                                            <Box
                                                                key={i}
                                                                onClick={() => setLightboxImage(doc.file_url || doc.document_url)}
                                                                sx={{
                                                                    minWidth: 120, height: 90, borderRadius: '12px', overflow: 'hidden', cursor: 'zoom-in',
                                                                    flexShrink: 0, border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                                }}
                                                            >
                                                                <img src={doc.file_url || doc.document_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="evidence" />
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>

            {/* Lightbox */}
            {lightboxImage && (
                <Box
                    onClick={() => setLightboxImage(null)}
                    sx={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        bgcolor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out'
                    }}
                >
                    <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
                        <IconButton
                            onClick={() => setLightboxImage(null)}
                            sx={{ position: 'absolute', top: -48, right: 0, color: 'white' }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <img src={lightboxImage} style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px', objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
