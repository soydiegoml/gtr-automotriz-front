  import { createTheme } from '@mui/material/styles';

  // Tipografía compartida para ambos temas
  const sharedTypography = {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  };

  // --- TEMA CLARO PARA EL PANEL DE ADMINISTRACIÓN ---
  // Limpio, funcional y profesional.
  export const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', // Un azul clásico y profesional
      },
      background: {
        default: '#f4f5f7', // Un gris muy claro para evitar el blanco puro
        paper: '#ffffff',
      },
    },
    typography: sharedTypography,
  });

  // --- TEMA OSCURO PARA LA PÁGINA PÚBLICA ---
  // Elegante, moderno y tecnológico.
  export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#2196f3', // Un azul vibrante que resalta en fondos oscuros
        contrastText: '#ffffff',
      },
      background: {
        default: '#212121', // <-- Lo aclaramos un poco, de #121212
        paper: '#2c2c2c',   // <-- Lo aclaramos también, de #1e1e1e
      },
      text: {
          primary: '#e8e8e8', // Aclaramos sutilmente el texto para mantener el contraste
          secondary: '#b0b0b0',
      }
    },
    typography: sharedTypography,
  });

  export const yellowTheme = createTheme({
    palette: {
      mode: 'light', // Es un tema claro
      primary: {
        main: '#3483fa', // El azul de los botones de MercadoLibre
      },
      secondary: {
        main: '#ffdb15', // El amarillo característico
      },
      background: {
        default: '#ebebeb', // El gris de fondo de MercadoLibre
        paper: '#ffffff',   // Las tarjetas son blancas
      },
      text: {
        primary: '#333333',
      }
    },
    typography: sharedTypography,
  });
