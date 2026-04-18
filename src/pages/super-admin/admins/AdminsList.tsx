import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from "@/config/apiConfig";
import { Trash2, Edit2, Plus, Eye, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Admin {
  id: string;
  companyId: string;
  userId: string;
  role: string;
  status: string;
  createdAt: string;
  company: { name: string };
  user: { name: string; email: string; password?: string };
}

export function AdminsList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(admins.filter(a => a.id !== id));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to delete admin");
    }
  };

  const handleViewPassword = async (admin: Admin) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/admins/${admin.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedAdmin({ ...admin, user: { ...admin.user, password: data.data.password } });
        setShowPasswordDialog(true);
      } else {
        setError(data.error || "Failed to fetch password");
      }
    } catch (err) {
      setError("Failed to fetch password");
    }
  };

  const handleCopyPassword = () => {
    if (selectedAdmin?.user.password) {
      navigator.clipboard.writeText(selectedAdmin.user.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading admins...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Company Admins</h1>
        {/* Add Admin button removed - admins are now created with companies */}
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Search Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admins List ({filteredAdmins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Admin Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{admin.user.name}</td>
                    <td className="px-4 py-2">{admin.user.email}</td>
                    <td className="px-4 py-2">{admin.company.name}</td>
                    <td className="px-4 py-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        admin.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewPassword(admin)}
                        title="View Password"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(admin.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Password</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name
                </label>
                <div className="bg-gray-100 px-4 py-2 rounded">
                  {selectedAdmin.user.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="bg-gray-100 px-4 py-2 rounded">
                  {selectedAdmin.user.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-100 px-4 py-2 rounded font-mono">
                    {selectedAdmin.user.password}
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCopyPassword}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                ⚠️ Keep this password secure. Share it only with the admin.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
