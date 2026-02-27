'use client';

import { Box, Container, Typography } from '@mui/material';
import MarketingHeader from '@/components/layout/MarketingHeader';
import MarketingFooter from '@/components/layout/MarketingFooter';

export default function CompliancePage() {
  return (
    <Box sx={{ bgcolor: '#EDF3FB' }}>
      <MarketingHeader />

      <Box sx={{ pt: { xs: 11, md: 13 }, pb: { xs: 8, md: 10 }, borderBottom: '1px solid #D6E2F2' }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: '#2D5F9E', letterSpacing: 1.8, fontWeight: 700 }}>Governance</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#10243D', mb: 2 }}>Compliance</Typography>
          <Typography sx={{ color: '#4A6080', mb: 4 }}>Effective Date: 1 March 2026</Typography>

          <Box sx={{ display: 'grid', gap: 2.5 }}>
            {[
              ['Regulatory Alignment', 'ClaimNova workflows are designed to align with applicable Indian insurance regulations, insurer governance requirements, and digital claim documentation standards.'],
              ['Digital Assessment Controls', 'Every AI-assisted assessment is logged with timestamps, decision trace metadata, and review checkpoints to support transparent and auditable claim operations.'],
              ['Fraud Detection & Verification', 'The platform applies anomaly checks, image forensics indicators, and policy-validation steps to reduce fraudulent claim risk and improve decision integrity.'],
              ['Data Governance', 'We apply access controls, encrypted storage, and controlled retention practices for sensitive claim data. Access is restricted to authorized roles and reviewed periodically.'],
              ['Grievance & Escalation', 'For grievance redressal or compliance escalation, contact support@claimnova.in with your claim reference and we will respond through formal support channels.'],
            ].map(([title, text]) => (
              <Box key={title} sx={{ bgcolor: '#F1F6FD', border: '1px solid #D2DEEF', borderRadius: 3, p: { xs: 2.2, md: 3 } }}>
                <Typography variant="h6" sx={{ color: '#1A2B3C', mb: 1.1, fontWeight: 700 }}>{title}</Typography>
                <Typography sx={{ color: '#4A6080', lineHeight: 1.75 }}>{text}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <MarketingFooter />
    </Box>
  );
}
