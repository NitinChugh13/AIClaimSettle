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
    Tooltip as MuiTooltip
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
    FactCheck as BadgeCheckIcon
} from '@mui/icons-material';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OfficerQueuePage() {
    const [queueItems, setQueueItems] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [note, setNote] = useState('');
    const [processedIds, setProcessedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueue = async () => {
        try {
            const res = await fetch('/api/claims');
            const data = await res.json();

            const formattedData = data.map((c: any) => ({
                id: c.id,
                policy: c.policyNumber,
                holder: c.holderName,
                vehicle: c.vehicleModel,
                incident: c.incidentType,
                location: c.incidentLocation,
                amount: c.totalAmount,
                confidence: c.confidenceScore,
                fraudScore: c.fraudScore,
                flags: c.flags || [],
                status: c.status,
                createdAt: c.createdAt,
                damages: (c.damageItems || []).map((di: any) => ({
                    part: di.partName,
                    severity: di.severity,
                    action: di.action,
                    amount: di.netSubtotal,
                })),
            }));

            setQueueItems(formattedData);
            setLoading(false);
            if (!selected && formattedData.length > 0) {
                const remaining = formattedData.filter((q: any) => q.status === 'pending');
                setSelected(remaining.length > 0 ? remaining[0] : formattedData[0]);
            }
        } catch (error) {
            console.error('Error fetching queue:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
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
            policyNumber: selected.policy,
            holderName: selected.holder,
            vehicleModel: selected.vehicle,
            vehicleReg: 'MH 01 AB 1234',
            incidentType: selected.incident,
            incidentDate: format(new Date(), 'yyyy-MM-dd'),
            incidentLocation: selected.location,
            totalAmount: selected.amount,
            damageItems: selected.damages.map((d: any) => ({
                partName: d.part,
                severity: d.severity,
                action: d.action,
                netSubtotal: d.amount
            })),
            status: selected.status
        });
        toast.success('Technical report exported successfully');
    };

    const handleDecision = async (decision: 'approve' | 'reject' | 'escalate') => {
        if (!selected) return;
        const newStatus = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'escalated';
        try {
            await fetch(`/api/claims/${selected.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, note }),
            });
            setProcessedIds(prev => [...prev, selected.id]);
            toast.success(`TX-${selected.id.slice(0, 8)} marked as ${newStatus.toUpperCase()}`);
            const remaining = queueItems.filter(q => ![...processedIds, selected.id].includes(q.id) && q.status === 'pending');
            setSelected(remaining.length > 0 ? remaining[0] : null);
            setNote('');
        } catch (error) {
            toast.error('Uplink failure: Unable to commit decision');
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

    const remainingItems = queueItems.filter(q => !processedIds.includes(q.id) && q.status === 'pending');

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
                            {remainingItems.length} Records awaiting cryptographic validation
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                placeholder="Filter ID/Holder..."
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon sx={{ color: '#94A3B8', mr: 1.5 }} />
                                    ),
                                    sx: {
                                        height: 56,
                                        borderRadius: '16px',
                                        bgcolor: '#FFFFFF',
                                        fontWeight: 700,
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
                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Holder / Object</Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }} textAlign="right">
                                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Value</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <AnimatePresence mode="popLayout">
                            {queueItems.map((item, idx) => {
                                const isProcessed = processedIds.includes(item.id) || item.status !== 'pending';
                                const isSelected = selected?.id === item.id;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                    >
                                        <Card
                                            onClick={() => setSelected(item)}
                                            sx={{
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                border: isSelected ? '2px solid #2D5F9E' : '1px solid #E2E8F0',
                                                boxShadow: isSelected ? '0 8px 24px rgba(45, 95, 158, 0.12)' : 'none',
                                                opacity: isProcessed && !isSelected ? 0.6 : 1,
                                                '&:hover': {
                                                    transform: isSelected ? 'none' : 'translateY(-2px)',
                                                    boxShadow: isSelected ? '0 8px 24px rgba(45, 95, 158, 0.12)' : '0 4px 12px rgba(0,0,0,0.05)',
                                                    borderColor: isSelected ? '#2D5F9E' : '#CBD5E1'
                                                },
                                                bgcolor: isSelected ? '#FFFFFF' : '#FFFFFF'
                                            }}
                                        >
                                            <CardContent sx={{ p: '16px !important' }}>
                                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: isSelected ? '#2D5F9E' : '#64748B', fontFamily: 'monospace' }}>
                                                        TX-{item.id.slice(0, 8)}
                                                    </Typography>
                                                    <Chip
                                                        label={item.status === 'pending' ? 'PENDING' : item.status.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '9px',
                                                            fontWeight: 900,
                                                            bgcolor: item.status === 'approved' ? '#ECFDF5' : item.status === 'rejected' ? '#FEF2F2' : '#FFF7ED',
                                                            color: item.status === 'approved' ? '#10B981' : item.status === 'rejected' ? '#EF4444' : '#F97316',
                                                            border: 'none'
                                                        }}
                                                    />
                                                </Stack>
                                                <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 800, color: '#1E3A5F', mb: 0.5, textTransform: 'uppercase' }}>
                                                    {item.holder}
                                                </Typography>
                                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <ZapIcon sx={{ fontSize: 14, color: '#2D5F9E' }} />
                                                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
                                                            {item.vehicle}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#1E3A5F' }}>
                                                        ₹{item.amount.toLocaleString('en-IN')}
                                                    </Typography>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </Box>
                </Box>

                {/* Right: Detailed View */}
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    bgcolor: '#FFFFFF',
                    p: { xs: 2, md: 5, lg: 6 },
                    display: { xs: selected ? 'block' : 'none', lg: 'block' }
                }}>
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            >
                                {/* Detail Header */}
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
                                    <Stack direction="row" spacing={4} alignItems="center">
                                        <Avatar sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '12px',
                                            bgcolor: '#2D5F9E',
                                            boxShadow: '0 4px 12px rgba(45, 95, 158, 0.12)'
                                        }}>
                                            <ShieldAlertIcon sx={{ fontSize: 24 }} />
                                        </Avatar>
                                        <Box>
                                            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                                <Chip
                                                    label={`TXID: ${selected.id.toUpperCase().slice(0, 12)}`}
                                                    size="small"
                                                    sx={{ borderRadius: '8px', fontWeight: 900, bgcolor: '#F1F5F9', color: '#475569', fontSize: '10px' }}
                                                />
                                                <Chip
                                                    label="PROTOCOL_VERIFIED"
                                                    size="small"
                                                    sx={{ borderRadius: '8px', fontWeight: 900, bgcolor: '#ECFDF5', color: '#10B981', fontSize: '10px' }}
                                                />
                                            </Stack>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase', mb: 0.2 }}>
                                                {selected.holder}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AlertTriangleIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                                                {selected.incident} Incident in {selected.location}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Button
                                        variant="contained"
                                        onClick={handleDownloadReport}
                                        startIcon={<DownloadIcon />}
                                        sx={{
                                            height: 48,
                                            px: 3,
                                            borderRadius: '14px',
                                            bgcolor: '#2D5F9E',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            fontSize: '13px',
                                            '&:hover': { bgcolor: '#1E3A5F' }
                                        }}
                                    >
                                        Export Technical Dossier
                                    </Button>
                                </Box>

                                {/* Key Data Matrix */}
                                <Grid container spacing={2} sx={{ mb: 6 }}>
                                    {[
                                        { label: 'Policy Ident', value: selected.policy, icon: FileTextIcon, color: '#2D5F9E' },
                                        { label: 'Damage Severity', value: 'High Magnitude', icon: ActivityIcon, color: '#10B981' },
                                        { label: 'Risk Vector', value: `${selected.fraudScore}% Score`, icon: ShieldAlertIcon, color: selected.fraudScore > 40 ? '#EF4444' : '#64748B' },
                                    ].map((item, i) => (
                                        <Grid key={i} size={{ xs: 12, md: 4 }}>
                                            <Paper sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: `${item.color}10`, color: item.color, borderRadius: '12px' }}>
                                                        <item.icon sx={{ fontSize: 20 }} />
                                                    </Avatar>
                                                    <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                                        {item.label}
                                                    </Typography>
                                                </Stack>
                                                <Typography sx={{ fontSize: '15px', fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase' }}>
                                                    {item.value}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Damage Breakdown Ledger */}
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase', mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <HistoryIcon sx={{ color: '#2D5F9E', fontSize: 24 }} /> Damage Assessment Ledger
                                </Typography>
                                <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none', mb: 6, overflow: 'hidden', overflowX: 'auto' }}>
                                    <Table>
                                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                                            <TableRow>
                                                <TableCell sx={{ color: '#64748B', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', pl: 4 }}>Component</TableCell>
                                                <TableCell sx={{ color: '#64748B', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px' }}>Severity</TableCell>
                                                <TableCell sx={{ color: '#64748B', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px' }}>Action</TableCell>
                                                <TableCell align="right" sx={{ color: '#64748B', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', pr: 4 }}>Settlement (₹)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selected.damages.map((d: any, i: number) => (
                                                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell sx={{ py: 4, pl: 4 }}>
                                                        <Typography sx={{ fontWeight: 800, color: '#1E3A5F', textTransform: 'uppercase' }}>{d.part}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 4 }}>
                                                        <Chip label={d.severity} size="small" sx={{ height: 24, fontSize: '10px', fontWeight: 800, bgcolor: '#F1F5F9', color: '#475569' }} />
                                                    </TableCell>
                                                    <TableCell sx={{ py: 4 }}>
                                                        <Box>
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#1E3A5F', textTransform: 'uppercase' }}>{d.action}</Typography>
                                                            <Typography sx={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>{d.action === 'Replace' ? 'OEM Component' : 'Structural Repair'}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ py: 3, pr: 4 }}>
                                                        <Typography sx={{ fontWeight: 900, color: '#1E3A5F', fontSize: '15px' }}>₹{d.amount.toLocaleString('en-IN')}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{
                                                bgcolor: '#1E3A5F !important',
                                                '& td': {
                                                    bgcolor: '#1E3A5F !important',
                                                    borderColor: '#1E3A5F !important',
                                                    color: '#FFFFFF !important'
                                                }
                                            }}>
                                                <TableCell colSpan={3} sx={{ py: 1.5, pl: 4 }}>
                                                    <Typography sx={{ color: 'inherit', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Net Settlement Oracle
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" sx={{ py: 1.5, pr: 4 }}>
                                                    <Typography sx={{ color: 'inherit', fontWeight: 900, fontSize: '16px' }}>₹{selected.amount.toLocaleString('en-IN')}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Decision Protocol */}
                                {selected.status === 'pending' && !processedIds.includes(selected.id) && (
                                    <Box sx={{ mt: 6 }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, ml: 1 }}>
                                            <BadgeCheckIcon sx={{ color: '#2D5F9E', fontSize: 20 }} />
                                            <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
                                                Strategic Validation Justification
                                            </Typography>
                                        </Stack>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={note}
                                            onChange={e => setNote(e.target.value)}
                                            placeholder="Provide strategic reasoning for the validation decision node..."
                                            sx={{
                                                mb: 6,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '16px',
                                                    p: 2,
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    bgcolor: '#F8FAFC',
                                                    '& fieldset': { borderColor: '#E2E8F0' },
                                                }
                                            }}
                                        />
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 5 }}>
                                                <Button
                                                    fullWidth
                                                    onClick={() => handleDecision('approve')}
                                                    variant="contained"
                                                    startIcon={<BadgeCheckIcon sx={{ fontSize: 28 }} />}
                                                    sx={{
                                                        height: 56,
                                                        borderRadius: '16px',
                                                        bgcolor: '#10B981',
                                                        fontSize: '13px',
                                                        fontWeight: 900,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.1em',
                                                        boxShadow: '0 8px 16px rgba(16, 185, 129, 0.15)',
                                                        '&:hover': { bgcolor: '#059669' }
                                                    }}
                                                >
                                                    Finalize Approval
                                                </Button>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 3.5 }}>
                                                <Button
                                                    fullWidth
                                                    onClick={() => handleDecision('reject')}
                                                    variant="outlined"
                                                    startIcon={<XCircleIcon />}
                                                    sx={{
                                                        height: 56,
                                                        borderRadius: '16px',
                                                        borderColor: '#EF4444',
                                                        color: '#EF4444',
                                                        fontSize: '13px',
                                                        fontWeight: 900,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.1em',
                                                        '&:hover': { bgcolor: '#FEF2F2', borderColor: '#EF4444' }
                                                    }}
                                                >
                                                    Terminate TX
                                                </Button>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 3.5 }}>
                                                <Button
                                                    fullWidth
                                                    onClick={() => handleDecision('escalate')}
                                                    variant="outlined"
                                                    startIcon={<ArrowUpCircleIcon />}
                                                    sx={{
                                                        height: 56,
                                                        borderRadius: '16px',
                                                        borderColor: '#E2E8F0',
                                                        color: '#64748B',
                                                        fontSize: '13px',
                                                        fontWeight: 900,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.1em',
                                                        '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
                                                    }}
                                                >
                                                    Escalate Node
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
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

