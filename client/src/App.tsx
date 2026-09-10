import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { PublicLayout } from './components/layout/PublicLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { AboutPage } from './pages/AboutPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { QualityPage } from './pages/QualityPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';

// Admin Pages
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminProtectedRoute } from './admin/components/AdminProtectedRoute';
import { AdminLayout } from './admin/layout/AdminLayout';
import { DashboardPage } from './admin/pages/DashboardPage';
import { ProductsAdminPage } from './admin/pages/ProductsAdminPage';
import { CategoriesAdminPage } from './admin/pages/CategoriesAdminPage';
import { HeroSlidesAdminPage } from './admin/pages/HeroSlidesAdminPage';
import { EnquiriesAdminPage } from './admin/pages/EnquiriesAdminPage';
import { CustomersAdminPage } from './admin/pages/CustomersAdminPage';
import { SettingsAdminPage } from './admin/pages/SettingsAdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AdminAuthProvider>
          <Routes>
            {/* Public Customer Facing Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="quote" element={<RequestQuotePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="industries" element={<IndustriesPage />} />
              <Route path="quality" element={<QualityPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<LegalPage type="privacy" />} />
              <Route path="terms" element={<LegalPage type="terms" />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Portal */}
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductsAdminPage />} />
                <Route path="categories" element={<CategoriesAdminPage />} />
                <Route path="hero-slides" element={<HeroSlidesAdminPage />} />
                <Route path="enquiries" element={<EnquiriesAdminPage />} />
                <Route path="customers" element={<CustomersAdminPage />} />
                <Route path="settings" element={<SettingsAdminPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
