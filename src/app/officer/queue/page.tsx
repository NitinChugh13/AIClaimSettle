'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { generateClaimReport } from '@/lib/pdf-generator';
import { format } from 'date-fns';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    IconButton,
    TextField,
    Paper,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Tooltip as MuiTooltip,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Skeleton
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as XCircleIcon,
    ArrowUpward as ArrowUpCircleIcon,
    Download as DownloadIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Shield as ShieldAlertIcon,
    Insights as ActivityIcon,
    Description as FileTextIcon,
    ChevronRight as ChevronRightIcon,
    FlashOn as ZapIcon,
    History as HistoryIcon,
    MoreHoriz as MoreHorizontalIcon,
    Launch as ExternalLinkIcon,
    Warning as AlertTriangleIcon,
    FactCheck as BadgeCheckIcon,
    AssignmentInd as AssignIcon,
    AttachMoney as MoneyIcon,
    Notes as NotesIcon,
    Event as EventIcon
} from '@mui/icons-material';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OfficerQueuePage() {
    const [queueItems, setQueueItems] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [surveyors, setSurveyors] = useState<any[]>([]);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'assign' | null>(null);

    // Form States
    const [finalAmount, setFinalAmount] = useState<string>('');
    const [officerNotes, setOfficerNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [surveyorId, setSurveyorId] = useState('');
    const [inspectionDate, setInspectionDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const fetchQueue = async () => {
        try {
            const res = await fetch('/api/officer/claims', { credentials: 'include' });
            const result = await res.json();
            console.log('[Officer Queue] Claims API Response:', result);
            const claimsArray = Array.isArray(result) ? result : (result.claims || result.data || []);

            setQueueItems(claimsArray);
            if (!selected && claimsArray.length > 0) {
                handleSelectClaim(claimsArray[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching queue:', error);
            setLoading(false);
        }
    };

    const fetchSurveyors = async () => {
        try {
            const res = await fetch('/api/officer/surveyors', { credentials: 'include' });
            const data = await res.json();
            if (data.success) setSurveyors(data.surveyors);
        } catch (error) {
            console.error('Error fetching surveyors:', error);
        }
    };

    const handleSelectClaim = async (claim: any) => {
        setLoadingDetail(true);
        setSelected(claim);
        setActionType(null);
        try {
            const res = await fetch(`/api/officer/claims/${claim.id}`);
            const data = await res.json();
            if (data.success) {
                console.log('[Officer Queue] Claim Detail Uplink:', {
                    id: data.claim.id,
                    ai_confidence: data.claim.ai_confidence,
                    ai_confidence_score: data.claim.ai_confidence_score,
                    all_keys: Object.keys(data.claim)
                });
                setSelected(data.claim);
                setFinalAmount(data.claim.status === 'surveyor_reported' ? data.claim.surveyor_amount?.toString() || '' : data.claim.ai_approved_amount?.toString() || '');
            }
        } catch (error) {
            console.error('Error fetching claim detail:', error);
            toast.error('Failed to fetch claim details');
        } finally {
            setLoadingDetail(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        fetchSurveyors();
        const channel = supabase.channel('realtime-claims-queue')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, () => {
                fetchQueue();
                toast.info('Ledger updated via real-time uplink');
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleDownloadReport = () => {
        if (!selected) return;
        generateClaimReport({
            claimId: selected.id,
            policyNumber: selected.policies?.policy_number || 'N/A',
            holderName: selected.users?.full_name || 'N/A',
            vehicleModel: `${selected.policies?.vehicle_make} ${selected.policies?.vehicle_model}`,
            vehicleReg: selected.policies?.vehicle_number || 'N/A',
            incidentType: selected.incident_type,
            incidentDate: format(new Date(selected.created_at), 'yyyy-MM-dd'),
            incidentLocation: selected.incident_location,
            totalAmount: selected.ai_approved_amount,
            damageItems: (selected.ai_damage_items || []).map((d: any) => ({
                partName: d.part || d.name,
                severity: d.severity,
                action: d.action || 'Repair',
                netSubtotal: d.amount || d.cost
            })),
            status: selected.status
        });
        toast.success('Technical report exported successfully');
    };

    const handleAction = async () => {
        if (!selected || !actionType) return;

        let endpoint = `/api/officer/claims/${selected.id}/`;
        let body: any = { officer_notes: officerNotes };

        if (actionType === 'approve') {
            endpoint += 'approve';
            body.final_amount = parseFloat(finalAmount);
        } else if (actionType === 'reject') {
            endpoint += 'reject';
            body.rejection_reason = rejectionReason;
        } else if (actionType === 'assign') {
            endpoint += 'assign-surveyor';
            body = {
                surveyor_id: surveyorId,
                inspection_date: inspectionDate,
                notes: officerNotes
            };
        }

        try {
            const res = await fetch(endpoint, {
                method: actionType === 'assign' ? 'PATCH' : 'PATCH', // Both are PATCH as defined in API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Claim ${actionType}ed successfully`);
                setActionType(null);
                setOfficerNotes('');
                fetchQueue(); // Refresh list

                // Refresh detail
                const detailRes = await fetch(`/api/officer/claims/${selected.id}`);
                const detailData = await detailRes.json();
                if (detailData.success) setSelected(detailData.claim);
            } else {
                toast.error(data.error || 'Action failed');
            }
        } catch (error) {
            toast.error('Network failure: Unable to commit decision');
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '600px', gap: 2 }}>
                <CircularProgress sx={{ color: '#2D5F9E' }} />
                <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#64748B', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                    Decrypting Ledger Queue...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', pt: 2 }}>
            {/* Ledger Header */}
            <Container maxWidth="xl" sx={{ mb: 2, px: { xs: 2.5, md: 4 } }}>
                <Grid container spacing={2} alignItems="flex-end" justifyContent="space-between">
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                            <ActivityIcon sx={{ fontSize: 20, color: '#10B981' }} />
                            <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#10B981' }}>
                                Live Queue Synchronized
                            </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '-0.01em', mb: 0.1 }}>
                            Manual Review Ledger
                        </Typography>
                        <Typography sx={{ color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '8px' }}>
                            {queueItems.length} Records in current vector
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                placeholder="Filter ID/Holder..."
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon sx={{ color: '#94A3B8', mr: 1.5 }} />
                                    ),
                                    sx: {
                                        height: 40,
                                        borderRadius: '12px',
                                        bgcolor: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '13px',
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                sx={{
                                    height: 40,
                                    px: 2.5,
                                    borderRadius: '10px',
                                    borderColor: '#E2E8F0',
                                    color: '#64748B',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '12px',
                                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
                                }}
                            >
                                Filter
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, overflow: 'hidden', borderTop: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                {/* Left: Queue List */}
                <Box sx={{
                    width: { xs: '100%', lg: '380px' },
                    borderRight: '1px solid #E2E8F0',
                    display: { xs: selected ? 'none' : 'flex', lg: 'flex' },
                    flexDirection: 'column',
                    bgcolor: '#F8FAFC',
                    height: '100%'
                }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: { xs: 'none', lg: 'block' } }}>
                        <Grid container>
                            <Grid size={{ xs: 4 }}>
                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TX ID</Typography>
                            </Grid>
                            <Grid size={{ xs: 5 }}>
                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Claimant / Vehicle</Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Value</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <AnimatePresence mode="popLayout">
                            {queueItems.map((item, idx) => {
                                const isSelected = selected?.id === item.id;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                    >
                                        <Card
                                            onClick={() => handleSelectClaim(item)}
                                            sx={{
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                border: isSelected ? '2px solid #2D5F9E' : '1px solid #E2E8F0',
                                                boxShadow: isSelected ? '0 8px 16px rgba(45, 95, 158, 0.08)' : 'none',
                                                '&:hover': {
                                                    borderColor: isSelected ? '#2D5F9E' : '#CBD5E1',
                                                    bgcolor: isSelected ? '#FFFFFF' : '#F1F5F9'
                                                },
                                                bgcolor: '#FFFFFF'
                                            }}
                                        >
                                            <CardContent sx={{ p: '12px !important' }}>
                                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                                    <Typography sx={{ fontSize: '10px', fontWeight: 900, color: isSelected ? '#2D5F9E' : '#64748B', fontFamily: 'monospace' }}>
                                                        {item.claim_number}
                                                    </Typography>
                                                    <Chip
                                                        label={
                                                            (item.status === 'ai_reviewed' || item.status === 'ai_complete') ? 'PENDING REVIEW' :
                                                                item.status === 'surveyor_assigned' ? 'SURVEY SCHEDULED' :
                                                                    item.status.replace('_', ' ').toUpperCase()
                                                        }
                                                        size="small"
                                                        sx={{
                                                            height: 18,
                                                            fontSize: '8px',
                                                            fontWeight: 900,
                                                            bgcolor: item.status === 'approved' ? '#ECFDF5' :
                                                                item.status === 'rejected' ? '#FEF2F2' :
                                                                    (item.status === 'ai_reviewed' || item.status === 'ai_complete') ? '#FFF7ED' :
                                                                        item.status === 'surveyor_assigned' ? '#F5F3FF' : '#F1F5F9',
                                                            color: item.status === 'approved' ? '#10B981' :
                                                                item.status === 'rejected' ? '#EF4444' :
                                                                    (item.status === 'ai_reviewed' || item.status === 'ai_complete') ? '#F97316' :
                                                                        item.status === 'surveyor_assigned' ? '#7C3AED' : '#64748B',
                                                        }}
                                                    />
                                                </Stack>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F', mb: 0.5 }}>
                                                    {item.claimant_name}
                                                </Typography>
                                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                                    <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                                                        {item.vehicle}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '14px', fontWeight: 900, color: '#1E3A5F' }}>
                                                        ₹{item.ai_approved_amount?.toLocaleString('en-IN')}
                                                    </Typography>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        {queueItems.length === 0 && (
                            <Box sx={{ py: 8, textAlign: 'center', opacity: 0.5 }}>
                                <ShieldAlertIcon sx={{ fontSize: 40, mb: 1, color: '#CBD5E1' }} />
                                <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#94A3B8' }}>No records found</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Right: Detailed View */}
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    bgcolor: '#FFFFFF',
                    p: { xs: 2, md: 4 },
                    display: { xs: selected ? 'block' : 'none', lg: 'block' }
                }}>
                    <AnimatePresence mode="wait">
                        {loadingDetail ? (
                            <Box sx={{ py: 4 }}>
                                <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="20%" sx={{ mb: 4 }} />
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 4 }}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} /></Grid>
                                    <Grid size={{ xs: 4 }}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} /></Grid>
                                    <Grid size={{ xs: 4 }}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} /></Grid>
                                </Grid>
                            </Box>
                        ) : selected ? (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            >
                                <Box sx={{ mb: 3, display: { lg: 'none' } }}>
                                    <Button
                                        onClick={() => setSelected(null)}
                                        startIcon={<ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />}
                                        sx={{ color: '#2D5F9E', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px' }}
                                    >
                                        Back to Queue
                                    </Button>
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 4 }}>
                                    <Stack direction="row" spacing={3} alignItems="center">
                                        <Avatar sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: '#2D5F9E' }}>
                                            <ShieldAlertIcon sx={{ fontSize: 28 }} />
                                        </Avatar>
                                        <Box>
                                            <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
                                                <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase' }}>
                                                    {selected.users?.full_name}
                                                </Typography>
                                                <Chip
                                                    label={selected.claim_number}
                                                    size="small"
                                                    sx={{ borderRadius: '6px', fontWeight: 900, bgcolor: '#F1F5F9', color: '#475569', fontSize: '10px' }}
                                                />
                                            </Stack>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {selected.incident_type} Incident • {selected.incident_location}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Button
                                        variant="contained"
                                        onClick={handleDownloadReport}
                                        startIcon={<DownloadIcon />}
                                        sx={{
                                            height: 44, px: 3, borderRadius: '12px', bgcolor: '#2D5F9E', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px'
                                        }}
                                    >
                                        Export Dossier
                                    </Button>
                                </Box>

                                {/* Photo Evidence */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.2em', mb: 2 }}>
                                        Visual Evidence Packet
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                                        {selected.claim_documents?.map((doc: any) => (
                                            <Box
                                                key={doc.id}
                                                component="a"
                                                href={doc.document_url || doc.file_url}
                                                target="_blank"
                                                sx={{
                                                    flexShrink: 0,
                                                    width: 140,
                                                    height: 100,
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: '1px solid #E2E8F0',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'scale(1.05)' }
                                                }}
                                            >
                                                <img
                                                    src={doc.document_url || doc.file_url}
                                                    alt="Evidence"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* AI Context */}
                                {selected.ai_recommendation && (
                                    <Paper sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: '16px',
                                        bgcolor: selected.ai_recommendation === 'manual_review' ? 'rgba(245, 158, 11, 0.08)' :
                                            selected.ai_recommendation === 'Approve' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                                        border: '1px solid',
                                        borderColor: selected.ai_recommendation === 'manual_review' ? '#F59E0B' :
                                            selected.ai_recommendation === 'Approve' ? '#10B981' : '#3B82F6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        boxShadow: 'none'
                                    }}>
                                        <Typography variant="body2" sx={{
                                            fontWeight: 900,
                                            color: selected.ai_recommendation === 'manual_review' ? '#BB6B00' :
                                                selected.ai_recommendation === 'Approve' ? '#065F46' : '#1E40AF',
                                            textTransform: 'uppercase',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            {selected.ai_recommendation === 'manual_review' ? '⚠️' :
                                                selected.ai_recommendation === 'Approve' ? '✅' : '🔍'}
                                            AI Suggestion: {
                                                selected.ai_recommendation === 'manual_review' ? 'Manual Review Requested' :
                                                    selected.ai_recommendation === 'Approve' ? 'Recommended for Approval' :
                                                        selected.ai_recommendation === 'Survey Required' ? 'Strategic Survey Recommended' : selected.ai_recommendation
                                            }
                                        </Typography>
                                    </Paper>
                                )}

                                <Paper sx={{ p: 3, borderRadius: '20px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', mb: 4, boxShadow: 'none' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <ZapIcon sx={{ color: '#F59E0B' }} />
                                        <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1E3A5F', textTransform: 'uppercase' }}>
                                            AI Neural Assessment
                                        </Typography>
                                    </Stack>
                                    <Typography sx={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, mb: 3 }}>
                                        {selected.ai_reasoning}
                                    </Typography>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', mb: 1.5 }}>
                                            Identified Damage Clusters
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {(selected.ai_damaged_parts || []).map((part: string) => (
                                                <Chip key={part} label={part} size="small" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }} />
                                            ))}
                                        </Stack>
                                    </Box>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>AI Confidence Score</Typography>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 900, color: (selected.ai_confidence_score || parseFloat(selected.ai_confidence || '0')) > 80 ? '#10B981' : '#F59E0B' }}>
                                                {selected.ai_confidence
                                                    ? `${selected.ai_confidence}%`
                                                    : selected.ai_confidence_score
                                                        ? `${selected.ai_confidence_score}%`
                                                        : 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>Oracle Estimate</Typography>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 900, color: '#1E3A5F' }}>
                                                ₹{selected.ai_approved_amount?.toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Surveyor Report Card - Persistent if data exists */}
                                {selected.surveyor_assignments?.[0]?.vehicle_condition && (
                                    <Box sx={{
                                        p: 3,
                                        mb: 4,
                                        borderRadius: '16px',
                                        bgcolor: '#F0F9FF',
                                        border: '1px solid #0EA5E9',
                                        boxShadow: 'none'
                                    }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                            <AssignIcon sx={{ color: '#0EA5E9' }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0369A1', textTransform: 'uppercase' }}>
                                                👨&zwj;💼 Surveyor Inspection Report
                                            </Typography>
                                        </Stack>

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', mb: 0.5 }}>
                                                    Surveyor Recommended Amount
                                                </Typography>
                                                <Typography sx={{ fontSize: '20px', fontWeight: 900, color: '#0369A1' }}>
                                                    ₹{selected.surveyor_amount?.toLocaleString('en-IN')}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', mb: 0.5 }}>
                                                    Vehicle Condition
                                                </Typography>
                                                <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#1E3A5F', textTransform: 'capitalize' }}>
                                                    {selected.surveyor_assignments?.[0]?.vehicle_condition || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', mb: 0.5 }}>
                                                    Inspection Notes
                                                </Typography>
                                                <Typography sx={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                                                    {selected.surveyor_assignments?.[0]?.inspection_notes || 'No notes provided.'}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', mb: 0.5 }}>
                                                    Inspected By
                                                </Typography>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F' }}>
                                                    {selected.surveyor_assignments?.[0]?.surveyors?.full_name || 'Assigned Surveyor'}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#0EA5E9', textTransform: 'uppercase', mb: 0.5 }}>
                                                    Inspection Date
                                                </Typography>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <EventIcon sx={{ fontSize: 16, color: '#64748B' }} />
                                                    {selected.surveyor_assignments?.[0]?.inspection_date || 'N/A'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Action Console */}
                                {(() => {
                                    const isPending = [
                                        'ai_reviewed',
                                        'ai_complete',
                                        'officer_review',
                                        'info_requested',
                                        'under_review',
                                        'surveyor_assigned',
                                        'survey_requested',
                                        'surveyor_reported'
                                    ].includes(selected.status);

                                    if (isPending) {
                                        return (
                                            <Box sx={{ mt: 4 }}>
                                                {!actionType ? (
                                                    <Box>
                                                        {selected.status === 'survey_requested' && (
                                                            <Box sx={{ p: 2, mb: 3, borderRadius: '12px', bgcolor: '#FEF3C7', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                <AlertTriangleIcon sx={{ color: '#D97706' }} />
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#B45309' }}>⚠️ Customer Requested Physical Survey</Typography>
                                                            </Box>
                                                        )}
                                                        {selected.status === 'surveyor_reported' && (
                                                            <Box sx={{ p: 2, mb: 3, borderRadius: '12px', bgcolor: '#ECFDF5', border: '1px solid #10B981', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                <CheckCircleIcon sx={{ color: '#059669' }} />
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#065F46' }}>✅ Surveyor inspection complete. Surveyor recommended: ₹{selected.surveyor_amount?.toLocaleString('en-IN')}</Typography>
                                                            </Box>
                                                        )}
                                                        <Stack direction="row" spacing={2}>
                                                            {selected.status === 'survey_requested' ? (
                                                                <>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => setActionType('assign')}
                                                                        startIcon={<AssignIcon />}
                                                                        sx={{ flex: 2, height: 48, borderRadius: '12px', bgcolor: '#F59E0B', color: '#FFF', fontWeight: 900, textTransform: 'uppercase', '&:hover': { bgcolor: '#D97706' } }}
                                                                    >
                                                                        Assign Surveyor
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => setActionType('approve')}
                                                                        sx={{ flex: 1, height: 48, borderRadius: '12px', borderColor: '#10B981', color: '#10B981', fontWeight: 900, textTransform: 'uppercase' }}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => setActionType('reject')}
                                                                        sx={{ flex: 1, height: 48, borderRadius: '12px', borderColor: '#EF4444', color: '#EF4444', fontWeight: 900, textTransform: 'uppercase' }}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            ) : selected.status === 'surveyor_reported' ? (
                                                                <>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => setActionType('approve')}
                                                                        startIcon={<CheckCircleIcon />}
                                                                        sx={{ flex: 1, height: 48, borderRadius: '12px', bgcolor: '#10B981', fontWeight: 900, textTransform: 'uppercase' }}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => setActionType('reject')}
                                                                        startIcon={<XCircleIcon />}
                                                                        sx={{ flex: 1, height: 48, borderRadius: '12px', borderColor: '#EF4444', color: '#EF4444', fontWeight: 900, textTransform: 'uppercase' }}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => setActionType('approve')}
                                                                        startIcon={<CheckCircleIcon />}
                                                                        sx={{ flex: 1, height: 48, borderRadius: '12px', bgcolor: '#10B981', fontWeight: 900, textTransform: 'uppercase' }}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => setActionType('assign')}
                                                                        startIcon={<AssignIcon />}
                                                                        sx={{ flex: 1, height: 48, borderRadius: '12px', borderColor: '#2D5F9E', color: '#2D5F9E', fontWeight: 900, textTransform: 'uppercase' }}
                                                                    >
                                                                        Assign Surveyor
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => setActionType('reject')}
                                                                        startIcon={<XCircleIcon />}
                                                                        sx={{ flex: 1, height: 48, borderRadius: '12px', borderColor: '#EF4444', color: '#EF4444', fontWeight: 900, textTransform: 'uppercase' }}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                ) : (
                                                    <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #CBD5E1', borderLeft: `6px solid ${actionType === 'approve' ? '#10B981' : actionType === 'reject' ? '#EF4444' : '#2D5F9E'}` }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                                            <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase', color: '#1E3A5F' }}>
                                                                {actionType}al Protocol
                                                            </Typography>
                                                            <IconButton onClick={() => setActionType(null)}><XCircleIcon /></IconButton>
                                                        </Stack>

                                                        <Stack spacing={3}>
                                                            {actionType === 'approve' && (
                                                                <TextField
                                                                    fullWidth
                                                                    label="Final Settlement Amount (₹)"
                                                                    type="number"
                                                                    value={finalAmount}
                                                                    onChange={e => setFinalAmount(e.target.value)}
                                                                    InputProps={{ startAdornment: <MoneyIcon sx={{ mr: 1, color: '#94A3B8' }} /> }}
                                                                />
                                                            )}

                                                            {actionType === 'reject' && (
                                                                <FormControl fullWidth>
                                                                    <InputLabel>Rejection Reason</InputLabel>
                                                                    <Select
                                                                        value={rejectionReason}
                                                                        label="Rejection Reason"
                                                                        onChange={e => setRejectionReason(e.target.value)}
                                                                    >
                                                                        <MenuItem value="Invalid Documents">Invalid Documents</MenuItem>
                                                                        <MenuItem value="Policy Not Covered">Policy Not Covered</MenuItem>
                                                                        <MenuItem value="Fraudulent Activity Suspected">Fraudulent Activity Suspected</MenuItem>
                                                                        <MenuItem value="Damage Inconsistent with Statement">Damage Inconsistent with Statement</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            )}

                                                            {actionType === 'assign' && (
                                                                <Grid container spacing={2}>
                                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                                        <FormControl fullWidth>
                                                                            <InputLabel>Surveyor Node</InputLabel>
                                                                            <Select
                                                                                value={surveyorId}
                                                                                label="Surveyor Node"
                                                                                onChange={e => setSurveyorId(e.target.value)}
                                                                            >
                                                                                {surveyors.map(s => (
                                                                                    <MenuItem key={s.id} value={s.id}>{s.full_name} ({s.license_number})</MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                                        <TextField
                                                                            fullWidth
                                                                            label="Inspection Date"
                                                                            type="date"
                                                                            value={inspectionDate}
                                                                            onChange={e => setInspectionDate(e.target.value)}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            )}

                                                            <TextField
                                                                fullWidth
                                                                multiline
                                                                rows={3}
                                                                label="Officer Internal Notes"
                                                                value={officerNotes}
                                                                onChange={e => setOfficerNotes(e.target.value)}
                                                            />

                                                            <Button
                                                                fullWidth
                                                                variant="contained"
                                                                onClick={handleAction}
                                                                sx={{ height: 50, borderRadius: '12px', bgcolor: actionType === 'approve' ? '#10B981' : actionType === 'reject' ? '#EF4444' : '#2D5F9E', fontWeight: 900, textTransform: 'uppercase' }}
                                                            >
                                                                Commit {actionType}al
                                                            </Button>
                                                        </Stack>
                                                    </Paper>
                                                )}
                                            </Box>
                                        );
                                    } else {
                                        return (
                                            <Box sx={{ mt: 4, p: 3, borderRadius: '16px', bgcolor: selected.status === 'approved' ? '#ECFDF5' : selected.status === 'rejected' ? '#FEF2F2' : '#F1F5F9', textAlign: 'center', border: '1px solid', borderColor: selected.status === 'approved' ? '#10B981' : selected.status === 'rejected' ? '#EF4444' : '#E2E8F0' }}>
                                                {selected.status === 'approved' ? <BadgeCheckIcon sx={{ fontSize: 40, color: '#10B981', mb: 1 }} /> : <XCircleIcon sx={{ fontSize: 40, color: '#EF4444', mb: 1 }} />}
                                                <Typography sx={{ fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase' }}>
                                                    Case {selected.status.replace('_', ' ').toUpperCase()}
                                                </Typography>
                                                <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                                                    {selected.status === 'approved' ? 'Claim has been finalized and settlement protocol initiated.' :
                                                        selected.status === 'rejected' ? 'Claim has been rejected based on officer technical assessment.' :
                                                            selected.status === 'survey_requested' ? 'Customer has requested a physical survey. Please assign a surveyor.' :
                                                                'No further manual intervention required on this node.'}
                                                </Typography>
                                            </Box>
                                        );
                                    }
                                })()}
                            </motion.div>
                        ) : (
                            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 8, textAlign: 'center', gap: 4 }}>
                                <Avatar sx={{ width: 120, height: 120, bgcolor: '#F8FAFC', color: '#CBD5E1', borderRadius: '40px', border: '1px solid #E2E8F0' }}>
                                    <ActivityIcon sx={{ fontSize: 60 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase', mb: 1, fontStyle: 'italic' }}>
                                        Ledger Uplink Idle
                                    </Typography>
                                    <Typography sx={{ color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '11px', maxWidth: 300 }}>
                                        Select a transaction packet from the left vector to initialize validation protocol.
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>
        </Box>
    );
}
