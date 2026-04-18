import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ShieldCheck } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance</h1>
          <p className="text-muted-foreground">Manage compliance rules and policies</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Rules</CardTitle>
          <CardDescription>All compliance and regulatory rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No compliance rules created yet</p>
            <Button className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Create First Rule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
