'use client';

import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/useSidebarStore';
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
    Avatar,
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
    const { isCollapsed, toggleSidebar, isMobileOpen, setMobileOpen } = useSidebarStore();
    const pathname = usePathname();

    const sidebarContent = (
        <Box
            sx={{
                width: isCollapsed ? 80 : 260,
                flexShrink: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#FFFFFF',
                borderRight: '1px solid #F0F6FF',
                boxShadow: 'none'
            }}
        >
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '10px',
                            bgcolor: '#1E3A5F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ShieldIcon sx={{ color: 'white', fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1E3A5F', letterSpacing: '-0.02em', lineHeight: 1.2 }}>CLAIMNOVA</Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ADMIN CONSOLE</Typography>
                        </Box>
                    </Box>
                )}
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        color: '#64748B',
                        bgcolor: '#F8FAFC',
                        borderRadius: '10px',
                        display: { xs: 'none', md: 'flex' },
                        '&:hover': { bgcolor: '#F1F5F9' }
                    }}
                >
                    {isCollapsed ? <MenuIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
                </IconButton>
            </Box>

            {/* Navigation */}
            <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.2,
                                    px: isCollapsed ? 1.5 : 2,
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    bgcolor: isActive ? '#F0F6FF' : 'transparent',
                                    color: isActive ? '#2D5F9E' : '#64748B',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: isActive ? '#F0F6FF' : '#F8FAFC',
                                        color: isActive ? '#2D5F9E' : '#1E3A5F',
                                        '& .MuiListItemIcon-root': { color: isActive ? '#2D5F9E' : '#1E3A5F' }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: isCollapsed ? 0 : 32,
                                    color: isActive ? '#2D5F9E' : '#94A3B8',
                                    transition: 'color 0.2s'
                                }}>
                                    <item.icon sx={{ fontSize: 20 }} />
                                </ListItemIcon>
                                {!isCollapsed && (
                                    <ListItemText
                                        primary={item.label}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    fontSize: '13px',
                                                    fontWeight: isActive ? 800 : 700,
                                                    letterSpacing: '-0.01em'
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ p: 2, borderTop: '1px solid #F0F6FF' }}>
                <ListItemButton
                    component={Link}
                    href="/officer/dashboard"
                    onClick={() => setMobileOpen(false)}
                    sx={{
                        borderRadius: '12px',
                        py: 1.5,
                        bgcolor: '#F8FAFC',
                        color: '#64748B',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        '&:hover': { bgcolor: '#F1F5F9', color: '#1E3A5F' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 36, color: 'inherit' }}>
                        <DashboardIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    {!isCollapsed && (
                        <ListItemText
                            primary="Switch to Officer"
                            slotProps={{
                                primary: {
                                    sx: { fontSize: '12px', fontWeight: 800 }
                                }
                            }}
                        />
                    )}
                </ListItemButton>

                {/* Developer Credit */}
                <Box sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: '16px',
                    bgcolor: '#F8FAFC',
                    border: '1px solid #F0F6FF',
                    display: isCollapsed ? 'none' : 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <Avatar
                        src="/nitin.png"
                        sx={{
                            width: 32,
                            height: 32,
                            border: '2px solid #E2E8F0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                    />
                    <Box>
                        <Typography sx={{ color: '#94A3B8', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Engineered By</Typography>
                        <Typography sx={{ color: '#1E3A5F', fontSize: '11px', fontWeight: 900 }}>NITIN CHUGH</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <Box
                sx={{
                    width: isCollapsed ? 80 : 260,
                    flexShrink: 0,
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bgcolor: '#FFFFFF',
                    borderRight: '1px solid #F0F6FF',
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
