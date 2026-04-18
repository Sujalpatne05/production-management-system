import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Wrench, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AssetsDashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const totalValue = assets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
        <p className="text-muted-foreground mt-2">Track and manage company assets and maintenance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">Active assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Scheduled maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Asset Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total asset value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Asset management operations</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Asset
          </Button>
          <Button variant="outline" className="gap-2">
            <Wrench className="w-4 h-4" />
            Schedule Maintenance
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assets</CardTitle>
          <CardDescription>Latest asset records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : assets.length === 0 ? (
            <p className="text-center text-muted-foreground">No assets found</p>
          ) : (
            <div className="space-y-3">
              {assets.slice(0, 5).map((asset) => (
                <div key={asset.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-muted-foreground">{asset.category}</p>
                  </div>
                  <p className="text-sm font-medium">₹{asset.purchasePrice?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
