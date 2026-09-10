import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Logo } from '../../components/ui/Logo';
import {
  LayoutDashboard,
  Inbox,
  Package,
  FolderTree,
  Sliders,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Enquiries & Quotes', href: '/admin/enquiries', icon: Inbox },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Hero Slides', href: '/admin/hero-slides', icon: Sliders },
    { label: 'Customer Leads', href: '/admin/customers', icon: Users },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] text-[#111814] flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E2EBE5] flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[#E2EBE5] flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Logo variant="dark" showSubtitle={false} size="sm" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EBF3ED] text-[#07552B] px-2 py-0.5 rounded-full border border-[#D0DDD4]">
                Console
              </span>
            </Link>
          </div>

          {/* Nav list */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-[#07552B] text-white shadow-sm'
                      : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-[#E2EBE5] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-full text-xs text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5] transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#07552B]" />
              <span>Public Website</span>
            </span>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5]">
            <div className="truncate mr-2">
              <span className="block text-xs font-bold text-[#111814] truncate">{user?.name}</span>
              <span className="block text-[10px] text-[#07552B] uppercase font-mono font-bold">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full text-[#526458] hover:text-red-600 hover:bg-red-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Mobile/Desktop */}
        <header className="h-16 bg-white border-b border-[#E2EBE5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-full bg-[#F4F7F5] border border-[#E2EBE5] text-[#526458] hover:text-[#111814]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#111814] uppercase tracking-tight">
              {navItems.find((n) => n.href === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[#526458]">
              Signed in as <span className="text-[#111814] font-semibold">{user?.email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#D0DDD4] text-[#526458] hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <div className="fixed left-0 top-0 bottom-0 w-4/5 max-w-xs bg-white border-r border-[#E2EBE5] p-5 flex flex-col justify-between z-50 shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E2EBE5]">
                  <Logo variant="dark" showSubtitle={false} size="sm" />
                  <button onClick={() => setIsMobileNavOpen(false)} className="text-[#526458] hover:text-[#111814]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          location.pathname === item.href
                            ? 'bg-[#07552B] text-white'
                            : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase hover:bg-red-100 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
