import { Box } from '@mui/material';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AdminSidebar />
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
                {children}
            </Box>
        </Box>
    );
}
