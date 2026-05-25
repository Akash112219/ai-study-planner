import React from 'react';
import MarketingLayout from '../../components/Layout/MarketingLayout';

const About = () => {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
        <p className="text-xl text-slate-400 mb-12">
          We are on a mission to democratize elite academic strategies using artificial intelligence.
        </p>
        <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl text-left">
          <p className="text-slate-300 leading-relaxed mb-4">
            Founded by a team of university dropouts turned software engineers, AI StudyPlanner was born from the frustration of inefficient studying. We realized that what separates top performers isn't raw intelligence, but optimized scheduling and focused execution.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Our algorithms are trained on the latest cognitive science research regarding spaced repetition, interleaving, and the Pomodoro technique to ensure every minute you spend studying yields maximum retention.
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default About;
