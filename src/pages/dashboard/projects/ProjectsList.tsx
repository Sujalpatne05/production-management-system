import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({ title: "Error", description: "Failed to fetch projects", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter(p => p.id !== id));
        toast({ title: "Success", description: "Project deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    }
  };

  const filteredProjects = projects.filter(proj =>
    proj.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage projects and tasks</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>{filteredProjects.length} projects found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-center text-muted-foreground">No projects found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Manager</th>
                    <th className="text-left py-3 px-4">Budget</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{proj.name}</td>
                      <td className="py-3 px-4">{proj.manager || "N/A"}</td>
                      <td className="py-3 px-4">₹{proj.budget?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(proj.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => deleteProject(proj.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
