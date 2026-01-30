import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddAttendance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { employees, addAttendance } = useStore();
  const [form, setForm] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    inTime: "09:00",
    outTime: "17:00",
    status: "present" as "present" | "absent" | "late" | "half-day",
    note: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId) {
      toast({ title: "Error", description: "Please select an employee", variant: "destructive" });
      return;
    }

    const employee = employees.find(e => e.id === form.employeeId);
    addAttendance({
      employeeId: form.employeeId,
      employeeName: employee?.name || "",
      date: form.date,
      inTime: form.inTime,
      outTime: form.outTime,
      status: form.status,
      note: form.note,
    });

    toast({ title: "Success", description: "Attendance recorded successfully" });
    navigate("/dashboard/attendance/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Attendance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Employee *</Label>
                <Select value={form.employeeId} onValueChange={(v) => setForm({ ...form, employeeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.filter(e => e.status === "active").map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>In Time</Label>
                <Input type="time" value={form.inTime} onChange={(e) => setForm({ ...form, inTime: e.target.value })} />
              </div>
              <div>
                <Label>Out Time</Label>
                <Input type="time" value={form.outTime} onChange={(e) => setForm({ ...form, outTime: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: "present" | "absent" | "late" | "half-day") => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Note</Label>
              <Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Additional notes" />
            </div>
            <Button type="submit" className="w-full">Save Attendance</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAttendance;
