import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { apiClient } from "@/services/apiClient";

interface Factory {
  id: string;
  name: string;
  type: "Main Office" | "Branch Office";
  location: string;
  manager: string;
  employees: number;
  productionLines: number;
  storageCapacity: number;
  efficiency: number;
}

const EditFactory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Factory | null>(null);

  useEffect(() => {
    fetchFactory();
  }, [id]);

  const fetchFactory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/factories/${id}`);
      setFormData(response.data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch factory");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData(prev => ({
        ...prev!,
        [name]: name === "employees" || name === "productionLines" ? parseInt(value) : 
                name === "storageCapacity" || name === "efficiency" ? parseFloat(value) : value
      }));
    }
  };

  const handleTypeChange = (value: string) => {
    if (formData) {
      setFormData(prev => ({
        ...prev!,
        type: value as "Main Office" | "Branch Office"
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Factory name is required");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required");
      return;
    }

    try {
      setSaving(true);
      await apiClient.put(`/api/factories/${id}`, formData);
      navigate("/dashboard/factories");
    } catch (err: any) {
      setError(err.message || "Failed to update factory");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading factory...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="space-y-6">
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">Factory not found</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/dashboard/factories")}>Back to Factories</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/factories")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Factory</h1>
          <p className="text-muted-foreground mt-1">{formData.name}</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Factory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Factory Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Office">Main Office</SelectItem>
                      <SelectItem value="Branch Office">Branch Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Manager Name</Label>
                  <Input
                    id="manager"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Capacity Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Capacity & Resources</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    name="employees"
                    type="number"
                    value={formData.employees}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productionLines">Production Lines</Label>
                  <Input
                    id="productionLines"
                    name="productionLines"
                    type="number"
                    value={formData.productionLines}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storageCapacity">Storage Capacity (sq ft)</Label>
                  <Input
                    id="storageCapacity"
                    name="storageCapacity"
                    type="number"
                    value={formData.storageCapacity}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efficiency">Efficiency (%)</Label>
                  <Input
                    id="efficiency"
                    name="efficiency"
                    type="number"
                    value={formData.efficiency}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="gap-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/factories")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditFactory;
