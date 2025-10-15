import { createTheme } from '@mui/material/styles';

// Luxury color palette
const luxuryColors = {
  primary: {
    main: '#B8860B', // Dark Gold
    light: '#E6C67A', // Light Gold
    dark: '#8B6914', // Deep Gold
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#1E1E1E', // Almost Black
    light: '#383838',
    dark: '#0F0F0F',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F9F9F9',
  },
  text: {
    primary: '#1E1E1E',
    secondary: '#555555',
    disabled: '#8E8E8E',
  },
  error: {
    main: '#C62828',
    light: '#E57373',
    dark: '#B71C1C',
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
  },
  // Accent colors for special elements
  accent: {
    gold: '#D4AF37',
    silver: '#C0C0C0',
    copper: '#B87333',
    champagne: '#F7E7CE',
    cream: '#FFFDD0',
  }
};

// Luxury typography with serif fonts for headings and sans-serif for body
const luxuryTheme = createTheme({
  palette: {
    primary: luxuryColors.primary,
    secondary: luxuryColors.secondary,
    background: luxuryColors.background,
    text: luxuryColors.text,
    error: luxuryColors.error,
    success: luxuryColors.success,
  },
  typography: {
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '0.02em',
      marginBottom: '0.5em',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '0.02em',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(184, 134, 11, 0.2)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: luxuryColors.primary.dark,
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
        },
        elevation1: {
          boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: luxuryColors.primary.main,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

export default luxuryTheme;
export { luxuryColors };