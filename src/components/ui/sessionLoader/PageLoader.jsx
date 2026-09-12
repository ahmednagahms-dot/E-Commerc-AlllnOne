import React from 'react';

export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] p-6 animate-fade-in">
      
      <div className="relative flex items-center justify-center w-20 h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400 animate-spin-slow"></div>
        <div className="relative flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full shadow-md">
          <span className="text-white font-bold text-sm">AlO</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-1">AlllnOne E-commerce</h2>
      <p className="text-sm text-slate-500 mb-12 animate-pulse">{text}</p>

      <div className="w-full max-w-5xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-400/40 rounded-2xl animate-pulse"></div>
          <div className="h-28 bg-slate-400/40 rounded-2xl animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-28 bg-slate-400/40 rounded-2xl animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>

        <div className="h-64 bg-slate-400/40 rounded-2xl w-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        
      </div>
    </div>
  );
}