import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Customer } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/utils';
import { Search, Phone, Mail, Building, RotateCcw } from 'lucide-react';

export const CustomersAdminPage: React.FC = () => {
  const { error } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = () => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);

    api
      .get(`/customers?${query.toString()}`)
      .then((res: any) => {
        if (res.data) setCustomers(res.data);
      })
      .catch((err) => error(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111814] uppercase tracking-tight font-sans">
            Customer Leads Directory
          </h1>
          <p className="text-xs text-[#526458] mt-1">
            Aggregated contractor, builder, and industrial buyer leads captured through quotation submissions.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E2EBE5] flex gap-3 max-w-md shadow-sm">
        <Input
          placeholder="Search by customer name, phone, or firm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary" onClick={loadCustomers}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="rounded-2xl bg-white border border-[#E2EBE5] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#E2EBE5] text-[#526458] uppercase font-bold text-[10px] bg-[#F4F7F5]">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Company / Entity</th>
              <th className="p-4 text-center">Total Quotes</th>
              <th className="p-4 text-right">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2EBE5]">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-[#F4F7F5] transition">
                <td className="p-4 font-bold text-[#111814] text-sm">{c.name}</td>
                <td className="p-4 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[#111814]">
                    <Phone className="w-3 h-3 text-[#07552B]" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#526458]">
                    <Mail className="w-3 h-3 text-[#526458]" />
                    <span>{c.email}</span>
                  </div>
                </td>
                <td className="p-4 text-[#111814] font-medium">
                  {c.company ? (
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#526458] shrink-0" />
                      <span>{c.company}</span>
                    </div>
                  ) : (
                    <span className="text-[#526458]">Individual</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-[#EBF3ED] border border-[#D0DDD4] font-mono font-bold text-[#07552B]">
                    {c._count?.enquiries || 0}
                  </span>
                </td>
                <td className="p-4 text-right text-[#526458] text-[11px]">
                  {formatDate(c.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
