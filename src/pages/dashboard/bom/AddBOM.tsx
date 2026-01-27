import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save } from 'lucide-react';

export function AddBOM() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    description: '',
    notes: '',
  });
  const [components, setComponents] = useState<any[]>([]);
  const [newComponent, setNewComponent] = useState({
    productId: '',
    rawMaterialId: '',
    quantity: '',
    uom: 'pcs',
    wasteFactor: '0',
  });

  const handleAddComponent = () => {
    if (!newComponent.quantity) return;
    
    setComponents([
      ...components,
      {
        ...newComponent,
        id: Math.random(),
      },
    ]);
    setNewComponent({ productId: '', rawMaterialId: '', quantity: '', uom: 'pcs', wasteFactor: '0' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log('Creating BOM:', { ...formData, components });
    navigate('/dashboard/bom');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Bill of Materials</h2>
        <p className="text-gray-600">Define components required for a product</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>BOM Information</CardTitle>
            <CardDescription>Basic details about the BOM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Product</label>
                <Input
                  placeholder="Select Product"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">BOM Name</label>
                <Input
                  placeholder="e.g., Standard Assembly v1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the BOM..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Components</CardTitle>
              <CardDescription>Add materials and sub-assemblies</CardDescription>
            </div>
            <Button onClick={handleAddComponent} size="sm" variant="outline" className="gap-1">
              <Plus className="w-4 h-4" />
              Add Component
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-6 gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
              <Input placeholder="Product/Material" value={newComponent.productId} onChange={(e) => setNewComponent({ ...newComponent, productId: e.target.value })} />
              <Input placeholder="Qty" type="number" value={newComponent.quantity} onChange={(e) => setNewComponent({ ...newComponent, quantity: e.target.value })} />
              <Select value={newComponent.uom} onValueChange={(v) => setNewComponent({ ...newComponent, uom: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="UOM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">PCS</SelectItem>
                  <SelectItem value="kg">KG</SelectItem>
                  <SelectItem value="ltr">LTR</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Waste %" type="number" value={newComponent.wasteFactor} onChange={(e) => setNewComponent({ ...newComponent, wasteFactor: e.target.value })} />
              <Button onClick={handleAddComponent} size="sm">Add</Button>
            </div>

            {components.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Waste %</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>{component.productId || component.rawMaterialId}</TableCell>
                      <TableCell>{component.quantity}</TableCell>
                      <TableCell>{component.uom}</TableCell>
                      <TableCell>{component.wasteFactor}%</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setComponents(components.filter((c) => c.id !== component.id))}
                          className="gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Create BOM
          </Button>
          <Button variant="outline" type="button" onClick={() => navigate('/dashboard/bom')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
