
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Product, ProductFormData, departments } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  product?: Product;
  isEdit?: boolean;
  onCancel?: () => void;
  className?: string;
}

export function ProductForm({
  onSubmit,
  product,
  isEdit = false,
  onCancel,
  className,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    code: product?.code || "",
    name: product?.name || "",
    price: product?.price || 0,
    department: product?.department || departments[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error("O código do produto é obrigatório");
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error("O nome do produto é obrigatório");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4 p-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="code">Código do Produto</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Digite o código do produto"
          className="glass"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Digite o nome do produto"
          className="glass"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          className="glass"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => 
            setFormData((prev) => ({ ...prev, department: value }))
          }
        >
          <SelectTrigger id="department" className="glass">
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="glass"
          >
            Cancelar
          </Button>
        )}
        <Button 
          type="submit"
          className="bg-primary text-white"
        >
          {isEdit ? "Atualizar" : "Adicionar"} Produto
        </Button>
      </div>
    </form>
  );
}
