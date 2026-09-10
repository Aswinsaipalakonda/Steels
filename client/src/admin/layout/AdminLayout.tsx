import React, { useState, useEffect } from 'react';
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
  Clock,
  Building2,
  Bell,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Enquiries & Orders', href: '/admin/enquiries', icon: Inbox },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Hero Banners', href: '/admin/hero-slides', icon: Sliders },
    { label: 'Partner Brands', href: '/admin/brands', icon: Building2 },
    { label: 'Customer Leads', href: '/admin/customers', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] text-[#111814] flex font-sans">
      {/* Sidebar Desktop (Styled as in Reference Image 2 with Light Theme) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E2EBE5] flex-col justify-between shrink-0 shadow-sm z-20">
        <div>
          {/* Top Brand Header */}
          <div className="p-6 border-b border-[#E2EBE5]">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#07552B] text-white flex items-center justify-center font-black shadow-sm">
                <Logo variant="dark" showText={false} size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight uppercase leading-none font-sans text-[#111814]">
                  Steels
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold tracking-widest text-[#07552B] uppercase mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#07552B]" />
                  Industrial Supply
                </span>
              </div>
            </Link>
          </div>

          {/* Section Heading & Navigation list */}
          <div className="p-4">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#526458]">
              General Navigation
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'bg-[#07552B] text-white shadow-sm font-bold'
                        : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#526458]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer - Logout Action */}
        <div className="p-4 border-t border-[#E2EBE5]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50/70 hover:bg-red-100 hover:text-red-800 border border-red-200/60 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Matching Reference Image 2) */}
        <header className="h-16 bg-white border-b border-[#E2EBE5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Left: Mobile Toggle & Clock Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-full bg-[#F4F7F5] border border-[#E2EBE5] text-[#526458] hover:text-[#111814]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Clock Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFCFA] border border-[#E2EBE5] text-xs text-[#526458] shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#07552B]" />
              <span className="font-bold text-[10px] tracking-wider text-[#111814] uppercase">Admin Portal</span>
              <span className="font-mono text-xs font-bold text-[#07552B] pl-1 border-l border-[#E2EBE5]">
                {currentTime || '09:00:00 AM'}
              </span>
            </div>
          </div>

          {/* Right: Live Store Link & Admin User Capsule */}
          <div className="flex items-center gap-3">
            {/* Live Store Pill */}
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#07552B] border border-[#D0DDD4] text-xs font-bold hover:bg-[#d8e8dc] transition shadow-sm"
              title="View Public Storefront"
            >
              <span className="w-2 h-2 rounded-full bg-[#07552B] animate-pulse" />
              <span className="hidden sm:inline">Steels Store Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FAFCFA] border border-[#E2EBE5] shadow-sm">
              <div className="w-7 h-7 rounded-full bg-[#07552B] text-white flex items-center justify-center font-black text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-[#111814] leading-tight truncate max-w-[120px]">
                  {user?.name || 'Steels Admin'}
                </span>
                <span className="text-[9px] font-bold text-[#07552B] tracking-wider uppercase leading-tight font-mono">
                  {user?.role || 'SUPER ADMIN'}
                </span>
              </div>
            </div>
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
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#07552B] text-white flex items-center justify-center font-black">
                      <Logo variant="dark" showText={false} size="sm" />
                    </div>
                    <span className="font-black text-base uppercase text-[#111814]">Steels</span>
                  </div>
                  <button onClick={() => setIsMobileNavOpen(false)} className="text-[#526458] hover:text-[#111814]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 px-2 text-[10px] font-bold uppercase tracking-widest text-[#526458]">
                  General Navigation
                </div>
                <nav className="mt-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider ${
                          isActive
                            ? 'bg-[#07552B] text-white font-bold'
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
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

