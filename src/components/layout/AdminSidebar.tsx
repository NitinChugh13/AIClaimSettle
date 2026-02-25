'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Typography,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    LocalOffer as PackageIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
    Security as ShieldIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const navItems = [
    { href: '/admin/pricing', icon: PackageIcon, label: 'Parts Pricing' },
    { href: '/admin/analytics', icon: BarChartIcon, label: 'Analytics' },
    { href: '/admin/rules', icon: SettingsIcon, label: 'Decision Rules' },
];

export default function AdminSidebar() {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();

    const toggleDrawer = () => setOpen(!open);

    return (
        <>
            {/* Mobile toggle button (visible only when closed) */}
            {!open && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1200, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        transition: 'width 0.2s',
                        overflowX: 'hidden',
                        backgroundColor: '#0f172a', // slate-900
                        color: 'white',
                        borderRight: 'none',
                        ...(!open && {
                            width: 0,
                            visibility: 'hidden',
                        }),
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>ClaimSettle AI</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>ADMIN PANEL</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={toggleDrawer} sx={{ color: '#94a3b8' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.href}
                                    selected={isActive}
                                    sx={{
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: 'primary.contrastText',
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.08)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'inherit' : '#94a3b8' }}>
                                        <item.icon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        slotProps={{ primary: { fontSize: 14, fontWeight: isActive ? 600 : 500 } }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Box sx={{ p: 2 }}>
                    <ListItem disablePadding sx={{ mb: 2 }}>
                        <ListItemButton
                            component={Link}
                            href="/officer/dashboard"
                            sx={{
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: '#94a3b8' }}>
                                <DashboardIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Switch to Officer"
                                slotProps={{ primary: { fontSize: 13, color: '#e2e8f0' } }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Developer Credit */}
                    <Box sx={{ display: open ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', p: 2, mt: 2, borderRadius: 3, bgcolor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid', borderColor: 'primary.main', mb: 1.5, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                            <img src="/nitin.png" alt="Nitin Chugh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>Developed By</Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>Nitin Chugh</Typography>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
