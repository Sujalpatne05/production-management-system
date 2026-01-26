import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AddLeadDialog from "@/components/AddLeadDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "New" | "Won" | "Lost";
  value: string;
  createdDate: string;
}

const CRMLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      company: "Tech Solutions Inc",
      email: "rajesh@techsol.com",
      phone: "+91-9876543210",
      status: "New",
      value: "₹5,00,000",
      createdDate: "2026-01-20",
    },
    {
      id: "2",
      name: "Priya Sharma",
      company: "Global Industries",
      email: "priya@global.com",
      phone: "+91-9876543211",
      status: "Won",
      value: "₹12,50,000",
      createdDate: "2026-01-15",
    },
    {
      id: "3",
      name: "Amit Patel",
      company: "Manufacturing Co",
      email: "amit@mfg.com",
      phone: "+91-9876543212",
      status: "Lost",
      value: "₹3,50,000",
      createdDate: "2026-01-10",
    },
    {
      id: "4",
      name: "Neha Gupta",
      company: "Enterprise Solutions",
      email: "neha@enterprise.com",
      phone: "+91-9876543213",
      status: "New",
      value: "₹8,75,000",
      createdDate: "2026-01-18",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case "Won":
        return <Badge className="bg-green-100 text-green-800">Won</Badge>;
      case "Lost":
        return <Badge className="bg-red-100 text-red-800">Lost</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      color: "text-blue-600",
    },
    {
      label: "Won Deals",
      value: leads.filter((l) => l.status === "Won").length,
      color: "text-green-600",
    },
    {
      label: "Pipeline Value",
      value: "₹30,75,000",
      color: "text-purple-600",
    },
    {
      label: "Conversion Rate",
      value: "25%",
      color: "text-orange-600",
    },
  ];

  const handleAddLead = (leadData: Omit<Lead, "id" | "createdDate">) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split("T")[0],
    };
    setLeads([...leads, newLead]);
  };

  const handleEditLead = (leadData: Omit<Lead, "id" | "createdDate">) => {
    if (!editingLead) return;
    setLeads(leads.map((l) => (l.id === editingLead.id ? { ...l, ...leadData } : l)));
    setEditingLead(null);
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter((l) => l.id !== id));
    setDeleteConfirm(null);
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="CRM - Sales Leads" subtitle="Manage your sales pipeline and leads" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leads Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Leads</CardTitle>
          <Button
            className="gap-2"
            onClick={() => {
              setEditingLead(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> New Lead
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search leads by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Lead Name</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Deal Value</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell className="font-semibold">{lead.value}</TableCell>
                      <TableCell className="text-sm text-gray-600">{lead.createdDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(lead)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => setDeleteConfirm(lead.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No leads found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <AddLeadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editingLead ? handleEditLead : handleAddLead}
        editingLead={editingLead}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteConfirm && handleDeleteLead(deleteConfirm)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CRMLeads;
