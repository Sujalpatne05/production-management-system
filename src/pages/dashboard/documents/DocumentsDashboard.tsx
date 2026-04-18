import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DocumentsDashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({ title: "Error", description: "Failed to fetch documents", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(documents.filter(d => d.id !== id));
        toast({ title: "Success", description: "Document deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete document", variant: "destructive" });
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-2">Manage documents and files</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document List</CardTitle>
          <CardDescription>{filteredDocuments.length} documents found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : filteredDocuments.length === 0 ? (
            <p className="text-center text-muted-foreground">No documents found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Uploaded</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{doc.name}</td>
                      <td className="py-3 px-4">{doc.category}</td>
                      <td className="py-3 px-4">{doc.type}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(doc.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => deleteDocument(doc.id)}
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
