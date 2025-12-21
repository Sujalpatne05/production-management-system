import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStore } from "@/store/useStore";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Factory } from "lucide-react";
import { useEffect } from "react";

const sectorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z.enum(["active", "inactive"]),
});

type SectorFormValues = z.infer<typeof sectorSchema>;

export default function EditSector() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { sectors, updateSector } = useStore();
  
  const sector = sectors.find((s) => s.id === id);

  const form = useForm<SectorFormValues>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (sector) {
      form.reset({
        name: sector.name,
        description: sector.description,
        status: sector.status,
      });
    }
  }, [sector, form]);

  if (!sector) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Sector not found</p>
        <Button onClick={() => navigate("/dashboard/reports/sectors")} className="mt-4">
          Back to Sectors
        </Button>
      </div>
    );
  }

  const onSubmit = (data: SectorFormValues) => {
    if (id) {
      updateSector(id, data);
      toast({
        title: "Sector Updated",
        description: `Sector "${data.name}" has been updated successfully.`,
      });
      navigate("/dashboard/reports/sectors");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/reports/sectors")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Sector</h1>
          <p className="text-muted-foreground">Update sector information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5" />
            Sector Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Design & Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the sector's purpose and activities"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit">Update Sector</Button>
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard/reports/sectors")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
