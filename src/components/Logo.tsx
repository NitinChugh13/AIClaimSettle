import React from 'react';
import ClaimNovaLogo from './ClaimNovaLogo';

export default function Logo({ className = '', variant = 'light' }: { className?: string, variant?: 'light' | 'dark' }) {
    return (
        <div className={className}>
            <ClaimNovaLogo variant={variant} size={32} />
        </div>
    );
}
