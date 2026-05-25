import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Optional message from successful signup
  const successMessage = location.state?.message;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === 200 && response.data.access_token) {
        // Store JWT token and role
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userRole', response.data.user?.role || 'user');
        
        // Redirect based on user role
        if (response.data.user && response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20 group">
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Home
      </Link>

      {/* Main Glass Container */}
      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Glow border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/20 rounded-3xl blur-md"></div>
        
        <div className="glass-panel p-8 sm:p-10 relative">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-6 animate-float">
              AI
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-slate-400 mt-2 text-sm">Sign in to your StudyPlanner account</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm text-center">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              required 
              placeholder="name@university.edu" 
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-5 h-5 text-emerald-400" />}
            />
            
            <Input 
              label="Password" 
              name="password"
              type={showPassword ? "text" : "password"}
              required 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-5 h-5 text-emerald-400" />}
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
            
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border border-slate-600 rounded bg-slate-900/50 checked:bg-emerald-500 checked:border-emerald-500 transition-colors cursor-pointer" />
                  <svg className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              
              <a href="#" className="text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                Forgot password?
              </a>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                size="lg" 
                isLoading={isLoading}
                className="py-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] text-base font-semibold"
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Social Login Separator */}
          <div className="mt-8 mb-6 relative flex items-center justify-center">
            <div className="absolute w-full border-t border-slate-700/50"></div>
            <div className="relative px-4 bg-slate-800/80 text-xs text-slate-500 uppercase tracking-wider font-medium">Or continue with</div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-colors group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/></svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-colors group">
              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Don't have an account? <Link to="/signup" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
