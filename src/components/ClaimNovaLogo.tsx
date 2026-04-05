'use client';

import React from 'react';
import { Box } from '@mui/material';

interface Props {
    variant?: 'light' | 'dark';
    size?: number;
}

export default function ClaimNovaLogo({ variant = 'light', size = 32 }: Props) {
    const isDark = variant === 'dark';
    const primaryColor = '#3B82F6';
    const textColor = isDark ? '#0A0F1E' : '#FFFFFF';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>

            <style>{`
                @keyframes cometSpin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Icon wrapper */}
            <Box sx={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>

                {/* Static faint orbit ring */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '1px solid rgba(59,130,246,0.12)',
                }} />

                {/* Comet 1 — clockwise, blue */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: '#1a78e6',
                    borderRightColor: 'rgba(26,120,230,0.3)',
                    borderBottomColor: 'transparent',
                    borderLeftColor: 'transparent',
                    filter: 'drop-shadow(0 0 5px rgba(26,120,230,0.85))',
                    animation: 'cometSpin 1.6s linear infinite',
                }} />

                {/* Comet 2 — counter-clockwise, light blue */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderBottomColor: '#60b8ff',
                    borderLeftColor: 'rgba(96,184,255,0.3)',
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                    filter: 'drop-shadow(0 0 5px rgba(96,184,255,0.85))',
                    animation: 'cometSpin 1.6s linear infinite reverse',
                }} />

                {/* Bolt SVG */}
                <svg
                    width={size * 0.65}
                    height={size * 0.65}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ position: 'relative', zIndex: 2 }}
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
            </Box>

            {/* Text */}
            <Box sx={{ display: 'flex', fontWeight: 900, fontSize: size * 0.75, fontFamily: 'Inter, sans-serif' }}>
                <span style={{ color: textColor }}>Claim</span>
                <span style={{ color: primaryColor }}>Nova</span>
            </Box>

        </Box>
    );
}