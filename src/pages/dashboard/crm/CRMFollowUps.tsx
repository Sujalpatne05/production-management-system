import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Edit2, Trash2, CheckCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AddFollowUpDialog from "@/components/AddFollowUpDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FollowUp {
  id: string;
  leadName: string;
  followUpDate: string;
  followUpTime: string;
  notes: string;
  status: "Scheduled" | "Completed" | "Pending";
  type: "Call" | "Email" | "Meeting" | "Demo";
}

const CRMFollowUps = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/crm/follow-ups");
        if (res.ok) {
          const data = await res.json();
          setFollowUps(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch follow-ups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, []);

  const filteredFollowUps = followUps.filter((fu) =>
    fu.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fu.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Call: "bg-purple-100 text-purple-800",
      Email: "bg-cyan-100 text-cyan-800",
      Meeting: "bg-green-100 text-green-800",
      Demo: "bg-orange-100 text-orange-800",
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  const upcomingFollowUps = followUps.filter((f) => f.status === "Scheduled").length;
  const completedFollowUps = followUps.filter((f) => f.status === "Completed").length;

  const handleAddFollowUp = async (followUpData: Omit<FollowUp, "id">) => {
    try {
      const res = await fetch("http://localhost:3000/api/crm/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(followUpData),
      });
      if (!res.ok) throw new Error("Failed to create follow-up");
      const newFollowUp = await res.json();
      setFollowUps([newFollowUp, ...followUps]);
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("Could not add follow-up");
    }
  };

  const handleEditFollowUp = async (followUpData: Omit<FollowUp, "id">) => {
    if (!editingFollowUp) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/crm/follow-ups/${editingFollowUp.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(followUpData),
        }
      );
      if (!res.ok) throw new Error("Failed to update follow-up");
      const updated = await res.json();
      setFollowUps(followUps.map((f) => (f.id === editingFollowUp.id ? updated : f)));
      setEditingFollowUp(null);
    } catch (err) {
      console.error(err);
      alert("Could not update follow-up");
    }
  };

  const handleDeleteFollowUp = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/crm/follow-ups/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete follow-up");
      setFollowUps(followUps.filter((f) => f.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      alert("Could not delete follow-up");
    }
  };

  const handleEditClick = (followUp: FollowUp) => {
    setEditingFollowUp(followUp);
    setDialogOpen(true);
  };

  const handleMarkComplete = (id: string) => {
    setFollowUps(
      followUps.map((f) => (f.id === id ? { ...f, status: "Completed" } : f))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM - Follow-ups"
        subtitle="Track and manage your customer follow-up activities"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Follow-ups</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{followUps.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Upcoming</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{upcomingFollowUps}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{completedFollowUps}</p>
          </CardContent>
        </Card>
      </div>

      {/* Follow-ups Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Follow-up Schedule</CardTitle>
          <Button
            className="gap-2"
            onClick={() => {
              setEditingFollowUp(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> Add Follow-up
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search follow-ups by lead name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Lead Name</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Notes</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFollowUps.length > 0 ? (
                  filteredFollowUps.map((followUp) => (
                    <TableRow key={followUp.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{followUp.leadName}</TableCell>
                      <TableCell>{getTypeBadge(followUp.type)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {followUp.followUpDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {followUp.followUpTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{followUp.notes}</TableCell>
                      <TableCell>{getStatusBadge(followUp.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {followUp.status === "Scheduled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 gap-1 text-green-600"
                              onClick={() => handleMarkComplete(followUp.id)}
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(followUp)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => setDeleteConfirm(followUp.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No follow-ups found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <AddFollowUpDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editingFollowUp ? handleEditFollowUp : handleAddFollowUp}
        editingFollowUp={editingFollowUp}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Follow-up</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this follow-up? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteConfirm && handleDeleteFollowUp(deleteConfirm)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CRMFollowUps;
