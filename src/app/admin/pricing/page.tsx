'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Stack,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    InputAdornment,
    Chip,
    Dialog,
    Divider,
    Fade
} from '@mui/material';
import {
    Search as SearchIcon,
    CloudUpload as UploadIcon,
    Storage as DatabaseIcon,
    Speed as ZapIcon,
    Scale as ScaleIcon,
    Insights as ActivityIcon,
    ChevronRight as ChevronRightIcon,
    Launch as ArrowUpRightIcon,
    FilterList as FilterIcon,
    MoreHoriz as MoreIcon,
    Build as WrenchIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as ClockIcon,
    VerifiedUser as ShieldCheckIcon,
    TableChart as TableIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';

const SAMPLE_PARTS = [
    { make: 'Maruti Suzuki', model: 'Swift', part: 'Front Bumper Assembly', oem: 4200, aftermarket: 1800, labor: '2.5 hrs', updated: '15 Jan 2024', status: 'Active' },
    { make: 'Maruti Suzuki', model: 'Swift', part: 'Left Headlamp', oem: 3800, aftermarket: 1500, labor: '1 hr', updated: '15 Jan 2024', status: 'Active' },
    { make: 'Hyundai', model: 'i20', part: 'Front Bumper Assembly', oem: 5100, aftermarket: 2200, labor: '2.5 hrs', updated: '20 Jan 2024', status: 'Active' },
    { make: 'Honda', model: 'City', part: 'Rear Bumper Assembly', oem: 6800, aftermarket: 3100, labor: '2 hrs', updated: '22 Jan 2024', status: 'Active' },
    { make: 'Tata', model: 'Nexon', part: 'Windshield Glass', oem: 8500, aftermarket: 4200, labor: '3 hrs', updated: '01 Feb 2024', status: 'Active' },
    { make: 'Mahindra', model: 'Thar', part: 'Right Fender', oem: 9200, aftermarket: 4500, labor: '4 hrs', updated: '05 Feb 2024', status: 'Reviewing' },
];

export default function AdminPricingPage() {
    const [search, setSearch] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const filteredParts = SAMPLE_PARTS.filter(p =>
        p.make.toLowerCase().includes(search.toLowerCase()) ||
        p.model.toLowerCase().includes(search.toLowerCase()) ||
        p.part.toLowerCase().includes(search.toLowerCase())
    );

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                loading: 'Establishing ERP Uplink...',
                success: 'Neural Catalog Synchronized with Database',
                error: 'Uplink Failed',
            });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 10 }}>
            {/* Catalog Header */}
            <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', py: 4, mb: 4 }}>
                <Container maxWidth="xl">
                    <Grid container spacing={3} alignItems="flex-end" justifyContent="space-between">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <ScaleIcon sx={{ fontSize: 20, color: '#2D5F9E' }} />
                                <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#2D5F9E' }}>
                                    Global Value Oracle
                                </Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase', mb: 1 }}>
                                Value Catalog
                            </Typography>
                            <Typography sx={{ color: '#64748B', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                High-precision OEM benchmark & component price ledger.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Stack direction="row" spacing={2} justifyContent={{ md: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    sx={{
                                        height: 48,
                                        px: 3,
                                        borderRadius: '12px',
                                        borderColor: '#E2E8F0',
                                        color: '#64748B',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                        '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
                                    }}
                                    startIcon={<DatabaseIcon sx={{ fontSize: 18 }} />}
                                >
                                    {isSyncing ? 'Syncing...' : 'Sync ERP Hub'}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setIsUploadOpen(true)}
                                    sx={{
                                        height: 48,
                                        px: 4,
                                        borderRadius: '12px',
                                        bgcolor: '#2D5F9E',
                                        boxShadow: '0 8px 20px rgba(45, 95, 158, 0.2)',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                        '&:hover': { bgcolor: '#1E3A5F' }
                                    }}
                                    startIcon={<UploadIcon />}
                                >
                                    Batch CSV Upload
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl">
                {/* Quick Stats */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        { label: 'Active Catalog Parts', value: '42,891', icon: WrenchIcon, color: '#2D5F9E' },
                        { label: 'Average Precision', value: '99.8%', icon: ShieldCheckIcon, color: '#10B981' },
                        { label: 'Last Sync cycle', value: '14m ago', icon: ClockIcon, color: '#F59E0B' },
                    ].map((stat, i) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={i}>
                            <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Avatar sx={{ width: 48, height: 48, bgcolor: `${stat.color}10`, color: stat.color, borderRadius: '14px' }}>
                                        <stat.icon sx={{ fontSize: 24 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#1E3A5F', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', mt: 0.5, letterSpacing: '0.05em' }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Catalog Table Area */}
                <Paper elevation={0} sx={{ borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #F1F5F9', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                        <TextField
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter by Make, Model or Component ID..."
                            variant="outlined"
                            size="small"
                            sx={{
                                width: { xs: '100%', md: 400 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    bgcolor: '#F8FAFC',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', display: { xs: 'none', lg: 'block' } }}>
                                Displaying {filteredParts.length} Neural Nodes
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                sx={{
                                    height: 40,
                                    borderRadius: '10px',
                                    borderColor: '#E2E8F0',
                                    color: '#64748B',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    fontSize: '11px',
                                    '&:hover': { bgcolor: '#F8FAFC' }
                                }}
                            >
                                Filter
                            </Button>
                        </Stack>
                    </Box>

                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                                <TableRow>
                                    <TableCell sx={{ color: '#64748B', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', py: 2 }}>S.No</TableCell>
                                    <TableCell sx={{ color: '#64748B', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', py: 2 }}>Category</TableCell>
                                    <TableCell sx={{ color: '#64748B', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', py: 2 }}>Component Matrix</TableCell>
                                    <TableCell align="right" sx={{ color: '#64748B', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', py: 2 }}>OEM (₹)</TableCell>
                                    <TableCell align="right" sx={{ color: '#64748B', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', py: 2 }}>Aftermarket (₹)</TableCell>
                                    <TableCell sx={{ color: '#64748B', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', py: 2 }}>Labor</TableCell>
                                    <TableCell align="center" sx={{ color: '#64748B', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', py: 2 }}>Protocol</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredParts.map((p, i) => (
                                    <TableRow key={i} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#2D5F9E', fontFamily: 'monospace' }}>
                                                {(i + 1).toString().padStart(2, '0')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F', textTransform: 'uppercase' }}>{p.make}</Typography>
                                                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8' }}>{p.model}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2D5F9E' }} />
                                                <Box>
                                                    <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F' }}>{p.part}</Typography>
                                                    <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>UPDATED {p.updated}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 2 }}>
                                            <Typography sx={{ fontSize: '13px', fontWeight: 900, color: '#1E3A5F', fontFamily: 'monospace' }}>
                                                ₹{p.oem.toLocaleString('en-IN')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 2 }}>
                                            <Typography sx={{ fontSize: '13px', fontWeight: 900, color: '#64748B', fontFamily: 'monospace' }}>
                                                ₹{p.aftermarket.toLocaleString('en-IN')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <ActivityIcon sx={{ fontSize: 14, color: '#2D5F9E' }} />
                                                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>{p.labor}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 2 }}>
                                            <Chip
                                                label={p.status}
                                                size="small"
                                                sx={{
                                                    borderRadius: '6px',
                                                    fontSize: '9px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    bgcolor: p.status === 'Active' ? '#ECFDF5' : '#FFF7ED',
                                                    color: p.status === 'Active' ? '#10B981' : '#F59E0B',
                                                    border: '1px solid',
                                                    borderColor: p.status === 'Active' ? '#D1FAE5' : '#FFEDD5',
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Auto-Benchmarking active across 1,200+ neural partner garages in Pan-India Sector
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            {/* CSV Upload Overlay */}
            <Dialog
                open={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '24px', maxWidth: 500, width: '100%', overflow: 'hidden' }
                }}
            >
                <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ width: 48, height: 48, bgcolor: '#2D5F9E10', color: '#2D5F9E', borderRadius: '14px' }}>
                                <TableIcon sx={{ fontSize: 24 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase' }}>
                                    Batch Data Uplink
                                </Typography>
                                <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                                    Direct CSV Matrix injection
                                </Typography>
                            </Box>
                        </Stack>
                        <IconButton onClick={() => setIsUploadOpen(false)} size="small" sx={{ bgcolor: '#F8FAFC' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box sx={{
                        border: '2px dashed #E2E8F0',
                        borderRadius: '20px',
                        p: 6,
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#2D5F9E', bgcolor: '#F8FAFF' },
                        cursor: 'pointer'
                    }}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: '#F8FAFC', mx: 'auto', mb: 2 }}>
                            <UploadIcon sx={{ fontSize: 32, color: '#94A3B8' }} />
                        </Avatar>
                        <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#1E3A5F' }}>Drop CSV Ledger Here</Typography>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', mt: 1 }}>
                            Supports .csv and .xlsx volume packets (Max 50MB)
                        </Typography>
                        <Button variant="outlined" sx={{ mt: 3, borderRadius: '8px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}>
                            Select Vector File
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <CheckCircleIcon sx={{ fontSize: 14, color: '#10B981' }} />
                            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase' }}>Format Validated</Typography>
                        </Stack>
                        <Button size="small" sx={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#2D5F9E' }}>
                            Download Template
                        </Button>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            toast.success('Matrix injection successful');
                            setIsUploadOpen(false);
                        }}
                        sx={{
                            mt: 4,
                            height: 52,
                            borderRadius: '14px',
                            bgcolor: '#2D5F9E',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            fontSize: '12px',
                            boxShadow: '0 8px 20px rgba(45, 95, 158, 0.2)',
                            '&:hover': { bgcolor: '#1E3A5F' }
                        }}
                    >
                        Execute Batch Process
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}
