'use client';

import React from 'react';
import { Box } from '@mui/material';

interface Props {
    variant?: 'light' | 'dark';
    size?: number;
}

export default function ClaimNovaLogo({ variant = 'light', size = 32 }: Props) {
    const isDark = variant === 'dark'; // dark variant for light backgrounds
    const primaryColor = '#3B82F6'; // Electric Blue
    const textColor = isDark ? '#0A0F1E' : '#FFFFFF';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M22 6L10 20H18L10 30L22 16H14L22 6Z"
                    fill={primaryColor}
                    stroke={primaryColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <Box sx={{ display: 'flex', fontWeight: 900, fontSize: size * 0.75, fontFamily: 'Inter, sans-serif' }}>
                <span style={{ color: textColor }}>Claim</span>
                <span style={{ color: primaryColor }}>Nova</span>
            </Box>
        </Box>
    );
}
