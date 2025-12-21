import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AttendanceList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { attendance, updateAttendance, deleteAttendance } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAttendance, setEditingAttendance] = useState<any>(null);
  const [editForm, setEditForm] = useState({ inTime: "", outTime: "", status: "present" as "present" | "absent" | "late" | "half-day", note: "" });

  const filteredAttendance = attendance.filter((a) =>
    a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.date.includes(searchQuery)
  );

  const handleEdit = (att: any) => {
    setEditingAttendance(att);
    setEditForm({ inTime: att.inTime, outTime: att.outTime, status: att.status, note: att.note });
  };

  const handleSaveEdit = () => {
    if (editingAttendance) {
      updateAttendance(editingAttendance.id, editForm);
      toast({ title: "Success", description: "Attendance updated successfully" });
      setEditingAttendance(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteAttendance(id);
    toast({ title: "Success", description: "Attendance deleted successfully" });
  };

  const handleExport = () => {
    const csv = [
      ["Employee", "Date", "In Time", "Out Time", "Status", "Note"],
      ...filteredAttendance.map(a => [a.employeeName, a.date, a.inTime, a.outTime, a.status, a.note])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "present": return "default";
      case "absent": return "destructive";
      case "late": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Attendance List</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/attendance/add")} className="gap-2">
            <Plus className="w-4 h-4" /> Add Attendance
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Attendance Records ({filteredAttendance.length})</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>In Time</TableHead>
                  <TableHead>Out Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell className="font-medium">{att.employeeName}</TableCell>
                      <TableCell>{att.date}</TableCell>
                      <TableCell>{att.inTime}</TableCell>
                      <TableCell>{att.outTime}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(att.status)}>{att.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{att.note}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(att)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Attendance</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(att.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No attendance records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingAttendance} onOpenChange={() => setEditingAttendance(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>In Time</Label>
                <Input type="time" value={editForm.inTime} onChange={(e) => setEditForm({ ...editForm, inTime: e.target.value })} />
              </div>
              <div>
                <Label>Out Time</Label>
                <Input type="time" value={editForm.outTime} onChange={(e) => setEditForm({ ...editForm, outTime: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v: "present" | "absent" | "late" | "half-day") => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Note</Label>
              <Textarea value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} />
            </div>
            <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceList;
