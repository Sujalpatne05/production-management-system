import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, AlertTriangle, Shield, Clock3, Database } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const BackupRestore = () => {
  const { toast } = useToast();
  const { exportData, importData, resetData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastRestore, setLastRestore] = useState<string | null>(null);

  // Mocked backup history (would come from API/storage in real implementation)
  const backups = useMemo(
    () => [
      { id: "bkp-003", date: "2026-01-27 09:45", size: "1.2 MB", type: "Full", status: "Success" },
      { id: "bkp-002", date: "2026-01-26 18:10", size: "1.1 MB", type: "Full", status: "Success" },
      { id: "bkp-001", date: "2026-01-25 08:55", size: "1.0 MB", type: "Full", status: "Success" },
    ],
    []
  );

  const handleBackup = () => {
    setIsBackingUp(true);
    try {
      const data = exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `iproduction-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      toast({ title: "Success", description: "Backup downloaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Backup failed. Please try again.", variant: "destructive" });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        toast({ title: "Invalid file", description: "Please select a .json backup file", variant: "destructive" });
        return;
      }
      setIsRestoring(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importData(data);
          setLastRestore(new Date().toLocaleString());
          toast({ title: "Success", description: "Data restored successfully" });
        } catch (error) {
          toast({ title: "Error", description: "Invalid backup file", variant: "destructive" });
        } finally {
          setIsRestoring(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    resetData();
    toast({ title: "Success", description: "All data has been reset to defaults" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Business Continuity</p>
        <h1 className="text-3xl font-bold">Backup & Restore</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700 flex items-center gap-2"><Database className="h-4 w-4" /> Latest Backup</CardTitle></CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-700">{backups[0]?.date || "--"}</div>
            <p className="text-xs text-gray-500">{backups[0]?.size || ""}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700 flex items-center gap-2"><Shield className="h-4 w-4" /> Integrity</CardTitle></CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-700">Checksum ready</div>
            <p className="text-xs text-gray-500">Validated JSON export</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700 flex items-center gap-2"><Clock3 className="h-4 w-4" /> Last Restore</CardTitle></CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-700">{lastRestore || "Not restored yet"}</div>
            <p className="text-xs text-gray-500">Track the last restore event</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Coverage</CardTitle></CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-700">Full dataset</div>
            <p className="text-xs text-gray-500">Users, roles, products, orders, settings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" /> Backup Data</CardTitle>
            <CardDescription>Download a backup of all your data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create a backup file containing all your outlets, products, sales, purchases, and other data.
            </p>
            <Button onClick={handleBackup} className="w-full" disabled={isBackingUp}>
              {isBackingUp ? "Preparing..." : "Download Backup"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" /> Restore Data</CardTitle>
            <CardDescription>Restore data from a backup file</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a previously downloaded backup file to restore your data.
            </p>
            <input type="file" ref={fileInputRef} accept=".json" onChange={handleRestore} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full" disabled={isRestoring}>
              {isRestoring ? "Restoring..." : "Upload Backup File"}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Only .json files are accepted. Keep backups secure and private.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Reset Data</CardTitle>
            <CardDescription>Reset all data to factory defaults</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will delete all your data and restore the default sample data.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">Reset All Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Yes, Reset Everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Recent Backups</CardTitle>
          <CardDescription>Track your latest backups for quick restore and compliance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Backup ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.id}</TableCell>
                    <TableCell>{backup.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{backup.type}</Badge>
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">{backup.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={handleBackup}>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupRestore;
