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
    Dashboard as DashboardIcon,
    ViewList as ViewListIcon,
    Settings as SettingsIcon,
    Security as ShieldIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const navItems = [
    { href: '/officer/dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { href: '/officer/queue', icon: ViewListIcon, label: 'Review Queue' },
];

export default function OfficerSidebar() {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();

    const toggleDrawer = () => setOpen(!open);

    return (
        <>
            {!open && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1200, bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}
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
                        backgroundColor: '#0a192f', // very dark blue
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
                        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>ClaimSettle AI</Typography>
                            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>OFFICER PORTAL</Typography>
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
                                            backgroundColor: 'secondary.main',
                                            color: 'primary.contrastText',
                                            '&:hover': {
                                                backgroundColor: 'secondary.dark',
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
                            href="/admin/pricing"
                            sx={{
                                borderRadius: 2,
                                border: '1px solid rgba(255,255,255,0.2)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: '#94a3b8' }}>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Admin Settings"
                                slotProps={{ primary: { fontSize: 13, color: '#e2e8f0' } }}
                            />
                        </ListItemButton>
                    </ListItem>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            AO
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">Arun Officer</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Claims Dept</Typography>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
