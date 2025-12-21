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
import { useStore } from "@/store/useStore";
import { ArrowLeft, Save, Upload } from "lucide-react";

const whiteLabelSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Valid hex color required"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Valid hex color required"),
  logoUrl: z.string().url("Valid URL required").optional().or(z.literal("")),
  faviconUrl: z.string().url("Valid URL required").optional().or(z.literal("")),
  footerText: z.string().optional(),
});

type WhiteLabelFormValues = z.infer<typeof whiteLabelSchema>;

const WhiteLabel = () => {
  const navigate = useNavigate();
  const { companyProfile, updateCompanyProfile } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<WhiteLabelFormValues>({
    resolver: zodResolver(whiteLabelSchema),
    defaultValues: {
      appName: companyProfile.name || "",
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      logoUrl: companyProfile.logo || "",
      faviconUrl: "",
      footerText: "",
    },
  });

  const onSubmit = async (data: WhiteLabelFormValues) => {
    setIsSaving(true);
    try {
      updateCompanyProfile({
        name: data.appName,
        logo: data.logoUrl || "",
      });
      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 500);
    } catch (error) {
      console.error("Error saving white label settings:", error);
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
        <h1 className="text-3xl font-bold">White Label Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customize Your Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* App Name */}
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My ERP System" {...field} />
                      </FormControl>
                      <FormDescription>Name displayed in the application</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Primary Color */}
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color *</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="w-20 h-10" />
                        </FormControl>
                        <FormControl>
                          <Input placeholder="#3b82f6" {...field} className="flex-1" />
                        </FormControl>
                      </div>
                      <FormDescription>Hex color code for primary theme</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Secondary Color */}
                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color *</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="w-20 h-10" />
                        </FormControl>
                        <FormControl>
                          <Input placeholder="#8b5cf6" {...field} className="flex-1" />
                        </FormControl>
                      </div>
                      <FormDescription>Hex color code for secondary theme</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Logo URL */}
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormDescription>URL to your company logo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Favicon URL */}
                <FormField
                  control={form.control}
                  name="faviconUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/favicon.ico" {...field} />
                      </FormControl>
                      <FormDescription>URL to your favicon icon</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Footer Text */}
                <FormField
                  control={form.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Footer Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="© 2024 My Company. All rights reserved."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Text displayed in the footer</FormDescription>
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
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: form.watch("primaryColor") + "20", borderColor: form.watch("primaryColor") }}>
              <h3 className="text-2xl font-bold mb-2" style={{ color: form.watch("primaryColor") }}>
                {form.watch("appName")}
              </h3>
              <p className="text-sm text-muted-foreground">Application name preview</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhiteLabel;
