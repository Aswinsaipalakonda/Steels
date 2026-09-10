import React, { useState, useEffect, useMemo } from 'react';
import api from '../../lib/api';
import { Enquiry } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/utils';
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  FileText,
  Download,
  List,
  Columns,
  Calculator,
  Copy,
  Check,
  Building2,
  User,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Send,
  MessageSquare,
  X,
  Edit3,
  Save,
  Eye,
  Tag,
} from 'lucide-react';

type ViewMode = 'table' | 'kanban';
type DrawerTab = 'details' | 'edit' | 'calculator' | 'history';

export const EnquiriesAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'quantity'>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isLoading, setIsLoading] = useState(true);

  // Sliding Side Window (Drawer) State
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>('details');

  // Edit / Update Form States
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editQuantity, setEditQuantity] = useState<string | number>(10);
  const [editUnit, setEditUnit] = useState('MT');
  const [editStatus, setEditStatus] = useState('NEW');
  const [editStatusNote, setEditStatusNote] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Quotation Calculator states
  const [ratePerMt, setRatePerMt] = useState<number>(54500);
  const [freightCharges, setFreightCharges] = useState<number>(3500);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const loadEnquiries = () => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (statusFilter && statusFilter !== 'ALL') query.set('status', statusFilter);

    api
      .get(`/enquiries?${query.toString()}`)
      .then((res: any) => {
        if (res.data) setEnquiries(res.data);
      })
      .catch((err) => error(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  // Handle ESC key to smoothly close the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        handleCloseDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Status counts for tabs and top KPIs
  const counts = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'NEW').length;
    const contactedCount = enquiries.filter((e) => e.status === 'CONTACTED').length;
    const quotedCount = enquiries.filter((e) => e.status === 'QUOTATION_SENT').length;
    const negotiationCount = enquiries.filter((e) => e.status === 'NEGOTIATION').length;
    const confirmedCount = enquiries.filter((e) => e.status === 'CONFIRMED').length;
    const completedCount = enquiries.filter((e) => e.status === 'COMPLETED').length;
    const cancelledCount = enquiries.filter((e) => e.status === 'CANCELLED').length;
    const inProgressCount = contactedCount + quotedCount + negotiationCount;

    const totalTonnage = enquiries.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    return {
      total,
      newCount,
      contactedCount,
      quotedCount,
      negotiationCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      inProgressCount,
      totalTonnage,
    };
  }, [enquiries]);

  // Client-side filtered and sorted list
  const filteredEnquiries = useMemo(() => {
    let list = [...enquiries];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.enquiryNumber.toLowerCase().includes(q) ||
          e.customer?.name.toLowerCase().includes(q) ||
          e.customer?.phone.toLowerCase().includes(q) ||
          e.customer?.email.toLowerCase().includes(q) ||
          e.customer?.company?.toLowerCase().includes(q) ||
          e.product?.name.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((e) => e.status === statusFilter);
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'quantity') {
      list.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    }

    return list;
  }, [enquiries, search, statusFilter, sortBy]);

  // Open Sliding Window from right to left
  const handleOpenDetail = async (id: string, tab: DrawerTab = 'details') => {
    try {
      const res: any = await api.get(`/enquiries/${id}`);
      if (res.data) {
        const item = res.data;
        setSelectedEnquiry(item);

        // Pre-fill editable fields
        setEditName(item.customer?.name || '');
        setEditPhone(item.customer?.phone || '');
        setEditEmail(item.customer?.email || '');
        setEditCompany(item.customer?.company || '');
        setEditLocation(item.location || item.customer?.location || '');
        setEditQuantity(item.quantity || 10);
        setEditUnit(item.unit || 'MT');
        setEditStatus(item.status || 'NEW');
        setEditStatusNote('');
        setEditInternalNotes(item.internalNotes || '');

        setActiveDrawerTab(tab);
        setIsDrawerOpen(true);
      }
    } catch (err: any) {
      error(err.message || 'Failed to retrieve enquiry details');
    }
  };

  // Close Sliding Window from left to right slowly
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Save Edit & Update Record
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setIsSavingEdit(true);
    try {
      const payload = {
        quantity: editQuantity ? Number(editQuantity) : null,
        unit: editUnit,
        location: editLocation,
        internalNotes: editInternalNotes,
        status: editStatus,
        statusNote: editStatusNote.trim() || undefined,
        customer: {
          name: editName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim(),
          company: editCompany.trim(),
          location: editLocation.trim(),
        },
      };

      const res: any = await api.put(`/enquiries/${selectedEnquiry.id}`, payload);
      if (res.data) {
        setSelectedEnquiry(res.data);
        success(`Enquiry #${selectedEnquiry.enquiryNumber} updated successfully.`);
        loadEnquiries();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update enquiry record.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      error('No records available to export.');
      return;
    }

    const headers = [
      'Enquiry Number',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Company',
      'Product',
      'Variant',
      'Quantity (MT)',
      'Delivery Location',
      'Status',
    ];

    const rows = filteredEnquiries.map((e) => [
      `"${e.enquiryNumber}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`,
      `"${e.customer?.name || ''}"`,
      `"${e.customer?.phone || ''}"`,
      `"${e.customer?.email || ''}"`,
      `"${e.customer?.company || ''}"`,
      `"${e.product?.name || 'Steel Bill'}"`,
      `"${e.variant?.name || ''}"`,
      e.quantity || 0,
      `"${e.location || ''}"`,
      `"${e.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Steels_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Enquiries pipeline exported to CSV');
  };

  // Quotation Calculations
  const qty = Number(editQuantity) || selectedEnquiry?.quantity || 10;
  const baseTotal = qty * ratePerMt;
  const freightTotal = freightCharges;
  const subtotal = baseTotal + freightTotal;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const handleCopyQuoteText = () => {
    if (!selectedEnquiry) return;
    const text = `*COMMERCIAL STEEL QUOTATION*\nReference: #${selectedEnquiry.enquiryNumber}\nCustomer: ${editName || selectedEnquiry.customer?.name} (${editCompany || selectedEnquiry.customer?.company || 'Commercial Buyer'})\n\nProduct: ${selectedEnquiry.product?.name || 'Commercial Steel'}\nQuantity: ${qty} MT\n\nBase Rate: ₹${ratePerMt.toLocaleString('en-IN')}/MT\nBase Amount: ₹${baseTotal.toLocaleString('en-IN')}\nFreight & Transit: ₹${freightTotal.toLocaleString('en-IN')}\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\nGST (18%): ₹${gst.toLocaleString('en-IN')}\n*TOTAL QUOTATION VALUE: ₹${grandTotal.toLocaleString('en-IN')}*\n\nTerms: Direct factory dispatch with mill test certificate. 100% digital weighment.`;

    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    success('Quotation summary copied to clipboard!');
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  // Kanban column definitions with associated colors
  const kanbanColumns = [
    { key: 'NEW', title: 'New Requests', headerCls: 'bg-amber-50 text-amber-900 border-amber-200', countCls: 'bg-amber-200 text-amber-950' },
    { key: 'CONTACTED', title: 'Contacted', headerCls: 'bg-sky-50 text-sky-900 border-sky-200', countCls: 'bg-sky-200 text-sky-950' },
    { key: 'QUOTATION_SENT', title: 'Quotation Sent', headerCls: 'bg-purple-50 text-purple-900 border-purple-200', countCls: 'bg-purple-200 text-purple-950' },
    { key: 'NEGOTIATION', title: 'In Negotiation', headerCls: 'bg-indigo-50 text-indigo-900 border-indigo-200', countCls: 'bg-indigo-200 text-indigo-950' },
    { key: 'CONFIRMED', title: 'Confirmed Orders', headerCls: 'bg-emerald-50 text-emerald-900 border-emerald-200', countCls: 'bg-emerald-200 text-emerald-950' },
  ];

  // Status badge with rich colors and interactive visual cue
  const renderStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; cls: string; dot: string }> = {
      NEW: {
        label: 'NEW',
        cls: 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400/30',
        dot: 'bg-amber-500 animate-ping',
      },
      CONTACTED: {
        label: 'CONTACTED',
        cls: 'bg-sky-100 text-sky-900 border-sky-300 ring-1 ring-sky-400/30',
        dot: 'bg-sky-500',
      },
      QUOTATION_SENT: {
        label: 'QUOTED',
        cls: 'bg-purple-100 text-purple-900 border-purple-300 ring-1 ring-purple-400/30',
        dot: 'bg-purple-500',
      },
      NEGOTIATION: {
        label: 'NEGOTIATION',
        cls: 'bg-indigo-100 text-indigo-900 border-indigo-300 ring-1 ring-indigo-400/30',
        dot: 'bg-indigo-500',
      },
      CONFIRMED: {
        label: 'CONFIRMED',
        cls: 'bg-emerald-100 text-emerald-950 border-emerald-400 ring-1 ring-emerald-500/30 font-black',
        dot: 'bg-emerald-600',
      },
      COMPLETED: {
        label: 'COMPLETED',
        cls: 'bg-teal-100 text-teal-900 border-teal-300 ring-1 ring-teal-400/30',
        dot: 'bg-teal-500',
      },
      CANCELLED: {
        label: 'CANCELLED',
        cls: 'bg-rose-100 text-rose-900 border-rose-300 ring-1 ring-rose-400/30',
        dot: 'bg-rose-500',
      },
    };

    const cfg = configs[status] || {
      label: status.replace(/_/g, ' '),
      cls: 'bg-slate-100 text-slate-800 border-slate-300',
      dot: 'bg-slate-400',
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs whitespace-nowrap ${cfg.cls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
        <span>{cfg.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12 relative">
      {/* 1. Page Header with Title & Top Actions */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#111814]">
              Quotation & Order Pipeline
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-[#526458] mt-1 font-sans">
            Track commercial inquiries from buyer discovery to quotation dispatch, negotiations, and order delivery.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
            title="Download CSV export"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadEnquiries}
            disabled={isLoading}
            className="p-2.5 rounded-full bg-[#061B12] hover:bg-[#07552B] text-white transition-all shadow-xs hover:shadow-md active:scale-95 disabled:opacity-70"
            title="Refresh pipeline"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Interactive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Inquiries */}
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md ${
            statusFilter === 'ALL' ? 'border-[#07552B] ring-2 ring-[#07552B]/20 bg-emerald-50/20' : 'border-[#E2EBE5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526458]">Total Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-[#111814]">{counts.total}</div>
          <div className="mt-2 text-xs text-[#526458] flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-[#07552B]" />
            <span>{counts.totalTonnage} MT total requested</span>
          </div>
        </div>

        {/* Action Required (NEW) */}
        <div
          onClick={() => setStatusFilter('NEW')}
          className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md ${
            statusFilter === 'NEW' ? 'border-amber-500 ring-2 ring-amber-500/25 bg-amber-50/20' : 'border-[#E2EBE5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Action Required</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-amber-900">{counts.newCount}</div>
          <div className="mt-2 text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Awaiting initial contact</span>
          </div>
        </div>

        {/* In Progress Deals */}
        <div
          onClick={() => setStatusFilter('QUOTATION_SENT')}
          className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md ${
            statusFilter === 'QUOTATION_SENT' ? 'border-blue-600 ring-2 ring-blue-600/25 bg-blue-50/20' : 'border-[#E2EBE5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">In Active Flow</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-blue-900">{counts.inProgressCount}</div>
          <div className="mt-2 text-xs text-blue-700 font-medium">
            {counts.quotedCount} quoted • {counts.negotiationCount} negotiating
          </div>
        </div>

        {/* Confirmed Orders */}
        <div
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md ${
            statusFilter === 'CONFIRMED' ? 'border-emerald-600 ring-2 ring-emerald-600/25 bg-emerald-50/20' : 'border-[#E2EBE5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Confirmed Orders</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#07552B] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-black text-[#07552B]">{counts.confirmedCount}</div>
          <div className="mt-2 text-xs text-emerald-800 font-medium">
            Conversion: {counts.total > 0 ? Math.round(((counts.confirmedCount + counts.completedCount) / counts.total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & View Toggle */}
      <div className="bg-white border border-[#E2EBE5] rounded-3xl p-4 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Input
            placeholder="Search by enquiry #, buyer, phone, steel grade, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-xs rounded-full bg-[#F4F7F5] border-[#D0DDD4] focus:border-[#07552B]"
          />
          <Search className="w-4 h-4 text-[#526458] absolute left-3.5 top-3" />
        </div>

        {/* Controls: Sort and View Mode */}
        <div className="flex items-center gap-3 flex-wrap justify-between lg:justify-end">
          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs text-[#526458]">
            <span className="font-semibold hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#D0DDD4] rounded-full px-3.5 py-1.5 text-xs text-[#111814] font-semibold focus:outline-none focus:border-[#07552B]"
            >
              <option value="newest">Newest Inquiries First</option>
              <option value="oldest">Oldest Inquiries First</option>
              <option value="quantity">Highest Volume (MT)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#EBF3ED] p-1 rounded-full border border-[#D0DDD4]">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-[#07552B] text-white shadow-xs' : 'text-[#07552B] hover:text-[#053d1f]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-[#07552B] text-white shadow-xs' : 'text-[#07552B] hover:text-[#053d1f]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pipeline Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Quick Status Pills with Thematic Colors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none">
        {[
          {
            key: 'ALL',
            label: 'All Inquiries',
            count: counts.total,
            activeCls: 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/30',
            inactiveCls: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-slate-200 text-slate-900 font-bold',
          },
          {
            key: 'NEW',
            label: 'New',
            count: counts.newCount,
            activeCls: 'bg-amber-500 text-white shadow-md ring-2 ring-amber-500/30',
            inactiveCls: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-amber-200 text-amber-950 font-black',
          },
          {
            key: 'CONTACTED',
            label: 'Contacted',
            count: counts.contactedCount,
            activeCls: 'bg-sky-600 text-white shadow-md ring-2 ring-sky-600/30',
            inactiveCls: 'bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-sky-200 text-sky-950 font-black',
          },
          {
            key: 'QUOTATION_SENT',
            label: 'Quotation Sent',
            count: counts.quotedCount,
            activeCls: 'bg-purple-600 text-white shadow-md ring-2 ring-purple-600/30',
            inactiveCls: 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-purple-200 text-purple-950 font-black',
          },
          {
            key: 'NEGOTIATION',
            label: 'Negotiation',
            count: counts.negotiationCount,
            activeCls: 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600/30',
            inactiveCls: 'bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-indigo-200 text-indigo-950 font-black',
          },
          {
            key: 'CONFIRMED',
            label: 'Confirmed',
            count: counts.confirmedCount,
            activeCls: 'bg-[#07552B] text-white shadow-md ring-2 ring-[#07552B]/30',
            inactiveCls: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-emerald-200 text-emerald-950 font-black',
          },
          {
            key: 'COMPLETED',
            label: 'Completed',
            count: counts.completedCount,
            activeCls: 'bg-teal-600 text-white shadow-md ring-2 ring-teal-600/30',
            inactiveCls: 'bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-teal-200 text-teal-950 font-black',
          },
          {
            key: 'CANCELLED',
            label: 'Cancelled',
            count: counts.cancelledCount,
            activeCls: 'bg-rose-600 text-white shadow-md ring-2 ring-rose-600/30',
            inactiveCls: 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100',
            badgeActive: 'bg-white/20 text-white',
            badgeInactive: 'bg-rose-200 text-rose-950 font-black',
          },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 border active:scale-95 ${
                isActive ? tab.activeCls : tab.inactiveCls
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  isActive ? tab.badgeActive : tab.badgeInactive
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. Main Content: Table View OR Kanban Board */}
      {viewMode === 'table' ? (
        <div className="rounded-3xl bg-white border border-[#E2EBE5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2EBE5] text-[#526458] uppercase font-bold text-[10px] bg-[#F4F7F5]">
                <tr>
                  <th className="py-4 px-5">Enquiry Reference</th>
                  <th className="py-4 px-5">Buyer & Organization</th>
                  <th className="py-4 px-5">Steel Requirements</th>
                  <th className="py-4 px-5">Required Volume</th>
                  <th className="py-4 px-5">Pipeline Status</th>
                  <th className="py-4 px-5">Received</th>
                  <th className="py-4 px-5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE5]">
                {filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enq) => {
                    const initials = enq.customer?.name
                      ? enq.customer.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'B';

                    return (
                      <tr key={enq.id} className="hover:bg-emerald-50/40 even:bg-slate-50/40 transition-colors group">
                        {/* Enquiry # */}
                        <td className="py-4 px-5">
                          <button
                            onClick={() => handleOpenDetail(enq.id, 'details')}
                            className="font-mono text-xs font-bold text-[#07552B] bg-[#EBF3ED] hover:bg-[#07552B] hover:text-white px-2.5 py-1 rounded-md border border-[#D0DDD4] inline-flex items-center gap-1 transition-all group-hover:border-[#07552B] shadow-2xs active:scale-95"
                            title="Inspect & manage record"
                          >
                            <span>{enq.enquiryNumber}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                          </button>
                          {enq.location && (
                            <span className="text-[10px] text-[#526458] flex items-center gap-1 mt-1 truncate max-w-[150px]">
                              <MapPin className="w-3 h-3 text-[#07552B] shrink-0" />
                              <span className="truncate">{enq.location}</span>
                            </span>
                          )}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#07552B] to-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs ring-2 ring-white">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-[#111814] block text-xs truncate">
                                {enq.customer?.name}
                              </span>
                              {enq.customer?.company && (
                                <span className="text-[11px] text-[#526458] block truncate font-medium">
                                  {enq.customer.company}
                                </span>
                              )}
                              <div className="flex items-center gap-2 text-[10px] text-[#526458] mt-0.5">
                                <a
                                  href={`tel:${enq.customer?.phone}`}
                                  className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5"
                                  title="Direct phone call"
                                >
                                  <Phone className="w-2.5 h-2.5" />
                                  <span>{enq.customer?.phone}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Product Requirement */}
                        <td className="py-4 px-5">
                          <span className="font-bold text-[#111814] block text-xs">
                            {enq.product?.name || 'Commercial Steel Project'}
                          </span>
                          {enq.variant ? (
                            <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                              {enq.variant.name || enq.variant.diameter}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#526458]">Custom Specifications</span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-5">
                          <div className="font-black text-slate-900 text-sm">
                            <span className="bg-slate-100 text-slate-900 px-2.5 py-0.5 rounded-md border border-slate-200 inline-block">
                              {enq.quantity ? `${enq.quantity} ${enq.unit || 'MT'}` : 'Custom Tonnage'}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#526458] block mt-0.5 font-medium">Industrial Supply</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5">
                          {renderStatusBadge(enq.status)}
                        </td>

                        {/* Received */}
                        <td className="py-4 px-5 text-[#526458] whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock className="w-3.5 h-3.5 text-[#526458]" />
                            <span>{formatDate(enq.createdAt)}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {enq.customer?.phone && (
                              <a
                                href={`tel:${enq.customer.phone}`}
                                className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-300 flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md hover:scale-110 active:scale-95 group/call"
                                title={`Call ${enq.customer?.name} (${enq.customer?.phone})`}
                              >
                                <Phone className="w-3.5 h-3.5 transition-transform group-hover/call:rotate-12" />
                              </a>
                            )}

                            {enq.customer?.email && (
                              <a
                                href={`mailto:${enq.customer.email}?subject=Steels Quotation #${enq.enquiryNumber}`}
                                className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white border border-blue-300 flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md hover:scale-110 active:scale-95 group/mail"
                                title={`Email ${enq.customer?.email}`}
                              >
                                <Mail className="w-3.5 h-3.5 transition-transform group-hover/mail:-translate-y-0.5" />
                              </a>
                            )}

                            <button
                              onClick={() => handleOpenDetail(enq.id, 'details')}
                              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#061B12] to-[#07552B] hover:from-[#07552B] hover:to-[#0D7A40] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 border border-[#07552B]/40"
                              title="Open sliding side window"
                            >
                              <span>Manage Record</span>
                              <ChevronRight className="w-3 h-3 text-emerald-300" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#526458]">
                      <div className="w-12 h-12 rounded-full bg-[#F4F7F5] flex items-center justify-center mx-auto mb-3 text-[#526458]">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-[#111814] text-sm">No enquiries found</p>
                      <p className="text-xs text-[#526458] mt-1">Try refining your search terms or filter selection.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN PIPELINE BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colEnquiries = filteredEnquiries.filter((e) => e.status === col.key);

            return (
              <div
                key={col.key}
                className="bg-white border border-[#E2EBE5] rounded-3xl p-4 shadow-xs flex flex-col min-h-[420px]"
              >
                <div className={`flex items-center justify-between p-2.5 rounded-2xl border mb-3 ${col.headerCls}`}>
                  <span className="font-black text-xs">{col.title}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${col.countCls}`}>
                    {colEnquiries.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colEnquiries.length > 0 ? (
                    colEnquiries.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] hover:border-[#07552B]/40 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => handleOpenDetail(item.id, 'details')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[11px] font-bold text-[#07552B] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#D0DDD4]">
                            {item.enquiryNumber}
                          </span>
                          <span className="text-[10px] text-[#526458]">{formatDate(item.createdAt)}</span>
                        </div>

                        <h4 className="font-bold text-xs text-[#111814] truncate group-hover:text-[#07552B] transition">
                          {item.customer?.name}
                        </h4>
                        {item.customer?.company && (
                          <span className="text-[10px] text-[#526458] block truncate font-medium">
                            {item.customer.company}
                          </span>
                        )}

                        <div className="my-2.5 p-2 rounded-xl bg-white border border-[#E2EBE5]">
                          <span className="font-semibold text-xs text-[#111814] block truncate">
                            {item.product?.name || 'Commercial Steel'}
                          </span>
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="text-[#526458]">{item.variant?.name || 'Standard'}</span>
                            <span className="font-black text-[#07552B]">
                              {item.quantity ? `${item.quantity} ${item.unit || 'MT'}` : 'Custom'}
                            </span>
                          </div>
                        </div>

                        {item.location && (
                          <div className="text-[10px] text-[#526458] flex items-center gap-1 truncate mb-2">
                            <MapPin className="w-3 h-3 text-[#07552B] shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#E2EBE5] flex items-center justify-between text-[11px]">
                          <span className="text-[#07552B] font-bold flex items-center gap-1 group-hover:underline">
                            <span>Manage Record</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-[#526458] border-2 border-dashed border-[#E2EBE5] rounded-2xl">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. SLIDING SIDE WINDOW / DRAWER (Opens from right to left slowly, closes from left to right slowly) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-500 ease-in-out ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseDrawer}
        aria-hidden="true"
      />

      {/* Sliding Window */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[580px] md:w-[680px] bg-white shadow-2xl border-l border-[#D0DDD4] flex flex-col transform transition-transform duration-500 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedEnquiry && (
          <div className="flex flex-col h-full">
            {/* Drawer Top Header Bar */}
            <div className="p-6 border-b border-[#E2EBE5] flex items-center justify-between bg-[#FAFCFA] shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                  <span className="font-mono text-base font-black text-[#07552B] bg-[#EBF3ED] px-2.5 py-0.5 rounded-lg border border-[#D0DDD4] tracking-tight">
                    #{selectedEnquiry.enquiryNumber}
                  </span>
                  {renderStatusBadge(selectedEnquiry.status)}
                </div>
                <p className="text-xs text-[#526458]">
                  Logged on {formatDate(selectedEnquiry.createdAt)}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseDrawer}
                className="p-2 rounded-full text-[#526458] hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                title="Close window (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Tabs */}
            <div className="px-6 pt-3 pb-3 border-b border-[#E2EBE5] bg-white flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveDrawerTab('details')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  activeDrawerTab === 'details'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('edit')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  activeDrawerTab === 'edit'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit & Update</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('calculator')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  activeDrawerTab === 'calculator'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Quotation Rate</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('history')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  activeDrawerTab === 'history'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
            </div>

            {/* Drawer Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: OVERVIEW & DETAILS */}
              {activeDrawerTab === 'details' && (
                <div className="space-y-5 text-xs">
                  {/* Buyer Card */}
                  <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2">
                      <span className="text-[#07552B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Buyer Information
                      </span>
                      <button
                        onClick={() => setActiveDrawerTab('edit')}
                        className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full font-bold border border-amber-200 flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="font-black text-base text-[#111814]">
                      {selectedEnquiry.customer?.name}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <a
                          href={`tel:${selectedEnquiry.customer?.phone}`}
                          className="font-bold text-emerald-800 hover:underline"
                        >
                          {selectedEnquiry.customer?.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <a
                          href={`mailto:${selectedEnquiry.customer?.email}`}
                          className="font-medium text-blue-800 hover:underline truncate"
                        >
                          {selectedEnquiry.customer?.email}
                        </a>
                      </div>

                      {selectedEnquiry.customer?.company && (
                        <div className="flex items-center gap-2 text-[#526458]">
                          <Building2 className="w-3.5 h-3.5 text-[#07552B] shrink-0" />
                          <span>
                            Company: <strong className="text-[#111814]">{selectedEnquiry.customer.company}</strong>
                          </span>
                        </div>
                      )}

                      {selectedEnquiry.location && (
                        <div className="flex items-center gap-2 text-[#526458]">
                          <MapPin className="w-3.5 h-3.5 text-[#07552B] shrink-0" />
                          <span>
                            Site: <strong className="text-[#111814]">{selectedEnquiry.location}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Direct Quick Action Buttons inside Buyer Card */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#E2EBE5]">
                      <a
                        href={`tel:${selectedEnquiry.customer?.phone}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 border border-emerald-300"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Buyer</span>
                      </a>
                      <a
                        href={`mailto:${selectedEnquiry.customer?.email}?subject=Steels Quotation #${selectedEnquiry.enquiryNumber}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-100 hover:bg-blue-600 text-blue-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 border border-blue-300"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Email</span>
                      </a>
                      <button
                        onClick={() => setActiveDrawerTab('calculator')}
                        className="py-2 px-3.5 rounded-xl bg-purple-100 hover:bg-purple-600 text-purple-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 border border-purple-300"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Calculate Quote</span>
                      </button>
                    </div>
                  </div>

                  {/* Steel Specification Card */}
                  <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2">
                      <span className="text-[#07552B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Steel Requirements
                      </span>
                      <span className="text-[10px] font-bold text-[#07552B] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {selectedEnquiry.product?.category?.name || 'Heavy Industry'}
                      </span>
                    </div>

                    <div className="font-black text-base text-[#111814]">
                      {selectedEnquiry.product?.name || 'Commercial Steel Order'}
                    </div>

                    {selectedEnquiry.variant && (
                      <div className="p-3 rounded-xl bg-white border border-[#E2EBE5] space-y-1">
                        <span className="text-[10px] text-[#526458] uppercase font-bold tracking-wider block">
                          Selected Grade / Diameter
                        </span>
                        <div className="font-bold text-[#07552B] text-sm">
                          {selectedEnquiry.variant.name}
                        </div>
                        {selectedEnquiry.variant.diameter && (
                          <div className="text-[11px] text-[#526458]">
                            Diameter / Size: <strong className="text-[#111814]">{selectedEnquiry.variant.diameter}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-[#EBF3ED] border border-[#D0DDD4] flex items-center justify-between">
                      <span className="font-bold text-xs text-[#07552B]">Required Tonnage:</span>
                      <span className="text-base font-black text-[#07552B]">
                        {selectedEnquiry.quantity || 'TBD'} {selectedEnquiry.unit || 'MT'}
                      </span>
                    </div>

                    {selectedEnquiry.message && (
                      <div className="p-3.5 rounded-xl bg-white border border-[#E2EBE5] text-[#526458]">
                        <span className="font-bold text-[#111814] block text-[11px] mb-1">Buyer Notes:</span>
                        "{selectedEnquiry.message}"
                      </div>
                    )}

                    {selectedEnquiry.internalNotes && (
                      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900">
                        <span className="font-bold block text-[11px] mb-1">Internal Operations Notes:</span>
                        "{selectedEnquiry.internalNotes}"
                      </div>
                    )}
                  </div>

                  {/* Quick Action Trigger */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-950 block text-xs">Need to update pricing or status?</span>
                      <span className="text-[11px] text-emerald-800">Calculate live GST rates or edit buyer details.</span>
                    </div>
                    <button
                      onClick={() => setActiveDrawerTab('edit')}
                      className="text-xs font-bold rounded-full px-4 py-2 bg-[#07552B] hover:bg-[#053d1f] text-white shadow-xs transition active:scale-95"
                    >
                      Edit Record
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: EDIT & UPDATE ENQUIRY */}
              {activeDrawerTab === 'edit' && (
                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#07552B] block">
                      Edit Customer Information
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Buyer Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Company / Firm</label>
                        <input
                          type="text"
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                          placeholder="e.g. Skyline Infrastructure Ltd."
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#07552B] block">
                      Edit Quantity & Delivery
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Required Volume</label>
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] font-bold focus:outline-none focus:border-[#07552B]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Unit</label>
                        <select
                          value={editUnit}
                          onChange={(e) => setEditUnit(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] font-medium focus:outline-none focus:border-[#07552B]"
                        >
                          <option value="MT">MT (Metric Tonnes)</option>
                          <option value="KG">KG</option>
                          <option value="Bundles">Bundles</option>
                          <option value="Pieces">Pieces</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-[#111814] block mb-1">Delivery Destination / Site</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="e.g. Pune Highway Project Site, Sector 4"
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5] space-y-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#07552B] block">
                      Update Pipeline Stage & Sales Notes
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Pipeline Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111814] focus:outline-none focus:border-[#07552B]"
                        >
                          <option value="NEW">New (Unreviewed)</option>
                          <option value="CONTACTED">Contacted (Called/Emailed)</option>
                          <option value="QUOTATION_SENT">Quotation Sent</option>
                          <option value="NEGOTIATION">In Negotiation</option>
                          <option value="CONFIRMED">Order Confirmed</option>
                          <option value="COMPLETED">Delivered / Fulfilled</option>
                          <option value="CANCELLED">Cancelled / Closed</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">Action Note (For Timeline)</label>
                        <input
                          type="text"
                          placeholder="e.g. Revised rate to ₹54,200/MT upon site inspection"
                          value={editStatusNote}
                          onChange={(e) => setEditStatusNote(e.target.value)}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-[#111814] block mb-1">Internal Operations Notes</label>
                        <textarea
                          rows={2}
                          value={editInternalNotes}
                          onChange={(e) => setEditInternalNotes(e.target.value)}
                          placeholder="Internal team notes, special payment conditions, dispatch warehouse location..."
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl p-3 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="w-full font-black text-xs rounded-full py-3 bg-gradient-to-r from-[#07552B] to-[#0D7A40] hover:from-[#053d1f] hover:to-[#07552B] text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingEdit ? 'Saving Changes...' : 'Save & Update Enquiry'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: QUOTATION ESTIMATOR */}
              {activeDrawerTab === 'calculator' && (
                <div className="space-y-5 text-xs">
                  <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-[#E2EBE5]">
                    <h4 className="font-bold text-sm text-[#111814] flex items-center gap-2 mb-4">
                      <Calculator className="w-4 h-4 text-[#07552B]" />
                      Interactive Commercial Rate Estimator
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-[#111814] block mb-1">
                          Base Steel Rate per MT (₹)
                        </label>
                        <input
                          type="number"
                          value={ratePerMt}
                          onChange={(e) => setRatePerMt(Number(e.target.value))}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 font-mono font-bold text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                        <span className="text-[10px] text-[#526458] mt-1 block">Standard factory benchmark</span>
                      </div>

                      <div>
                        <label className="font-bold text-[#111814] block mb-1">
                          Freight & Transit Charges (₹)
                        </label>
                        <input
                          type="number"
                          value={freightCharges}
                          onChange={(e) => setFreightCharges(Number(e.target.value))}
                          className="w-full bg-white border border-[#D0DDD4] rounded-xl px-3.5 py-2 font-mono font-bold text-[#111814] focus:outline-none focus:border-[#07552B]"
                        />
                        <span className="text-[10px] text-[#526458] mt-1 block">
                          To: {editLocation || selectedEnquiry.location || 'Local Delivery Zone'}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-5 p-4 rounded-2xl bg-white border border-[#D0DDD4] space-y-2">
                      <div className="flex items-center justify-between text-[#526458]">
                        <span>Base Material ({qty} MT × ₹{ratePerMt.toLocaleString('en-IN')})</span>
                        <span className="font-mono font-bold text-[#111814]">₹{baseTotal.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-[#526458]">
                        <span>Logistics & Freight</span>
                        <span className="font-mono font-bold text-[#111814]">₹{freightTotal.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-[#526458] pt-1 border-t border-[#F4F7F5]">
                        <span>Subtotal</span>
                        <span className="font-mono font-bold text-[#111814]">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-[#526458]">
                        <span>Commercial GST @ 18%</span>
                        <span className="font-mono font-bold text-[#111814]">₹{gst.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-2 border-t border-[#E2EBE5] font-black text-[#07552B]">
                        <span>ESTIMATED QUOTATION VALUE</span>
                        <span className="font-mono text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={handleCopyQuoteText}
                        className="flex-1 py-2.5 px-4 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
                      >
                        {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedQuote ? 'Quotation Copied!' : 'Copy Quote Summary for Client'}</span>
                      </button>

                      <a
                        href={`mailto:${editEmail || selectedEnquiry.customer?.email}?subject=Commercial Steel Quotation - ${selectedEnquiry.enquiryNumber}&body=Dear ${editName || selectedEnquiry.customer?.name},%0D%0A%0D%0AThank you for your inquiry with Steels Industrial Supply.%0D%0A%0D%0APlease find our quotation below:%0D%0AProduct: ${selectedEnquiry.product?.name}%0D%0AQuantity: ${qty} MT%0D%0ABase Rate: Rs. ${ratePerMt}/MT%0D%0ATotal Value: Rs. ${grandTotal}%0D%0A%0D%0ABest regards,%0D%0ASteels Commercial Sales Desk`}
                        className="py-2.5 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>Email to Buyer</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TIMELINE & AUDIT HISTORY */}
              {activeDrawerTab === 'history' && (
                <div className="space-y-4 text-xs">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#526458] block">
                    Chronological Activity Trail
                  </span>

                  <div className="space-y-2.5">
                    {selectedEnquiry.statusHistory && selectedEnquiry.statusHistory.length > 0 ? (
                      selectedEnquiry.statusHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-[#FAFCFA] border border-[#E2EBE5] flex items-start justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-[#07552B] uppercase text-[11px]">
                                {item.newStatus.replace(/_/g, ' ')}
                              </span>
                              <span className="text-zinc-300">•</span>
                              <span className="text-[#526458] text-[11px]">
                                {item.changedBy?.name || 'Customer Online'}
                              </span>
                            </div>
                            {item.note && <p className="text-[#111814] mt-1 font-medium">{item.note}</p>}
                          </div>
                          <span className="text-[10px] text-[#526458] whitespace-nowrap">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#526458] py-8 text-center border-2 border-dashed border-[#E2EBE5] rounded-2xl">
                        No previous status transitions recorded yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
