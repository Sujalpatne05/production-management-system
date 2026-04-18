// Production metrics calculation service
export interface ProductionMetrics {
  oee: number; // Overall Equipment Effectiveness (0-100)
  efficiency: number; // Production efficiency percentage
  uptime: number; // Machine uptime percentage
  defectRate: number; // Defect rate percentage
  totalProduction: number;
  completedProduction: number;
  delayedProduction: number;
  runningProduction: number;
}

export interface AlertData {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  actionUrl?: string;
  read: boolean;
}

// Calculate OEE (Availability × Performance × Quality)
export const calculateOEE = (
  availability: number,
  performance: number,
  quality: number
): number => {
  return Math.round((availability * performance * quality) / 10000);
};

// Calculate production efficiency
export const calculateEfficiency = (
  completedUnits: number,
  plannedUnits: number
): number => {
  if (plannedUnits === 0) return 0;
  return Math.round((completedUnits / plannedUnits) * 100);
};

// Calculate machine uptime
export const calculateUptime = (
  operatingHours: number,
  totalHours: number
): number => {
  if (totalHours === 0) return 0;
  return Math.round((operatingHours / totalHours) * 100);
};

// Calculate defect rate
export const calculateDefectRate = (
  defectiveUnits: number,
  totalUnits: number
): number => {
  if (totalUnits === 0) return 0;
  return Math.round((defectiveUnits / totalUnits) * 100);
};

// Generate mock production metrics
export const generateProductionMetrics = (): ProductionMetrics => {
  const availability = 85 + Math.random() * 15; // 85-100%
  const performance = 80 + Math.random() * 20; // 80-100%
  const quality = 90 + Math.random() * 10; // 90-100%

  return {
    oee: calculateOEE(availability, performance, quality),
    efficiency: 75 + Math.random() * 25,
    uptime: 88 + Math.random() * 12,
    defectRate: Math.random() * 5,
    totalProduction: 150,
    completedProduction: 95,
    delayedProduction: 12,
    runningProduction: 43,
  };
};

// Generate mock alerts
export const generateAlerts = (): AlertData[] => {
  return [
    {
      id: '1',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'MS Plate 5mm stock below threshold (120 units)',
      timestamp: new Date(Date.now() - 5 * 60000),
      actionUrl: '/dashboard/stock',
      read: false,
    },
    {
      id: '2',
      type: 'error',
      title: 'Production Delay',
      message: 'PRO-1021 delayed by 4 hours',
      timestamp: new Date(Date.now() - 15 * 60000),
      actionUrl: '/dashboard/production',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Payment Due',
      message: 'Invoice INV-2026-001 payment due in 2 days',
      timestamp: new Date(Date.now() - 30 * 60000),
      actionUrl: '/dashboard/payments',
      read: false,
    },
    {
      id: '4',
      type: 'success',
      title: 'Production Complete',
      message: 'PRO-1022 completed successfully',
      timestamp: new Date(Date.now() - 60 * 60000),
      actionUrl: '/dashboard/production',
      read: true,
    },
  ];
};
