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
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Quotation & Enquiry Pipeline
          </h1>
          <p className="text-xs text-steel-olive mt-1">
            Track customer requests from discovery to quotation dispatch and confirmation.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
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
            className="bg-steel-darkest border border-steel-rich rounded-lg px-3 py-2 text-xs text-white"
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
            className="p-2 rounded-lg bg-steel-darkest border border-steel-rich text-zinc-400 hover:text-white"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pipeline Table */}
      <div className="rounded-2xl bg-steel-forest/40 border border-steel-rich overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-steel-rich text-steel-olive uppercase font-bold text-[10px] bg-steel-forest/80">
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
            <tbody className="divide-y divide-steel-rich/60">
              {enquiries.length > 0 ? (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-steel-darkest/60 transition">
                    <td className="p-4 font-mono font-bold text-emerald-400">{enq.enquiryNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-white block text-sm">{enq.customer?.name}</span>
                      <span className="text-[11px] text-zinc-400 block">{enq.customer?.phone}</span>
                      {enq.customer?.company && (
                        <span className="text-[10px] text-steel-olive block">{enq.customer.company}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium block">
                        {enq.product?.name || 'Commercial Steel Bill'}
                      </span>
                      {enq.variant && (
                        <span className="text-[11px] text-emerald-400 font-mono">
                          {enq.variant.diameter || enq.variant.name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-white whitespace-nowrap">
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
                    <td className="p-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {formatDate(enq.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenDetail(enq.id)}
                        className="text-xs py-1"
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-steel-olive">
                    No enquiries match filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Status Timeline Modal */}
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
              <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich space-y-2 text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block">
                  Customer Profile
                </span>
                <div className="font-bold text-white text-sm">{selectedEnquiry.customer?.name}</div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Phone className="w-3.5 h-3.5 text-steel-olive shrink-0" />
                  <a href={`tel:${selectedEnquiry.customer?.phone}`} className="hover:underline">
                    {selectedEnquiry.customer?.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Mail className="w-3.5 h-3.5 text-steel-olive shrink-0" />
                  <a href={`mailto:${selectedEnquiry.customer?.email}`} className="hover:underline">
                    {selectedEnquiry.customer?.email}
                  </a>
                </div>
                {selectedEnquiry.customer?.company && (
                  <div className="text-zinc-400">Firm: {selectedEnquiry.customer.company}</div>
                )}
                {selectedEnquiry.location && (
                  <div className="flex items-start gap-1.5 text-zinc-300 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{selectedEnquiry.location}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich space-y-2 text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block">
                  Steel Specification Requested
                </span>
                <div className="font-bold text-white text-sm">
                  {selectedEnquiry.product?.name || 'Mixed Project Bill'}
                </div>
                {selectedEnquiry.variant && (
                  <div className="text-zinc-300">Variant: {selectedEnquiry.variant.name}</div>
                )}
                <div className="text-white font-bold text-sm pt-1">
                  Quantity: {selectedEnquiry.quantity} {selectedEnquiry.unit || 'MT'}
                </div>
                {selectedEnquiry.message && (
                  <div className="p-2.5 rounded bg-steel-darkest border border-steel-rich text-zinc-300 text-[11px] mt-2">
                    "{selectedEnquiry.message}"
                  </div>
                )}
              </div>
            </div>

            {/* Status Change Form */}
            <form onSubmit={handleUpdateStatus} className="p-4 rounded-xl bg-steel-forest border border-steel-accent/40 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
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

              <Button type="submit" variant="primary" className="w-full text-xs font-bold" isLoading={isUpdatingStatus}>
                Update Pipeline Record
              </Button>
            </form>

            {/* Chronological Activity Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-steel-olive block">
                Activity & Status History
              </span>

              <div className="space-y-2 max-h-44 overflow-y-auto">
                {selectedEnquiry.statusHistory && selectedEnquiry.statusHistory.length > 0 ? (
                  selectedEnquiry.statusHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-steel-forest/30 border border-steel-rich flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase">{item.newStatus}</span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-steel-olive">{item.changedBy?.name || 'Customer Online'}</span>
                        </div>
                        {item.note && <p className="text-zinc-300 mt-1">{item.note}</p>}
                      </div>
                      <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-steel-olive">No status transitions recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
