'use client';

import { Box, Container, Typography } from '@mui/material';
import MarketingHeader from '@/components/layout/MarketingHeader';
import MarketingFooter from '@/components/layout/MarketingFooter';

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ bgcolor: '#EDF3FB' }}>
      <MarketingHeader />

      <Box sx={{ pt: { xs: 11, md: 13 }, pb: { xs: 8, md: 10 }, borderBottom: '1px solid #D6E2F2' }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: '#2D5F9E', letterSpacing: 1.8, fontWeight: 700 }}>Legal</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#10243D', mb: 2 }}>Privacy Policy</Typography>
          <Typography sx={{ color: '#4A6080', mb: 4 }}>Effective Date: 1 March 2026</Typography>

          <Box sx={{ display: 'grid', gap: 2.5 }}>
            {[
              ['Information We Collect', 'We collect policy details, claimant identity information, vehicle and incident details, uploaded damage photos, and communication records required to process insurance claims safely and accurately.'],
              ['How We Use Information', 'Your information is used to verify policy eligibility, run AI-assisted damage assessment, generate claim reports, support officer review, and maintain mandatory regulatory audit trails.'],
              ['Data Security & Retention', 'ClaimNova applies encryption in transit and at rest, strict access controls, and logging for sensitive workflows. Claim records are retained based on legal, contractual, and compliance requirements.'],
              ['Data Sharing', 'Information may be shared only with authorized insurers, regulated service partners, and legal authorities where required for claim settlement, fraud checks, and compliance obligations.'],
              ['Your Rights', 'You may request correction of personal information, raise grievances, and ask for details about claim-data handling by contacting support@claimnova.in.'],
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
