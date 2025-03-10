
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
import { Edit, Trash, MoreVertical, MessageSquare, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  
  // Determine stock status
  const hasStockInfo = product.stock !== undefined;
  const isLowStock = hasStockInfo && product.minStock !== undefined && product.stock < product.minStock;
  
  return (
    <Card 
      className={cn(
        "glass-card p-4 transition-all duration-300", 
        isHovered ? "scale-[1.02]" : "",
        isLowStock ? "border-yellow-400 dark:border-yellow-600" : "",
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
          
          {/* Stock information */}
          {hasStockInfo && (
            <div className="flex items-center mt-2 space-x-2">
              <div className={cn(
                "flex items-center text-xs rounded-full px-2 py-0.5",
                isLowStock 
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" 
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              )}>
                <Package className="h-3.5 w-3.5 mr-1" />
                <span>{product.stock} {product.stock === 1 ? "unidade" : "unidades"}</span>
              </div>
              
              {isLowStock && (
                <span className="text-xs text-yellow-700 dark:text-yellow-500">
                  Estoque baixo
                </span>
              )}
            </div>
          )}
          
          {product.notes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-pointer">
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      <span>Observações</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{product.notes}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
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
