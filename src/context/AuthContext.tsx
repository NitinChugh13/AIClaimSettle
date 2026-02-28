'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
    id: string;
    full_name: string;
    mobile: string;
    email?: string;
    is_mobile_verified?: boolean;
    policy_id?: string;
    policy_verified?: boolean;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            setLoading(true);
            console.log('[AuthContext] Calling /api/auth/me...');
            const res = await fetch('/api/auth/me', {
                credentials: 'include',
            });
            console.log('[AuthContext] Response status:', res.status);
            const data = await res.json();
            console.log('[AuthContext] Response data:', data);

            if (res.ok && data.success && data.user) {
                setUser(data.user);
                console.log('[AuthContext] User set:', data.user);
            } else {
                setUser(null);
                console.log('[AuthContext] No user found');
            }
        } catch (error) {
            console.error('[AuthContext] Error:', error);
            setUser(null);
        } finally {
            setLoading(false);
            console.log('[AuthContext] Loading set to false');
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            setLoading(true);
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
