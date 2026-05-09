'use client';
import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF',
      light: '#3395FF',
      dark: '#0055B3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#636366',
      light: '#8E8E93',
      dark: '#3A3A3C',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1C1E',
      secondary: '#636366',
      disabled: '#AEAEB2',
    },
    divider: '#E8E8ED',
    grey: {
      50: '#F5F5F7',
      100: '#E8E8ED',
      200: '#D2D2D7',
      300: '#AEAEB2',
      400: '#8E8E93',
      500: '#636366',
      600: '#48484A',
      700: '#3A3A3C',
      800: '#2C2C2E',
      900: '#1C1C1E',
    },
    error: { main: '#FF3B30' },
    success: { main: '#34C759' },
    warning: { main: '#FF9500' },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"SF Pro Text"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h3: { fontWeight: 600, letterSpacing: '-0.015em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
    button: { fontWeight: 500, letterSpacing: 0, textTransform: 'none' as const },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.10)',
    '0 8px 24px rgba(0,0,0,0.10)',
    '0 12px 32px rgba(0,0,0,0.12)',
    '0 16px 48px rgba(0,0,0,0.14)',
    '0 20px 64px rgba(0,0,0,0.14)',
    '0 24px 80px rgba(0,0,0,0.16)',
    ...Array(16).fill('none'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: '#F5F5F7',
        },
        '::selection': {
          backgroundColor: alpha('#007AFF', 0.15),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 980,
          padding: '10px 22px',
          fontSize: '0.9375rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&:active': { transform: 'scale(0.97)' },
          transition: 'all 0.15s ease',
          '&.MuiButton-contained.MuiButton-colorPrimary': {
            background: 'linear-gradient(180deg, #007AFF 0%, #0066DD 100%)',
            '&:hover': { background: 'linear-gradient(180deg, #1A87FF 0%, #0070EE 100%)' },
          },
          '&.MuiButton-outlined.MuiButton-colorPrimary': {
            borderColor: '#007AFF', color: '#007AFF',
            '&:hover': { backgroundColor: alpha('#007AFF', 0.06), borderColor: '#007AFF' },
          },
        },
        text: {
          '&:hover': { backgroundColor: alpha('#007AFF', 0.06) },
        },
        sizeLarge: { padding: '13px 28px', fontSize: '1rem' },
        sizeSmall: { padding: '7px 16px', fontSize: '0.875rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16, backgroundImage: 'none' },
        elevation1: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
        elevation2: { boxShadow: '0 4px 20px rgba(0,0,0,0.10)' },
        elevation3: { boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' as const },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#ffffff',
            '& fieldset': { borderColor: '#D2D2D7' },
            '&:hover fieldset': { borderColor: '#AEAEB2' },
            '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: 1.5 },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& fieldset': { borderColor: '#D2D2D7' },
          '&:hover fieldset': { borderColor: '#AEAEB2' },
          '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: 1.5 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 980, fontWeight: 500 },
        filled: { '&.MuiChip-colorPrimary': { backgroundColor: '#007AFF', color: '#fff' } },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0.85)',
          color: '#1C1C1E',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          minWidth: 'auto',
          padding: '8px 16px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        standard: { backgroundColor: alpha('#007AFF', 0.08), color: '#0055B3' },
        colorSuccess: { backgroundColor: alpha('#34C759', 0.08), color: '#1A7A30' },
        colorError: { backgroundColor: alpha('#FF3B30', 0.08), color: '#CC2A22' },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: '#E8E8ED' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#E8E8ED' },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { backgroundColor: '#007AFF', fontWeight: 600 },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'background-color 0.15s ease',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#FF3B30',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.65rem',
        },
      },
    },
  },
});

export default theme;
