import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const securitySchema = z.object({
  question: z.string().min(1, "Please select a security question"),
  answer: z.string().min(2, "Answer must be at least 2 characters").max(100, "Answer must be less than 100 characters"),
});

const SecurityQuestion = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      question: "",
      answer: "Dhaka",
    },
  });

  const securityQuestions = [
    "What is the name of the town you were born?",
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was your first car?",
    "What elementary school did you attend?",
  ];

  const handleSubmit = (values: z.infer<typeof securitySchema>) => {
    toast({
      title: "Security Question Updated",
      description: "Your security question has been set successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Set Security Question</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Security Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Question *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a security question" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {securityQuestions.map((question, index) => (
                          <SelectItem key={index} value={question}>
                            {question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Answer *</FormLabel>
                    <FormControl>
                      <Input placeholder="Security Answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityQuestion;
