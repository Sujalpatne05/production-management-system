import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import {
  Plus,
  Factory,
  Package,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  categoryId: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  unit: string;
  status: "active" | "inactive";
}

const AddProductionEnhanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProduction, productions, productionStages } = useStore();

  // Local product management
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "MS ANGLE 50x50x5 MM",
      categoryId: "steel",
      sku: "MSA-50-50-5",
      price: 45,
      cost: 35,
      stock: 500,
      unit: "KG",
      status: "active",
    },
    {
      id: "2",
      name: "Steel Rod 12mm",
      categoryId: "steel",
      sku: "SR-12",
      price: 38,
      cost: 28,
      stock: 750,
      unit: "KG",
      status: "active",
    },
    {
      id: "3",
      name: "Mild Steel Plate",
      categoryId: "steel",
      sku: "MSP-10",
      price: 50,
      cost: 40,
      stock: 300,
      unit: "KG",
      status: "active",
    },
    {
      id: "4",
      name: "Stainless Steel Sheet",
      categoryId: "ss",
      sku: "SSS-2",
      price: 120,
      cost: 95,
      stock: 150,
      unit: "KG",
      status: "active",
    },
  ]);

  // Add Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    categoryId: "steel",
    price: 0,
    cost: 0,
    stock: 0,
    unit: "KG",
  });

  // Production Form State
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [stage, setStage] = useState("raw-material");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Add New Product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku) {
      toast({
        title: "Error",
        description: "Please fill in product name and SKU",
        variant: "destructive",
      });
      return;
    }

    const productToAdd: Product = {
      id: String(products.length + 1),
      name: newProduct.name,
      categoryId: newProduct.categoryId,
      sku: newProduct.sku,
      price: newProduct.price,
      cost: newProduct.cost,
      stock: newProduct.stock,
      unit: newProduct.unit,
      status: "active",
    };

    setProducts([...products, productToAdd]);
    setProductId(productToAdd.id);
    setProductSearch("");
    setShowProductDropdown(false);
    setShowAddProductModal(false);

    // Reset form
    setNewProduct({
      name: "",
      sku: "",
      categoryId: "steel",
      price: 0,
      cost: 0,
      stock: 0,
      unit: "KG",
    });

    toast({
      title: "Success",
      description: `Product "${productToAdd.name}" added successfully!`,
    });
  };

  // Filter Products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Handle Submit
  const handleSubmit = () => {
    if (!productId) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    if (quantity < 1) {
      toast({
        title: "Error",
        description: "Quantity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    try {
      const referenceNo = `PRD-${String(productions.length + 1).padStart(3, "0")}`;
      const selectedProduct = products.find((p) => p.id === productId);

      addProduction({
        referenceNo,
        productId,
        quantity,
        startDate,
        endDate: endDate || undefined,
        status: "running",
        stage,
        notes,
      });

      toast({
        title: "Success",
        description: `Production for "${selectedProduct?.name}" created successfully!`,
      });
      navigate("/dashboard/production/list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create production",
        variant: "destructive",
      });
    }
  };

  const selectedProduct = products.find((p) => p.id === productId);

  return (
    <div className="space-y-6">
      <PageHeader title="Create Production Order" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Notes</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-4">
          {/* Product Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Select Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Product *</Label>
                <div className="relative mt-2">
                  <Input
                    placeholder="Type product name or SKU..."
                    value={
                      selectedProduct
                        ? `${selectedProduct.sku} - ${selectedProduct.name}`
                        : productSearch
                    }
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductDropdown(true);
                      if (selectedProduct) setProductId("");
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    className="w-full"
                  />
                  {showProductDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              setProductId(product.id);
                              setProductSearch("");
                              setShowProductDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 flex justify-between items-start"
                          >
                            <div>
                              <p className="font-semibold text-sm">{product.sku} - {product.name}</p>
                              <p className="text-xs text-gray-600">
                                Stock: {product.stock} {product.unit} • Price: ₹{product.price}
                              </p>
                            </div>
                            <Badge variant="outline">{product.status}</Badge>
                          </button>
                        ))
                      ) : productSearch ? (
                        <div className="space-y-2 p-3">
                          <div className="text-sm text-gray-600">
                            No products found for "{productSearch}"
                          </div>
                          <Button
                            onClick={() => {
                              setShowProductDropdown(false);
                              setShowAddProductModal(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Product
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 p-3">
                          <div className="text-sm text-gray-500">
                            {products.length} products available - start typing to filter
                          </div>
                          <Button
                            onClick={() => {
                              setShowProductDropdown(false);
                              setShowAddProductModal(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Product
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedProduct && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs">SKU</p>
                      <p className="font-semibold">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Current Stock</p>
                      <p className="font-semibold text-blue-700">
                        {selectedProduct.stock} {selectedProduct.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Cost Price</p>
                      <p className="font-semibold">₹{selectedProduct.cost}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Sale Price</p>
                      <p className="font-semibold text-green-600">₹{selectedProduct.price}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div>
                <Label className="text-sm font-semibold">Production Quantity *</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                  {selectedProduct && (
                    <span className="text-sm text-gray-600">
                      {selectedProduct.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Production Stage */}
              <div>
                <Label className="text-sm font-semibold">Production Stage *</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw-material">Raw Material</SelectItem>
                    <SelectItem value="cutting">Cutting</SelectItem>
                    <SelectItem value="bending">Bending</SelectItem>
                    <SelectItem value="welding">Welding</SelectItem>
                    <SelectItem value="grinding">Grinding</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="assembly">Assembly</SelectItem>
                    <SelectItem value="quality-check">Quality Check</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule & Notes Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Schedule & Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Start Date *</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Expected End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-sm font-semibold">Production Notes</Label>
                <Textarea
                  placeholder="Add special instructions, quality requirements, material specifications..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Production Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Summary */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="text-lg font-bold">{selectedProduct?.name || "Not selected"}</p>
                  <p className="text-sm text-gray-500">SKU: {selectedProduct?.sku || "-"}</p>
                </div>

                {/* Quantity Summary */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Production Quantity</p>
                  <p className="text-lg font-bold">
                    {quantity} {selectedProduct?.unit || ""}
                  </p>
                  <p className="text-sm text-gray-500">Status: Running</p>
                </div>

                {/* Stage Summary */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Current Stage</p>
                  <Badge className="w-fit bg-blue-600">{stage.toUpperCase()}</Badge>
                </div>

                {/* Timeline Summary */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="text-sm font-semibold">
                    {new Date(startDate).toLocaleDateString()} 
                    {endDate ? ` → ${new Date(endDate).toLocaleDateString()}` : " → "}
                  </p>
                </div>
              </div>

              {/* Notes Summary */}
              {notes && (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-sm">{notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard/production/list")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Factory className="h-4 w-4" />
                  Create Production Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add New Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white border-b">
              <CardTitle>Add New Product</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddProductModal(false)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {/* Product Name */}
              <div>
                <Label>Product Name *</Label>
                <Input
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* SKU */}
              <div>
                <Label>SKU (Stock Keeping Unit) *</Label>
                <Input
                  placeholder="Enter unique SKU"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                <Select value={newProduct.categoryId} onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steel">Steel</SelectItem>
                    <SelectItem value="ss">Stainless Steel</SelectItem>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="brass">Brass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Unit */}
              <div>
                <Label>Unit of Measurement</Label>
                <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KG">KG (Kilogram)</SelectItem>
                    <SelectItem value="PCS">PCS (Pieces)</SelectItem>
                    <SelectItem value="MTR">MTR (Meter)</SelectItem>
                    <SelectItem value="BOX">BOX</SelectItem>
                    <SelectItem value="PACK">PACK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cost Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter cost price"
                    value={newProduct.cost || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Sale Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter sale price"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Initial Stock */}
              <div>
                <Label>Initial Stock</Label>
                <Input
                  type="number"
                  placeholder="Enter initial stock quantity"
                  value={newProduct.stock || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAddProductModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddProductionEnhanced;
