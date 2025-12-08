import { useState, useEffect } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

interface CheckInRecord {
  date: string;
  inTime: string;
  outTime: string | null;
  note: string;
}

const CheckInOutDialog = () => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<CheckInRecord | null>(null);
  const { toast } = useToast();
  const { attendance, addAttendance, updateAttendance } = useStore();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for today's record
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendance.find(a => a.date === today && a.employeeId === 'current-user');
    if (record) {
      setTodayRecord({
        date: record.date,
        inTime: record.inTime,
        outTime: record.outTime || null,
        note: record.note,
      });
    } else {
      setTodayRecord(null);
    }
  }, [attendance, open]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateDuration = (inTime: string, outTime: string) => {
    const [inH, inM] = inTime.split(':').map(Number);
    const [outH, outM] = outTime.split(':').map(Number);
    const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);
    const dateString = now.toISOString().split('T')[0];

    addAttendance({
      employeeId: 'current-user',
      employeeName: 'Current User',
      date: dateString,
      inTime: timeString,
      outTime: '',
      status: 'present',
      note: note,
    });

    setTodayRecord({
      date: dateString,
      inTime: timeString,
      outTime: null,
      note: note,
    });

    toast({
      title: "Checked In",
      description: `You checked in at ${formatTime(now)}`,
    });
    setNote("");
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);
    const today = now.toISOString().split('T')[0];

    const record = attendance.find(a => a.date === today && a.employeeId === 'current-user');
    if (record) {
      updateAttendance(record.id, {
        outTime: timeString,
        note: note || record.note,
      });

      setTodayRecord(prev => prev ? { ...prev, outTime: timeString } : null);

      toast({
        title: "Checked Out",
        description: `You checked out at ${formatTime(now)}`,
      });
    }
    setNote("");
  };

  const isCheckedIn = todayRecord && todayRecord.inTime && !todayRecord.outTime;
  const isCheckedOut = todayRecord && todayRecord.outTime;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Clock className="w-4 h-4" />
          Check in/Check out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Attendance
          </DialogTitle>
          <DialogDescription>
            {formatDate(currentTime)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Time Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Status Display */}
          {todayRecord && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Check In:</span>
                <span className="font-medium">{todayRecord.inTime}</span>
              </div>
              {todayRecord.outTime && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check Out:</span>
                    <span className="font-medium">{todayRecord.outTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium text-primary">
                      {calculateDuration(todayRecord.inTime, todayRecord.outTime)}
                    </span>
                  </div>
                </>
              )}
              {todayRecord.note && (
                <div className="text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Note: </span>
                  <span>{todayRecord.note}</span>
                </div>
              )}
            </div>
          )}

          {/* Note Input */}
          {!isCheckedOut && (
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note for your attendance..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!todayRecord && (
              <Button onClick={handleCheckIn} className="flex-1 gap-2">
                <LogIn className="w-4 h-4" />
                Check In
              </Button>
            )}
            {isCheckedIn && (
              <Button onClick={handleCheckOut} variant="destructive" className="flex-1 gap-2">
                <LogOut className="w-4 h-4" />
                Check Out
              </Button>
            )}
            {isCheckedOut && (
              <div className="flex-1 text-center py-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  ✓ Attendance completed for today
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInOutDialog;
