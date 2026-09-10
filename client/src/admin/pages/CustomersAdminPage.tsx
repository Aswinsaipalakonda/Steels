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
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Customer Leads Directory
          </h1>
          <p className="text-xs text-steel-olive mt-1">
            Aggregated contractor, builder, and industrial buyer leads captured through quotation submissions.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-steel-forest/60 border border-steel-rich flex gap-3 max-w-md">
        <Input
          placeholder="Search by customer name, phone, or firm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary" onClick={loadCustomers}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="rounded-2xl bg-steel-forest/40 border border-steel-rich overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-steel-rich text-steel-olive uppercase font-bold text-[10px] bg-steel-forest/80">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Company / Entity</th>
              <th className="p-4 text-center">Total Quotes</th>
              <th className="p-4 text-right">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-rich/60">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-steel-darkest/60 transition">
                <td className="p-4 font-bold text-white text-sm">{c.name}</td>
                <td className="p-4 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Mail className="w-3 h-3 text-steel-olive" />
                    <span>{c.email}</span>
                  </div>
                </td>
                <td className="p-4 text-zinc-300 font-medium">
                  {c.company ? (
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-steel-olive shrink-0" />
                      <span>{c.company}</span>
                    </div>
                  ) : (
                    <span className="text-steel-olive">Individual</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 rounded-full bg-steel-darkest border border-steel-rich font-mono font-bold text-emerald-400">
                    {c._count?.enquiries || 0}
                  </span>
                </td>
                <td className="p-4 text-right text-zinc-400 text-[11px]">
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
