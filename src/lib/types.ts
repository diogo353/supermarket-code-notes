
export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  department: string;
  notes?: string; // Adding notes field
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
