import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, DollarSign, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function HRDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
        <p className="text-muted-foreground mt-2">Manage employees, leaves, attendance, and payroll</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pending approvals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Today's attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Processed this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common HR operations</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Request Leave
          </Button>
          <Button variant="outline" className="gap-2">
            <Clock className="w-4 h-4" />
            Mark Attendance
          </Button>
          <Button variant="outline" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Process Payroll
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Employees</CardTitle>
          <CardDescription>Latest employee records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-muted-foreground">No employees found</p>
          ) : (
            <div className="space-y-3">
              {employees.slice(0, 5).map((emp) => (
                <div key={emp.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">{emp.position}</p>
                  </div>
                  <p className="text-sm font-medium">{emp.department}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
