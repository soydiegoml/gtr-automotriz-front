
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../theme';
import { AppBar, Box, Button, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';

// Iconos para el menú
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../store/authStore';

const drawerWidth = 240; // Ancho del menú lateral

export default function DashboardLayout() {
  const location = useLocation();
  const adminUser = useAuthStore((state) => state.adminUser);
  const logout = useAuthStore((state) => state.logout);

  // La clave del cambio: los 'path' ahora incluyen el prefijo '/admin'
  const menuItems = [
    { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'Inventario', path: '/admin/inventario', icon: <InventoryIcon /> },
  ];

  const drawer = (
    <div>
      <Toolbar /> {/* Un espacio para que el contenido no quede debajo del AppBar */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                // Hacemos que el item seleccionado se resalte
                selected={location.pathname === item.path}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    // Envolvemos todo en el ThemeProvider con el tema claro
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline /> {/* CssBaseline aplica los estilos base del tema (fondos, etc.) */}
        
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Panel de Administración
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {adminUser?.email}
            </Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
              Salir
            </Button>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <Toolbar /> {/* Espacio necesario para que el contenido no quede debajo del AppBar */}
          
          {/* Aquí se renderizará la página activa (Dashboard o Inventario) */}
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
