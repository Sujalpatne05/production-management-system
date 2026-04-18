import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Edit2, Trash2, Building2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
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
  storageUsed: number;
  efficiency: number;
  status: string;
}

const FactoriesList = () => {
  const navigate = useNavigate();
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchFactories();
    fetchSummary();
  }, []);

  const fetchFactories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/factories");
      setFactories(response.data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch factories");
      setFactories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await apiClient.get("/api/factories/company/summary");
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this factory?")) return;

    try {
      await apiClient.delete(`/api/factories/${id}`);
      setFactories(factories.filter(f => f.id !== id));
      fetchSummary();
    } catch (err: any) {
      setError(err.message || "Failed to delete factory");
    }
  };

  const filteredFactories = factories.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading factories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Factories & Production Facilities</h1>
          <p className="text-muted-foreground mt-1">Manage your production locations</p>
        </div>
        <Button onClick={() => navigate("/dashboard/factories/add")} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Factory
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Factories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalFactories}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.mainOffices} Main • {summary.branchOffices} Branch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all factories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Production Lines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalProductionLines}</div>
              <p className="text-xs text-muted-foreground mt-1">Total capacity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.averageEfficiency}%</div>
              <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Factories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Factories ({filteredFactories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFactories.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No factories found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Lines</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFactories.map((factory) => (
                    <TableRow key={factory.id}>
                      <TableCell className="font-medium">{factory.name}</TableCell>
                      <TableCell>
                        <Badge variant={factory.type === "Main Office" ? "default" : "secondary"}>
                          {factory.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{factory.location}</TableCell>
                      <TableCell>{factory.manager}</TableCell>
                      <TableCell>{factory.employees}</TableCell>
                      <TableCell>{factory.productionLines}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${factory.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{factory.efficiency}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={factory.status === "active" ? "default" : "destructive"}>
                          {factory.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/factories/edit/${factory.id}`)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(factory.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FactoriesList;
