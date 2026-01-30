import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CheckInOut = () => {
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const mockData = [
    {
      sn: 1,
      date: "26/10/2024",
      inTime: "00:24:14",
      outTime: "00:24:14",
      timeCount: "0.00 Hour(s)",
      note: "",
    },
  ];

  const handleSearch = () => {
    // Search logic here
  };

  const handleExport = () => {
    // Export logic here
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Check In/Check Out</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Input
              placeholder="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button variant="outline" onClick={handleExport}>
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SN</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>In Time</TableHead>
                  <TableHead>Out Time</TableHead>
                  <TableHead>Time Count</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.length > 0 ? (
                  mockData.map((item) => (
                    <TableRow key={item.sn}>
                      <TableCell>{item.sn}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.inTime}</TableCell>
                      <TableCell>{item.outTime}</TableCell>
                      <TableCell>{item.timeCount}</TableCell>
                      <TableCell>{item.note}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1 to 1 of 1 entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInOut;
