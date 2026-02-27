'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/useSidebarStore';
import Link from 'next/link';
import {
    Dashboard as DashboardIcon,
    Assignment as QueueIcon,
    Settings as SettingsIcon,
    ChevronLeft as ChevronLeftIcon,
    Menu as MenuIcon,
    ExitToApp as LogoutIcon,
    FlashOn as ZapIcon,
    Person as PersonIcon,
    Security as ShieldIcon,
} from '@mui/icons-material';
import {
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    Avatar,
    Button,
    AppBar,
    Toolbar,
} from '@mui/material';
import Logo from '@/components/Logo';

const navItems = [
    { href: '/officer/dashboard', icon: DashboardIcon, label: 'Control Center' },
    { href: '/officer/queue', icon: QueueIcon, label: 'Review Queue' },
];

const secondaryItems = [
    { href: '/admin/pricing', icon: ShieldIcon, label: 'Value Catalog' },
    { href: '/officer/settings', icon: SettingsIcon, label: 'System Nodes' },
];

export default function OfficerSidebar() {
    const { isCollapsed, toggleSidebar: toggleCollapse, isMobileOpen, setMobileOpen } = useSidebarStore();
    const pathname = usePathname();
    const router = useRouter();

    const sidebarWidth = isCollapsed ? 80 : 260;

    const sidebarContent = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderRight: '1px solid #CBD8EA',
            position: 'relative',
        }}>
            {/* Header */}
            <Box sx={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                px: isCollapsed ? 0 : 3,
                justifyContent: isCollapsed ? 'center' : 'space-between',
                borderBottom: '1px solid #F0F6FF'
            }}>
                {!isCollapsed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '8px',
                            bgcolor: '#1A2B3C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ZapIcon sx={{ color: 'white', fontSize: 16 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1A2B3C', letterSpacing: '-0.02em', lineHeight: 1.2, fontSize: '13px' }}>CLAIMNOVA</Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>OFFICER NODE</Typography>
                        </Box>
                    </Box>
                )}


                <IconButton
                    onClick={toggleCollapse}
                    sx={{
                        color: '#64748B',
                        bgcolor: '#F8FAFC',
                        borderRadius: '10px',
                        display: { xs: 'none', md: 'flex' },
                        ml: isCollapsed ? 0 : 1,
                        '&:hover': { bgcolor: '#F1F5F9' }
                    }}
                >
                    {isCollapsed ? <MenuIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
                </IconButton>
            </Box>

            {/* Navigation */}
            <Box sx={{ flex: 1, py: 4, overflowY: 'auto', px: 2 }} className="custom-scrollbar">
                <Typography variant="caption" sx={{
                    px: 2,
                    fontWeight: 800,
                    color: '#8DA5BE',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    display: isCollapsed ? 'none' : 'block',
                    mb: 1
                }}>
                    Primary Nodes
                </Typography>

                <List sx={{ mb: 4 }}>
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        borderRadius: '12px',
                                        py: 1.2,
                                        px: isCollapsed ? 1.2 : 1.5,
                                        bgcolor: active ? 'rgba(45, 95, 158, 0.08)' : 'transparent',
                                        '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.04)' },
                                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        minWidth: isCollapsed ? 0 : 32,
                                        color: active ? '#2D5F9E' : '#94A3B8',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <item.icon sx={{ fontSize: 20 }} />
                                    </ListItemIcon>
                                    {!isCollapsed && (
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontWeight: active ? 800 : 700,
                                                color: active ? '#1A2B3C' : '#64748B',
                                                fontSize: '13px',
                                                letterSpacing: '-0.01em'
                                            }}
                                        />
                                    )}
                                    {active && !isCollapsed && (
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2D5F9E' }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Typography variant="caption" sx={{
                    px: 2,
                    fontWeight: 800,
                    color: '#8DA5BE',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    display: isCollapsed ? 'none' : 'block',
                    mb: 1
                }}>
                    Sub-Systems
                </Typography>

                <List>
                    {secondaryItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        borderRadius: '12px',
                                        py: 1.2,
                                        px: isCollapsed ? 1.2 : 1.5,
                                        bgcolor: active ? 'rgba(45, 95, 158, 0.08)' : 'transparent',
                                        '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.04)' },
                                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        minWidth: isCollapsed ? 0 : 32,
                                        color: active ? '#2D5F9E' : '#94A3B8',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <item.icon sx={{ fontSize: 20 }} />
                                    </ListItemIcon>
                                    {!isCollapsed && (
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontWeight: active ? 800 : 700,
                                                color: active ? '#1A2B3C' : '#64748B',
                                                fontSize: '13px',
                                                letterSpacing: '-0.01em'
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* User Profile / Disconnect */}
            <Box sx={{ p: 2, borderTop: '1px solid #F0F6FF' }}>
                {!isCollapsed ? (
                    <Box sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: '#FAFCFF',
                        border: '1px solid #CBD8EA',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'rgba(45, 95, 158, 0.1)',
                                color: '#2D5F9E',
                                fontWeight: 800
                            }}>
                                <PersonIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1A2B3C', lineHeight: 1.2 }}>Officer #77F</Typography>
                                <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 600 }}>Active Validator</Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            startIcon={<LogoutIcon />}
                            onClick={() => router.push('/')}
                            sx={{
                                borderRadius: '10px',
                                textTransform: 'uppercase',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                letterSpacing: 1
                            }}
                        >
                            Disconnect
                        </Button>
                    </Box>
                ) : (
                    <IconButton
                        onClick={() => router.push('/')}
                        sx={{
                            width: '100%',
                            borderRadius: '12px',
                            py: 1.5,
                            color: '#8DA5BE',
                            '&:hover': { color: '#D64045', bgcolor: 'rgba(214, 64, 69, 0.05)' }
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            {/* Desktop Sidebar (Fixed) */}
            <Box
                component="nav"
                sx={{
                    width: isCollapsed ? 80 : 260,
                    flexShrink: 0,
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bgcolor: 'white',
                    borderRight: '1px solid #CBD8EA',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1300,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    boxShadow: 'none'
                }}
            >
                {sidebarContent}
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={isMobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 260,
                        border: 'none',
                        boxShadow: '4px 0 24px rgba(30, 58, 95, 0.1)'
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        </>
    );
}
