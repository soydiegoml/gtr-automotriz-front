import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, CardActionArea } from '@mui/material';
import type { Vehicle } from '../../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const coverImage = vehicle.images.find(img => img.isCover) || vehicle.images?.[0];

  return (
    <CardActionArea sx={{ height: '100%', textDecoration: 'none', borderRadius: 2 }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={coverImage?.url}
            alt={vehicle.title}
            sx={{ 
              height: 200, 
              objectFit: 'cover'
            }} 
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            <Chip 
              label={vehicle.year.value} 
              color="primary" 
              size="small" 
              sx={{ fontWeight: 'bold', boxShadow: '0px 2px 4px rgba(0,0,0,0.5)' }} 
            />
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            {vehicle.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vendido por: {vehicle.agency.name}
          </Typography>
          {/* --- EFECTO DE SOMBRA AJUSTADO --- */}
          <Typography 
            variant="h5" 
            sx={{ 
              mt: 'auto',
              fontWeight: 'bold', 
              color: '#000', // El color base del texto sigue siendo blanco puro
              // Aplicamos valores de opacidad y desenfoque más bajos para un brillo sutil
              textShadow: `
                0 0 3px rgba(255, 255, 255, 0.5),
                0 0 6px rgba(48, 158, 248, 0.3),
                0 0 9px rgba(43, 147, 231, 0.2)
              `
            }}
          >
            ${vehicle.price.toLocaleString('es-MX')}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};
