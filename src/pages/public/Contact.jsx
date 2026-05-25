import React from 'react';
import MarketingLayout from '../../components/Layout/MarketingLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';

const Contact = () => {
  return (
    <MarketingLayout>
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-24 relative z-10 min-h-[calc(100vh-80px)]">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            We'd love to hear from <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">You</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Whether you have a question about features, pricing, or need technical support, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Contact Info & Map */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Contact Card: Email */}
              <div className="p-6 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:bg-slate-800/60 hover:border-teal-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Email Us</h4>
                <p className="text-slate-400 text-sm">support@aistudyplanner.com</p>
              </div>

              {/* Contact Card: Phone */}
              <div className="p-6 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:bg-slate-800/60 hover:border-emerald-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Call Us</h4>
                <p className="text-slate-400 text-sm">+1 (800) 123-4567</p>
              </div>
            </div>

            {/* Location / Map Section */}
            <div className="p-2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden group">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-700/50">
                {/* Futuristic Map Mockup */}
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                
                {/* Map Ping Animation */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-teal-500/20 rounded-full animate-ping"></div>
                  <div className="absolute w-6 h-6 bg-teal-500/40 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)] z-20"></div>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
                
                <div className="absolute bottom-4 left-4 z-20">
                  <h4 className="text-white font-bold">Global Headquarters</h4>
                  <p className="text-slate-400 text-sm">123 AI Boulevard, Silicon Valley, CA</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Glassmorphism Form */}
          <div className="relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {/* Ambient Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <form className="relative z-10 bg-slate-800/60 backdrop-blur-2xl border border-slate-700/50 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
              <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-slate-400 text-sm mb-8">We usually respond within 24 hours.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="Jane" required />
                <Input label="Last Name" placeholder="Doe" required />
              </div>
              
              <Input label="Email Address" type="email" placeholder="jane@example.com" required />
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Topic</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 outline-none transition-colors hover:border-slate-600 appearance-none cursor-pointer">
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Product Feedback</option>
                </select>
              </div>

              <Textarea label="Message" placeholder="How can we help you?" rows={5} required />
              
              <div className="pt-2">
                <Button variant="primary" fullWidth size="lg" className="py-4 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                  Send Message
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </MarketingLayout>
  );
};

export default Contact;
