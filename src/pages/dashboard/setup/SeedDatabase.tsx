import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/services/apiClient";
import { CheckCircle2, Database, ArrowRight, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const SeedDatabase = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/seed/tenant-master-data", {});
      console.log("Seed response:", response);
      
      setSeeded(true);
      toast({
        title: "Database Seeded Successfully!",
        description: "Default customers, suppliers, products, and raw materials have been created.",
      });
    } catch (error: any) {
      console.error("Seed error:", error);
      toast({
        title: "Seed Failed",
        description: error?.message || "Failed to seed database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Database Setup" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed Master Data
          </CardTitle>
          <CardDescription>
            Populate your database with default master data to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This will create default data for your tenant:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>2 Customers (Walk-in Customer, Retail Customer)</li>
                <li>1 Supplier (Global Supplies Inc)</li>
                <li>2 Products (MS ANGLE 50x50x5 MM, Steel Rod 12mm)</li>
                <li>2 Raw Materials (Cotton Thread, ABS Plastic Pellets)</li>
                <li>Stock entries (100 units each)</li>
              </ul>
            </AlertDescription>
          </Alert>

          {seeded && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Master data has been seeded successfully! You can now:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Create purchase orders</li>
                  <li>Create sales invoices</li>
                  <li>Manage inventory</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleSeed}
              disabled={loading || seeded}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Seeding Database...
                </>
              ) : seeded ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Already Seeded
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Seed Database Now
                </>
              )}
            </Button>

            {seeded && (
              <Button
                variant="outline"
                onClick={() => window.location.href = "/dashboard/purchases/add"}
                className="flex items-center gap-2"
              >
                Create Purchase Order
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeedDatabase;
