import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/ui/Logo';
import api from '../../lib/api';
import { ShieldCheck, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('admin@steelplatform.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.data?.token && res.data?.user) {
        login(res.data.token, res.data.user);
        success(`Welcome back, ${res.data.user.name}`);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      error(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Light Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EBF3ED]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-[#D0DDD4] rounded-3xl p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo variant="dark" size="lg" />
          </div>
          <h1 className="text-xl font-black text-[#111814] tracking-tight uppercase">Admin Management Desk</h1>
          <p className="text-xs text-[#526458] mt-1">Steel Enquiry & Commercial Operations Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Corporate Email"
              type="email"
              placeholder="admin@steelplatform.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
            <Mail className="w-4 h-4 text-[#526458] absolute left-3.5 top-[34px]" />
          </div>

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
            />
            <Lock className="w-4 h-4 text-[#526458] absolute left-3.5 top-[34px]" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[34px] text-[#526458] hover:text-[#111814]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-md" isLoading={isLoading}>
              Sign In to Dashboard
            </Button>
          </div>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="mt-8 p-4 rounded-2xl bg-[#F4F7F5] border border-[#E2EBE5] text-xs text-[#526458]">
          <div className="flex items-center gap-1.5 text-[#07552B] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Default Seed Credentials:</span>
          </div>
          <p className="text-[#526458]">
            Email: <span className="text-[#111814] font-semibold font-mono">admin@steelplatform.com</span>
          </p>
          <p className="text-[#526458]">
            Password: <span className="text-[#111814] font-semibold font-mono">Password@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
