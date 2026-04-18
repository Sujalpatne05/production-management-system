import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/hr/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({ title: "Error", description: "Failed to fetch employees", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/hr/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(employees.filter(e => e.id !== id));
        toast({ title: "Success", description: "Employee deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete employee", variant: "destructive" });
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-2">Manage employee records</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>{filteredEmployees.length} employees found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : filteredEmployees.length === 0 ? (
            <p className="text-center text-muted-foreground">No employees found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-left py-3 px-4">Salary</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{emp.name}</td>
                      <td className="py-3 px-4">{emp.email}</td>
                      <td className="py-3 px-4">{emp.department}</td>
                      <td className="py-3 px-4">{emp.position}</td>
                      <td className="py-3 px-4">₹{emp.salary?.toLocaleString()}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => deleteEmployee(emp.id)}
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
