
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Product, ProductFormData, departments } from "@/lib/types";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { cn } from "@/lib/utils";
import { Scan } from "lucide-react";

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
    notes: product?.notes || "",
  });
  
  const [showScanner, setShowScanner] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
  
  const handleCodeScanned = (code: string) => {
    setFormData(prev => ({
      ...prev,
      code: code
    }));
    toast.success(`Código ${code} escaneado com sucesso!`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4 p-4", className)}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="code">Código do Produto</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-1"
          >
            <Scan className="h-4 w-4" />
            <span className="text-xs">Escanear</span>
          </Button>
        </div>
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
      
      {/* Add new notes field */}
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          placeholder="Adicione observações sobre o produto..."
          className="glass min-h-[100px]"
        />
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

      {showScanner && (
        <BarcodeScanner 
          onCodeScanned={handleCodeScanned} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </form>
  );
}
