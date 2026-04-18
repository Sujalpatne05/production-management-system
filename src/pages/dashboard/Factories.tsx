import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, Building2, MapPin, Users, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Factory {
  id: string;
  name: string;
  type: "Main Office" | "Branch Office";
  location: string;
  manager?: string;
  employees: number;
  productionLines: number;
  storageCapacity: number;
  storageUsed: number;
  efficiency: number;
  status: string;
  createdAt: string;
}

export default function Factories() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Main Office",
    location: "",
    manager: "",
    employees: "0",
    productionLines: "0",
    storageCapacity: "0",
    efficiency: "0",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFactories();
  }, []);

  const fetchFactories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("🏭 Fetching factories with token:", token ? "✅ Present" : "❌ Missing");
      
      const response = await fetch("http://localhost:5001/api/factories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("📡 API Response status:", response.status);
      const data = await response.json();
      console.log("📦 API Response data:", data);
      
      if (data.success) {
        console.log("✅ Factories fetched:", data.data?.length || 0);
        setFactories(data.data || []);
      } else {
        console.log("❌ API Error:", data.error);
        toast({ title: "Error", description: data.error || "Failed to fetch factories", variant: "destructive" });
      }
    } catch (error) {
      console.error("❌ Error fetching factories:", error);
      toast({ title: "Error", description: "Failed to fetch factories", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFactory = async () => {
    try {
      if (!formData.name || !formData.type || !formData.location) {
        toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/factories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          location: formData.location,
          manager: formData.manager || "Not Assigned",
          employees: parseInt(formData.employees) || 0,
          productionLines: parseInt(formData.productionLines) || 0,
          storageCapacity: parseFloat(formData.storageCapacity) || 0,
          efficiency: parseFloat(formData.efficiency) || 0,
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Factory created successfully" });
        setIsDialogOpen(false);
        resetForm();
        fetchFactories();
      } else {
        toast({ title: "Error", description: data.error || "Failed to create factory", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error creating factory:", error);
      toast({ title: "Error", description: "Failed to create factory", variant: "destructive" });
    }
  };

  const handleUpdateFactory = async () => {
    try {
      if (!editingFactory) return;

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/factories/${editingFactory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          location: formData.location,
          manager: formData.manager || "Not Assigned",
          employees: parseInt(formData.employees) || 0,
          productionLines: parseInt(formData.productionLines) || 0,
          storageCapacity: parseFloat(formData.storageCapacity) || 0,
          efficiency: parseFloat(formData.efficiency) || 0,
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Factory updated successfully" });
        setIsDialogOpen(false);
        resetForm();
        fetchFactories();
      } else {
        toast({ title: "Error", description: data.error || "Failed to update factory", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating factory:", error);
      toast({ title: "Error", description: "Failed to update factory", variant: "destructive" });
    }
  };

  const handleDeleteFactory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this factory?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/factories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Factory deleted successfully" });
        fetchFactories();
      } else {
        toast({ title: "Error", description: data.error || "Failed to delete factory", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting factory:", error);
      toast({ title: "Error", description: "Failed to delete factory", variant: "destructive" });
    }
  };

  const handleEditFactory = (factory: Factory) => {
    setEditingFactory(factory);
    setFormData({
      name: factory.name,
      type: factory.type,
      location: factory.location,
      manager: factory.manager || "",
      employees: factory.employees.toString(),
      productionLines: factory.productionLines.toString(),
      storageCapacity: factory.storageCapacity.toString(),
      efficiency: factory.efficiency.toString(),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Main Office",
      location: "",
      manager: "",
      employees: "0",
      productionLines: "0",
      storageCapacity: "0",
      efficiency: "0",
    });
    setEditingFactory(null);
  };

  const filteredFactories = factories.filter(factory =>
    factory.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factory.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factory.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factories & Production Facilities</h1>
          <p className="text-muted-foreground mt-2">Manage your production locations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Factory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingFactory ? "Edit Factory" : "Create New Factory"}</DialogTitle>
              <DialogDescription>
                {editingFactory ? "Update factory details" : "Add a new production facility"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Factory Name *</label>
                <Input
                  placeholder="e.g., Main Production Plant"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type *</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Office">Main Office</SelectItem>
                    <SelectItem value="Branch Office">Branch Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Location *</label>
                <Input
                  placeholder="e.g., Panvel, Raigad"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Manager</label>
                <Input
                  placeholder="e.g., Rajesh Kumar"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Employees</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Production Lines</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.productionLines}
                    onChange={(e) => setFormData({ ...formData, productionLines: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Storage Capacity</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.storageCapacity}
                    onChange={(e) => setFormData({ ...formData, storageCapacity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Efficiency (%)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingFactory ? handleUpdateFactory : handleAddFactory}
                  className="flex-1"
                >
                  {editingFactory ? "Update" : "Create"} Factory
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Factories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading factories...</p>
          </CardContent>
        </Card>
      ) : filteredFactories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No factories found</p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Factory
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFactories.map((factory) => (
            <Card key={factory.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{factory.name}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {factory.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {factory.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleEditFactory(factory)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleDeleteFactory(factory.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Manager</div>
                      <div className="font-semibold text-sm">{factory.manager || "Not Assigned"}</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="w-3 h-3" />
                        Employees
                      </div>
                      <div className="font-semibold text-sm">{factory.employees || 0}</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Production Lines</div>
                      <div className="font-semibold text-sm">{factory.productionLines || 0}</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Zap className="w-3 h-3" />
                        Efficiency
                      </div>
                      <div className="font-semibold text-sm">{factory.efficiency || 0}%</div>
                    </div>
                  </div>

                  {/* Storage Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Storage Capacity</div>
                      <div className="font-semibold text-sm">{((factory.storageCapacity ?? 0) || 0).toLocaleString()} units</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Storage Used</div>
                      <div className="font-semibold text-sm">{((factory.storageUsed ?? 0) || 0).toLocaleString()} units</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
