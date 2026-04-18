import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Settings,
  TrendingUp,
  FileText,
  HelpCircle,
  Lock,
  Ticket,
  Key,
  ChevronDown,
  Zap,
  Shield,
  Database,
  Bell,
  Globe,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    icon: BarChart3,
    href: '/super-admin',
    badge: 'NEW',
    submenu: [
      { label: 'Overview', href: '/super-admin/dashboard/overview', icon: '📊' },
      { label: 'Analytics', href: '/super-admin/dashboard/analytics', icon: '📈' },
    ],
  },
  {
    label: 'Companies',
    icon: Building2,
    href: '/super-admin/companies',
    submenu: [
      { label: 'Company List', href: '/super-admin/companies', icon: '📋' },
      { label: 'Add Company', href: '/super-admin/companies/add', icon: '➕' },
    ],
  },
  {
    label: 'Management',
    icon: Users,
    href: '/super-admin/management',
    submenu: [
      { label: 'Admins', href: '/super-admin/admins', icon: '👨‍💼' },
      { label: 'All Users', href: '/super-admin/users', icon: '👥' },
      { label: 'User Activity', href: '/super-admin/users/activity', icon: '📍' },
    ],
  },
  {
    label: 'Billing & Plans',
    icon: CreditCard,
    href: '/super-admin/billing',
    submenu: [
      { label: 'Subscription Plans', href: '/super-admin/billing/plans', icon: '💳' },
      { label: 'Company Subscriptions', href: '/super-admin/billing/subscriptions', icon: '📑' },
      { label: 'Invoices', href: '/super-admin/billing/invoices', icon: '🧾' },
      { label: 'Payments', href: '/super-admin/billing/payments', icon: '💰' },
    ],
  },
  {
    label: 'Analytics & Reports',
    icon: TrendingUp,
    href: '/super-admin/analytics',
    submenu: [
      { label: 'Platform Analytics', href: '/super-admin/analytics/platform', icon: '📊' },
      { label: 'Revenue Reports', href: '/super-admin/analytics/revenue', icon: '💹' },
      { label: 'User Reports', href: '/super-admin/analytics/users', icon: '👤' },
    ],
  },
  {
    label: 'Audit & Compliance',
    icon: FileText,
    href: '/super-admin/audit-logs',
    submenu: [
      { label: 'System Logs', href: '/super-admin/audit-logs/system', icon: '📝' },
      { label: 'Admin Activity', href: '/super-admin/audit-logs/admin', icon: '🔍' },
      { label: 'Company Activity', href: '/super-admin/audit-logs/company', icon: '📊' },
    ],
  },
  {
    label: 'Configuration',
    icon: Settings,
    href: '/super-admin/settings',
    submenu: [
      { label: 'Global Settings', href: '/super-admin/settings/config', icon: '⚙️' },
      { label: 'Email Settings', href: '/super-admin/settings/email', icon: '📧' },
      { label: 'SMS Settings', href: '/super-admin/settings/sms', icon: '💬' },
    ],
  },
  {
    label: 'Support & Integration',
    icon: Ticket,
    href: '/super-admin/support',
    submenu: [
      { label: 'Support Tickets', href: '/super-admin/support/tickets', icon: '🎫' },
      { label: 'Knowledge Base', href: '/super-admin/support/kb', icon: '📚' },
      { label: 'API Keys', href: '/super-admin/api-keys', icon: '🔑' },
    ],
  },
  {
    label: 'Security',
    icon: Lock,
    href: '/super-admin/security',
    submenu: [
      { label: 'Permissions', href: '/super-admin/security/permissions', icon: '🛡️' },
      { label: 'Roles', href: '/super-admin/security/roles', icon: '👑' },
      { label: '2FA Settings', href: '/super-admin/security/2fa', icon: '🔐' },
    ],
  },
];

export function SuperAdminSidebar() {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  const isActive = (href: string) => location.pathname === href;
  const isMenuActive = (href: string) => location.pathname.startsWith(href);

  React.useEffect(() => {
    // Auto-expand menu if current path matches
    for (const item of menuItems) {
      if (isMenuActive(item.href) && item.submenu) {
        setExpandedMenu(item.href);
        break;
      }
    }
  }, [location.pathname]);

  return (
    <div className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold">⚡</span>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Super Admin
            </h2>
            <p className="text-xs text-slate-400">Platform Management</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {menuItems.map((item) => (
          <div key={item.href} className="group">
            <button
              onClick={() => setExpandedMenu(expandedMenu === item.href ? null : item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                isMenuActive(item.href)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-200" />
              
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <item.icon size={20} />
              </div>
              
              {/* Label */}
              <span className="flex-1 text-left relative z-10">{item.label}</span>
              
              {/* Badge */}
              {item.badge && (
                <span className="relative z-10 px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full">
                  {item.badge}
                </span>
              )}
              
              {/* Chevron */}
              {item.submenu && (
                <ChevronDown
                  size={18}
                  className={`relative z-10 transition-transform duration-300 ${
                    expandedMenu === item.href ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {item.submenu && expandedMenu === item.href && (
              <div className="mt-1 ml-2 pl-2 border-l-2 border-slate-700/50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                {item.submenu.map((subitem) => (
                  <Link
                    key={subitem.href}
                    to={subitem.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive(subitem.href)
                        ? 'bg-blue-600/30 text-blue-300 border-l-2 border-blue-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    }`}
                  >
                    <span className="text-sm">{subitem.icon}</span>
                    <span>{subitem.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm space-y-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">System Online</span>
        </div>

        {/* Footer Text */}
        <div className="text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">© 2026 ERP System</p>
          <p>Multi-Tenant Platform v1.0</p>
        </div>
      </div>
    </div>
  );
}
