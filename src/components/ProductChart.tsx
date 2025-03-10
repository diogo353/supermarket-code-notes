
import { useMemo } from "react";
import { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ProductChartProps {
  products: Product[];
  className?: string;
}

export function ProductChart({ products, className }: ProductChartProps) {
  const chartData = useMemo(() => {
    const departmentCounts: Record<string, number> = {};
    
    products.forEach(product => {
      departmentCounts[product.department] = (departmentCounts[product.department] || 0) + 1;
    });
    
    // Convert to the format expected by Recharts
    return Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [products]);
  
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", 
    "#82CA9D", "#8DD1E1", "#A4DE6C", "#D0ED57", "#FFAA15"
  ];
  
  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  if (products.length === 0) {
    return (
      <Card className={`glass-card p-4 flex items-center justify-center h-64 ${className}`}>
        <p className="text-muted-foreground text-center">
          Adicione produtos para ver o gráfico
        </p>
      </Card>
    );
  }

  return (
    <Card className={`glass-card p-4 ${className}`}>
      <h3 className="font-medium text-lg mb-2">Produtos por Departamento</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} produtos`, "Quantidade"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
