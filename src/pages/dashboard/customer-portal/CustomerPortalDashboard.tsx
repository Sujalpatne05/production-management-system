import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Receipt, Mail } from "lucide-react";

export default function CustomerPortalDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Portal</h1>
        <p className="text-muted-foreground mt-2">Self-service portal for customers to track orders and access invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              My Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Available invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Open tickets</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Customer self-service options</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            View Orders
          </Button>
          <Button variant="outline" className="gap-2">
            <Receipt className="w-4 h-4" />
            Download Invoices
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Create Support Ticket
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Customer portal module implementation in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This module provides customers with self-service access to their orders, invoices, and support tickets.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
