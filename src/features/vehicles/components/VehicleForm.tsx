import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText, Button, Box, Typography, Chip, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';
import { fetchBrands, fetchModelsByBrand, fetchYears, fetchAgencies } from '../api/vehicleCatalogsApi';
import { useVehicleStore } from '../../../store/vehicleStore';
import type { Vehicle, Brand, Model, Year, Agency, Image as ImageType } from '../../../types';

// --- ESQUEMAS DE VALIDACIÓN SEPARADOS ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const baseSchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres'),
  brandId: z.number({ invalid_type_error: 'Debes seleccionar una marca' }).min(1, 'Debes seleccionar una marca'),
  modelId: z.number({ invalid_type_error: 'Debes seleccionar un modelo' }).min(1, 'Debes seleccionar un modelo'),
  yearId: z.number({ invalid_type_error: 'Debes seleccionar un año' }).min(1, 'Debes seleccionar un año'),
  agencyId: z.number({ invalid_type_error: 'Debes seleccionar una agencia' }).min(1, 'Debes seleccionar una agencia'),
  price: z.number({ required_error: 'El precio es requerido' }).positive('El precio debe ser mayor a 0'),
  color: z.string().min(3, 'El color es requerido'),
  vin: z.string().optional(),
  description: z.string().optional(),
});

