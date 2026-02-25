'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    CloudUpload as UploadIcon,
    Storage as DatabaseIcon,
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

    const filteredParts = SAMPLE_PARTS.filter(p =>
        p.make.toLowerCase().includes(search.toLowerCase()) ||
        p.model.toLowerCase().includes(search.toLowerCase()) ||
        p.part.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-start' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Parts Price Catalog</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage OEM and Aftermarket component pricing for the AI assessment engine.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DatabaseIcon />}
                        onClick={() => toast.info('Syncing from Database...')}
                        sx={{ bgcolor: 'white' }}
                    >
                        Sync ERP
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<UploadIcon />}
                        onClick={() => toast.success('Upload dialog opened')}
                    >
                        Upload CSV
                    </Button>
                </Box>
            </Box>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
                    <TextField
                        placeholder="Search by make, model, or part name..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', md: 400 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                        Showing <strong>{filteredParts.length}</strong> active parts
                    </Typography>
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Part Details</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Vehicle</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>OEM Price (₹)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Aftermarket (₹)</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Labor Est.</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredParts.length > 0 ? (
                                filteredParts.map((p, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="600">{p.part}</Typography>
                                            <Typography variant="caption" color="text.secondary">Last updated: {p.updated}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">{p.make}</Typography>
                                            <Typography variant="caption" color="text.secondary">{p.model}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight="600">{p.oem.toLocaleString('en-IN')}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight="500" color="text.secondary">{p.aftermarket.toLocaleString('en-IN')}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{p.labor}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={p.status}
                                                size="small"
                                                color={p.status === 'Active' ? 'success' : 'warning'}
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold', bgcolor: p.status === 'Active' ? '#f0fdf4' : '#fffbeb' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No parts match your search criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Typography variant="caption" display="block" textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
                Prices are benchmarked automatically across 1,200+ partner garages in India.
            </Typography>
        </Box>
    );
}
