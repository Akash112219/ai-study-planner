import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, RotateCw, CalendarDays, ChevronDown, CheckCircle2, Zap, Brain, Sparkles, TrendingUp, Play, Star, BarChart3, Clock, BookOpen, Award, ArrowRight, X } from 'lucide-react';
import MarketingLayout from '../../components/Layout/MarketingLayout';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  const featuresList = [
    { 
      title: "Neural Scheduling", 
      desc: "Our AI analyzes your natural energy peaks to schedule deep-work precisely when you're most focused.",
      icon: <BrainCircuit className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/5",
      border: "border-emerald-500/20 hover:border-emerald-500/50"
    },
    { 
      title: "Spaced Repetition", 
      desc: "Automatically injects micro-review sessions into your week right before the forgetting curve hits.",
      icon: <RotateCw className="w-6 h-6 text-blue-400" />,
      color: "from-blue-500/20 to-indigo-500/5",
      border: "border-blue-500/20 hover:border-blue-500/50"
    },
    { 
      title: "Auto-Rescheduling", 
      desc: "Life happens. If you miss a study session, the AI instantly recalculates your entire week.",
      icon: <CalendarDays className="w-6 h-6 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/5",
      border: "border-amber-500/20 hover:border-amber-500/50"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      university: "Stanford University",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=10b981",
      text: "I used to spend 2 hours every Sunday just trying to map out my study week. This AI does it in 5 seconds and actually adapts when I sleep in. It's magic.",
    },
    {
      name: "Marcus Chen",
      university: "MIT",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Marcus&backgroundColor=3b82f6",
      text: "The spaced repetition algorithm built directly into my calendar is a game-changer. I completely crushed my organic chemistry finals without pulling a single all-nighter.",
    },
    {
      name: "Elena Rodriguez",
      university: "UCLA",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Elena&backgroundColor=f59e0b",
      text: "Finally, a planner that understands that I'm a human, not a robot. The auto-rescheduling feature saves me so much guilt when I inevitably miss a session.",
    }
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for casual students getting started.",
      features: ["Smart scheduling for up to 5 courses", "Basic auto-rescheduling", "Standard calendar sync"],
      buttonText: "Get Started",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$8",
      period: "/month",
      description: "For serious students who want to maximize their grades.",
      features: ["Unlimited courses & tasks", "Advanced neural scheduling", "Spaced repetition injection", "Real-time calendar sync", "Priority support"],
      buttonText: "Start Free Trial",
      highlighted: true,
      badge: "Most Popular"
    },
    {
      name: "Ultra",
      price: "$19",
      period: "/month",
      description: "The ultimate AI academic weapon for elite scholars.",
      features: ["Everything in Pro", "AI essay outline generation", "Automated flashcard creation", "1-on-1 AI tutoring (10 hrs/mo)", "Custom API access"],
      buttonText: "Go Ultra",
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: "How does the AI know when I'm most productive?",
      answer: "During onboarding, we ask a few questions about your sleep schedule and daily energy levels. As you use the app and track when you complete tasks, our machine learning model continuously refines your schedule to match your natural circadian rhythms."
    },
    {
      question: "Does it sync with my school's calendar?",
      answer: "Yes! StudyPlanner natively integrates with Canvas, Blackboard, Google Calendar, Apple Calendar, and Outlook. Your deadlines and lectures are automatically imported and kept in sync."
    },
    {
      question: "What happens if I fall behind on my schedule?",
      answer: "No problem. Unlike traditional planners that make you feel guilty, our AI features a one-click 'Reschedule' button that instantly recalculates your upcoming tasks to get you back on track without missing deadlines."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption (AES-256) for all data. We never sell your personal information or academic data to third parties."
    }
  ];

  // Helper component for 5 stars
  const StarRating = () => (
    <div className="flex gap-1 mb-4 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <MarketingLayout>
      {/* Background ambient elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-teal-500/5 blur-[150px]" />
      </div>

      <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24">
        
        {/* PREMIUM SAAS HERO SECTION */}
        <div className="w-full max-w-7xl mx-auto mb-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-8">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-left relative z-20"
            >
              {/* Feature Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-700/50 text-slate-300 text-sm font-medium mb-8 shadow-lg backdrop-blur-md hover:bg-slate-800/80 transition-colors cursor-pointer group">
                <Sparkles className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
                  Introducing StudyPlanner 2.0 AI
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </motion.div>
              
              {/* Main Heading */}
              <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
                Study Smarter <br />
                <span className="relative whitespace-nowrap">
                  <span className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-xl rounded-full"></span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 drop-shadow-sm">
                    with AI.
                  </span>
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed mb-10">
                Your personal AI-powered study planner that creates schedules, tracks progress, and boosts productivity. Stop planning and start achieving.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-start items-center gap-4 mb-12">
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
                    Get Started <Zap className="w-4 h-4 group-hover:text-amber-300 transition-colors" />
                  </button>
                </Link>
                <button onClick={() => setShowDemo(true)} className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white font-medium rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 group">
                  <Play className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" /> Watch Demo
                </button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div variants={itemVariants} className="flex flex-wrap justify-start items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-[#020617]" src="https://api.dicebear.com/7.x/notionists/svg?seed=1&backgroundColor=10b981" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-[#020617]" src="https://api.dicebear.com/7.x/notionists/svg?seed=2&backgroundColor=3b82f6" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-[#020617]" src="https://api.dicebear.com/7.x/notionists/svg?seed=3&backgroundColor=f59e0b" alt="User" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-xs text-white font-bold">+2k</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span>4.9/5 from students</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Student Image with Floating Elements */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50 }}
              className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] mt-10 lg:mt-0"
            >
              {/* Main Image Container */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/60 bg-slate-900/80">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 mix-blend-overlay z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                  alt="Students studying together" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 pointer-events-none"></div>
              </div>

              {/* Floating Glassmorphism Analytics Card 1 */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 md:-left-8 top-10 md:top-20 z-30"
              >
                <div className="glass-panel p-3 md:p-4 flex items-center gap-3 w-[160px] md:w-[200px]">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] md:text-xs font-medium mb-0.5">Productivity</p>
                    <p className="text-white text-sm md:text-base font-bold">+34% this week</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Glassmorphism Analytics Card 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-4 md:-right-8 bottom-16 md:bottom-24 z-30"
              >
                <div className="glass-panel p-3 md:p-4 flex flex-col gap-2 w-[160px] md:w-[180px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-slate-300 text-[10px] md:text-xs font-medium">Session</span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] font-bold rounded-full border border-blue-500/20">Active</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden mt-1">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-400 w-[65%] h-full rounded-full"></div>
                  </div>
                  <p className="text-slate-400 text-[10px] text-right">45m left</p>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Global Impact Statistics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl mb-32"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            {[
              { label: "Active Students", value: 12, suffix: "k+", icon: <Brain className="w-5 h-5 text-emerald-400 mx-auto mb-3" /> },
              { label: "Tasks Optimized", value: 15, suffix: "M+", icon: <Zap className="w-5 h-5 text-blue-400 mx-auto mb-3" /> },
              { label: "Productivity Spike", value: 215, suffix: "%", icon: <TrendingUp className="w-5 h-5 text-indigo-400 mx-auto mb-3" /> },
              { label: "Hours Saved", value: 850, suffix: "k+", icon: <CalendarDays className="w-5 h-5 text-teal-400 mx-auto mb-3" /> }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-8 group">
                {stat.icon}
                <h3 className="text-4xl font-extrabold text-white mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Features Section */}
        <div className="w-full max-w-6xl mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Built on <span className="text-gradient">cognitive science</span>.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We've automated the science behind effective learning so you can just focus on studying.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuresList.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group p-8 bg-slate-900/40 backdrop-blur-xl border rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${f.border}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${f.color} border border-white/5`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="w-full max-w-6xl mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Loved by <span className="text-gradient-blue">Top Students</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Join thousands of students who have upgraded their academic workflow.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-8 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <StarRating />
                  <p className="text-slate-300 leading-relaxed text-sm mb-8">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full bg-slate-800"
                  />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{t.name}</h4>
                    <p className="text-slate-500 text-xs">{t.university}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Pricing Section */}
        <div id="pricing" className="w-full max-w-6xl mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Simple, transparent <span className="text-gradient">pricing</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Invest in your grades. Cancel anytime.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative flex flex-col p-8 rounded-3xl ${tier.highlighted ? 'bg-slate-800/80 border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.15)] scale-105 z-10' : 'bg-slate-900/50 border border-slate-800 glass-card'}`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-bold text-white tracking-wider uppercase shadow-lg">
                    {tier.badge}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-slate-400 text-sm h-10">{tier.description}</p>
                </div>
                <div className="mb-8 flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-white tracking-tight">{tier.price}</span>
                  {tier.period && <span className="text-slate-400 text-lg mb-1">{tier.period}</span>}
                </div>
                <ul className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.highlighted ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${tier.highlighted ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                  {tier.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Frequently Asked Questions</h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="marketing-cta w-full max-w-5xl rounded-3xl bg-gradient-to-br from-emerald-500/20 via-slate-800 to-blue-500/20 border border-slate-700/50 p-12 text-center relative overflow-hidden glass-card"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to top your class?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
              Join thousands of students getting better grades in less time.
            </p>
            <Link to="/signup">
              <button className="btn-primary py-4 px-10 text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Start your free trial
              </button>
            </Link>
          </div>
        </motion.div>
        
      </div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowDemo(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-slate-900/50 hover:bg-slate-800 text-white rounded-full transition-colors backdrop-blur"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src="/demo.webp" 
                alt="App Demo" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MarketingLayout>
  );
};

export default Home;
