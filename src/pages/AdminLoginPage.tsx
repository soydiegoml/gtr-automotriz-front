import { useState } from 'react';
import type { FormEvent } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Alert, Box, Button, Container, CssBaseline, Paper, Stack, TextField, Typography } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { lightTheme } from '../theme';
import { useAuthStore } from '../store/authStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const redirectPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/admin/dashboard';

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = login({ email, password });

    if (!result.success) {
      setErrorMessage(result.error || 'No se pudo iniciar sesión.');
      return;
    }

    setErrorMessage('');
    navigate(redirectPath, { replace: true });
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f4f5f7 0%, #dfe7f2 100%)'
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={8} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Acceso administrativo
                </Typography>
                <Typography color="text.secondary">
                  Ingresa para administrar inventario, publicaciones y operación interna.
                </Typography>
              </Box>

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    fullWidth
                    autoFocus
                  />
                  <TextField
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    fullWidth
                  />
                  <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.4 }}>
                    Iniciar sesión
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Esta es una base local temporal. El siguiente paso será conectarla al backend real.
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
