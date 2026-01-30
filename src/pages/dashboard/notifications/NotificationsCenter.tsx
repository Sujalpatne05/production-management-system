import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, ShoppingCart, DollarSign, Trash2, CheckCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Notification {
  id: string;
  type: "low-stock" | "payment-due" | "order" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "critical" | "warning" | "info";
  actionUrl?: string;
}

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "low-stock",
      title: "Low Stock Alert",
      message: "Product A stock is below minimum level (5 units remaining)",
      timestamp: "2 hours ago",
      read: false,
      severity: "critical",
      actionUrl: "/dashboard/stock",
    },
    {
      id: "2",
      type: "payment-due",
      title: "Payment Due",
      message: "Supplier payment due to XYZ Supplies - Amount: ₹50,000",
      timestamp: "4 hours ago",
      read: false,
      severity: "warning",
      actionUrl: "/dashboard/supplier-payments/list",
    },
    {
      id: "3",
      type: "order",
      title: "New Order Created",
      message: "Customer order #ORD-2026-045 has been created for 500 units",
      timestamp: "6 hours ago",
      read: true,
      severity: "info",
      actionUrl: "/dashboard/orders/list",
    },
    {
      id: "4",
      type: "low-stock",
      title: "Low Stock Alert",
      message: "Raw Material B stock is low (12 units remaining)",
      timestamp: "8 hours ago",
      read: true,
      severity: "warning",
      actionUrl: "/dashboard/stock",
    },
    {
      id: "5",
      type: "alert",
      title: "Quality Issue",
      message: "Scrap rate in Work Order WO-2026-002 exceeded 5%",
      timestamp: "12 hours ago",
      read: true,
      severity: "critical",
      actionUrl: "/dashboard/mrp/work-orders",
    },
    {
      id: "6",
      type: "payment-due",
      title: "Customer Payment Overdue",
      message: "Invoice #INV-2026-123 payment overdue by 5 days",
      timestamp: "1 day ago",
      read: true,
      severity: "critical",
      actionUrl: "/dashboard/customer-receives/list",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "low-stock":
        return <AlertTriangle className="w-5 h-5" />;
      case "payment-due":
        return <DollarSign className="w-5 h-5" />;
      case "order":
        return <ShoppingCart className="w-5 h-5" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const stats = [
    {
      label: "Unread Alerts",
      value: unreadCount,
      color: "text-red-600",
      icon: Bell,
    },
    {
      label: "Low Stock",
      value: notifications.filter((n) => n.type === "low-stock").length,
      color: "text-orange-600",
      icon: AlertTriangle,
    },
    {
      label: "Payment Due",
      value: notifications.filter((n) => n.type === "payment-due").length,
      color: "text-yellow-600",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Center"
        subtitle="Manage and track all system alerts and notifications"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Notifications</CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(
                    notification.severity
                  )} ${!notification.read ? "font-semibold" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-0.5 text-current`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-current rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <p className="text-xs opacity-70 mt-2">{notification.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {notification.actionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() =>
                            (window.location.href = notification.actionUrl!)
                          }
                        >
                          View
                        </Button>
                      )}
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-red-600"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No notifications at this time</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsCenter;
