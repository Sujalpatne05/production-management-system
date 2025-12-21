import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddRMCategory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRMCategory } = useStore();
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }

    addRMCategory({ name: form.name, description: form.description });
    toast({ title: "Success", description: "Category added successfully" });
    navigate("/dashboard/item-setup/rm-categories");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add RM Category</h1>
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Category Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter category name" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" />
            </div>
            <Button type="submit" className="w-full">Save Category</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRMCategory;
