import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Enquiry } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/utils';
import {
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const EnquiriesAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected enquiry for detail & status change
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [newStatus, setNewStatus] = useState('CONTACTED');
  const [statusNote, setStatusNote] = useState('');

  const loadEnquiries = () => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (statusFilter) query.set('status', statusFilter);

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

  const handleOpenDetail = async (id: string) => {
    try {
      const res: any = await api.get(`/enquiries/${id}`);
      if (res.data) {
        setSelectedEnquiry(res.data);
        setNewStatus(res.data.status);
        setStatusNote('');
        setIsDetailModalOpen(true);
      }
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setIsUpdatingStatus(true);
    try {
      await api.put(`/enquiries/${selectedEnquiry.id}/status`, {
        status: newStatus,
        note: statusNote || undefined,
      });

      success(`Status updated to ${newStatus}`);
      // Refresh selected enquiry
      handleOpenDetail(selectedEnquiry.id);
      loadEnquiries();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111814] uppercase tracking-tight font-sans">
            Quotation & Enquiry Pipeline
          </h1>
          <p className="text-xs text-[#526458] mt-1">
            Track customer requests from discovery to quotation dispatch and confirmation.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2EBE5] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-sm">
        <div className="flex gap-2 flex-1 max-w-md">
          <Input
            placeholder="Search by enquiry #, customer, phone, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" onClick={loadEnquiries}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#D0DDD4] rounded-full px-3.5 py-2 text-xs text-[#111814] focus:outline-none focus:border-[#07552B]"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUOTATION_SENT">Quotation Sent</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={loadEnquiries}
            className="p-2 rounded-full bg-white border border-[#D0DDD4] text-[#526458] hover:text-[#111814] hover:bg-[#F4F7F5] transition"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pipeline Table */}
      <div className="rounded-2xl bg-white border border-[#E2EBE5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2EBE5] text-[#526458] uppercase font-bold text-[10px] bg-[#F4F7F5]">
              <tr>
                <th className="p-4">Enquiry #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product Requirement</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4">Received</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EBE5]">
              {enquiries.length > 0 ? (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F4F7F5] transition">
                    <td className="p-4 font-mono font-bold text-[#07552B]">{enq.enquiryNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-[#111814] block text-sm">{enq.customer?.name}</span>
                      <span className="text-[11px] text-[#526458] block">{enq.customer?.phone}</span>
                      {enq.customer?.company && (
                        <span className="text-[10px] text-[#526458] block">{enq.customer.company}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-[#111814] font-medium block">
                        {enq.product?.name || 'Commercial Steel Bill'}
                      </span>
                      {enq.variant && (
                        <span className="text-[11px] text-[#07552B] font-mono font-bold">
                          {enq.variant.diameter || enq.variant.name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-[#111814] whitespace-nowrap">
                      {enq.quantity ? `${enq.quantity} ${enq.unit || 'MT'}` : 'Custom'}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          enq.status === 'NEW'
                            ? 'new'
                            : enq.status === 'QUOTATION_SENT'
                            ? 'quotation'
                            : enq.status === 'CONFIRMED'
                            ? 'confirmed'
                            : enq.status === 'CONTACTED'
                            ? 'contacted'
                            : 'default'
                        }
                      >
                        {enq.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#526458] whitespace-nowrap">{formatDate(enq.createdAt)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(enq.id)}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-[#D0DDD4] text-[#07552B] font-semibold hover:border-[#07552B] hover:bg-[#EBF3ED] transition"
                      >
                        View & Quote
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#526458]">
                    No enquiries match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Enquiry #${selectedEnquiry.enquiryNumber}`}
          description={`Logged on ${formatDate(selectedEnquiry.createdAt)}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Customer & Requirement Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] space-y-2 text-xs">
                <span className="text-[#07552B] font-bold uppercase tracking-wider block">
                  Customer Profile
                </span>
                <div className="font-bold text-[#111814] text-sm">{selectedEnquiry.customer?.name}</div>
                <div className="flex items-center gap-1.5 text-[#526458]">
                  <Phone className="w-3.5 h-3.5 text-[#07552B] shrink-0" />
                  <a href={`tel:${selectedEnquiry.customer?.phone}`} className="hover:underline text-[#111814]">
                    {selectedEnquiry.customer?.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-[#526458]">
                  <Mail className="w-3.5 h-3.5 text-[#07552B] shrink-0" />
                  <a href={`mailto:${selectedEnquiry.customer?.email}`} className="hover:underline text-[#111814]">
                    {selectedEnquiry.customer?.email}
                  </a>
                </div>
                {selectedEnquiry.customer?.company && (
                  <div className="text-[#526458]">Firm: <span className="text-[#111814] font-semibold">{selectedEnquiry.customer.company}</span></div>
                )}
                {selectedEnquiry.location && (
                  <div className="flex items-start gap-1.5 text-[#526458] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#07552B] shrink-0 mt-0.5" />
                    <span>{selectedEnquiry.location}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] space-y-2 text-xs">
                <span className="text-[#07552B] font-bold uppercase tracking-wider block">
                  Steel Specification Requested
                </span>
                <div className="font-bold text-[#111814] text-sm">
                  {selectedEnquiry.product?.name || 'Mixed Project Bill'}
                </div>
                {selectedEnquiry.variant && (
                  <div className="text-[#526458]">Variant: <span className="font-semibold text-[#111814]">{selectedEnquiry.variant.name}</span></div>
                )}
                <div className="text-[#111814] font-bold text-sm pt-1">
                  Quantity: {selectedEnquiry.quantity} {selectedEnquiry.unit || 'MT'}
                </div>
                {selectedEnquiry.message && (
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2EBE5] text-[#526458] text-[11px] mt-2">
                    "{selectedEnquiry.message}"
                  </div>
                )}
              </div>
            </div>

            {/* Status Change Form */}
            <form onSubmit={handleUpdateStatus} className="p-5 rounded-2xl bg-white border border-[#D0DDD4] shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111814] block">
                Update Pipeline Status & Log Sales Note
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="New Pipeline Status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUOTATION_SENT">Quotation Sent</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </Select>

                <Input
                  label="Action Note (e.g. Quoted Rate/MT)"
                  placeholder="e.g. Quoted ₹54,500/MT including freight"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full text-xs font-bold shadow-md" isLoading={isUpdatingStatus}>
                Update Pipeline Record
              </Button>
            </form>

            {/* Chronological Activity Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#526458] block">
                Activity & Status History
              </span>

              <div className="space-y-2 max-h-44 overflow-y-auto">
                {selectedEnquiry.statusHistory && selectedEnquiry.statusHistory.length > 0 ? (
                  selectedEnquiry.statusHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#F4F7F5] border border-[#E2EBE5] flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111814] uppercase">{item.newStatus}</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-[#526458]">{item.changedBy?.name || 'Customer Online'}</span>
                        </div>
                        {item.note && <p className="text-[#526458] mt-1">{item.note}</p>}
                      </div>
                      <span className="text-[11px] text-[#526458] whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#526458]">No status transitions recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
