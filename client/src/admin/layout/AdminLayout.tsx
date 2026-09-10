import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
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
    <div className="min-h-screen bg-steel-darkest text-steel-purewhite flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-steel-forest border-r border-steel-rich flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-steel-rich flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-steel-primary border border-steel-accent flex items-center justify-center font-bold text-xs text-emerald-400">
                APEX
              </div>
              <span className="font-bold text-sm uppercase text-white tracking-tight">Admin Console</span>
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-steel-accent text-white border border-emerald-500/40 shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-steel-darkest/60'
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
        <div className="p-4 border-t border-steel-rich space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-steel-olive hover:text-white hover:bg-steel-darkest transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-xl bg-steel-darkest border border-steel-rich">
            <div className="truncate mr-2">
              <span className="block text-xs font-bold text-white truncate">{user?.name}</span>
              <span className="block text-[10px] text-emerald-400 uppercase font-mono">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-steel-forest transition"
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
        <header className="h-16 bg-steel-forest/80 border-b border-steel-rich px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-lg bg-steel-darkest border border-steel-rich text-zinc-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
              {navItems.find((n) => n.href === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-steel-olive">
              Signed in as <span className="text-white font-semibold">{user?.email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-steel-darkest border border-steel-rich text-zinc-300 hover:text-red-400 transition"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="fixed left-0 top-0 bottom-0 w-4/5 max-w-xs bg-steel-forest border-r border-steel-rich p-5 flex flex-col justify-between z-50">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-steel-rich">
                  <span className="font-bold text-sm uppercase text-white">Apex Steel Console</span>
                  <button onClick={() => setIsMobileNavOpen(false)} className="text-steel-olive hover:text-white">
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
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider ${
                          location.pathname === item.href
                            ? 'bg-steel-accent text-white'
                            : 'text-zinc-400 hover:text-white'
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
                className="w-full py-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs font-bold uppercase"
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
