import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      // The backend currently only needs email and password
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === 201) {
        // Redirect to login page on success
        navigate('/login', { state: { message: "Account created successfully! Please log in." } });
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden py-12">
      
      {/* Background ambient lighting */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-500/15 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20 group hidden sm:flex">
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Home
      </Link>

      {/* Main Glass Container */}
      <div className="w-full max-w-[500px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-8 sm:mt-0">
        
        {/* Glow border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/20 rounded-3xl blur-md"></div>
        
        <div className="glass-panel p-8 sm:p-10 relative">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(45,212,191,0.4)] mb-6 animate-float">
              AI
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-slate-400 mt-2 text-sm">Start optimizing your study schedule today</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <Input 
              label="Username" 
              name="username"
              type="text" 
              required 
              placeholder="alex_student" 
              value={formData.username}
              onChange={handleChange}
              leftIcon={<User className="w-5 h-5 text-teal-400" />}
            />

            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              required 
              placeholder="name@university.edu" 
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-5 h-5 text-teal-400" />}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input 
                label="Password" 
                name="password"
                type={showPassword ? "text" : "password"}
                required 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="w-5 h-5 text-teal-400" />}
                rightIcon={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:text-teal-400 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
              <Input 
                label="Confirm Password" 
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={handleChange}
                leftIcon={<Lock className="w-5 h-5 text-teal-400" />}
              />
            </div>
            
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1 shrink-0">
                  <input type="checkbox" required className="peer appearance-none w-5 h-5 border border-slate-600 rounded bg-slate-900/50 checked:bg-teal-500 checked:border-teal-500 transition-colors cursor-pointer" />
                  <svg className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                  I agree to the <a href="#" className="text-teal-400 hover:text-teal-300 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-400 hover:text-teal-300 hover:underline">Privacy Policy</a>.
                </span>
              </label>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                size="lg" 
                isLoading={isLoading}
                className="py-4 shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] text-base font-semibold"
              >
                Create Account
              </Button>
            </div>
          </form>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Already have an account? <Link to="/login" className="text-teal-400 font-medium hover:text-teal-300 transition-colors">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
