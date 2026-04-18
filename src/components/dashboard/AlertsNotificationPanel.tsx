import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  X,
  Bell,
} from "lucide-react";
import { AlertData } from "@/services/productionMetricsService";

interface AlertsNotificationPanelProps {
  alerts: AlertData[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onNavigate?: (url: string) => void;
}

export const AlertsNotificationPanel = ({
  alerts,
  onDismiss,
  onMarkAsRead,
  onNavigate,
}: AlertsNotificationPanelProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-orange-50 border-orange-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts & Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No alerts at this time</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${getAlertBgColor(
                  alert.type
                )} ${!alert.read ? "ring-2 ring-offset-1 ring-blue-300" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      {!alert.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(alert.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {alert.actionUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onMarkAsRead?.(alert.id);
                          onNavigate?.(alert.actionUrl!);
                        }}
                      >
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismiss?.(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
