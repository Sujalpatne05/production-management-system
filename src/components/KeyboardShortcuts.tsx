import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if Ctrl (or Cmd on Mac) + Alt is pressed
      if ((event.ctrlKey || event.metaKey) && event.altKey) {
        event.preventDefault();

        switch (event.key.toLowerCase()) {
          case "d":
            navigate("/dashboard/overview");
            showShortcutToast("Dashboard");
            break;
          case "h":
            navigate("/dashboard");
            showShortcutToast("Home");
            break;
          case "n":
            navigate("/dashboard/notifications");
            showShortcutToast("Notifications");
            break;
          case "c":
            navigate("/dashboard/crm/leads");
            showShortcutToast("CRM Leads");
            break;
          case "s":
            navigate("/dashboard/sales/list");
            showShortcutToast("Sales");
            break;
          case "p":
            navigate("/dashboard/purchases/list");
            showShortcutToast("Purchases");
            break;
          case "m":
            navigate("/dashboard/mrp/work-orders");
            showShortcutToast("MRP Work Orders");
            break;
          case "r":
            navigate("/dashboard/reports/sale");
            showShortcutToast("Reports");
            break;
          case "i":
            navigate("/dashboard/stock");
            showShortcutToast("Inventory");
            break;
        }
      }

      // Help menu: Ctrl/Cmd + /
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        showHelpToast();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  const showShortcutToast = (destination: string) => {
    toast({
      title: `Navigated to ${destination}`,
      duration: 2000,
    });
  };

  const showHelpToast = () => {
    toast({
      title: "⌨️ Keyboard Shortcuts",
      description: (
        <div className="mt-2 space-y-1 text-sm">
          <div className="font-semibold mb-2">Ctrl+Alt + Key:</div>
          <div>• D - Dashboard</div>
          <div>• H - Home</div>
          <div>• N - Notifications</div>
          <div>• C - CRM</div>
          <div>• S - Sales</div>
          <div>• P - Purchases</div>
          <div>• M - MRP</div>
          <div>• R - Reports</div>
          <div>• I - Inventory</div>
          <div className="mt-2 pt-2 border-t">
            <div>• Ctrl+/ - This help menu</div>
          </div>
        </div>
      ),
      duration: 8000,
    });
  };

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
