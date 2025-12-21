import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const outletSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters").max(20, "Phone must be less than 20 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).optional(),
  address: z.string().max(500, "Address must be less than 500 characters").optional().or(z.literal("")),
});

const AddOutlet = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof outletSchema>>({
    resolver: zodResolver(outletSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      status: undefined,
      address: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof outletSchema>) => {
    toast({
      title: "Factory Added",
      description: "The factory has been added successfully.",
    });
    navigate("/dashboard/factories/list");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Factory</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Factory Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Factory Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Factory Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Factory Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Factory Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Factory Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Factory Email" {...field} />
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
                      <FormLabel>Factory Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
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
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factory Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Factory Address" rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOutlet;