const imageValidation = z
  .array(z.instanceof(File))
  .min(1, 'Debes subir al menos una imagen.')
  .refine((files) => files.every(file => file.size <= MAX_FILE_SIZE), `Cada imagen debe pesar máximo 5MB.`)
  .refine((files) => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Solo se aceptan formatos .jpg, .png y .webp.");

const createVehicleSchema = baseSchema.extend({ images: imageValidation });
const updateVehicleSchema = baseSchema.extend({ images: imageValidation.optional() });

type BaseFormData = z.infer<typeof baseSchema>;
type VehicleFormData = BaseFormData & { images?: File[] };

interface VehicleFormProps {
  onSuccess: () => void;
  vehicleToEdit: Vehicle | null;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess, vehicleToEdit }) => {
  const { addVehicle, updateVehicle } = useVehicleStore((state) => ({ addVehicle: state.addVehicle, updateVehicle: state.updateVehicle }));
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const activeSchema = vehicleToEdit ? updateVehicleSchema : createVehicleSchema;

  const { control, handleSubmit, watch, formState: { errors }, reset, setValue, getValues } = useForm<VehicleFormData>({
    resolver: zodResolver(activeSchema),
    defaultValues: { images: [], title: '', color: '', vin: '', description: '', price: 0, brandId: 0, modelId: 0, yearId: 0, agencyId: 0 },
  });

  const { data: brands = [] } = useQuery<Brand[]>({ queryKey: ['brands'], queryFn: fetchBrands });
  const { data: agencies = [] } = useQuery<Agency[]>({ queryKey: ['agencies'], queryFn: fetchAgencies });
  const selectedBrandId = watch('brandId');
  const selectedModelId = watch('modelId');
  const { data: models = [], isLoading: isLoadingModels } = useQuery<Model[]>({ queryKey: ['models', selectedBrandId], queryFn: () => fetchModelsByBrand(selectedBrandId!), enabled: !!selectedBrandId });
  const { data: years = [], isLoading: isLoadingYears } = useQuery<Year[]>({ queryKey: ['years', selectedModelId], queryFn: fetchYears, enabled: !!selectedModelId });
  
  useEffect(() => {
    if (vehicleToEdit && brands.length > 0 && agencies.length > 0) {
      reset({
        title: vehicleToEdit.title, brandId: vehicleToEdit.brand.id, modelId: vehicleToEdit.model.id,
        yearId: vehicleToEdit.year.id, agencyId: vehicleToEdit.agency.id, price: vehicleToEdit.price,
        color: vehicleToEdit.color, vin: vehicleToEdit.vin, description: vehicleToEdit.description,
        images: [],
      });
      setImagePreviews(vehicleToEdit.images.map(img => img.url));
    } else if (!vehicleToEdit) {
      reset({ title: '', images: [], brandId: 0, modelId: 0, yearId: 0, agencyId: 0, price: 0, color: '', vin: '', description: '' });
      setImagePreviews([]);
    }
  }, [vehicleToEdit, brands, agencies, reset]);

  const onSubmit = (data: VehicleFormData) => {
    const brand = brands.find(b => b.id === data.brandId)!;
    const model = models.find(m => m.id === data.modelId)!;
    const year = years.find(y => y.id === data.yearId)!;
    const agency = agencies.find(a => a.id === data.agencyId)!;

    if (vehicleToEdit) {
      let updatedImages = vehicleToEdit.images;
      if (data.images && data.images.length > 0) {
        updatedImages = data.images.map((file, index) => ({ id: Date.now() + index, url: URL.createObjectURL(file), isCover: index === 0 }));
      }
      const updatedVehicle = { ...vehicleToEdit, title: data.title, brand, model, year, agency, price: data.price, color: data.color, description: data.description || '', vin: data.vin || '', images: updatedImages };
      updateVehicle(updatedVehicle);
    } else {
      if (!data.images) return;
      const newImages: ImageType[] = data.images.map((file, index) => ({ id: Date.now() + index, url: URL.createObjectURL(file), isCover: index === 0 }));
      addVehicle({
        title: data.title, status: 'DISPONIBLE', brand, model, year, agency, price: data.price, color: data.color, description: data.description || '', vin: data.vin || '', createdBy: 'admin', images: newImages,
        isFeatured: false
      });
    }
    onSuccess();
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      const currentFiles = getValues('images') || [];
      const combinedFiles = [...currentFiles, ...newFiles].filter((file, index, self) => index === self.findIndex(f => f.name === file.name && f.size === file.size));
      setValue('images', combinedFiles, { shouldValidate: true });
      const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const handleClearImages = () => {
    setValue('images', [], { shouldValidate: true });
    setImagePreviews([]);
  };

  return (
    <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <Controller name="title" control={control} render={({ field }) => ( <TextField {...field} label="Título del Anuncio" fullWidth autoFocus error={!!errors.title} helperText={errors.title?.message} /> )}/>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>Galería de Imágenes</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>Añadir Imágenes
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </Button>
            {imagePreviews.length > 0 && ( <Button variant="text" color="error" size="small" startIcon={<ClearIcon />} onClick={handleClearImages}>Limpiar</Button> )}
          </Box>
          {errors.images && <FormHelperText error>{typeof errors.images.message === 'string' ? errors.images.message : 'Error en las imágenes'}</FormHelperText>}
          {imagePreviews.length > 0 && (
            <Box mt={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {imagePreviews.map((previewUrl, index) => (
                <Box key={previewUrl} sx={{ border: '1px solid #ddd', p: 0.5, borderRadius: 1, position: 'relative' }}>
                  {index === 0 && <Chip label="Portada" size="small" color="primary" sx={{ position: 'absolute', top: 4, left: 4, zIndex: 1, opacity: 0.9 }}/>}
                  <img src={previewUrl} alt={`Vista previa ${index + 1}`} height="90" style={{ display: 'block' }} />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.brandId}><InputLabel>Marca</InputLabel>
            <Controller name="brandId" control={control} render={({ field }) => ( <Select {...field} value={field.value || ''} label="Marca" onChange={(e) => { field.onChange(e); setValue('modelId', 0); setValue('yearId', 0); }}>{brands.map((b) => (<MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>))}</Select> )}/>
            {errors.brandId && <FormHelperText>{errors.brandId.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.modelId} disabled={!selectedBrandId || isLoadingModels}><InputLabel>Modelo</InputLabel>
            <Controller name="modelId" control={control} render={({ field }) => ( <Select {...field} value={field.value || ''} label="Modelo" onChange={(e) => { field.onChange(e); setValue('yearId', 0); }}>{isLoadingModels ? <MenuItem disabled><CircularProgress size={20} sx={{mx: 'auto'}} /></MenuItem> : models.map((m) => (<MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>))}</Select> )}/>
            {errors.modelId && <FormHelperText>{errors.modelId.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.yearId} disabled={!selectedModelId || isLoadingYears}><InputLabel>Año</InputLabel>
            <Controller name="yearId" control={control} render={({ field }) => ( <Select {...field} value={field.value || ''} label="Año">{isLoadingYears ? <MenuItem disabled><CircularProgress size={20} sx={{mx: 'auto'}} /></MenuItem> : years.map((y) => (<MenuItem key={y.id} value={y.id}>{y.value}</MenuItem>))}</Select> )}/>
            {errors.yearId && <FormHelperText>{errors.yearId.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.agencyId}><InputLabel>Agencia</InputLabel>
            <Controller name="agencyId" control={control} render={({ field }) => ( <Select {...field} value={field.value || ''} label="Agencia">{agencies.map((a) => (<MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>))}</Select> )}/>
            {errors.agencyId && <FormHelperText>{errors.agencyId.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="price" control={control} render={({ field }) => ( <TextField {...field} value={field.value || ''} label="Precio" type="number" fullWidth error={!!errors.price} helperText={errors.price?.message} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /> )}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="color" control={control} render={({ field }) => ( <TextField {...field} label="Color" fullWidth error={!!errors.color} helperText={errors.color?.message} /> )}/>
        </Grid>
        <Grid item xs={12}>
          <Controller name="vin" control={control} render={({ field }) => ( <TextField {...field} label="VIN (Número de Serie) (Opcional)" fullWidth /> )}/>
        </Grid>
        <Grid item xs={12}>
          <Controller name="description" control={control} render={({ field }) => ( <TextField {...field} label="Descripción Adicional (Opcional)" multiline rows={3} fullWidth /> )}/>
        </Grid>
      </Grid>
    </form>
  );
};