import React from 'react';
import { Image, Clock, CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { MOCK_CONTRIBUTORS } from '../constants';
import { motion } from 'motion/react';

export const Analytics = () => {
  return (
    <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto space-y-16">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x border border-outline-variant">
        {/* Total Images */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 transition-colors hover:bg-surface-container-low"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="p-2 bg-primary/5 text-primary rounded-lg">
              <Image size={24} />
            </span>
            <span className="text-[10px] font-extrabold text-primary px-2 py-0.5 border border-primary/20 uppercase tracking-[0.2em]">Live</span>
          </div>
          <h3 className="text-on-surface-variant text-[11px] font-extrabold uppercase tracking-[0.2em] mb-2">Total Images</h3>
          <p className="text-5xl font-extrabold text-on-surface tracking-tighter">1,284</p>
          <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider">
            <TrendingUp size={14} />
            <span>12% Increase</span>
          </div>
        </motion.div>

        {/* Pending */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-10 transition-colors hover:bg-surface-container-low"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="p-2 bg-on-surface-variant/5 text-on-surface-variant rounded-lg">
              <Clock size={24} />
            </span>
            <span className="text-[10px] font-extrabold text-on-surface-variant px-2 py-0.5 border border-outline-variant uppercase tracking-[0.2em]">Processing</span>
          </div>
          <h3 className="text-on-surface-variant text-[11px] font-extrabold uppercase tracking-[0.2em] mb-2">Pending</h3>
          <p className="text-5xl font-extrabold text-on-surface tracking-tighter">142</p>
          <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            <Clock size={14} />
            <span>Wait: 4.2s</span>
          </div>
        </motion.div>

        {/* Ready */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-10 transition-colors hover:bg-surface-container-low"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="p-2 bg-primary/5 text-primary rounded-lg">
              <CheckCircle size={24} />
            </span>
            <span className="text-[10px] font-extrabold text-primary px-2 py-0.5 border border-primary/20 uppercase tracking-[0.2em]">Healthy</span>
          </div>
          <h3 className="text-on-surface-variant text-[11px] font-extrabold uppercase tracking-[0.2em] mb-2">Ready</h3>
          <p className="text-5xl font-extrabold text-on-surface tracking-tighter">1,142</p>
          <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider">
            <CheckCircle size={14} />
            <span>99.8% Cache</span>
          </div>
        </motion.div>
      </div>

      {/* Main Analytics Section */}
      <div className="border border-outline-variant overflow-hidden">
        {/* Storage Leaderboard Header */}
        <div className="p-10 border-b border-outline-variant flex justify-between items-end bg-surface">
          <div>
            <h2 className="text-2xl font-extrabold text-on-surface tracking-tighter uppercase mb-2">Storage Leaderboard</h2>
            <p className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-[0.2em]">Top 5 high-density contributors</p>
          </div>
          <button className="text-[11px] font-extrabold text-primary flex items-center gap-2 hover:opacity-70 transition-opacity uppercase tracking-widest border-b border-primary/30 pb-1">
            Full List <ChevronRight size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-10 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.3em]">Contributor</th>
                <th className="px-10 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.3em] text-right">Total Size</th>
                <th className="px-10 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.3em] text-right">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {MOCK_CONTRIBUTORS.map((contributor) => (
                <tr key={contributor.id} className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 border border-outline-variant bg-surface text-on-surface flex items-center justify-center font-extrabold text-xs">
                        {contributor.initials}
                      </div>
                      <div>
                        <div className="font-extrabold text-on-surface text-sm tracking-tight uppercase">
                          {contributor.username}
                        </div>
                        <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                          Tier: {contributor.tier}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right font-extrabold text-on-surface text-lg tracking-tight">
                    {contributor.totalSize}
                  </td>
                  <td className="px-10 py-8 text-right font-bold text-on-surface-variant text-sm">
                    {contributor.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
