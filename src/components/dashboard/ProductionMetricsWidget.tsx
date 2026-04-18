import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { ProductionMetrics } from "@/services/productionMetricsService";

interface ProductionMetricsWidgetProps {
  metrics: ProductionMetrics;
  onDrillDown?: (metric: string) => void;
}

export const ProductionMetricsWidget = ({
  metrics,
  onDrillDown,
}: ProductionMetricsWidgetProps) => {
  const getMetricColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "text-green-600";
    if (value >= threshold - 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getMetricBgColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "bg-green-50 border-green-200";
    if (value >= threshold - 10) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const MetricCard = ({
    title,
    value,
    unit,
    icon: Icon,
    onClick,
    threshold,
  }: {
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    onClick?: () => void;
    threshold?: number;
  }) => (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getMetricBgColor(
        value,
        threshold
      )}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <div className="text-gray-400">{Icon}</div>
      </div>
      <div className={`text-2xl font-bold ${getMetricColor(value, threshold)}`}>
        {value.toFixed(1)}{unit}
      </div>
      <p className="text-xs text-gray-500 mt-1">Click to drill down</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Production Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="OEE"
            value={metrics.oee}
            unit="%"
            icon={<TrendingUp className="h-4 w-4" />}
            onClick={() => onDrillDown?.("oee")}
            threshold={75}
          />
          <MetricCard
            title="Efficiency"
            value={metrics.efficiency}
            unit="%"
            icon={<Activity className="h-4 w-4" />}
            onClick={() => onDrillDown?.("efficiency")}
            threshold={80}
          />
          <MetricCard
            title="Uptime"
            value={metrics.uptime}
            unit="%"
            icon={<Activity className="h-4 w-4" />}
            onClick={() => onDrillDown?.("uptime")}
            threshold={85}
          />
          <MetricCard
            title="Defect Rate"
            value={metrics.defectRate}
            unit="%"
            icon={<AlertCircle className="h-4 w-4" />}
            onClick={() => onDrillDown?.("defectRate")}
            threshold={5}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.completedProduction}
            </div>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics.runningProduction}
            </div>
            <p className="text-xs text-gray-600">Running</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.delayedProduction}
            </div>
            <p className="text-xs text-gray-600">Delayed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.totalProduction}
            </div>
            <p className="text-xs text-gray-600">Total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
