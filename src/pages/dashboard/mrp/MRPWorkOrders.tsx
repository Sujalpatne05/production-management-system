import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageHeader from "@/components/PageHeader";

interface WorkOrder {
  id: string;
  workOrderNo: string;
  productName: string;
  plannedQty: number;
  producedQty: number;
  scrapQty: number;
  startDate: string;
  endDate: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  efficiency: number;
}

const MRPWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: "1",
      workOrderNo: "WO-2026-001",
      productName: "Product A",
      plannedQty: 1000,
      producedQty: 950,
      scrapQty: 30,
      startDate: "2026-01-20",
      endDate: "2026-01-26",
      status: "Completed",
      efficiency: 95,
    },
    {
      id: "2",
      workOrderNo: "WO-2026-002",
      productName: "Product B",
      plannedQty: 500,
      producedQty: 450,
      scrapQty: 15,
      startDate: "2026-01-22",
      endDate: "2026-01-28",
      status: "In Progress",
      efficiency: 90,
    },
    {
      id: "3",
      workOrderNo: "WO-2026-003",
      productName: "Product C",
      plannedQty: 750,
      producedQty: 0,
      scrapQty: 0,
      startDate: "2026-01-27",
      endDate: "2026-02-02",
      status: "Planning",
      efficiency: 0,
    },
    {
      id: "4",
      workOrderNo: "WO-2026-004",
      productName: "Product D",
      plannedQty: 300,
      producedQty: 250,
      scrapQty: 40,
      startDate: "2026-01-18",
      endDate: "2026-01-25",
      status: "On Hold",
      efficiency: 83,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkOrders = workOrders.filter((wo) =>
    wo.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wo.workOrderNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Planning":
        return <Badge className="bg-blue-100 text-blue-800">Planning</Badge>;
      case "In Progress":
        return <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "On Hold":
        return <Badge className="bg-red-100 text-red-800">On Hold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = [
    {
      label: "Total Work Orders",
      value: workOrders.length,
      color: "text-blue-600",
    },
    {
      label: "In Progress",
      value: workOrders.filter((w) => w.status === "In Progress").length,
      color: "text-orange-600",
    },
    {
      label: "Completed",
      value: workOrders.filter((w) => w.status === "Completed").length,
      color: "text-green-600",
    },
    {
      label: "Avg Efficiency",
      value: `${Math.round(
        workOrders.reduce((sum, w) => sum + w.efficiency, 0) / workOrders.length
      )}%`,
      color: "text-purple-600",
    },
  ];

  const totalPlanned = workOrders.reduce((sum, w) => sum + w.plannedQty, 0);
  const totalProduced = workOrders.reduce((sum, w) => sum + w.producedQty, 0);
  const totalScrap = workOrders.reduce((sum, w) => sum + w.scrapQty, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="MRP - Work Orders"
        subtitle="Manage and track manufacturing work orders"
      />

      {/* High Scrap Alert */}
      {totalScrap > totalPlanned * 0.05 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            ⚠️ High scrap quantity detected ({totalScrap} units). Review quality control processes.
          </AlertDescription>
        </Alert>
      )}

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-blue-900">Planned Qty</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalPlanned.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-green-900">Produced Qty</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{totalProduced.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-red-900">Scrap Qty</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{totalScrap.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Orders</CardTitle>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Work Order
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search work orders by product or WO number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">WO Number</TableHead>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Planned Qty</TableHead>
                  <TableHead className="font-semibold">Produced Qty</TableHead>
                  <TableHead className="font-semibold">Scrap Qty</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Efficiency</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.length > 0 ? (
                  filteredWorkOrders.map((wo) => (
                    <TableRow key={wo.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-sm">{wo.workOrderNo}</TableCell>
                      <TableCell className="font-medium">{wo.productName}</TableCell>
                      <TableCell className="text-right font-semibold">{wo.plannedQty.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">{wo.producedQty.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600 font-semibold">{wo.scrapQty.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(wo.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${wo.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{wo.efficiency}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No work orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MRPWorkOrders;
