import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AddFactory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setLoading(true);
      await apiClient.post("/api/factories", formData);
      navigate("/dashboard/factories");
    } catch (err: any) {
      setError(err.message || "Failed to create factory");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Add New Factory</h1>
          <p className="text-muted-foreground mt-1">Create a new production facility</p>
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
                    placeholder="e.g., Main Production Plant"
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
                    placeholder="e.g., Panvel, Raigad"
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
                    placeholder="e.g., John Doe"
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
                    placeholder="0"
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
                    placeholder="0"
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
                    placeholder="0"
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
                    placeholder="0"
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
                disabled={loading}
                className="gap-2"
              >
                {loading ? "Creating..." : "Create Factory"}
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

export default AddFactory;
