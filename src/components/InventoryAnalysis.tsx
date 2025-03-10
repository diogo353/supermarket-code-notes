
import { Product } from "@/lib/types";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp, AlertTriangle, Package } from "lucide-react";

interface InventoryAnalysisProps {
  products: Product[];
  className?: string;
}

export function InventoryAnalysis({ products, className }: InventoryAnalysisProps) {
  // Products with stock information
  const productsWithStock = products.filter(p => p.stock !== undefined);
  
  if (productsWithStock.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-muted-foreground">
          Adicione informações de estoque aos produtos para ver análises de inventário.
        </div>
      </Card>
    );
  }

  // Total stock quantity
  const totalStock = productsWithStock.reduce((total, product) => total + (product.stock || 0), 0);
  
  // Low stock products
  const lowStockProducts = productsWithStock.filter(
    p => p.minStock !== undefined && p.stock !== undefined && p.stock < p.minStock
  );
  
  // Products with highest stock
  const highestStockProducts = [...productsWithStock]
    .sort((a, b) => (b.stock || 0) - (a.stock || 0))
    .slice(0, 3);
  
  // Products with lowest stock (but not zero)
  const lowestStockProducts = [...productsWithStock]
    .filter(p => (p.stock || 0) > 0)
    .sort((a, b) => (a.stock || 0) - (b.stock || 0))
    .slice(0, 3);

  // Calculate average stock per department
  const departmentStocks = productsWithStock.reduce((acc, product) => {
    const dept = product.department;
    if (!acc[dept]) {
      acc[dept] = { total: 0, count: 0 };
    }
    acc[dept].total += (product.stock || 0);
    acc[dept].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  // Department with highest average stock
  let highestAvgDept = "";
  let highestAvg = 0;
  
  Object.entries(departmentStocks).forEach(([dept, { total, count }]) => {
    const avg = total / count;
    if (avg > highestAvg) {
      highestAvg = avg;
      highestAvgDept = dept;
    }
  });

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <AnalyticsCard
        title="Estoque Total"
        value={totalStock}
        description="Unidades em todos os produtos"
        footer={
          <div className="text-xs text-muted-foreground">
            {productsWithStock.length} produtos com informações de estoque
          </div>
        }
      />
      
      <AnalyticsCard
        title="Produtos em Estoque Baixo"
        value={lowStockProducts.length}
        description="Produtos abaixo do estoque mínimo"
        footer={
          lowStockProducts.length > 0 ? (
            <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Recomendado repor estoque
            </div>
          ) : (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="mr-1 h-3 w-3" />
              Todos os produtos em níveis adequados
            </div>
          )
        }
      />
      
      <Card className="glass-card p-4 md:col-span-2">
        <h3 className="font-medium text-lg mb-3">Análises Detalhadas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Maior Estoque</h4>
            <ul className="space-y-2">
              {highestStockProducts.map(product => (
                <li key={product.id} className="flex justify-between text-sm">
                  <span className="font-medium">{product.name}</span>
                  <span className="flex items-center">
                    <Package className="mr-1 h-3 w-3 text-primary" />
                    {product.stock}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Menor Estoque</h4>
            <ul className="space-y-2">
              {lowestStockProducts.map(product => (
                <li key={product.id} className="flex justify-between text-sm">
                  <span className="font-medium">{product.name}</span>
                  <span className="flex items-center">
                    <Package className="mr-1 h-3 w-3 text-yellow-600" />
                    {product.stock}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {highestAvgDept && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Departamento com Maior Estoque Médio</h4>
            <div className="flex justify-between">
              <span className="font-medium">{highestAvgDept}</span>
              <span className="text-primary">{highestAvg.toFixed(1)} unidades/produto</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
