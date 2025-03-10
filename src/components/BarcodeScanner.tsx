
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { X } from "lucide-react";

interface BarcodeScannerProps {
  onCodeScanned: (code: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onCodeScanned, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerContainerId = "html5qr-code-scanner";

  useEffect(() => {
    // Inicializa o scanner quando o componente é montado
    scannerRef.current = new Html5Qrcode(scannerContainerId);

    // Limpa o scanner quando o componente é desmontado
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .catch(error => console.error("Erro ao parar o scanner:", error));
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scannerRef.current) return;

    setIsScanning(true);
    try {
      const qrCodeSuccessCallback = (decodedText: string) => {
        // Para quando um código é lido com sucesso
        handleCodeDetected(decodedText);
      };

      const config = { fps: 10, qrbox: 250 };
      
      // Inicia o scanner usando a câmera traseira
      await scannerRef.current.start(
        { facingMode: "environment" }, 
        config, 
        qrCodeSuccessCallback,
        undefined // Adding the fourth argument (error callback) as undefined
      );
    } catch (err) {
      toast.error("Erro ao iniciar o scanner. Verifique as permissões da câmera.");
      console.error("Erro ao iniciar o scanner:", err);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error("Erro ao parar o scanner:", error);
      }
    }
  };

  const handleCodeDetected = async (code: string) => {
    // Para o scanner após detectar um código
    await stopScanner();
    
    // Envia o código detectado para o componente pai
    onCodeScanned(code);
    
    // Fecha o scanner
    onClose();
    
    // Notifica o usuário
    toast.success("Código de barras detectado!");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 z-10" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium mb-2">Scanner de Código de Barras</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Posicione o código de barras na frente da câmera para escanear
          </p>
        </div>
        
        <div 
          id={scannerContainerId} 
          className="w-full h-72 overflow-hidden rounded-md bg-muted"
        ></div>
        
        <div className="p-4 flex justify-center">
          {!isScanning ? (
            <Button onClick={startScanner} className="bg-primary text-white">
              Iniciar Scanner
            </Button>
          ) : (
            <Button onClick={stopScanner} variant="destructive">
              Parar Scanner
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
