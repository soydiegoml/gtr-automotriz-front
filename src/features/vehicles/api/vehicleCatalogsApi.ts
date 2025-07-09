import { useVehicleStore } from '../../../store/vehicleStore';
import type { Brand, Model, Year } from '../../../types';

// --- NUEVA LÓGICA DINÁMICA ---
// Las funciones ahora leen el estado global para simular una API real

const getUnique = <T, K extends keyof T>(items: T[], key: K): T[K][] => {
  return [...new Map(items.map(item => [item[key]['id' as keyof T[K]], item[key]])).values()];
};

const fetchApi = <T>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 250)); // Reducimos el delay
};

export const fetchBrands = () => {
    const allVehicles = useVehicleStore.getState().vehicles;
    const uniqueBrands = getUnique(allVehicles, 'brand');
    return fetchApi(uniqueBrands as Brand[]);
};

export const fetchModelsByBrand = (brandId: number) => {
    if (!brandId) return fetchApi([]);
    const allVehicles = useVehicleStore.getState().vehicles;
    const brandModels = allVehicles
        .filter(v => v.brand.id === brandId)
        .map(v => v.model);
    const uniqueModels = [...new Map(brandModels.map(m => [m.id, m])).values()];
    return fetchApi(uniqueModels as Model[]);
};

export const fetchYears = () => {
    const allVehicles = useVehicleStore.getState().vehicles;
    const uniqueYears = getUnique(allVehicles, 'year');
    // Ordenamos los años de más nuevo a más viejo
    uniqueYears.sort((a, b) => (b as Year).value - (a as Year).value);
    return fetchApi(uniqueYears as Year[]);
};

// La lista de agencias puede seguir siendo estática si lo prefieres
export const fetchAgencies = () => {
    const allVehicles = useVehicleStore.getState().vehicles;
    const uniqueAgencies = getUnique(allVehicles, 'agency');
    return fetchApi(uniqueAgencies as any[]);
}
