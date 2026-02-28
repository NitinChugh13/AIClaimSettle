'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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
    CircularProgress,
    Paper,
    Divider,
    Stack,
    Tooltip as MuiTooltip
} from '@mui/material';
import {
    Insights as ActivityIcon,
    History as ClockIcon,
    CheckCircle as CheckCircleIcon,
    GppMaybe as ShieldAlertIcon,
    BarChart as BarChartIcon,
    ChevronRight as ChevronRightIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    NorthEast as ArrowUpRightIcon,
    TrendingUp as TrendingUpIcon,
    Cancel as XCircleIcon,
    FlashOn as ZapIcon,
    ArrowForward as ArrowRightIcon,
    Insights as InsightsIcon,
    Launch as ExternalLinkIcon
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, AreaChart, Area
} from 'recharts';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OfficerDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Pending Review', value: '0', icon: ClockIcon, color: '#E5A020', bg: 'rgba(229, 160, 32, 0.08)' },
        { label: 'Approved Today', value: '0', icon: CheckCircleIcon, color: '#0F9D6A', bg: 'rgba(15, 157, 106, 0.08)' },
        { label: "Total Volume", value: '0', icon: TrendingUpIcon, color: '#2D5F9E', bg: 'rgba(45, 95, 158, 0.08)' },
        { label: 'Risk Flags', value: '0', icon: ShieldAlertIcon, color: '#D64045', bg: 'rgba(214, 64, 69, 0.08)' },
    ]);
    const [queueClaims, setQueueClaims] = useState<any[]>([]);
    const [hourlyData, setHourlyData] = useState<any[]>([]);

    const fetchData = async () => {
        console.log('[Officer Dashboard] fetchData initiated');
        try {
            console.log('[Officer Dashboard] Starting parallel fetch for stats and claims...');
            const [statsRes, claimsRes] = await Promise.all([
                fetch('/api/officer/stats', { credentials: 'include' }),
                fetch('/api/officer/claims', { credentials: 'include' })
            ]);

            console.log('[Officer Dashboard] Fetch complete. Status codes:', statsRes.status, claimsRes.status);

            const statsData = await statsRes.json();
            const claimsData = await claimsRes.json();

            console.log('[Officer Dashboard] Stats API Response:', statsData);
            console.log('[Officer Dashboard] Claims API Response:', claimsData);

            if (statsData.success && (claimsData.success || Array.isArray(claimsData))) {
                const s = statsData.stats;
                const claimsArray = Array.isArray(claimsData) ? claimsData : (claimsData.claims || claimsData.data || []);

                console.log('[Officer Dashboard] Updating state with data. Claims count:', claimsArray.length);

                setStats([
                    { label: 'Pending Review', value: s.pending_review.toString(), icon: ClockIcon, color: '#E5A020', bg: 'rgba(229, 160, 32, 0.08)' },
                    { label: 'Approved Today', value: s.approved_today.toString(), icon: CheckCircleIcon, color: '#0F9D6A', bg: 'rgba(15, 157, 106, 0.08)' },
                    { label: "Total Approved", value: `₹${Math.round(s.total_amount_approved / 1000)}k`, icon: TrendingUpIcon, color: '#2D5F9E', bg: 'rgba(45, 95, 158, 0.08)' },
                    { label: 'Surveyor Active', value: s.surveyor_assigned.toString(), icon: ShieldAlertIcon, color: '#D64045', bg: 'rgba(214, 64, 69, 0.08)' },
                ]);

                // Filter for priority queue (show ALL for now to verify data)
                console.log('[Officer Dashboard] All available statuses:', claimsArray.map((c: any) => c.status));

                const latest = claimsArray
                    .slice(0, 5) // Show top 5 instead of 4
                    .map((c: any) => ({
                        id: c.id,
                        vehicle: c.claimant_name + ' - ' + (c.vehicle || 'Unknown'),
                        amount: c.ai_approved_amount || c.estimated_repair_cost || 0,
                        confidence: c.ai_confidence_score || 0,
                        flag: (c.ai_flags && c.ai_flags.length > 0) ? 'Flagged' : 'Clean',
                        time: c.created_at ? formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) : 'Just now'
                    }));
                setQueueClaims(latest);

                const hours: Record<string, number> = {};
                claimsArray.forEach((c: any) => {
                    const hour = new Date(c.created_at).getHours();
                    const display = hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
                    hours[display] = (hours[display] || 0) + 1;
                });
                const formattedHourly = Object.entries(hours).map(([hour, count]) => ({ hour, claims: count }));
                setHourlyData(formattedHourly.length > 0 ? formattedHourly : [
                    { hour: '9am', claims: 2 }, { hour: '12pm', claims: 5 }, { hour: '3pm', claims: 3 }, { hour: '6pm', claims: 8 }
                ]);
            } else {
                console.warn('[Officer Dashboard] API returned success:false');
            }

            setLoading(false);
        } catch (error) {
            console.error('[Officer Dashboard] FATAL ERROR during fetchData:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('[Officer Dashboard] Component mounted, triggering initial fetch');
        fetchData();

        const channel = supabase.channel('dashboard-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, (payload) => {
                console.log('[Officer Dashboard] Real-time update received:', payload);
                fetchData();
            })
            .subscribe();

        return () => {
            console.log('[Officer Dashboard] Component unmounting, cleaning up channel');
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return (
            <Box sx={{ p: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 2 }}>
                <CircularProgress size={48} thickness={4} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 4 }}>
                    Synchronizing Records...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, maxWidth: '1600px', mx: 'auto' }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, gap: 3 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2D5F9E' }} />
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#2D5F9E', textTransform: 'uppercase', letterSpacing: 2 }}>
                            Live Command Center
                        </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="900" sx={{ color: '#1A2B3C', textTransform: 'uppercase', letterSpacing: -0.5, fontStyle: 'italic', mb: 0.5 }}>
                        Control Center
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1 }}>
                        Strategic overview of Neural claim processing across nodes.
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    href="/officer/queue"
                    variant="contained"
                    endIcon={<ChevronRightIcon />}
                    sx={{
                        height: 48,
                        px: 3,
                        borderRadius: '12px',
                        bgcolor: '#2D5F9E',
                        '&:hover': { bgcolor: '#1E3A5F' },
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.75rem',
                        boxShadow: '0 8px 16px rgba(45, 95, 158, 0.15)'
                    }}
                >
                    Initialize Review Session
                </Button>
            </Box>

            {/* Core Metrics Grid */}
            <Grid container spacing={4} sx={{ mb: 8 }}>
                {stats.map((s, i) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={s.label}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card sx={{
                                borderRadius: '24px',
                                border: '1px solid #CBD8EA',
                                boxShadow: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 32px rgba(30, 58, 95, 0.08)',
                                    borderColor: s.color
                                }
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Avatar sx={{
                                            width: 44,
                                            height: 44,
                                            bgcolor: s.bg,
                                            color: s.color,
                                            borderRadius: '12px',
                                            border: `1px solid ${s.color}20`
                                        }}>
                                            <s.icon sx={{ fontSize: 22 }} />
                                        </Avatar>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#0F9D6A', bgcolor: 'rgba(15, 157, 106, 0.08)', px: 0.8, py: 0.2, borderRadius: '6px' }}>
                                            <ArrowUpRightIcon sx={{ fontSize: 12 }} />
                                            <Typography variant="caption" fontWeight="900" sx={{ fontSize: '10px' }}>+12%</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h4" fontWeight="900" sx={{ color: '#1A2B3C', mb: 0.2, fontSize: '1.75rem' }}>
                                        {s.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase', letterSpacing: 1, fontSize: '10px' }}>
                                        {s.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Analytics Rows */}
            <Grid container spacing={4}>
                {/* Left: Charts */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: '24px',
                        border: '1px solid #CBD8EA',
                        boxShadow: 'none',
                        height: '100%',
                        bgcolor: 'white'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', borderRadius: '8px' }}>
                                    <InsightsIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1A2B3C', textTransform: 'uppercase', letterSpacing: 0.5 }}>Neural Volume Distribution</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#8DA5BE', textTransform: 'uppercase', fontSize: '9px' }}>Network throughput per cycle</Typography>
                                </Box>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                {['24H', '7D', '30D'].map(t => (
                                    <Button key={t} size="small" sx={{
                                        borderRadius: '6px',
                                        height: 24,
                                        fontSize: '0.6rem',
                                        px: 1,
                                        minWidth: 40,
                                        fontWeight: 900,
                                        bgcolor: t === '24H' ? '#2D5F9E' : 'transparent',
                                        color: t === '24H' ? 'white' : '#8DA5BE',
                                        '&:hover': { bgcolor: t === '24H' ? '#1E3A5F' : '#F0F6FF' }
                                    }}>{t}</Button>
                                ))}
                            </Stack>
                        </Box>

                        <div style={{ width: '100%', height: 350, minHeight: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F6FF" />
                                    <XAxis
                                        dataKey="hour"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8DA5BE', fontSize: 10, fontWeight: 800 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8DA5BE', fontSize: 10, fontWeight: 800 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #CBD8EA',
                                            borderRadius: '16px',
                                            boxShadow: '0 8px 32px rgba(30, 58, 95, 0.1)',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#1A2B3C'
                                        }}
                                    />
                                    <Bar dataKey="claims" radius={[8, 8, 0, 0]} maxBarSize={40}>
                                        {hourlyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2D5F9E' : '#F0F6FF'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Paper>
                </Grid>

                {/* Right: Priority Queue */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: '24px',
                        border: '1px solid #CBD8EA',
                        boxShadow: 'none',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#FAFCFF'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(214, 64, 69, 0.08)', color: '#D64045', borderRadius: '8px' }}>
                                    <ZapIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1A2B3C', textTransform: 'uppercase', letterSpacing: 0.5 }}>Priority Queue</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#8DA5BE', textTransform: 'uppercase', fontSize: '9px' }}>Immediate review required</Typography>
                                </Box>
                            </Box>
                            <Chip label={`${queueClaims.length} DATA_TX`} size="small" sx={{ fontWeight: 900, fontSize: '9px', height: 20, bgcolor: '#F0F6FF', color: '#2D5F9E', borderRadius: '6px' }} />
                        </Box>

                        <Stack spacing={2} sx={{ mb: 4, flex: 1 }}>
                            {queueClaims.length === 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, opacity: 0.5 }}>
                                    <ShieldAlertIcon sx={{ fontSize: 48, color: '#CBD8EA', mb: 2 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#8DA5BE', textTransform: 'uppercase' }}>All nodes synchronized</Typography>
                                </Box>
                            ) : (
                                queueClaims.map((claim, idx) => (
                                    <Box
                                        key={claim.id}
                                        component={Link}
                                        href="/officer/queue"
                                        sx={{
                                            p: 2,
                                            borderRadius: '16px',
                                            bgcolor: 'white',
                                            border: '1px solid #CBD8EA',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#2D5F9E',
                                                transform: 'translateX(4px)',
                                                boxShadow: '0 4px 8px rgba(30, 58, 95, 0.04)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D5F9E', fontFamily: 'monospace' }}>TX-{claim.id.slice(0, 8).toUpperCase()}</Typography>
                                                <Typography variant="body1" fontWeight="900" sx={{ color: '#1A2B3C', textTransform: 'uppercase' }}>{claim.vehicle}</Typography>
                                            </Box>
                                            <Chip
                                                label={claim.flag}
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    bgcolor: claim.confidence < 70 ? 'rgba(214, 64, 69, 0.08)' : 'rgba(15, 157, 106, 0.08)',
                                                    color: claim.confidence < 70 ? '#D64045' : '#0F9D6A'
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" fontWeight="900" sx={{ color: '#1A2B3C' }}>₹{claim.amount.toLocaleString('en-IN')}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700 }}>{claim.time}</Typography>
                                                <ArrowRightIcon sx={{ fontSize: 16, color: '#CBD8EA' }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Stack>

                        <Button
                            component={Link}
                            href="/officer/queue"
                            fullWidth
                            variant="outlined"
                            sx={{
                                height: 44,
                                borderRadius: '12px',
                                borderColor: '#CBD8EA',
                                color: '#4A6080',
                                fontSize: '0.75rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                '&:hover': { borderColor: '#2D5F9E', bgcolor: '#F0F6FF' }
                            }}
                        >
                            Access Full Ledger
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
