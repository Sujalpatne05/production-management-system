import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardMetrics from "./DashboardMetrics";

const Overview = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome to your production management dashboard</p>
      </div>

      {/* Enhanced Metrics with Charts */}
      <DashboardMetrics />
    </div>
  );
};

export default Overview;
