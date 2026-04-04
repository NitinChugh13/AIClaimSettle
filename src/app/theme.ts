'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// CSS variable values mirrored here for MUI palette
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#3B82F6',        // --primary-light (bright blue)
            dark: '#1E40AF',        // --primary (dark blue)
            light: '#93C5FD',       // --accent (light sky blue)
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#6B7280',        // --text-secondary (medium gray)
            light: '#D1D5DB',       // --text-muted (light gray)
            dark: '#111827',        // --text-primary (near-black)
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#EF4444',        // Red
        },
        warning: {
            main: '#F59E0B',        // Amber
        },
        info: {
            main: '#3B82F6',        // Bright blue
        },
        success: {
            main: '#10B981',        // Green
        },
        background: {
            default: '#FFFFFF',     // --surface (white)
            paper: '#FFFFFF',       // --surface-card (white)
        },
        text: {
            primary: '#111827',     // --text-primary
            secondary: '#6B7280',   // --text-secondary
            disabled: '#D1D5DB',    // --text-muted
        },
        divider: '#E5E7EB',         // --border
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
        h1: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
            color: '#111827',
            fontWeight: 700,
        },
        h2: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
            color: '#111827',
            fontWeight: 700,
        },
        h3: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
            color: '#111827',
            fontWeight: 700,
        },
        h4: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
            color: '#111827',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                },
                containedPrimary: {
                    background: '#3B82F6',
                    '&:hover': {
                        background: '#2563EB',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#3B82F6',
                    color: '#3B82F6',
                    '&:hover': {
                        background: 'rgba(59, 130, 246, 0.06)',
                        borderColor: '#2563EB',
                    },
                },
            },
            defaultProps: {
                disableElevation: true,
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                            borderColor: '#D1D5DB',
                        },
                        '&:hover fieldset': {
                            borderColor: '#9CA3AF',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3B82F6',
                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#6B7280',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3B82F6',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#111827',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    borderBottom: '1px solid #E5E7EB',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    fontWeight: 600,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#E5E7EB',
                },
            },
        },
        MuiCircularProgress: {
            defaultProps: {
                color: 'primary',
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F9FAFB',
                    '& .MuiTableCell-root': {
                        fontWeight: 600,
                        color: '#111827',
                        borderBottom: '2px solid #E5E7EB',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(even)': {
                        backgroundColor: '#F9FAFB',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.04) !important',
                    },
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;
