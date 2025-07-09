import React, { useState, useMemo } from 'react';
import { Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Tabs, Tab } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useVehicleStore } from '../store/vehicleStore';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { VehicleTable } from '../features/vehicles/components/VehicleTable';
import type { Vehicle } from '../types';

const CatalogPage = () => {
  // Obtenemos todos los datos y acciones que necesitamos del store de Zustand
  const { vehicles, updateVehicleStatus, deleteVehicle, toggleFeaturedStatus } = useVehicleStore((state) => ({
    vehicles: state.vehicles,
    updateVehicleStatus: state.updateVehicleStatus,
    deleteVehicle: state.deleteVehicle,
    toggleFeaturedStatus: state.toggleFeaturedStatus, // <-- CORRECCIÓN APLICADA AQUÍ
  }));
  
  // Estados para manejar los modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  // Nuevo estado para la pestaña de filtro seleccionada
  const [currentTab, setCurrentTab] = useState('todos');

  // --- Handlers para los Modales ---
  const handleOpenCreateModal = () => {
    setVehicleToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setVehicleToEdit(null);
  };

  const handleOpenDeleteConfirm = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setVehicleToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  // --- Handlers para las Acciones de la Tabla ---
  const handleConfirmDelete = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete.id);
    }
    handleCloseDeleteConfirm();
  };

  const handleUpdateStatus = (vehicle: Vehicle) => {
    const newStatus = vehicle.status === 'DISPONIBLE' ? 'VENDIDO' : 'DISPONIBLE';
    updateVehicleStatus(vehicle.id, newStatus);
  };

  const handleToggleFeatured = (vehicle: Vehicle) => {
    toggleFeaturedStatus(vehicle.id);
  };

  // --- Lógica para las Pestañas de Filtro ---
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const filteredVehicles = useMemo(() => {
    switch (currentTab) {
      case 'destacados':
        return vehicles.filter(v => v.isFeatured);
      case 'disponibles':
        return vehicles.filter(v => v.status === 'DISPONIBLE');
      case 'vendidos':
        return vehicles.filter(v => v.status === 'VENDIDO');
      case 'todos':
      default:
        return vehicles;
    }
  }, [vehicles, currentTab]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Gestión de Inventario</Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenCreateModal}>Añadir Vehículo</Button>
      </Box>

      {/* Componente de Pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="pestañas de filtro de vehículos">
          <Tab label={`Todos (${vehicles.length})`} value="todos" />
          <Tab label={`Destacados (${vehicles.filter(v => v.isFeatured).length})`} value="destacados" />
          <Tab label={`Disponibles (${vehicles.filter(v => v.status === 'DISPONIBLE').length})`} value="disponibles" />
          <Tab label={`Vendidos (${vehicles.filter(v => v.status === 'VENDIDO').length})`} value="vendidos" />
        </Tabs>
      </Box>

      {/* La tabla ahora recibe la lista ya filtrada y la nueva función */}
      <VehicleTable
        vehicles={filteredVehicles}
        onEdit={handleOpenEditModal}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleOpenDeleteConfirm}
        onToggleFeatured={handleToggleFeatured}
      />
      
      {/* Modal para Crear/Editar Vehículo */}
      <Dialog open={isFormModalOpen} onClose={handleCloseFormModal} fullWidth maxWidth="sm">
        <DialogTitle>{vehicleToEdit ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}</DialogTitle>
        <DialogContent><VehicleForm onSuccess={handleCloseFormModal} vehicleToEdit={vehicleToEdit} /></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormModal}>Cancelar</Button>
          <Button variant="contained" type="submit" form="vehicle-form">{vehicleToEdit ? 'Guardar Cambios' : 'Guardar Vehículo'}</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Confirmar Eliminación */}
      <Dialog open={isDeleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el vehículo "{vehicleToDelete?.title}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Sí, Eliminar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CatalogPage;
  