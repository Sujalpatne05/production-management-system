import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Save } from "lucide-react";

const taxSettingsSchema = z.object({
  defaultTaxRate: z.coerce.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  taxName: z.string().min(1, "Tax name is required"),
  taxNumber: z.string().min(1, "Tax number is required"),
  taxType: z.enum(["percentage", "fixed"]),
  applicationLevel: z.enum(["item", "invoice", "both"]),
  description: z.string().optional(),
});

type TaxSettingsFormValues = z.infer<typeof taxSettingsSchema>;

const TaxSettings = () => {
  const navigate = useNavigate();
  const { companyProfile, updateCompanyProfile } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<TaxSettingsFormValues>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: {
      defaultTaxRate: 0,
      taxName: "VAT",
      taxNumber: companyProfile.taxNumber || "",
      taxType: "percentage",
      applicationLevel: "item",
      description: "",
    },
  });

  const onSubmit = async (data: TaxSettingsFormValues) => {
    setIsSaving(true);
    try {
      updateCompanyProfile({
        taxNumber: data.taxNumber,
      });
      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 500);
    } catch (error) {
      console.error("Error saving tax settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/settings")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Tax Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Tax Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tax Name */}
                <FormField
                  control={form.control}
                  name="taxName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., VAT, GST, Sales Tax" {...field} />
                      </FormControl>
                      <FormDescription>Name of the tax</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tax Number */}
                <FormField
                  control={form.control}
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Registration Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TAX-123456" {...field} />
                      </FormControl>
                      <FormDescription>Your tax registration number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tax Type */}
                <FormField
                  control={form.control}
                  name="taxType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Default Tax Rate */}
                <FormField
                  control={form.control}
                  name="defaultTaxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Tax Rate *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Default tax rate for invoices</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Application Level */}
                <FormField
                  control={form.control}
                  name="applicationLevel"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Tax Application Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="item">Applied on Item Level</SelectItem>
                          <SelectItem value="invoice">Applied on Invoice Level</SelectItem>
                          <SelectItem value="both">Applied on Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Where the tax should be applied</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional tax information"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/settings")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Tax Configuration Tips</h3>
              <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                <li>Set the default tax rate that applies to all items</li>
                <li>Choose whether tax is calculated as percentage or fixed amount</li>
                <li>Select the application level for tax calculation</li>
                <li>Ensure your tax registration number is accurate for compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSettings;
