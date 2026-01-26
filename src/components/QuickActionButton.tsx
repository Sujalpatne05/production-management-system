import { useState } from "react";
import { Plus, ShoppingCart, Package, Users, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const QuickActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: ShoppingCart,
      label: "New Sale",
      action: () => navigate("/dashboard/sales/add"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Package,
      label: "New Purchase",
      action: () => navigate("/dashboard/purchases/add"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Users,
      label: "New Lead",
      action: () => navigate("/dashboard/crm/leads"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: FileText,
      label: "New Order",
      action: () => navigate("/dashboard/orders/add"),
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  const handleActionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Quick Action Items */}
      {isOpen && (
        <div className="flex flex-col-reverse gap-3 animate-in slide-in-from-bottom-4 fade-in">
          {quickActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleActionClick(item.action)}
                className={`${item.color} text-white rounded-full p-3 shadow-lg flex items-center gap-2 group transition-all hover:scale-105 hover:shadow-xl`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap pr-0 group-hover:pr-3">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main FAB Button */}
      <Button
        size="icon"
        className={`w-14 h-14 rounded-full shadow-lg transition-all ${
          isOpen ? "rotate-45 bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close" : "Quick Actions"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  );
};

export default QuickActionButton;
