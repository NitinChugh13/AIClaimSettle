import { Box } from '@mui/material';
import OfficerSidebar from '@/components/layout/OfficerSidebar';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <OfficerSidebar />
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
                {children}
            </Box>
        </Box>
    );
}
