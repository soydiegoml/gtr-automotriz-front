
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { darkTheme, yellowTheme } from '../../theme';
import { AppBar, Box, CssBaseline, Toolbar, Typography, Button, useMediaQuery, Container } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

// El componente principal ahora contiene toda la lógica.
// Se envuelve en el ThemeProvider para que useMediaQuery pueda acceder al tema.
function ThemedPublicLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header con negro intenso y de ancho completo */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{   
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'secondary.main'
        }}
      >
        {/* El contenido del header se mantiene centrado en un contenedor 'xl' (más ancho) */}
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 88, sm: 104 },
              gap: 2,
              justifyContent: 'space-between'
            }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                display: 'inline-flex',
                alignItems: 'center',
                minWidth: 0,
                py: 1
              }}
            >
              <img
                src={logo}
                alt="DM Automotriz"
                style={{
                  height: isMobile ? 64 : 80,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
            </Box>
            <Button 
              sx={{ color: 'text.primary', borderColor: 'rgba(0,0,0,0.23)' }} 
              color="inherit" 
              variant="outlined"
              component={RouterLink} 
              to="/admin/dashboard"
              size={isMobile ? 'small' : 'medium'}
            >
              Admin Login
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* El contenido principal de la página también se renderiza dentro de un contenedor centrado 'xl' */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, sm: 4 } }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      {/* Pie de página simple */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: 'transparent' }}>
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <RouterLink to="/" style={{ color: darkTheme.palette.primary.main, textDecoration: 'none' }}>
              GT Automotriz
            </RouterLink>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

// Exportamos el componente envuelto en el ThemeProvider
export default function PublicLayout() {
  return (
    <ThemeProvider theme={yellowTheme }>
      <CssBaseline />
      <ThemedPublicLayout />
    </ThemeProvider>
  )
}
