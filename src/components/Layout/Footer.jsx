import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#020617] border-t border-slate-800/50 pt-20 pb-10 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] transition-all duration-300">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                StudyPlanner<span className="text-emerald-400">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              Empowering students worldwide with cognitive science and artificial intelligence to optimize study habits, maximize retention, and achieve academic excellence.
            </p>
            
            <div className="space-y-4 text-sm text-slate-400">
              <p className="flex items-center gap-3 hover:text-emerald-400 transition-colors cursor-pointer group">
                <Mail size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                support@aistudyplanner.com
              </p>
              <p className="flex items-center gap-3 hover:text-emerald-400 transition-colors cursor-pointer group">
                <Phone size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                +1 (800) 123-4567
              </p>
              <p className="flex items-center gap-3 group">
                <MapPin size={16} className="text-slate-500" />
                Silicon Valley, California
              </p>
            </div>
          </div>
          
          {/* Column 2: Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-white transition-colors flex items-center gap-2">Pricing <span className="text-[10px] py-0.5 px-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium">BETA</span></Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>
          
          {/* Column 3: Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog & Resources</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter for the latest AI study hacks.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-900/50 border border-slate-800 text-white text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 outline-none transition-colors hover:border-slate-700 placeholder-slate-500"
                required
              />
              <button className="btn-primary w-full py-2.5 text-sm">
                Subscribe
              </button>
            </form>
          </div>
          
        </div>
        
        {/* Bottom Bar: Copyright, Legal, Socials */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} AI StudyPlanner Inc. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
