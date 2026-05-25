import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex relative overflow-hidden text-slate-100">
      {/* Background ambient light */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar Component */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onCloseMobile={closeMobileMenu} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar onMenuToggle={toggleMobileMenu} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay Background */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
