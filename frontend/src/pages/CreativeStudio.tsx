import React from 'react';
import { Palette } from 'lucide-react';

export const CreativeStudio: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20">
          <Palette className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Creative Studio</h1>
          <p className="text-sm text-slate-400">Design high-performing advertisement concepts</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center max-w-xl mx-auto my-12">
        <h3 className="text-lg font-semibold text-white">Creative Studio Architecture Initialized</h3>
        <p className="text-slate-400 text-sm mt-2">
          This studio route is ready for connecting to real AI ad generation pipelines.
        </p>
      </div>
    </div>
  );
};
