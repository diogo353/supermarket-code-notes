
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  value,
  description,
  footer,
  className,
}: AnalyticsCardProps) {
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
      {footer && <CardFooter className="pt-1">{footer}</CardFooter>}
    </Card>
  );
}
