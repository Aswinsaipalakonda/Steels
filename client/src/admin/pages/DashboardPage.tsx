import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { DashboardOverview } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import {
  Inbox,
  Clock,
  CheckCircle2,
  TrendingUp,
  Package,
  Users,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = () => {
    setIsLoading(true);
    api
      .get('/analytics/dashboard')
      .then((res: any) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => console.error('Failed to load dashboard:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-[#E2EBE5]" />
          ))}
        </div>
      </div>
    );
  }

  const ov = data?.overview;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111814] uppercase tracking-tight font-sans">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-[#526458] mt-1">
            Real-time pipeline metrics and sales quote volume.
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-white border border-[#D0DDD4] text-xs font-semibold text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5] flex items-center gap-1.5 transition shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#07552B]" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2EBE5] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#526458]">
            <span className="text-xs font-bold uppercase tracking-wider">New Enquiries</span>
            <Inbox className="w-4 h-4 text-[#07552B]" />
          </div>
          <div className="text-3xl font-black text-[#111814]">{ov?.newEnquiries || 0}</div>
          <span className="text-[11px] text-[#07552B] font-semibold block">Awaiting First Sales Contact</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EBE5] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#526458]">
            <span className="text-xs font-bold uppercase tracking-wider">Quotes Sent</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#111814]">{ov?.quotationSentEnquiries || 0}</div>
          <span className="text-[11px] text-[#526458] block">In Negotiation Pipeline</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EBE5] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#526458]">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Leads</span>
            <CheckCircle2 className="w-4 h-4 text-[#07552B]" />
          </div>
          <div className="text-3xl font-black text-[#111814]">{ov?.confirmedEnquiries || 0}</div>
          <span className="text-[11px] text-[#07552B] font-semibold block">Conversion: {ov?.conversionRate || '0%'}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EBE5] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#526458]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <Package className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-[#111814]">{ov?.activeProducts || 0}</div>
          <span className="text-[11px] text-[#526458] block">{ov?.totalCategories || 0} Steel Categories</span>
        </div>
      </div>

      {/* Main Row: Recent Enquiries & Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#E2EBE5] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111814] uppercase tracking-tight">Recent Incoming Enquiries</h3>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-[#07552B] hover:underline flex items-center gap-1">
              <span>View All Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2EBE5] text-[#526458] uppercase font-bold text-[10px]">
                <tr>
                  <th className="pb-3">Enquiry #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Requested Steel</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE5]">
                {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
                  data.recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#F4F7F5] transition">
                      <td className="py-3 font-mono font-bold text-[#07552B]">{enq.enquiryNumber}</td>
                      <td className="py-3">
                        <span className="font-bold text-[#111814] block">{enq.customer?.name}</span>
                        <span className="text-[11px] text-[#526458]">{enq.customer?.company || enq.customer?.phone}</span>
                      </td>
                      <td className="py-3 text-[#111814] font-medium">
                        {enq.product?.name || 'Bulk Project Bill'}
                      </td>
                      <td className="py-3">
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
                      <td className="py-3 text-[#526458] text-[11px]">{formatDate(enq.createdAt)}</td>
                      <td className="py-3 text-right">
                        <Link
                          to="/admin/enquiries"
                          className="px-3 py-1 rounded-full bg-white border border-[#D0DDD4] text-[#07552B] font-semibold hover:border-[#07552B] hover:bg-[#EBF3ED] transition"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#526458]">
                      No incoming customer enquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pipeline Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E2EBE5] space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-[#111814] uppercase tracking-tight">Status Distribution</h3>

          <div className="space-y-3">
            {data?.statusBreakdown.map((item) => (
              <div key={item.status} className="space-y-1 text-xs">
                <div className="flex justify-between text-[#526458]">
                  <span className="font-semibold uppercase tracking-wider">{item.status}</span>
                  <span className="font-mono font-bold text-[#111814]">{item.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E2EBE5] overflow-hidden">
                  <div
                    className="h-full bg-[#07552B] rounded-full"
                    style={{
                      width: `${
                        ov?.totalEnquiries ? Math.min(100, (item.count / ov.totalEnquiries) * 100) : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E2EBE5] space-y-3">
            <h4 className="text-xs font-bold uppercase text-[#526458]">Quick Actions</h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/admin/products"
                className="p-3 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] hover:border-[#07552B] text-xs font-semibold text-[#111814] flex items-center justify-between transition"
              >
                <span>Add New Steel Product</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#07552B]" />
              </Link>
              <Link
                to="/admin/categories"
                className="p-3 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] hover:border-[#07552B] text-xs font-semibold text-[#111814] flex items-center justify-between transition"
              >
                <span>Manage Categories</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#07552B]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
