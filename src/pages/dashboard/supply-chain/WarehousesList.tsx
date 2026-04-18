import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function WarehousesList() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/supply-chain/warehouses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setWarehouses(data.data);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast({ title: "Error", description: "Failed to fetch warehouses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteWarehouse = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/supply-chain/warehouses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setWarehouses(warehouses.filter(w => w.id !== id));
        toast({ title: "Success", description: "Warehouse deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete warehouse", variant: "destructive" });
    }
  };

  const filteredWarehouses = warehouses.filter(wh =>
    wh.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground mt-2">Manage warehouse locations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Warehouse
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse List</CardTitle>
          <CardDescription>{filteredWarehouses.length} warehouses found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : filteredWarehouses.length === 0 ? (
            <p className="text-center text-muted-foreground">No warehouses found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Capacity</th>
                    <th className="text-left py-3 px-4">Manager</th>
                    <th className="text-left py-3 px-4">Contact</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarehouses.map((wh) => (
                    <tr key={wh.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{wh.name}</td>
                      <td className="py-3 px-4">{wh.location}</td>
                      <td className="py-3 px-4">{wh.capacity?.toLocaleString()} units</td>
                      <td className="py-3 px-4">{wh.manager || "N/A"}</td>
                      <td className="py-3 px-4">{wh.contact || "N/A"}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => deleteWarehouse(wh.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
