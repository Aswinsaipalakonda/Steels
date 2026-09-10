import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
    <div className="min-h-screen bg-steel-darkest flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-steel-darkest via-steel-forest to-steel-darkest" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-steel-darkest/95 border border-steel-rich rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-steel-primary border border-steel-accent flex items-center justify-center text-emerald-400 font-bold text-lg mx-auto mb-3 shadow-lg shadow-emerald-950/50">
            APEX
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Admin Management Desk</h1>
          <p className="text-xs text-steel-olive mt-1">Steel Enquiry & Commercial Operations Platform</p>
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
            <Mail className="w-4 h-4 text-steel-olive absolute left-3.5 top-[34px]" />
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
            <Lock className="w-4 h-4 text-steel-olive absolute left-3.5 top-[34px]" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[34px] text-steel-olive hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="w-full font-bold" isLoading={isLoading}>
              Sign In to Dashboard
            </Button>
          </div>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="mt-8 p-3.5 rounded-xl bg-steel-forest/60 border border-steel-rich/80 text-xs text-zinc-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Default Seed Credentials:</span>
          </div>
          <p className="text-steel-olive">
            Email: <span className="text-white font-mono">admin@steelplatform.com</span>
          </p>
          <p className="text-steel-olive">
            Password: <span className="text-white font-mono">Password@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
