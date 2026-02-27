'use client';

import OfficerSidebar from '@/components/layout/OfficerSidebar';
import { useSidebarStore } from '@/store/useSidebarStore';
import {
    Box,
    Typography,
    IconButton,
    AppBar,
    Toolbar,
    TextField,
    InputAdornment,
    Badge,
    Avatar,
    Stack,
    Divider
} from '@mui/material';
import {
    Notifications as BellIcon,
    Search as SearchIcon,
    Person as UserIcon,
    Shield as ShieldIcon,
    FlashOn as ZapIcon,
    CloudDone as NetworkIcon,
    Menu as MenuIcon
} from '@mui/icons-material';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
    const { isCollapsed, toggleMobileSidebar } = useSidebarStore();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F0F6FF' }}>
            <OfficerSidebar />

            <Box component="main" sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                pl: { xs: 0, md: isCollapsed ? '80px' : '260px' },
                transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Modern Header */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        bgcolor: 'white',
                        borderBottom: '1px solid #CBD8EA',
                        zIndex: (theme) => theme.zIndex.drawer - 1
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, minHeight: '48px !important' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 4 } }}>
                            <IconButton
                                onClick={toggleMobileSidebar}
                                sx={{ display: { md: 'none' }, color: '#2D5F9E' }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '10px',
                                    bgcolor: 'rgba(45, 95, 158, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(45, 95, 158, 0.15)'
                                }}>
                                    <ShieldIcon sx={{ color: '#2D5F9E', fontSize: 18 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1A2B3C', lineHeight: 1.2, fontSize: '0.8rem' }}>SECURE TERMINAL</Typography>
                                    <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 600, letterSpacing: 0.5, fontSize: '0.65rem' }}>NODE ID: CN-7781-B</Typography>
                                </Box>
                            </Box>

                            {/* Search */}
                            <TextField
                                size="small"
                                placeholder="Global Command Search..."
                                sx={{
                                    display: { xs: 'none', lg: 'flex' },
                                    width: 320,
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#FAFCFF',
                                        borderRadius: '12px'
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#8DA5BE', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {/* Network Status */}
                            <Box sx={{
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                gap: 1,
                                px: 1.5,
                                py: 0.5,
                                bgcolor: 'rgba(15, 157, 106, 0.08)',
                                borderRadius: '20px',
                                border: '1px solid rgba(15, 157, 106, 0.2)'
                            }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#0F9D6A' }} />
                                <Typography variant="caption" fontWeight="800" sx={{ color: '#0F9D6A', letterSpacing: 0.5 }}>NETWORK ACTIVE</Typography>
                            </Box>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <IconButton sx={{ bgcolor: 'rgba(45, 95, 158, 0.04)', '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.08)' } }}>
                                    <Badge variant="dot" color="primary">
                                        <BellIcon sx={{ color: '#4A6080', fontSize: 22 }} />
                                    </Badge>
                                </IconButton>

                                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1 }}>
                                    <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                        <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1A2B3C', lineHeight: 1.2 }}>Nitin Chugh</Typography>
                                        <Typography variant="caption" sx={{ color: '#2D5F9E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Chief Validator</Typography>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: '#2D5F9E',
                                            border: '2px solid rgba(45, 95, 158, 0.2)',
                                            boxShadow: '0 4px 12px rgba(45, 95, 158, 0.15)'
                                        }}
                                    >
                                        <UserIcon />
                                    </Avatar>
                                </Box>
                            </Stack>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', position: 'relative' }} className="custom-scrollbar">
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
