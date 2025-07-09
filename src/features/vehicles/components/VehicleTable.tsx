import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Avatar, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Vehicle } from '../../../types';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// La interfaz de Props ahora espera recibir las funciones para manejar todas las acciones
interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onUpdateStatus: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onToggleFeatured: (vehicle: Vehicle) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, onUpdateStatus, onDelete, onToggleFeatured }) => {
  // Estados para saber qué menú de qué fila está abierto
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<null | Vehicle>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, vehicle: Vehicle) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleEdit = () => {
    if (selectedVehicle) onEdit(selectedVehicle);
    handleMenuClose();
  };

  const handleUpdateStatus = () => {
    if (selectedVehicle) onUpdateStatus(selectedVehicle);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedVehicle) onDelete(selectedVehicle);
    handleMenuClose();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de vehículos">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
            <TableCell>Vehículo</TableCell>
            <TableCell>Año</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Estatus</TableCell>
            <TableCell>Dest.</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => {
            const coverImage = vehicle.images.find(img => img.isCover) || vehicle.images[0];
            return (
              <TableRow key={vehicle.id.toString()} hover>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={coverImage?.url} variant="rounded">{vehicle.brand.name.charAt(0)}</Avatar>
                    {vehicle.title}
                  </Box>
                </TableCell>
                <TableCell>{vehicle.year.value}</TableCell>
                <TableCell>${vehicle.price.toLocaleString('es-MX')}</TableCell>
                <TableCell>
                  <Chip
                    label={vehicle.status}
                    color={vehicle.status === 'DISPONIBLE' ? 'success' : 'default'}
                    variant={vehicle.status === 'DISPONIBLE' ? 'outlined' : 'filled'}
                    size="small"
                  />
                </TableCell>
                <TableCell padding="checkbox">
                  <IconButton onClick={() => onToggleFeatured(vehicle)}>
                    {vehicle.isFeatured ? <StarIcon color="primary" /> : <StarBorderIcon />}
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label={`acciones para ${vehicle.title}`}
                    onClick={(event) => handleMenuClick(event, vehicle)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Este es el menú flotante que se abre al hacer clic en el botón de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleUpdateStatus}>
          Marcar como {selectedVehicle?.status === 'DISPONIBLE' ? 'Vendido' : 'Disponible'}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Eliminar Registro
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};