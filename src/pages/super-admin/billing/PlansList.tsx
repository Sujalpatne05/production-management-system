import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from "@/config/apiConfig";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  maxUsers: number;
  maxStorage: number;
  features: string[];
  status: string;
  createdAt: string;
}

export function PlansList() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPlans(plans.filter(p => p.id !== id));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to delete plan");
    }
  };

  if (loading) return <div className="p-6">Loading plans...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div>
                <p className="text-3xl font-bold">${plan.price}</p>
                <p className="text-sm text-gray-600">per {plan.billingCycle}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm"><strong>Max Users:</strong> {plan.maxUsers}</p>
                <p className="text-sm"><strong>Max Storage:</strong> {plan.maxStorage} MB</p>
              </div>

              {plan.features && plan.features.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Features:</p>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-600">• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
