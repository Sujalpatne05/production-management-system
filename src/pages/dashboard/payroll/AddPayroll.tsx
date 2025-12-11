import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddPayroll = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { employees, addPayroll } = useStore();
  const [form, setForm] = useState({
    employeeId: "",
    month: new Date().toISOString().slice(0, 7),
    basicSalary: "",
    bonus: "0",
    deductions: "0",
  });

  const selectedEmployee = employees.find(e => e.id === form.employeeId);
  const netSalary = (Number(form.basicSalary) || 0) + (Number(form.bonus) || 0) - (Number(form.deductions) || 0);

  const handleEmployeeChange = (id: string) => {
    const employee = employees.find(e => e.id === id);
    setForm({ 
      ...form, 
      employeeId: id, 
      basicSalary: employee?.salary.toString() || "" 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId || !form.basicSalary) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    addPayroll({
      employeeId: form.employeeId,
      employeeName: selectedEmployee?.name || "",
      month: form.month,
      basicSalary: Number(form.basicSalary),
      bonus: Number(form.bonus),
      deductions: Number(form.deductions),
      netSalary,
      status: "pending",
    });

    toast({ title: "Success", description: "Payroll created successfully" });
    navigate("/dashboard/payroll/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Payroll</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Employee *</Label>
                <Select value={form.employeeId} onValueChange={handleEmployeeChange}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.filter(e => e.status === "active").map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name} - {e.position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Month</Label>
                <Input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Basic Salary *</Label>
                <Input type="number" min="0" step="0.01" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} />
              </div>
              <div>
                <Label>Bonus</Label>
                <Input type="number" min="0" step="0.01" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
              </div>
              <div>
                <Label>Deductions</Label>
                <Input type="number" min="0" step="0.01" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-semibold">Net Salary: ₹{netSalary.toFixed(2)}</p>
            </div>
            <Button type="submit" className="w-full">Create Payroll</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPayroll;
