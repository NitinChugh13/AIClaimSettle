'use client';

import { Box, Container, Typography } from '@mui/material';
import MarketingHeader from '@/components/layout/MarketingHeader';
import MarketingFooter from '@/components/layout/MarketingFooter';

export default function TermsOfUsePage() {
  return (
    <Box sx={{ bgcolor: '#EDF3FB' }}>
      <MarketingHeader />

      <Box sx={{ pt: { xs: 11, md: 13 }, pb: { xs: 8, md: 10 }, borderBottom: '1px solid #D6E2F2' }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: '#2D5F9E', letterSpacing: 1.8, fontWeight: 700 }}>Legal</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#10243D', mb: 2 }}>Terms of Use</Typography>
          <Typography sx={{ color: '#4A6080', mb: 4 }}>Effective Date: 1 March 2026</Typography>

          <Box sx={{ display: 'grid', gap: 2.5 }}>
            {[
              ['Service Scope', 'ClaimNova provides AI-assisted motor-claim intake, digital damage assessment support, and workflow tools for policyholders and insurers based on configured claim rules.'],
              ['Eligibility and Account Responsibility', 'You must provide accurate information, maintain lawful usage, and keep account credentials secure. Any unauthorized access must be reported immediately.'],
              ['Acceptable Use', 'You agree not to upload false claim evidence, abusive content, malicious files, or data that violates legal, contractual, or regulatory obligations.'],
              ['Decision and Liability Terms', 'Automated outputs are decision-support artifacts and may be subject to insurer/officer review. Final settlement outcomes depend on policy terms, regulatory requirements, and verification steps.'],
              ['Updates and Governing Terms', 'We may update platform features and legal terms as regulatory requirements evolve. Continued use indicates acceptance of updated terms in effect.'],
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
