import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FollowUp {
  id: string;
  leadName: string;
  followUpDate: string;
  followUpTime: string;
  notes: string;
  status: "Scheduled" | "Completed" | "Pending";
  type: "Call" | "Email" | "Meeting" | "Demo";
}

interface AddFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (followUp: Omit<FollowUp, "id">) => void;
  editingFollowUp?: FollowUp | null;
}

const AddFollowUpDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editingFollowUp,
}: AddFollowUpDialogProps) => {
  const [formData, setFormData] = useState<Omit<FollowUp, "id">>({
    leadName: editingFollowUp?.leadName || "",
    followUpDate: editingFollowUp?.followUpDate || "",
    followUpTime: editingFollowUp?.followUpTime || "",
    notes: editingFollowUp?.notes || "",
    status: editingFollowUp?.status || "Scheduled",
    type: editingFollowUp?.type || "Call",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.leadName ||
      !formData.followUpDate ||
      !formData.followUpTime ||
      !formData.notes
    ) {
      alert("Please fill all fields");
      return;
    }
    onSubmit(formData);
    setFormData({
      leadName: "",
      followUpDate: "",
      followUpTime: "",
      notes: "",
      status: "Scheduled",
      type: "Call",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingFollowUp ? "Edit Follow-up" : "Add New Follow-up"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leadName" className="text-right">
              Lead Name
            </Label>
            <Input
              id="leadName"
              value={formData.leadName}
              onChange={(e) => handleChange("leadName", e.target.value)}
              className="col-span-3"
              placeholder="Lead name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="followUpDate" className="text-right">
              Date
            </Label>
            <Input
              id="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={(e) => handleChange("followUpDate", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="followUpTime" className="text-right">
              Time
            </Label>
            <Input
              id="followUpTime"
              type="time"
              value={formData.followUpTime}
              onChange={(e) => handleChange("followUpTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={formData.type} onValueChange={(val) => handleChange("type", val)}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Demo">Demo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(val) => handleChange("status", val)}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="col-span-3"
              placeholder="Follow-up notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {editingFollowUp ? "Update Follow-up" : "Add Follow-up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFollowUpDialog;
