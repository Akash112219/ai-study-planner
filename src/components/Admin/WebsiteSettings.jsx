import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../common/GlassCard';
import Input from '../common/Input';
import Button from '../common/Button';
import { fetchAdminSettings, updateAdminSettings, uploadAdminSettingImage } from '../../services/api';
import { Save, Image as ImageIcon, Globe, Mail, Phone, Link2, Layout, FileText, Share2, Plus, Trash2, Megaphone, MonitorPlay } from 'lucide-react';

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    website_name: '',
    website_description: '',
    contact_email: '',
    support_number: '',
    social_facebook: '',
    social_twitter: '',
    social_linkedin: '',
    logo: '',
    favicon: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    announcement_banner: '',
    footer_content: '',
    features_section: [],
    testimonials: [],
    faq: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  const heroImageInputRef = useRef(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchAdminSettings();
      // Merge fetched settings with default state. Ensure arrays default to empty arrays if undefined.
      setSettings(prev => ({ 
        ...prev, 
        ...data,
        features_section: data.features_section || [],
        testimonials: data.testimonials || [],
        faq: data.faq || []
      }));
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setSettings(prev => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const handleAddItem = (field, defaultItem) => {
    setSettings(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }));
  };

  const handleRemoveItem = (field, index) => {
    setSettings(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      // Filter out empty string updates for logo/favicon to prevent overriding existing URLs with empty
      const dataToSave = { ...settings };
      await updateAdminSettings(dataToSave);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setMessage({ type: 'info', text: `Uploading ${key}...` });
      const response = await uploadAdminSettingImage(key, file);
      setSettings(prev => ({ ...prev, [key]: response.url }));
      setMessage({ type: 'success', text: `${key.charAt(0).toUpperCase() + key.slice(1)} uploaded successfully!` });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to upload ${key}.` });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Prepend backend base URL to image paths if they are relative
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:5000${url}`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
            <Layout className="text-indigo-500 w-8 h-8" /> 
            Website Settings
          </h2>
          <p className="text-slate-400">Manage your platform's global branding and configuration.</p>
        </div>
        <Button 
          onClick={handleSave} 
          isLoading={isSaving}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </header>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
          message.type === 'info' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
          'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {message.type === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Branding (Logo & Favicon) */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-400" /> Branding Assets
            </h3>
            
            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Main Logo</label>
              <div 
                onClick={() => logoInputRef.current.click()}
                className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-500/5 transition-colors group relative overflow-hidden bg-slate-800/50"
              >
                {settings.logo ? (
                  <img src={getImageUrl(settings.logo)} alt="Logo Preview" className="h-full object-contain p-2" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" />
                    <span className="text-sm text-slate-400 group-hover:text-indigo-300">Click to upload logo</span>
                  </>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium bg-slate-800 px-3 py-1 rounded-lg">Change Logo</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={logoInputRef} 
                onChange={(e) => handleFileUpload(e, 'logo')} 
                className="hidden" 
                accept="image/*" 
              />
              <p className="text-xs text-slate-500 mt-2">Recommended: 250x80px PNG with transparent background.</p>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Favicon</label>
              <div 
                onClick={() => faviconInputRef.current.click()}
                className="w-full h-24 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-500/5 transition-colors group relative overflow-hidden bg-slate-800/50"
              >
                {settings.favicon ? (
                  <img src={getImageUrl(settings.favicon)} alt="Favicon Preview" className="h-10 w-10 object-contain" />
                ) : (
                  <Globe className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium bg-slate-800 px-2 py-1 rounded-lg">Change</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={faviconInputRef} 
                onChange={(e) => handleFileUpload(e, 'favicon')} 
                className="hidden" 
                accept="image/x-icon,image/png" 
              />
              <p className="text-xs text-slate-500 mt-2">Recommended: 32x32px ICO or PNG.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" /> Announcement
            </h3>
            <div className="flex flex-col w-full">
              <label className="block text-sm font-medium text-slate-300 mb-2">Banner Text (Leave empty to hide)</label>
              <textarea
                name="announcement_banner"
                value={settings.announcement_banner}
                onChange={handleChange}
                placeholder="Huge Sale! 50% off all Premium features..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 p-4 min-h-[80px] focus:outline-none focus:border-amber-500 transition-colors resize-y"
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Text Settings */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> General Information
            </h3>
            <div className="space-y-5">
              <Input
                label="Website Name"
                name="website_name"
                value={settings.website_name}
                onChange={handleChange}
                placeholder="AI Study Planner"
                leftIcon={<Globe className="w-5 h-5 text-slate-400" />}
              />
              <div className="flex flex-col w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2">Website Description (SEO)</label>
                <textarea
                  name="website_description"
                  value={settings.website_description}
                  onChange={handleChange}
                  placeholder="The most advanced AI study scheduling tool..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 p-4 min-h-[100px] focus:outline-none focus:border-emerald-500 transition-colors resize-y"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-indigo-400" /> Homepage Hero
            </h3>
            <div className="space-y-5">
              <Input
                label="Hero Title"
                name="hero_title"
                value={settings.hero_title}
                onChange={handleChange}
                placeholder="Master Your Studies with AI"
              />
              <div className="flex flex-col w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2">Hero Subtitle</label>
                <textarea
                  name="hero_subtitle"
                  value={settings.hero_subtitle}
                  onChange={handleChange}
                  placeholder="Unlock personalized learning plans designed just for you."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 p-4 min-h-[80px] focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image / Illustration</label>
                <div 
                  onClick={() => heroImageInputRef.current.click()}
                  className="w-full h-40 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-500/5 transition-colors group relative overflow-hidden bg-slate-800/50"
                >
                  {settings.hero_image ? (
                    <img src={getImageUrl(settings.hero_image)} alt="Hero Preview" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" />
                      <span className="text-sm text-slate-400 group-hover:text-indigo-300">Upload Hero Graphic</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-slate-800 px-3 py-1 rounded-lg">Change Hero Image</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={heroImageInputRef} 
                  onChange={(e) => handleFileUpload(e, 'hero_image')} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-400" /> Contact Details
              </h3>
              <div className="space-y-5">
                <Input
                  label="Contact Email"
                  name="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  placeholder="support@example.com"
                  leftIcon={<Mail className="w-5 h-5 text-slate-400" />}
                />
                <Input
                  label="Support Number"
                  name="support_number"
                  value={settings.support_number}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  leftIcon={<Phone className="w-5 h-5 text-slate-400" />}
                />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-400" /> Social Links
              </h3>
              <div className="space-y-5">
                <Input
                  label="Facebook URL"
                  name="social_facebook"
                  value={settings.social_facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  leftIcon={<Link2 className="w-5 h-5 text-slate-400" />}
                />
                <Input
                  label="Twitter URL"
                  name="social_twitter"
                  value={settings.social_twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/..."
                  leftIcon={<Link2 className="w-5 h-5 text-slate-400" />}
                />
                <Input
                  label="LinkedIn URL"
                  name="social_linkedin"
                  value={settings.social_linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  leftIcon={<Link2 className="w-5 h-5 text-slate-400" />}
                />
              </div>
            </GlassCard>
          </div>

          {/* Features Builder */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-pink-400" /> Features Section
              </h3>
              <button 
                onClick={() => handleAddItem('features_section', { title: '', description: '' })}
                className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 transition flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Feature
              </button>
            </div>
            
            {settings.features_section.length === 0 && (
              <p className="text-slate-500 text-sm italic">No features added yet.</p>
            )}

            <div className="space-y-4">
              {settings.features_section.map((feature, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 relative group">
                  <button 
                    onClick={() => handleRemoveItem('features_section', idx)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid gap-3 pr-8">
                    <Input 
                      placeholder="Feature Title (e.g. Smart AI Analytics)" 
                      value={feature.title} 
                      onChange={(e) => handleArrayChange('features_section', idx, 'title', e.target.value)} 
                    />
                    <textarea
                      placeholder="Feature description..."
                      value={feature.description}
                      onChange={(e) => handleArrayChange('features_section', idx, 'description', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 p-3 min-h-[80px] focus:outline-none focus:border-pink-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Testimonials & FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" /> Testimonials
                </h3>
                <button 
                  onClick={() => handleAddItem('testimonials', { name: '', text: '' })}
                  className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {settings.testimonials.map((testi, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-white/5 relative">
                    <button onClick={() => handleRemoveItem('testimonials', idx)} className="absolute top-2 right-2 text-slate-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
                    <input type="text" placeholder="User Name" value={testi.name} onChange={(e) => handleArrayChange('testimonials', idx, 'name', e.target.value)} className="w-full bg-transparent border-b border-slate-700 text-sm text-white mb-2 pb-1 focus:outline-none focus:border-teal-500" />
                    <textarea placeholder="Quote..." value={testi.text} onChange={(e) => handleArrayChange('testimonials', idx, 'text', e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded text-slate-200 p-2 min-h-[60px] text-xs focus:outline-none focus:border-teal-500" />
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-400" /> FAQ
                </h3>
                <button 
                  onClick={() => handleAddItem('faq', { question: '', answer: '' })}
                  className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {settings.faq.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-white/5 relative">
                    <button onClick={() => handleRemoveItem('faq', idx)} className="absolute top-2 right-2 text-slate-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
                    <input type="text" placeholder="Question" value={item.question} onChange={(e) => handleArrayChange('faq', idx, 'question', e.target.value)} className="w-full bg-transparent border-b border-slate-700 text-sm text-white mb-2 pb-1 focus:outline-none focus:border-rose-500" />
                    <textarea placeholder="Answer..." value={item.answer} onChange={(e) => handleArrayChange('faq', idx, 'answer', e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded text-slate-200 p-2 min-h-[60px] text-xs focus:outline-none focus:border-rose-500" />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" /> Footer Content
            </h3>
            <textarea
              name="footer_content"
              value={settings.footer_content}
              onChange={handleChange}
              placeholder="© 2026 AI Study Planner. All rights reserved."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 p-4 min-h-[80px] focus:outline-none focus:border-indigo-500 transition-colors resize-y"
            />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;
