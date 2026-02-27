'use client';

import { Box, Typography } from '@mui/material';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Shield as ShieldIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useSidebarStore } from '@/store/useSidebarStore';
import { IconButton } from '@mui/material';

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed, toggleMobileSidebar } = useSidebarStore();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            <AdminSidebar />
            <Box component="main" sx={{
                flexGrow: 1,
                width: '100%',
                pl: { xs: 0, md: isCollapsed ? '80px' : '260px' },
                transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Header */}
                <Box
                    component="header"
                    sx={{
                        height: 56,
                        bgcolor: '#FFFFFF',
                        borderBottom: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: { xs: 2, md: 4 },
                        position: 'sticky',
                        top: 0,
                        zIndex: 1100
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={toggleMobileSidebar}
                            sx={{ display: { md: 'none' }, color: '#2D5F9E' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '8px',
                            bgcolor: 'rgba(45, 95, 158, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(45, 95, 158, 0.15)'
                        }}>
                            <ShieldIcon sx={{ color: '#2D5F9E', fontSize: 16 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1A2B3C', lineHeight: 1.2, fontSize: '0.75rem', textTransform: 'uppercase' }}>Admin Protocol</Typography>
                            <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700, letterSpacing: 0.5, fontSize: '0.6rem' }}>ENCRYPTED SESSION</Typography>
                        </Box>
                    </Box>
                </Box>
                {children}
            </Box>
        </Box>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
