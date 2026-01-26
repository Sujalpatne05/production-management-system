import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Building2,
  Users,
  Package,
  AlertCircle,
  Zap,
  TrendingUp,
} from "lucide-react";

interface Factory {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
  manager: string;
  storageCapacity: number;
  currentInventory: number;
  machinesCount: number;
  employeesCount: number;
  productionLines: number;
  efficiency: number;
}

interface Department {
  id: string;
  factoryId: string;
  name: string;
  type: "Production" | "Warehouse" | "QC" | "Packing" | "Maintenance";
  manager: string;
  capacity: number;
}

const mockFactories: Factory[] = [
  {
    id: "1",
    code: "FAC-001",
    name: "Main Branch",
    phone: "123-456-7890",
    email: "main@company.com",
    address: "123 Main St, City",
    status: "active",
    manager: "John Doe",
    storageCapacity: 50000,
    currentInventory: 35000,
    machinesCount: 15,
    employeesCount: 45,
    productionLines: 3,
    efficiency: 92,
  },
  {
    id: "2",
    code: "FAC-002",
    name: "Downtown Store",
    phone: "098-765-4321",
    email: "downtown@company.com",
    address: "456 Downtown Ave, City",
    status: "active",
    manager: "Jane Smith",
    storageCapacity: 30000,
    currentInventory: 22000,
    machinesCount: 8,
    employeesCount: 28,
    productionLines: 2,
    efficiency: 88,
  },
];

const mockDepartments: Department[] = [
  {
    id: "1",
    factoryId: "1",
    name: "Assembly Line A",
    type: "Production",
    manager: "Mike Johnson",
    capacity: 500,
  },
  {
    id: "2",
    factoryId: "1",
    name: "Quality Control",
    type: "QC",
    manager: "Sarah Williams",
    capacity: 100,
  },
  {
    id: "3",
    factoryId: "1",
    name: "Main Warehouse",
    type: "Warehouse",
    manager: "Robert Brown",
    capacity: 50000,
  },
];

export default function FactoriesList() {
  const { toast } = useToast();
  const [factories, setFactories] = useState<Factory[]>(mockFactories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFactory, setSelectedFactory] = useState<string | null>(
    factories[0]?.id
  );
  const [statusFilter, setStatusFilter] = useState("all");

  const currentFactory = factories.find((f) => f.id === selectedFactory);
  const factoryDepartments = mockDepartments.filter(
    (d) => d.factoryId === selectedFactory
  );

  const filteredFactories = factories.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Factories & Production Facilities" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Total Factories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factories.length}</div>
            <p className="text-xs text-gray-500">Active: {factories.filter(f => f.status === "active").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {factories.reduce((sum, f) => sum + f.employeesCount, 0)}
            </div>
            <p className="text-xs text-gray-500">Across all facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Production Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {factories.reduce((sum, f) => sum + f.productionLines, 0)}
            </div>
            <p className="text-xs text-gray-500">Total capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (factories.reduce((sum, f) => sum + f.currentInventory, 0) /
                  factories.reduce((sum, f) => sum + f.storageCapacity, 0)) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-gray-500">Capacity utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg. Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                factories.reduce((sum, f) => sum + f.efficiency, 0) /
                  factories.length
              )}
              %
            </div>
            <p className="text-xs text-gray-500">Overall productivity</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search factories by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Factories</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Factory
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Factories ({filteredFactories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Lines</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFactories.map((factory) => (
                    <TableRow key={factory.id}>
                      <TableCell className="font-mono text-sm">
                        {factory.code}
                      </TableCell>
                      <TableCell className="font-medium">{factory.name}</TableCell>
                      <TableCell>{factory.manager}</TableCell>
                      <TableCell>{factory.employeesCount}</TableCell>
                      <TableCell>{factory.productionLines}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded">
                            <div
                              className={`h-full rounded ${
                                factory.efficiency > 90
                                  ? "bg-green-500"
                                  : factory.efficiency > 80
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${factory.efficiency}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {factory.efficiency}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            factory.status === "active" ? "default" : "secondary"
                          }
                        >
                          {factory.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedFactory(factory.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          {currentFactory && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{currentFactory.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Factory Code</p>
                      <p className="text-lg font-semibold">{currentFactory.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Manager</p>
                      <p className="text-lg font-semibold">{currentFactory.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-semibold">{currentFactory.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-semibold">{currentFactory.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-lg font-semibold">{currentFactory.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge
                        variant={
                          currentFactory.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {currentFactory.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Storage Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Used</span>
                        <span className="font-semibold">
                          {currentFactory.currentInventory.toLocaleString()} /
                          {currentFactory.storageCapacity.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded">
                        <div
                          className="h-full bg-blue-500 rounded"
                          style={{
                            width: `${
                              (currentFactory.currentInventory /
                                currentFactory.storageCapacity) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {Math.round(
                          (currentFactory.currentInventory /
                            currentFactory.storageCapacity) *
                            100
                        )}
                        % utilization
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Efficiency Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Production Efficiency</span>
                        <span className="text-2xl font-bold">
                          {currentFactory.efficiency}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded">
                        <div
                          className={`h-full rounded ${
                            currentFactory.efficiency > 90
                              ? "bg-green-500"
                              : currentFactory.efficiency > 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${currentFactory.efficiency}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Departments & Sections</CardTitle>
              <Button size="sm" className="gap-2">
                <Plus className="h-3 w-3" />
                Add Department
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factoryDepartments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{dept.type}</Badge>
                      </TableCell>
                      <TableCell>{dept.manager}</TableCell>
                      <TableCell>{dept.capacity.toLocaleString()} units</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Machines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentFactory?.machinesCount}</div>
                <p className="text-xs text-gray-500 mt-1">Total equipment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {currentFactory?.employeesCount}
                </div>
                <p className="text-xs text-gray-500 mt-1">Skilled workers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Production Lines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {currentFactory?.productionLines}
                </div>
                <p className="text-xs text-gray-500 mt-1">Active lines</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Machinery Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">MAC-001</TableCell>
                    <TableCell>CNC Machine</TableCell>
                    <TableCell>Assembly Line A</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">MAC-002</TableCell>
                    <TableCell>Press Machine</TableCell>
                    <TableCell>Assembly Line A</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">MAC-003</TableCell>
                    <TableCell>Welding Robot</TableCell>
                    <TableCell>Assembly Line B</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Maintenance</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
