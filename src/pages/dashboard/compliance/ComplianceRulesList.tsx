import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ComplianceRulesList() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/compliance/rules", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRules(data.data);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
      toast({ title: "Error", description: "Failed to fetch compliance rules", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/compliance/rules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRules(rules.filter(r => r.id !== id));
        toast({ title: "Success", description: "Rule deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete rule", variant: "destructive" });
    }
  };

  const filteredRules = rules.filter(rule =>
    rule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Rules</h1>
          <p className="text-muted-foreground mt-2">Manage compliance and regulatory rules</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Rules</CardTitle>
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
          <CardTitle>Compliance Rules</CardTitle>
          <CardDescription>{filteredRules.length} rules found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : filteredRules.length === 0 ? (
            <p className="text-center text-muted-foreground">No compliance rules found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Requirement</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{rule.name}</td>
                      <td className="py-3 px-4">{rule.category}</td>
                      <td className="py-3 px-4 text-sm">{rule.requirement?.substring(0, 50)}...</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(rule.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => deleteRule(rule.id)}
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
