import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material';
import type { Vehicle } from '../../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const images = vehicle.images?.length ? vehicle.images : [];
  const coverIndex = images.findIndex((img) => img.isCover);
  const initialIndex = coverIndex >= 0 ? coverIndex : 0;
  const [imageIndex, setImageIndex] = useState(initialIndex);
  const hasMultipleImages = images.length > 1;
  const currentImage = images[imageIndex];

  useEffect(() => {
    setImageIndex(initialIndex);
  }, [initialIndex, vehicle.id]);

  const handlePrevImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <CardActionArea sx={{ height: '100%', textDecoration: 'none', borderRadius: 3 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.14)'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={currentImage?.url}
            alt={vehicle.title}
            sx={{
              height: 220,
              objectFit: 'cover',
              bgcolor: 'grey.100'
            }}
          />
          {hasMultipleImages && (
            <>
              <IconButton
                aria-label="Imagen anterior"
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 10,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(15, 23, 42, 0.56)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.78)' }
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                aria-label="Imagen siguiente"
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(15, 23, 42, 0.56)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.78)' }
                }}
              >
                <ChevronRightIcon />
              </IconButton>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.75
                }}
              >
                {images.map((image, index) => (
                  <Box
                    key={image.id}
                    sx={{
                      width: index === imageIndex ? 18 : 8,
                      height: 8,
                      borderRadius: 999,
                      bgcolor: index === imageIndex ? 'primary.main' : 'rgba(255,255,255,0.78)',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            </>
          )}
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
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 700, flexGrow: 1, mb: 1.25 }}>
            {vehicle.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
            {vehicle.mileage.toLocaleString('es-MX')} km
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mt: 'auto',
              fontWeight: 800,
              color: 'success.dark',
              // Aplicamos valores de opacidad y desenfoque más bajos para un brillo sutil
              letterSpacing: '-0.02em'
            }}
          >
            ${vehicle.price.toLocaleString('es-MX')}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};
