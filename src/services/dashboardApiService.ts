// Dashboard API Service for real-time data fetching
import { ProductionMetrics, AlertData } from "./productionMetricsService";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export interface DashboardData {
  metrics: ProductionMetrics;
  alerts: AlertData[];
  lastUpdated: Date;
}

// Fetch production metrics from backend
export const fetchProductionMetrics = async (): Promise<ProductionMetrics> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch metrics");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};

// Fetch alerts from backend
export const fetchAlerts = async (): Promise<AlertData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/alerts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch alerts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};

// Fetch all dashboard data
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const [metrics, alerts] = await Promise.all([
      fetchProductionMetrics(),
      fetchAlerts(),
    ]);

    return {
      metrics,
      alerts,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// Mark alert as read
export const markAlertAsRead = async (alertId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/alerts/${alertId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark alert as read");
    }
  } catch (error) {
    console.error("Error marking alert as read:", error);
    throw error;
  }
};

// Dismiss alert
export const dismissAlert = async (alertId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/alerts/${alertId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to dismiss alert");
    }
  } catch (error) {
    console.error("Error dismissing alert:", error);
    throw error;
  }
};

// Fetch drill-down transaction details
export const fetchTransactionDetails = async (
  metric: string,
  filters?: Record<string, any>
): Promise<any[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/dashboard/transactions/${metric}?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch transaction details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
};
