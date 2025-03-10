
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DateTime() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="text-sm font-medium text-muted-foreground">
        {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </div>
      <div className="text-2xl font-bold">
        {format(date, "HH:mm:ss")}
      </div>
    </div>
  );
}
