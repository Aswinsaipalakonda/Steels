import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFCFA] text-[#111814] flex flex-col font-sans selection:bg-[#07552B] selection:text-white">
      <Header />
      <main className="flex-grow pt-16 sm:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
