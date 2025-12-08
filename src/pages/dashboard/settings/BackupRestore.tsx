import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, RotateCcw, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const BackupRestore = () => {
  const { toast } = useToast();
  const { exportData, importData, resetData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iproduction-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast({ title: "Success", description: "Backup downloaded successfully" });
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importData(data);
          toast({ title: "Success", description: "Data restored successfully" });
        } catch (error) {
          toast({ title: "Error", description: "Invalid backup file", variant: "destructive" });
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
      <h1 className="text-3xl font-bold">Backup & Restore</h1>

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
            <Button onClick={handleBackup} className="w-full">Download Backup</Button>
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
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              Upload Backup File
            </Button>
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
    </div>
  );
};

export default BackupRestore;
