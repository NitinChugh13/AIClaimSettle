'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Button,
    Chip,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    CircularProgress,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as XCircleIcon,
    Upgrade as ArrowUpIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { generateClaimReport } from '@/lib/pdf-generator';
import { format } from 'date-fns';

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

            // Map DB schema to UI format
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
                // Focus first non-processed item
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

        const channel = supabase.channel('realtime-claims')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, () => {
                fetchQueue();
                toast.info('Queue updated in real-time');
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleDownloadReport = () => {
        if (!selected) return;

        // We need to fetch the raw claim from data or keep it in state
        // For simplicity, we use the 'selected' UI state which has most fields
        generateClaimReport({
            claimId: selected.id,
            policyNumber: selected.policy,
            holderName: selected.holder,
            vehicleModel: selected.vehicle,
            vehicleReg: selected.reg || 'MH 01 AB 1234', // fallback
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
        toast.success('Report generated successfully');
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
            toast.success(`Claim ${selected.id} ${newStatus}`);

            const remaining = queueItems.filter(q => ![...processedIds, selected.id].includes(q.id) && q.status === 'pending');
            if (remaining.length > 0) {
                setSelected(remaining[0]);
            } else {
                setSelected(null);
            }
            setNote('');
        } catch (error) {
            toast.error('Failed to update claim status');
        }
    };

    if (loading) {
        return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    const remainingItems = queueItems.filter(q => !processedIds.includes(q.id) && q.status === 'pending');

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Manual Review Queue</Typography>
                <Typography variant="body1" color="text.secondary">
                    {remainingItems.length} claims awaiting review (Live Sync Active)
                </Typography>
            </Box>

            {queueItems.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">No claims in the system yet.</Typography>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {/* Queue list */}
                    <Grid size={{ xs: 12, lg: 4 }} >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {queueItems.map(item => {
                                const isProcessed = processedIds.includes(item.id) || item.status !== 'pending';
                                const isSelected = selected?.id === item.id;

                                return (
                                    <Card
                                        key={item.id}
                                        elevation={0}
                                        onClick={() => setSelected(item)}
                                        sx={{
                                            cursor: 'pointer',
                                            border: '2px solid',
                                            borderColor: isSelected ? 'primary.main' : 'divider',
                                            bgcolor: isSelected ? 'rgba(30, 58, 95, 0.02)' : 'background.paper',
                                            opacity: isProcessed ? 0.5 : 1,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: isSelected ? 'primary.main' : 'primary.light',
                                            },
                                            borderRadius: 3,
                                        }}
                                    >
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{item.id}</Typography>
                                                {isProcessed ? (
                                                    <Chip label={item.status} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 'bold', textTransform: 'capitalize' }} />
                                                ) : (
                                                    <Chip label={item.flags.join(', ') || 'Pending'} size="small" sx={{ bgcolor: '#fffbeb', color: '#b45309', fontWeight: 'bold', borderColor: '#fde68a' }} variant="outlined" />
                                                )}
                                            </Box>
                                            <Typography variant="subtitle1" fontWeight="bold">{item.holder}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                {item.vehicle} • ₹{item.amount.toLocaleString('en-IN')}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                <Typography variant="caption" fontWeight="bold" sx={{ color: item.confidence >= 70 ? '#d97706' : '#dc2626' }}>
                                                    Conf: {item.confidence}%
                                                </Typography>
                                                <Typography variant="caption" fontWeight="bold" sx={{ color: item.fraudScore < 30 ? '#059669' : '#d97706' }}>
                                                    Fraud: {item.fraudScore}/100
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Grid>

                    {/* Claim detail */}
                    {selected && (
                        <Grid size={{ xs: 12, lg: 8 }} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" fontWeight="bold">{selected.id}</Typography>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Button
                                                        size="small"
                                                        startIcon={<DownloadIcon />}
                                                        onClick={handleDownloadReport}
                                                        sx={{ mr: 1, fontWeight: 'bold' }}
                                                    >
                                                        Report
                                                    </Button>
                                                    {selected.flags.map((f: string) => (
                                                        <Chip key={f} label={f} size="small" sx={{ bgcolor: '#fffbeb', color: '#b45309', fontWeight: 'bold', borderColor: '#fde68a' }} variant="outlined" />
                                                    ))}
                                                </Box>
                                            </Box>
                                        }
                                        sx={{ pb: 0 }}
                                    />
                                    <CardContent sx={{ p: 3 }}>
                                        <Grid container spacing={3} sx={{ mb: 4 }}>
                                            <Grid size={{ xs: 6, sm: 4 }} >
                                                <Typography variant="caption" color="text.secondary" display="block">Policyholder</Typography>
                                                <Typography variant="body2" fontWeight="500">{selected.holder}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 4 }} >
                                                <Typography variant="caption" color="text.secondary" display="block">Vehicle</Typography>
                                                <Typography variant="body2" fontWeight="500">{selected.vehicle}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 4 }} >
                                                <Typography variant="caption" color="text.secondary" display="block">Incident</Typography>
                                                <Typography variant="body2" fontWeight="500">{selected.incident}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }} >
                                                <Typography variant="caption" color="text.secondary" display="block">Location</Typography>
                                                <Typography variant="body2" fontWeight="500">{selected.location}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 4 }} >
                                                <Typography variant="caption" color="text.secondary" display="block">AI Confidence</Typography>
                                                <Typography variant="body2" fontWeight="bold" sx={{ color: selected.confidence >= 70 ? '#d97706' : '#dc2626' }}>{selected.confidence}%</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 4 }} >
                                                <Typography variant="caption" color="text.secondary" display="block">Fraud Score</Typography>
                                                <Typography variant="body2" fontWeight="bold" sx={{ color: selected.fraudScore < 30 ? '#059669' : '#d97706' }}>{selected.fraudScore}/100</Typography>
                                            </Grid>
                                        </Grid>

                                        <Typography variant="overline" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Damage Items</Typography>
                                        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                            <Table size="small">
                                                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Part</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Severity</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Action</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selected.damages.map((d: any, i: number) => (
                                                        <TableRow key={i}>
                                                            <TableCell><Typography variant="body2" fontWeight="500">{d.part}</Typography></TableCell>
                                                            <TableCell><Typography variant="body2" color="text.secondary">{d.severity}</Typography></TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={d.action}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        height: 24,
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 'bold',
                                                                        color: d.action === 'Replace' ? '#d97706' : '#059669',
                                                                        borderColor: d.action === 'Replace' ? '#fde68a' : '#a7f3d0'
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="right"><Typography variant="body2" fontWeight="bold">₹{d.amount.toLocaleString('en-IN')}</Typography></TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                                        <TableCell colSpan={3} sx={{ py: 2 }}>
                                                            <Typography variant="body1" fontWeight="bold">Total Payable</Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ py: 2 }}>
                                                            <Typography variant="h6" fontWeight="bold" color="success.main">₹{selected.amount.toLocaleString('en-IN')}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>

                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="overline" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Officer Note (Optional)</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Add review note..."
                                            value={note}
                                            onChange={e => setNote(e.target.value)}
                                            sx={{ mb: 3 }}
                                        />

                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 4 }} >
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => handleDecision('approve')}
                                                    disabled={processedIds.includes(selected.id) || selected.status !== 'pending'}
                                                    sx={{ py: 1.5, fontWeight: 'bold' }}
                                                >
                                                    Approve ₹{(selected.amount / 1000).toFixed(1)}K
                                                </Button>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 4 }} >
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<XCircleIcon />}
                                                    onClick={() => handleDecision('reject')}
                                                    disabled={processedIds.includes(selected.id) || selected.status !== 'pending'}
                                                    sx={{ py: 1.5, fontWeight: 'bold' }}
                                                >
                                                    Reject
                                                </Button>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 4 }} >
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="warning"
                                                    startIcon={<ArrowUpIcon />}
                                                    onClick={() => handleDecision('escalate')}
                                                    disabled={processedIds.includes(selected.id) || selected.status !== 'pending'}
                                                    sx={{ py: 1.5, fontWeight: 'bold' }}
                                                >
                                                    Escalate
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
}
