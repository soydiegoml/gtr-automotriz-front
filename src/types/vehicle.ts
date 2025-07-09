import type { Agency } from './agency';
import type { Brand } from './brand';
import type { Model } from './Model';
import type { Year } from './year';
import type { Image } from './image';

export interface Vehicle {
  id: number; // Equivalente a Long
  title: string;
  brand: Brand;
  model: Model;
  agency: Agency;
  year: Year;
  color: string;
  vin: string;
  description: string;
  price: number; // Equivalente a BigDecimal
  createdBy: string;
  createdAt: string; // Usamos string para fechas en formato ISO (ej: "2025-06-15T10:00:00Z")
  images: Image[];
  status: 'DISPONIBLE' | 'VENDIDO' | 'APARTADO';
  isFeatured: boolean;
}