import React from 'react';
import MarketingNavbar from './MarketingNavbar';
import Footer from './Footer';

const MarketingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Global Ambient Lighting */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <MarketingNavbar />
      
      {/* Add top padding to account for fixed navbar */}
      <main className="flex-grow pt-20 relative z-10">
        {children}
      </main>
      
      <Footer className="relative z-10" />
    </div>
  );
};

export default MarketingLayout;
