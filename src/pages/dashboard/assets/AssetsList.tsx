import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/assets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAssets(data.data);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({ title: "Error", description: "Failed to fetch assets", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/assets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAssets(assets.filter(a => a.id !== id));
        toast({ title: "Success", description: "Asset deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete asset", variant: "destructive" });
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground mt-2">Manage company assets</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Asset
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset List</CardTitle>
          <CardDescription>{filteredAssets.length} assets found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : filteredAssets.length === 0 ? (
            <p className="text-center text-muted-foreground">No assets found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Purchase Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{asset.name}</td>
                      <td className="py-3 px-4">{asset.category}</td>
                      <td className="py-3 px-4">{asset.location}</td>
                      <td className="py-3 px-4">₹{asset.purchasePrice?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => deleteAsset(asset.id)}
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
