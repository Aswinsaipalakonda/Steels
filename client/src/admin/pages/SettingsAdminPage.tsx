import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export const SettingsAdminPage: React.FC = () => {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: 'Steels Industrial Supply Ltd.',
    contact_phone: '+91 98765 43210',
    contact_email: 'sales@steelplatform.com',
    contact_address: 'Plot 42, Heavy Industrial Area, Steel Hub Phase II, Mumbai - 400072',
    working_hours: 'Monday - Saturday: 8:00 AM - 7:30 PM',
    stat_tons_supplied: '500,000+ MT',
    stat_projects_completed: '1,250+ Projects',
    stat_years_experience: '28+ Years',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .get('/settings/public')
      .then((res: any) => {
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const items = Object.entries(settings).map(([key, value]) => ({ key, value }));
      await api.put('/settings/bulk', { settings: items });
      success('Website settings updated successfully.');
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[#111814] uppercase tracking-tight font-sans">
          Company Details & Statistics
        </h1>
        <p className="text-xs text-[#526458] mt-1">
          Configure global contact information, yard addresses, and trust metrics displayed on the public site.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-8 rounded-2xl bg-white border border-[#E2EBE5] shadow-sm space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#07552B] border-b border-[#E2EBE5] pb-2">
          Corporate Identity & Sales Desk Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Display Name"
            value={settings.company_name || ''}
            onChange={(e) => handleChange('company_name', e.target.value)}
          />
          <Input
            label="Sales Desk Hotline Phone"
            value={settings.contact_phone || ''}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Sales Email Address"
            value={settings.contact_email || ''}
            onChange={(e) => handleChange('contact_email', e.target.value)}
          />
          <Input
            label="Operating / Weighbridge Hours"
            value={settings.working_hours || ''}
            onChange={(e) => handleChange('working_hours', e.target.value)}
          />
        </div>

        <Input
          label="Main Stockyard / Registered Address"
          value={settings.contact_address || ''}
          onChange={(e) => handleChange('contact_address', e.target.value)}
        />

        <h3 className="text-sm font-bold uppercase tracking-wider text-[#07552B] border-b border-[#E2EBE5] pb-2 pt-4">
          Homepage Statistics & Impact Counters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Tons Supplied Metric"
            value={settings.stat_tons_supplied || ''}
            onChange={(e) => handleChange('stat_tons_supplied', e.target.value)}
          />
          <Input
            label="Completed Projects Metric"
            value={settings.stat_projects_completed || ''}
            onChange={(e) => handleChange('stat_projects_completed', e.target.value)}
          />
          <Input
            label="Years Experience Metric"
            value={settings.stat_years_experience || ''}
            onChange={(e) => handleChange('stat_years_experience', e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-[#E2EBE5]">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
