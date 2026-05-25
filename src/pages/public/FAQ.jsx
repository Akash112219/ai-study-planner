import React, { useState } from 'react';
import MarketingLayout from '../../components/Layout/MarketingLayout';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const faqs = [
    {
      q: "How exactly does the AI schedule my study sessions?",
      a: "Our engine uses a fine-tuned Machine Learning model that processes your syllabi, deadlines, and historical productivity data. It identifies when your brain is most likely to achieve a 'flow state' and automatically slots your most difficult subjects into those specific time windows."
    },
    {
      q: "Is the application completely free?",
      a: "Yes! Our core AI scheduling features, daily dashboard, and task management are 100% free forever. We also offer a Premium tier which includes advanced deep-work analytics, two-way Google Calendar syncing, and PDF curriculum parsing."
    },
    {
      q: "Can I sync the AI planner with Google Calendar or Apple Calendar?",
      a: "Absolutely. On our Premium tier, we offer seamless two-way synchronization. If you add a doctor's appointment to Google Calendar, our AI will instantly detect the conflict and silently recalculate your entire study week."
    },
    {
      q: "What happens if I miss a scheduled study block?",
      a: "No problem at all! We built this platform for real humans, not robots. Simply click the 'Auto-Reschedule' button on your dashboard, and the AI will dynamically shift your remaining workload across the rest of the week without jeopardizing your deadlines."
    },
    {
      q: "Does it support the Pomodoro Technique?",
      a: "Yes. By default, the AI breaks deep-work sessions into 50-minute focused blocks followed by 10-minute breaks, which cognitive science shows is optimal for complex problem-solving. You can customize these intervals in your settings."
    },
    {
      q: "How does the automated Spaced Repetition work?",
      a: "The AI tracks exactly when you first studied a topic. Based on the Ebbinghaus forgetting curve, it will automatically schedule 15-minute 'micro-review' sessions 1 day, 3 days, and 7 days later to ensure the knowledge transfers to your long-term memory."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <MarketingLayout>
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-24 relative z-10 min-h-[calc(100vh-80px)]">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Questions</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about the product and billing. Can't find the answer you're looking for? Reach out to our team.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            
            return (
              <div 
                key={i} 
                className={`
                  rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl
                  ${isOpen 
                    ? 'bg-slate-800/80 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]' 
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/50'
                  }
                `}
              >
                {/* Question Header (Clickable) */}
                <button
                  onClick={() => toggleAccordion(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-200'}`}>
                    {faq.q}
                  </span>
                  
                  {/* Plus/Minus Icon */}
                  <div className={`
                    shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${isOpen ? 'bg-indigo-500/20 text-indigo-400 rotate-180' : 'bg-slate-700/50 text-slate-400'}
                  `}>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                </button>
                
                {/* Expandable Answer */}
                <div 
                  className={`
                    transition-all duration-500 ease-in-out
                    ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}
                  `}
                >
                  <p className="px-6 text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Call to action */}
        <div className="mt-16 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-slate-400">
            Still have questions? <a href="/contact" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Contact our support team</a>.
          </p>
        </div>

      </div>
    </MarketingLayout>
  );
};

export default FAQ;
