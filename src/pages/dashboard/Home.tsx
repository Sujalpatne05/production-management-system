import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Key, ShieldQuestion, LogOut, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductionData {
  referenceNo: string;
  product: string;
  startDate: string;
  consumedTime: string;
  productionCost: string;
  salePrice: string;
}

const mockProductionData: ProductionData[] = [];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = mockProductionData.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <Alert className="bg-warning/10 border-warning text-sm">
        <AlertDescription className="text-warning-foreground">
          In demo mode you cannot delete any data.
        </AlertDescription>
      </Alert>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Profile/Home</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl">
                  A
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-base sm:text-lg">Admin</h3>
                <p className="text-sm text-muted-foreground">admin@doorsoft.co</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base"
                onClick={() => navigate("/dashboard/change-profile")}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-info" />
                </div>
                Change Profile
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base"
                onClick={() => navigate("/dashboard/change-password")}
              >
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Key className="w-4 h-4 text-success" />
                </div>
                Change Password
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/security-question")}
              >
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <ShieldQuestion className="w-4 h-4 text-warning" />
                </div>
                Set Security Question
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/login")}
              >
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-destructive" />
                </div>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Running Productions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Running Productions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search Here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Consumed Time</TableHead>
                    <TableHead>Production Cost</TableHead>
                    <TableHead>Sale Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.referenceNo}>
                      <TableCell className="font-medium">{item.referenceNo}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell className="text-xs">{item.consumedTime}</TableCell>
                      <TableCell>{item.productionCost}</TableCell>
                      <TableCell>{item.salePrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Home;
