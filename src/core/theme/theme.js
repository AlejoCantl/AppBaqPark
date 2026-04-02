export const lightColors = {
  primary: '#022601',
  primaryLight: '#0a4a08',
  secondary: '#5B8C11',
  tertiary: '#C1D96C',
  text: '#ffffff',
  textDark: '#1a1a1a',
  textMuted: '#666666',
  background: '#F4F9F0',
  card: '#ffffff',
  border: '#e0e8d8',
  success: '#4CAF50',
  error: '#d32f2f',
  warning: '#FF9800',
  overlay: 'rgba(2, 38, 1, 0.7)',
};

export const darkColors = {
  primary: '#2E5A2D', // Un tono más suave y visible sobre fondos oscuros
  primaryLight: '#4B8849',
  secondary: '#7CB342', // Verde luminoso para destacar botones e íconos
  tertiary: '#C1D96C',
  text: '#ffffff', // Texto de botones
  textDark: '#F4F9F0', // Texto principal (ahora es brillante)
  textMuted: '#A0A0A0', // Subtítulos
  background: '#121212', // Fondo oscuro nativo
  card: '#1E1E1E', // Superficies
  border: '#2C2C2C', // Separadores
  success: '#81C784',
  error: '#E57373',
  warning: '#FFB74D',
  overlay: 'rgba(0, 0, 0, 0.8)',
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const spacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 100,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Exportamos "theme" por defecto conservando lightColors para no romper temporalmente
// los componentes mientras los refactorizamos
const theme = {
  colors: lightColors,
  fontSizes,
  spacing,
  radius,
  shadow,
};

export default theme;