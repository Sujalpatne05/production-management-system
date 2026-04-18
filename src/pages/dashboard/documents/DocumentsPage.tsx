import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage all your documents</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>All documents stored in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
            <Button className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Upload Your First Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
