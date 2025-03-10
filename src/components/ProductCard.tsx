
import { useState } from "react";
import { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function ProductCard({ 
  product, 
  onEdit, 
  onDelete,
  className 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className={cn(
        "glass-card p-4 transition-all duration-300", 
        isHovered ? "scale-[1.02]" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-primary/10 text-primary dark:bg-primary/20 px-2 py-0.5 rounded-full">
              {product.department}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(product.updatedAt, { 
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
          
          <h3 className="font-bold text-foreground">{product.name}</h3>
          <p className="font-mono text-sm text-primary">
            Código: {product.code}
          </p>
          <p className="font-medium">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(product.id)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
