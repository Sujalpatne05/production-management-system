import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SuperAdminSidebar } from '@/components/super-admin/SuperAdminSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Bell, Settings, User } from 'lucide-react';

export function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Get page title from location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('companies')) return 'Companies Management';
    if (path.includes('admins')) return 'Admin Management';
    if (path.includes('users')) return 'User Management';
    if (path.includes('billing')) return 'Billing & Subscriptions';
    if (path.includes('analytics')) return 'Analytics & Reports';
    if (path.includes('audit')) return 'Audit Logs';
    if (path.includes('settings')) return 'Configuration';
    if (path.includes('support')) return 'Support & Integration';
    if (path.includes('security')) return 'Security';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
        <SuperAdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-slate-100"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage your platform efficiently</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-slate-100"
              >
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-100"
              >
                <Settings size={20} className="text-slate-600" />
              </Button>

              {/* User Profile */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-100"
              >
                <User size={20} className="text-slate-600" />
              </Button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200" />

              {/* Logout */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
