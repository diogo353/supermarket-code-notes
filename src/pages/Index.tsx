
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DateTime } from "@/components/DateTime";
import { ProductForm } from "@/components/ProductForm";
import { ProductCard } from "@/components/ProductCard";
import { ProductChart } from "@/components/ProductChart";
import { InventoryAnalysis } from "@/components/InventoryAnalysis";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { Product, ProductFormData } from "@/lib/types";
import { Plus, Search, BarChart4 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        // Convert date strings back to Date objects
        return JSON.parse(savedProducts).map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        }));
      } catch (e) {
        console.error('Error parsing products from localStorage', e);
        return [];
      }
    }
    return [];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
  
  const handleAddProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: nanoid(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProducts((prev) => [newProduct, ...prev]);
    setAddDialogOpen(false);
    toast.success("Produto adicionado com sucesso!");
  };
  
  const handleEditProduct = (data: ProductFormData) => {
    if (!currentProduct) return;
    
    setProducts((prev) => 
      prev.map((p) => 
        p.id === currentProduct.id 
          ? { ...p, ...data, updatedAt: new Date() } 
          : p
      )
    );
    
    setCurrentProduct(null);
    setEditDialogOpen(false);
    toast.success("Produto atualizado com sucesso!");
  };
  
  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    setProducts((prev) => prev.filter((p) => p.id !== currentProduct.id));
    setCurrentProduct(null);
    setDeleteDialogOpen(false);
    toast.success("Produto excluído com sucesso!");
  };
  
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">MarketMemo</span>
            </div>
            
            <div className="flex items-center gap-2">
              <DateTime />
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-6 space-y-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos por nome, código ou departamento..."
                className="pl-9 glass"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={() => setAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white flex gap-2 items-center transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideUp">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={(product) => {
                        setCurrentProduct(product);
                        setEditDialogOpen(true);
                      }}
                      onDelete={(id) => {
                        const product = products.find(p => p.id === id);
                        if (product) {
                          setCurrentProduct(product);
                          setDeleteDialogOpen(true);
                        }
                      }}
                      className={`animate-slideUp animate-delay-${index * 100}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 glass-card animate-fadeIn">
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm 
                      ? "Nenhum produto encontrado com os critérios de busca." 
                      : "Você ainda não adicionou nenhum produto."}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => setAddDialogOpen(true)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Adicionar seu primeiro produto
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Estatísticas</h2>
                <BarChart4 className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="chart">Distribuição</TabsTrigger>
                  <TabsTrigger value="inventory">Inventário</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="mt-0">
                  <ProductChart products={products} className="animate-slideUp" />
                </TabsContent>
                
                <TabsContent value="inventory" className="mt-0">
                  <InventoryAnalysis products={products} className="animate-slideUp" />
                </TabsContent>
              </Tabs>
              
              <div className="glass-card p-4 animate-slideUp animate-delay-300">
                <h3 className="font-medium text-lg mb-2">Resumo</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Produtos:</span>
                    <span className="font-medium">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departamentos:</span>
                    <span className="font-medium">
                      {new Set(products.map(p => p.department)).size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Atualização:</span>
                    <span className="font-medium">
                      {products.length > 0
                        ? new Date(
                            Math.max(...products.map(p => p.updatedAt.getTime()))
                          ).toLocaleTimeString()
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
        
        {/* Add Product Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px] glass">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <ProductForm onSubmit={handleAddProduct} onCancel={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        
        {/* Edit Product Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] glass">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            {currentProduct && (
              <ProductForm 
                product={currentProduct}
                isEdit
                onSubmit={handleEditProduct}
                onCancel={() => setEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="glass">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir{" "}
                <span className="font-medium">{currentProduct?.name}</span>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="glass">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                className="bg-destructive text-destructive-foreground"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ThemeProvider>
  );
};

export default Index;
