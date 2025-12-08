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
import { ArrowLeft, Save, Mail } from "lucide-react";

const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, "SMTP server is required"),
  smtpPort: z.coerce.number().min(1).max(65535, "Valid port required"),
  senderEmail: z.string().email("Valid email required"),
  senderName: z.string().min(1, "Sender name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  encryptionType: z.enum(["none", "ssl", "tls"]),
  replyTo: z.string().email("Valid email required"),
});

type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;

const EmailSettings = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "smtp.gmail.com",
      smtpPort: 587,
      senderEmail: "",
      senderName: "",
      username: "",
      password: "",
      encryptionType: "tls",
      replyTo: "",
    },
  });

  const onSubmit = async (data: EmailSettingsFormValues) => {
    setIsSaving(true);
    try {
      console.log("Email settings saved:", data);
      setTimeout(() => {
        navigate("/dashboard/settings");
      }, 500);
    } catch (error) {
      console.error("Error saving email settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = () => {
    setTestEmailSent(true);
    setTimeout(() => setTestEmailSent(false), 3000);
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
        <h1 className="text-3xl font-bold">Email Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Email Service</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SMTP Server */}
                <FormField
                  control={form.control}
                  name="smtpServer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Server *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., smtp.gmail.com" {...field} />
                      </FormControl>
                      <FormDescription>Your email provider's SMTP server</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SMTP Port */}
                <FormField
                  control={form.control}
                  name="smtpPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="587" {...field} />
                      </FormControl>
                      <FormDescription>Common ports: 587 (TLS), 465 (SSL), 25</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sender Email */}
                <FormField
                  control={form.control}
                  name="senderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="noreply@example.com" {...field} />
                      </FormControl>
                      <FormDescription>Email address emails will be sent from</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sender Name */}
                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My Company" {...field} />
                      </FormControl>
                      <FormDescription>Display name for sender</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email username" {...field} />
                      </FormControl>
                      <FormDescription>SMTP authentication username</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your password" {...field} />
                      </FormControl>
                      <FormDescription>SMTP authentication password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Encryption Type */}
                <FormField
                  control={form.control}
                  name="encryptionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Encryption Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Encryption protocol for connection</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reply To */}
                <FormField
                  control={form.control}
                  name="replyTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reply-To Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="support@example.com" {...field} />
                      </FormControl>
                      <FormDescription>Email address for replies</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestEmail}
                  className="gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {testEmailSent ? "Test Email Sent!" : "Send Test Email"}
                </Button>
                <div className="flex gap-4">
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📧 Gmail Configuration</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>SMTP Server: smtp.gmail.com</li>
                <li>Port: 587 (TLS) or 465 (SSL)</li>
                <li>Use your Gmail address and app password</li>
                <li>Enable "Less secure app access" if needed</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">🔒 Security Tips</h3>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Always use encrypted connections (SSL/TLS)</li>
                <li>Use app-specific passwords for Gmail</li>
                <li>Keep your SMTP password confidential</li>
                <li>Test the configuration before going live</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettings;
