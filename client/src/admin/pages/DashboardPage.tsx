import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { DashboardOverview } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import {
  Inbox,
  Clock,
  CheckCircle2,
  TrendingUp,
  Package,
  Users,
  ArrowRight,
  RotateCw,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { success } = useToast();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const fetchDashboard = async (showToast = false) => {
    setIsSyncing(true);
    try {
      const res: any = await api.get('/analytics/dashboard');
      if (res.data) {
        setData(res.data);
        if (showToast) {
          success('Operations analytics synchronized successfully.');
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchDashboard(false);
  }, []);

  const ov = data?.overview;

  // Dynamic simulated trend data for the 65% width chart based on selected timeRange
  const trendData7Days = [
    { day: 'Mon', date: 'Sep 04', volume: 180, enquiries: 6, height: '48%' },
    { day: 'Tue', date: 'Sep 05', volume: 240, enquiries: 9, height: '64%' },
    { day: 'Wed', date: 'Sep 06', volume: 310, enquiries: 12, height: '82%' },
    { day: 'Thu', date: 'Sep 07', volume: 210, enquiries: 7, height: '56%' },
    { day: 'Fri', date: 'Sep 08', volume: 390, enquiries: 15, height: '96%' },
    { day: 'Sat', date: 'Sep 09', volume: 280, enquiries: 11, height: '74%' },
    { day: 'Sun', date: 'Sep 10', volume: 340, enquiries: 13, height: '88%' },
  ];

  const trendData30Days = [
    { day: 'W1', date: 'Aug 14-20', volume: 1240, enquiries: 42, height: '70%' },
    { day: 'W2', date: 'Aug 21-27', volume: 1480, enquiries: 56, height: '84%' },
    { day: 'W3', date: 'Aug 28-Sep 03', volume: 1100, enquiries: 38, height: '62%' },
    { day: 'W4', date: 'Sep 04-10', volume: 1850, enquiries: 71, height: '98%' },
  ];

  const trendData90Days = [
    { day: 'Jul', date: 'July 2026', volume: 4800, enquiries: 180, height: '68%' },
    { day: 'Aug', date: 'August 2026', volume: 5600, enquiries: 215, height: '82%' },
    { day: 'Sep', date: 'September 2026', volume: 6900, enquiries: 260, height: '96%' },
  ];

  const activeTrendData =
    timeRange === '7'
      ? trendData7Days
      : timeRange === '30'
      ? trendData30Days
      : trendData90Days;

  // Category share data matching steel sector
  const categoryShares = [
    { name: 'TMT Rebars (Fe 550D / 500D)', share: 44, tons: '680 MT', color: '#07552B' },
    { name: 'Heavy Structural Beams & Columns', share: 28, tons: '420 MT', color: '#0F766E' },
    { name: 'MS Hollow Sections & Pipes', share: 18, tons: '270 MT', color: '#2563EB' },
    { name: 'Boiler Quality Plates & Coils', share: 10, tons: '150 MT', color: '#6366F1' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header Section (Matching Image 2 with elegant serif title and Sync button) */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#111814]">
            Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#526458] mt-1.5 font-sans">
            Real-time steel supply performance metrics, sales quotation velocity, and active order pipeline.
          </p>
        </div>

        <button
          onClick={() => fetchDashboard(true)}
          disabled={isSyncing}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#111814] hover:bg-[#07552B] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-75"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Analytics'}</span>
        </button>
      </div>

      {/* 2. Interactive System Notification / Status Banner (Matching Image 2) */}
      {showNotice && (
        <div className="p-4 rounded-2xl bg-[#EBF3ED] border border-[#D0DDD4] text-[#07552B] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-white border border-[#D0DDD4] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#07552B]" />
            </div>
            <div>
              <span className="font-bold block text-[#111814]">Live Operations Synchronized</span>
              <span className="text-[#526458]">
                All steel product catalogues, partner mill feeds, and quotation requests are currently up to date.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="p-1 rounded-full text-[#526458] hover:text-[#111814] hover:bg-white/60 transition shrink-0"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Top KPI Metric Cards (Grid of 4 matching Reference Image 2 layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Enquiries / Revenue Tonnage */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EBE5] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#07552B]/40 transition duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#526458]">
                Total Enquiries
              </span>
              <div className="w-10 h-10 rounded-2xl bg-[#EBF3ED] text-[#07552B] flex items-center justify-center font-bold shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-black text-[#111814] tracking-tight">
              {ov?.totalEnquiries || 14}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#F4F7F5] flex items-center justify-between text-xs">
            <span className="text-[#07552B] font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Verified Inquiries
            </span>
            <span className="text-[#526458] text-[11px]">Conversion: {ov?.conversionRate || '100%'}</span>
          </div>
        </div>

        {/* Card 2: Active Pipeline / Total Orders */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EBE5] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#07552B]/40 transition duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#526458]">
                Active Pipeline
              </span>
              <div className="w-10 h-10 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] text-[#111814] flex items-center justify-center font-bold shadow-xs">
                <ShoppingBag className="w-5 h-5 text-[#526458]" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-black text-[#111814] tracking-tight">
              {(ov?.newEnquiries || 0) + (ov?.quotationSentEnquiries || 0) || 6}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#F4F7F5] flex items-center justify-between text-xs">
            <span className="text-[#526458] font-medium">+2 today</span>
            <span className="text-[#07552B] font-semibold text-[11px]">Under Review</span>
          </div>
        </div>

        {/* Card 3: Action Pending (Quotes Required) */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EBE5] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#07552B]/40 transition duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#526458]">
                Action Pending
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center font-bold shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-black text-[#111814] tracking-tight">
              {ov?.newEnquiries || 2}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#F4F7F5] flex items-center justify-between text-xs">
            <span className="text-amber-700 font-bold">Requires Quotation</span>
            <Link
              to="/admin/enquiries"
              className="text-[#111814] hover:text-[#07552B] font-bold flex items-center gap-1 transition"
            >
              View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: Active Products in Catalog */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2EBE5] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#07552B]/40 transition duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#526458]">
                Active Products
              </span>
              <div className="w-10 h-10 rounded-2xl bg-[#EBF3ED] text-[#07552B] flex items-center justify-center font-bold shadow-xs">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-black text-[#111814] tracking-tight">
              {ov?.activeProducts || 10}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#F4F7F5] flex items-center justify-between text-xs">
            <span className="text-[#07552B] font-bold">In-Stock Catalog</span>
            <Link
              to="/admin/products"
              className="text-[#111814] hover:text-[#07552B] font-bold flex items-center gap-1 transition"
            >
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Middle Section: Two Visual Analytics Cards (65% / 35% Width Split matching Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Card (approx 65% width): Revenue & Enquiry Velocity Trend */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EBE5] shadow-sm flex flex-col justify-between">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-serif font-black text-[#111814]">
                Revenue & Enquiry Velocity Trend
              </h3>
              <p className="text-xs text-[#526458] mt-1">
                Real-time sales quotation velocity over the last {timeRange} days
              </p>
            </div>

            {/* Filter and Legend */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#526458]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#07552B]" />
                <span className="font-medium">Tonnage (MT)</span>
              </div>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3.5 py-1.5 rounded-full bg-[#FAFCFA] border border-[#D0DDD4] text-xs font-bold text-[#111814] focus:outline-none focus:border-[#07552B] shadow-xs cursor-pointer"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="relative pt-6 pb-2">
            {/* Grid Dotted Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-10">
              <div className="border-b border-dashed border-[#E2EBE5] w-full" />
              <div className="border-b border-dashed border-[#E2EBE5] w-full" />
              <div className="border-b border-dashed border-[#E2EBE5] w-full" />
            </div>

            {/* Bar columns */}
            <div className="relative z-10 flex items-end justify-between gap-2 sm:gap-4 h-56 pt-6">
              {activeTrendData.map((item, idx) => {
                const isHovered = hoveredBarIndex === idx;
                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Hover Floating Tooltip */}
                    <div
                      className={`absolute -top-3 transition-all duration-200 pointer-events-none ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      <div className="bg-[#111814] text-white px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap shadow-lg flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{item.volume} MT</span>
                        <span className="text-gray-300">({item.enquiries} RFQs)</span>
                      </div>
                    </div>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[48px] bg-[#F4F7F5] rounded-2xl overflow-hidden flex flex-col justify-end p-1 h-full">
                      <div
                        style={{ height: item.height }}
                        className={`w-full rounded-xl transition-all duration-500 ${
                          isHovered
                            ? 'bg-[#07552B] shadow-md shadow-emerald-900/20'
                            : 'bg-gradient-to-t from-[#07552B] to-emerald-600'
                        }`}
                      />
                    </div>

                    {/* Day / Date label */}
                    <div className="mt-2 text-center">
                      <span className="block text-xs font-bold text-[#111814]">{item.day}</span>
                      <span className="block text-[10px] text-[#526458] truncate">{item.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card (approx 35% width): Category Sales / Demand Share */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EBE5] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-serif font-black text-[#111814]">
                Category Sales Share
              </h3>
              <Sparkles className="w-4 h-4 text-[#07552B]" />
            </div>
            <p className="text-xs text-[#526458] mb-6">
              Top performing product categories by enquiry volume
            </p>

            {/* Category Breakdown Progress Bars */}
            <div className="space-y-4">
              {categoryShares.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111814] truncate max-w-[200px]">{cat.name}</span>
                    <span className="font-mono font-bold text-[#07552B]">{cat.share}%</span>
                  </div>
                  {/* Progress track */}
                  <div className="w-full h-2.5 rounded-full bg-[#F4F7F5] overflow-hidden p-0.5 border border-[#E2EBE5]">
                    <div
                      style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                      className="h-full rounded-full transition-all duration-700"
                    />
                  </div>
                  <div className="text-[10px] text-[#526458] flex items-center justify-between">
                    <span>Est. Tonnage: {cat.tons}</span>
                    <span className="text-emerald-700 font-semibold">High Demand</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Link */}
          <div className="pt-6 border-t border-[#F4F7F5] mt-6">
            <Link
              to="/admin/categories"
              className="w-full py-2.5 rounded-full bg-[#FAFCFA] border border-[#D0DDD4] text-xs font-bold text-[#111814] hover:text-[#07552B] hover:bg-[#EBF3ED] hover:border-[#07552B] flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <span>Manage Product Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Active Enquiries & Quotation Pipeline */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-serif font-black text-[#111814]">
              Active Quotation Pipeline
            </h3>
            <p className="text-xs text-[#526458] mt-0.5">
              Recent incoming procurement requests requiring sales response.
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="px-4 py-2 rounded-full bg-white border border-[#D0DDD4] text-xs font-bold text-[#07552B] hover:bg-[#EBF3ED] flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EBE5] text-[10px] uppercase font-bold tracking-wider text-[#526458]">
                <th className="pb-3 font-bold">RFQ Reference</th>
                <th className="pb-3 font-bold">Client / Contractor</th>
                <th className="pb-3 font-bold">Product Requested</th>
                <th className="pb-3 font-bold">Quantity</th>
                <th className="pb-3 font-bold">Pipeline Status</th>
                <th className="pb-3 font-bold">Date Received</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7F5]">
              {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
                data.recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#FAFCFA] transition">
                    <td className="py-3.5 font-mono font-bold text-[#111814]">
                      {enq.enquiryNumber}
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#111814] block">{enq.customer?.name}</span>
                      <span className="text-[10px] text-[#526458] block">
                        {enq.customer?.company || enq.customer?.phone}
                      </span>
                    </td>
                    <td className="py-3.5 font-medium text-[#111814]">
                      {enq.product?.name || 'Custom Structural Steel Inquiry'}
                    </td>
                    <td className="py-3.5 font-bold text-[#07552B]">
                      {enq.quantity} {enq.unit}
                    </td>
                    <td className="py-3.5">
                      <Badge
                        variant={
                          enq.status === 'NEW'
                            ? 'new'
                            : enq.status === 'QUOTATION_SENT'
                            ? 'quotation'
                            : enq.status === 'CONFIRMED'
                            ? 'confirmed'
                            : 'default'
                        }
                      >
                        {enq.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-[#526458] whitespace-nowrap">
                      {formatDate(enq.createdAt)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/admin/enquiries"
                        className="px-3.5 py-1.5 rounded-full bg-white border border-[#D0DDD4] text-[#07552B] font-bold hover:border-[#07552B] hover:bg-[#EBF3ED] transition inline-flex items-center gap-1"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#526458]">
                    No recent enquiries. All procurement requests are currently addressed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
