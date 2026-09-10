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
  Building2,
  Home,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Enquiries & Orders', href: '/admin/enquiries', icon: Inbox, badge: 'New' },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Hero Banners', href: '/admin/hero-slides', icon: Sliders },
    { label: 'Partner Brands', href: '/admin/brands', icon: Building2, badge: 'Active' },
    { label: 'Customer Leads', href: '/admin/customers', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Determine current active section for breadcrumbs
  const currentNavItem = navItems.find(
    (item) =>
      location.pathname === item.href ||
      (item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href))
  );
  const activeLabel = currentNavItem?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#FAFCFA] text-[#111814] flex font-sans">
      {/* Sidebar Desktop: Deep Luxury Forest-Night Container with Compact Spacing (Reference Image) */}
      <aside className="hidden lg:flex w-64 bg-[#061B12] flex-col justify-between shrink-0 shadow-2xl z-20 sticky top-0 h-screen border-r border-[#04150E] overflow-y-auto">
        <div className="flex flex-col">
          {/* Top Brand Header */}
          <div className="p-5 pb-4 flex items-center gap-3 border-b border-white/10">
            {/* White Circular Badge with Steels Logo */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-md shrink-0">
              <img src="/S_logo.png" alt="Steels" className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-black text-base text-white tracking-tight uppercase leading-none font-sans truncate">
                Steels
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 tracking-wider uppercase mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">Industrial Supply</span>
              </span>
            </div>
          </div>

          {/* Section Header */}
          <div className="px-5 pt-4 pb-1.5 text-[10px] font-extrabold tracking-widest text-emerald-100/40 uppercase">
            General Navigation
          </div>

          {/* Navigation Links: Snug, compact spacing (space-y-1.5) matching reference layout */}
          <nav className="px-3 pt-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-[#061B12] font-black shadow-md'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#07552B]' : 'text-emerald-400/80 group-hover:text-white'
                      }`}
                    />
                    <span className="truncate tracking-wide">{item.label}</span>
                  </div>

                  {/* Subtle status indicators / badges */}
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#07552B] shrink-0" />
                  ) : item.badge ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 group-hover:bg-white/20 transition">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned Sign Out Action (Matching Reference Image Bottom Left) */}
        <div className="p-4 pb-5 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full transition-colors w-full"
          >
            <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Breadcrumbs on Left, Role Pill & Store Link on Right) */}
        <header className="h-16 bg-white border-b border-[#E2EBE5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Mobile Toggle & Breadcrumb Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-full bg-[#F4F7F5] border border-[#E2EBE5] text-[#526458] hover:text-[#111814]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation: ⌂ > Admin > ActiveSection */}
            <div className="flex items-center gap-2 text-xs text-[#526458] font-medium">
              <Link
                to="/admin/dashboard"
                className="hover:text-[#07552B] transition flex items-center p-1 rounded-md hover:bg-[#F4F7F5]"
                title="Go to Dashboard"
              >
                <Home className="w-3.5 h-3.5" />
              </Link>
              <ChevronRight className="w-3 h-3 text-[#D0DDD4]" />
              <span className="text-[#526458]">Admin</span>
              <ChevronRight className="w-3 h-3 text-[#D0DDD4]" />
              <span className="font-black text-[#111814]">{activeLabel}</span>
            </div>
          </div>

          {/* Right: Live Store Link & System Administrator Pill (Reference Image 2 Top Right) */}
          <div className="flex items-center gap-3">
            {/* Storefront Link Pill */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBF3ED] border border-[#D0DDD4] text-[#07552B] text-xs font-bold hover:bg-[#d8e8dc] transition shadow-xs"
              title="Open Public Storefront in new tab"
            >
              <span className="w-2 h-2 rounded-full bg-[#07552B] animate-pulse" />
              <span>Steels Store Live</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* System Administrator Role Capsule */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#061B12] text-white text-xs font-bold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="tracking-wide">{user?.name || 'System Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div className="fixed left-0 top-0 bottom-0 w-4/5 max-w-xs bg-[#061B12] p-5 flex flex-col justify-between z-50 shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                      <img src="/S_logo.png" alt="Steels" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black text-base text-white uppercase">Steels</span>
                  </div>
                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="text-emerald-200 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-1 pt-4 pb-1.5 text-[10px] font-extrabold tracking-widest text-emerald-100/40 uppercase">
                  General Navigation
                </div>

                <nav className="mt-1 space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.href ||
                      (item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs transition ${
                          isActive
                            ? 'bg-white text-[#061B12] font-black shadow-lg'
                            : 'text-emerald-100/75 hover:text-white hover:bg-white/10 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#07552B]' : 'text-emerald-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#07552B]" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 w-full"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
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
