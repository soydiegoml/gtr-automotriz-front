import { create } from 'zustand';
import type { Vehicle, Brand, Model, Year, Agency } from '../types';

// --- BASE DE DATOS SIMULADA MÁS GRANDE ---
const brands: Brand[] = [
  { id: 1, name: 'Nissan' }, { id: 2, name: 'Chevrolet' }, { id: 3, name: 'Volkswagen' },
  { id: 4, name: 'Ford' }, { id: 5, name: 'Toyota' }, { id: 6, name: 'Honda' },
];

const modelsByBrand: { [key: number]: Model[] } = {
  1: [{ id: 1, name: 'Versa' }, { id: 2, name: 'Sentra' }, { id: 7, name: 'Kicks' }],
  2: [{ id: 3, name: 'Aveo' }, { id: 4, name: 'Onix' }, { id: 8, name: 'Cavalier' }],
  3: [{ id: 5, name: 'Vento' }, { id: 6, name: 'Jetta' }, { id: 9, name: 'Taos' }],
  4: [{ id: 10, name: 'Figo' }, { id: 11, name: 'Mustang' }, { id: 12, name: 'Lobo' }],
  5: [{ id: 13, name: 'Corolla' }, { id: 14, name: 'RAV4' }, { id: 15, name: 'Hilux' }],
  6: [{ id: 16, name: 'Civic' }, { id: 17, name: 'CR-V' }, { id: 18, name: 'Accord' }],
};

const years: Year[] = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, value: 2024 - i })); // Años desde 2010 a 2024

const agencies: Agency[] = [
  { id: 1, name: 'Seminuevos GOCAR' }, { id: 2, name: 'Autos "El Tío"' },
  { id: 3, name: 'Agencia del Sol' }, { id: 4, name: 'Motorsport de México' },
];

const colors = ['Plata', 'Rojo', 'Blanco', 'Negro', 'Azul', 'Gris Oxford'];

// Función para generar los 200 vehículos
const generateInitialVehicles = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  for (let i = 1; i <= 200; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = modelsByBrand[brand.id][Math.floor(Math.random() * modelsByBrand[brand.id].length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const agency = agencies[Math.floor(Math.random() * agencies.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const price = Math.floor(Math.random() * (800000 - 150000 + 1)) + 150000;
    const mileage = Math.floor(Math.random() * (140000 - 12000 + 1)) + 12000;
    const status = Math.random() > 0.3 ? 'DISPONIBLE' : 'VENDIDO';

    vehicles.push({
      id: i,
      title: `${brand.name} ${model.name} ${year.value}`,
      status,
      brand,
      model,
      agency,
      year,
      color,
      mileage,
      vin: `VIN${i.toString().padStart(10, '0')}`,
      description: 'Vehículo en excelentes condiciones, listo para cualquier prueba.',
      price,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      images: [{ id: i, url: `https://placehold.co/600x400/2c2c2c/FFC107?text=${brand.name}+${model.name}`, isCover: true }],
      isFeatured: Math.random() < 0.05,
    });
  }
  return vehicles;
};

const initialVehicles = generateInitialVehicles();

// --- DEFINICIÓN DEL STORE ---

interface VehicleState {
  toggleFeaturedStatus: any;
  vehicles: Vehicle[];
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (updatedVehicle: Vehicle) => void;
  updateVehicleStatus: (vehicleId: number, newStatus: Vehicle['status']) => void;
  deleteVehicle: (vehicleId: number) => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  toggleFeaturedStatus: '',
  vehicles: initialVehicles,
  addVehicle: (newVehicleData) => set((state) => ({ vehicles: [ { id: Date.now(), createdAt: new Date().toISOString(), ...newVehicleData }, ...state.vehicles ] })),
  updateVehicle: (updatedVehicle) => set((state) => ({ vehicles: state.vehicles.map((v) => v.id === updatedVehicle.id ? updatedVehicle : v) })),
  updateVehicleStatus: (vehicleId, newStatus) => set((state) => ({ vehicles: state.vehicles.map((v) => v.id === vehicleId ? { ...v, status: newStatus } : v) })),
  deleteVehicle: (vehicleId: number) => set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== vehicleId) })),
}));
