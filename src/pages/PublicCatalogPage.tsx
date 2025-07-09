import React, { useState, useMemo, useEffect } from 'react';
import { useVehicleStore } from '../store/vehicleStore';
import { Box, Grid, Paper, Typography, Divider, FormControl, InputLabel, Select, MenuItem, Slider, CircularProgress } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { VehicleCard } from '../features/vehicles/components/VehicleCard';
import { useQuery } from '@tanstack/react-query';
import { fetchBrands, fetchModelsByBrand, fetchYears } from '../features/vehicles/api/vehicleCatalogsApi';
import type { Brand, Model, Year } from '../types';

// --- Componente de la Barra Lateral de Filtros (Lógica del Slider Corregida) ---
interface FilterSidebarProps {
  brands: Brand[];
  models: Model[];
  years: Year[];
  isLoadingModels: boolean;
  isLoadingYears: boolean;
  filters: { brandId: number; modelId: number; yearId: number; };
  priceRange: number[];
  onFilterChange: (event: SelectChangeEvent<number>) => void;
  onPriceChange: (newValue: number[]) => void;
  priceDomain: number[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  brands, models, years, isLoadingModels, isLoadingYears,
  filters, priceRange, onFilterChange, onPriceChange, priceDomain
}) => {
  // Estado local para una experiencia de arrastre fluida
  const [localPriceRange, setLocalPriceRange] = useState<number[]>(priceRange);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  return (
    <Paper elevation={2} sx={{ p: 2, position: 'sticky', top: '24px' }}>
      <Typography variant="h6" gutterBottom>Filtros</Typography>
      <Divider sx={{ my: 2 }} />
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Marca</InputLabel>
        <Select name="brandId" value={filters.brandId} label="Marca" onChange={onFilterChange}>
          <MenuItem value={0}><em>Todas</em></MenuItem>
          {brands.map((brand) => (<MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={filters.brandId === 0 || isLoadingModels}>
        <InputLabel>Modelo</InputLabel>
        <Select name="modelId" value={filters.modelId} label="Modelo" onChange={onFilterChange}>
          <MenuItem value={0}><em>Todos</em></MenuItem>
          {isLoadingModels ? <MenuItem disabled><CircularProgress size={20} /></MenuItem> : models.map((model) => (<MenuItem key={model.id} value={model.id}>{model.name}</MenuItem>))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Año</InputLabel>
        <Select name="yearId" value={filters.yearId} label="Año" onChange={onFilterChange}>
          <MenuItem value={0}><em>Todos</em></MenuItem>
          {isLoadingYears ? <MenuItem disabled><CircularProgress size={20} /></MenuItem> : years.map((year) => (<MenuItem key={year.id} value={year.id}>{year.value}</MenuItem>))}
        </Select>
      </FormControl>

      <Typography gutterBottom>Rango de Precio</Typography>
      {/* Contenedor para el Slider con padding horizontal */}
      <Box sx={{ px: 1 }}>
        <Slider
          value={localPriceRange}
          onChange={(_e, newValue) => setLocalPriceRange(newValue as number[])} // Actualiza solo la vista
          onChangeCommitted={(_e, newValue) => onPriceChange(newValue as number[])} // Aplica el filtro al soltar
          valueLabelDisplay="auto"
          getAriaValueText={(value) => `$${value.toLocaleString('es-MX')}`}
          min={priceDomain[0]}
          max={priceDomain[1]}
          step={10000}
          disableSwap
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Typography variant="body2">${localPriceRange[0].toLocaleString('es-MX')}</Typography>
        <Typography variant="body2">${localPriceRange[1].toLocaleString('es-MX')}</Typography>
      </Box>
    </Paper>
  );
};


// --- Página Principal del Catálogo Público ---
export const PublicCatalogPage = () => {
  const availableVehicles = useVehicleStore((state) => state.vehicles.filter((v) => v.status === 'DISPONIBLE'));

  const priceDomain = useMemo(() => {
    if (availableVehicles.length === 0) return [0, 1000000];
    const prices = availableVehicles.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [min, max > min ? max : min + 100000];
  }, []); // Se calcula solo una vez al inicio

  const [selectFilters, setSelectFilters] = useState({ brandId: 0, modelId: 0, yearId: 0 });
  const [priceRange, setPriceRange] = useState<number[]>(priceDomain);

  // Este useEffect ya no es necesario, el estado inicial se encarga
  // useEffect(() => { setPriceRange(priceDomain); }, [priceDomain]);

  const { data: brands = [] } = useQuery<Brand[]>({ queryKey: ['brands'], queryFn: fetchBrands });
  const { data: models = [], isLoading: isLoadingModels } = useQuery<Model[]>({ queryKey: ['models', selectFilters.brandId], queryFn: () => fetchModelsByBrand(selectFilters.brandId), enabled: selectFilters.brandId > 0 });
  const { data: years = [], isLoading: isLoadingYears } = useQuery<Year[]>({ queryKey: ['years'], queryFn: fetchYears });

  const handleSelectFilterChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    setSelectFilters(prev => {
      const newFilters = { ...prev, [name]: Number(value) || 0 };
      if (name === 'brandId') { newFilters.modelId = 0; }
      return newFilters;
    });
  };
  
  const handlePriceChange = (newValue: number[]) => {
    setPriceRange(newValue);
  };

  const filteredVehicles = useMemo(() => {
    return availableVehicles.filter(vehicle => {
      const brandMatch = selectFilters.brandId === 0 ? true : vehicle.brand.id === selectFilters.brandId;
      const modelMatch = selectFilters.modelId === 0 ? true : vehicle.model.id === selectFilters.modelId;
      const yearMatch = selectFilters.yearId === 0 ? true : vehicle.year.id === selectFilters.yearId;
      const priceMatch = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
      return brandMatch && modelMatch && yearMatch && priceMatch;
    });
  }, [availableVehicles, selectFilters, priceRange]);

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Nuestro Inventario</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} lg={2}>
          <FilterSidebar
            brands={brands} models={models} years={years}
            isLoadingModels={isLoadingModels} isLoadingYears={isLoadingYears}
            filters={selectFilters}
            priceRange={priceRange}
            onFilterChange={handleSelectFilterChange}
            onPriceChange={handlePriceChange}
            priceDomain={priceDomain}
          />
        </Grid>
        <Grid item xs={12} md={9} lg={10}>
          <Grid container spacing={3}>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <Grid item key={vehicle.id} xs={12} sm={6} md={4} lg={3}>
                  <VehicleCard vehicle={vehicle} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                <Typography>No se encontraron vehículos que coincidan con tus filtros.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PublicCatalogPage;
