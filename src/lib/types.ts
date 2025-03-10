
export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  department: string;
  notes?: string;
  stock?: number; // Add stock quantity field
  minStock?: number; // Add minimum stock threshold
  createdAt: Date;
  updatedAt: Date;
}

export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

export const departments = [
  "Mercearia",
  "Hortifruti",
  "Açougue",
  "Padaria",
  "Laticínios",
  "Bebidas",
  "Higiene",
  "Limpeza",
  "Outros",
];
