'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// CSS variable values mirrored here for MUI palette
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#2D5F9E',        // --primary-light
            dark: '#1E3A5F',        // --primary
            light: '#3B82C4',       // --accent
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#4A6080',        // --text-secondary
            light: '#8DA5BE',       // --text-muted
            dark: '#1A2B3C',        // --text-primary
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#D64045',        // --error
        },
        warning: {
            main: '#E5A020',        // --warning
        },
        info: {
            main: '#3B82C4',        // --accent
        },
        success: {
            main: '#0F9D6A',        // --success
        },
        background: {
            default: '#F0F6FF',     // --surface
            paper: '#FFFFFF',       // --surface-card
        },
        text: {
            primary: '#1A2B3C',     // --text-primary
            secondary: '#4A6080',   // --text-secondary
            disabled: '#8DA5BE',    // --text-muted
        },
        divider: '#CBD8EA',         // --border
    },
    typography: {
        fontFamily: 'var(--font-dm-sans, "DM Sans"), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h1: {
            fontFamily: 'var(--font-dm-serif, "DM Serif Display"), Georgia, serif',
            color: '#1A2B3C',
        },
        h2: {
            fontFamily: 'var(--font-dm-serif, "DM Serif Display"), Georgia, serif',
            color: '#1A2B3C',
        },
        h3: {
            fontFamily: 'var(--font-dm-serif, "DM Serif Display"), Georgia, serif',
            color: '#1A2B3C',
        },
        h4: {
            fontFamily: 'var(--font-dm-serif, "DM Serif Display"), Georgia, serif',
            color: '#1A2B3C',
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
                    borderRadius: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                },
                containedPrimary: {
                    background: '#2D5F9E',
                    '&:hover': {
                        background: '#1E3A5F',
                        boxShadow: '0 4px 16px rgba(30, 58, 95, 0.25)',
                        transform: 'translateY(-1px)',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#2D5F9E',
                    color: '#2D5F9E',
                    '&:hover': {
                        background: 'rgba(45, 95, 158, 0.06)',
                        borderColor: '#1E3A5F',
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
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(30, 58, 95, 0.07)',
                    border: '1px solid #CBD8EA',
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
                        borderRadius: '10px',
                        backgroundColor: '#FAFCFF',
                        '& fieldset': {
                            borderColor: '#CBD8EA',
                        },
                        '&:hover fieldset': {
                            borderColor: '#3B82C4',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3B82C4',
                            boxShadow: '0 0 0 3px rgba(59, 130, 196, 0.15)',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#4A6080',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3B82C4',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#1A2B3C',
                    boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
                    borderBottom: '1px solid #CBD8EA',
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
                    borderColor: '#CBD8EA',
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
                    backgroundColor: '#F0F6FF',
                    '& .MuiTableCell-root': {
                        fontWeight: 600,
                        color: '#1A2B3C',
                        borderBottom: '2px solid #CBD8EA',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(even)': {
                        backgroundColor: '#FAFCFF',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 196, 0.04) !important',
                    },
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;
