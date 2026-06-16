import { motion } from 'motion/react';
import { Target, AlertTriangle, Sparkles, TrendingDown, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { FootprintBreakdown } from '../utils/calculations';

interface DashboardProps {
  breakdown: FootprintBreakdown;
  total: number;
}

export default function Dashboard({ breakdown, total }: DashboardProps) {
  const PARIS_TARGET = 2.0;       // t CO2e to limit warming to 1.5 degrees C
  const GLOBAL_AVERAGE = 4.8;     // t CO2e global average per year per capita
  const WESTERN_AVERAGE = 12.5;    // t CO2e western average per year per capita

  // Normalize absolute percentages for the structural meter
  const sumBreakdown = (breakdown.transport + breakdown.energy + breakdown.diet + breakdown.waste) || 0.01;
  const pct = {
    transport: Math.max(0, Math.min(100, (breakdown.transport / sumBreakdown) * 100)),
    energy: Math.max(0, Math.min(100, (breakdown.energy / sumBreakdown) * 100)),
    diet: Math.max(0, Math.min(100, (breakdown.diet / sumBreakdown) * 100)),
    waste: Math.max(0, Math.min(100, (breakdown.waste / sumBreakdown) * 100))
  };

  // Find the primary driver of footprint
  const sortedBreakdown = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const primaryDriver = sortedBreakdown[0] || ['transport', 0];

  const driverLabels: Record<string, string> = {
    transport: 'Transportation Commutes',
    energy: 'Household Energy Waste',
    diet: 'High Meat Dietary Intake',
    waste: 'Organic/Trash Waste output'
  };

  return (
    <div className="space-y-8" id="dashboard-tab-panel">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scorecard / Headline Stat */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Annual Carbon Footprint</span>
              <span className="p-2 bg-white/5 rounded-xl border border-white/5 text-slate-300">
                <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-sans tracking-tight font-bold text-white tabular-nums">{total.toFixed(2)}</span>
              <span className="text-sm font-semibold text-slate-500">t CO2e / Year</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-400 leading-relaxed font-medium">
            {total <= PARIS_TARGET ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Supporting COP26 Paris Climate 1.5°C boundary!
              </span>
            ) : total <= GLOBAL_AVERAGE ? (
              <span className="text-slate-300">Excellent. Your footprint is below the global average, but targeting 2.0t will yield higher climate reversal.</span>
            ) : (
              <span className="text-slate-400">Your output exceeds target levels. Implementing active planner savings will reduce output by up to 40%.</span>
            )}
          </div>
        </motion.div>

        {/* Global Competence/Benchmarks */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Comparative Benchmarks</h3>
              <Target className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">COP26 Paris Target:</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-0.5 rounded-lg text-xs">≤ {PARIS_TARGET.toFixed(1)} t</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Global Average Capita:</span>
                <span className="text-slate-200 font-semibold">{GLOBAL_AVERAGE.toFixed(1)} t</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Western Average Capita:</span>
                <span className="text-slate-200 font-semibold">{WESTERN_AVERAGE.toFixed(1)} t</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 mt-6 flex items-center gap-1.5 text-xs text-slate-500">
            <span>To halt catastrophic heating, per-capita emissions must rest under 2 tons.</span>
          </div>
        </motion.div>

        {/* Dynamic Drivers */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Primary Emissions Driver</h3>
              <div className="p-1 px-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold text-[10px] tracking-wide">INSIGHT</div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/10 rounded-xl text-amber-500 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight capitalize">{driverLabels[primaryDriver[0]]}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Contributes <span className="font-semibold text-slate-200 text-xs">{primaryDriver[1].toFixed(2)} t CO2e</span> to your yearly total. Adjust targets in the Plan tab.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> High savings potential found</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* Visual Bars */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Emissions Footprint Breakdown</h3>
            <p className="text-xs text-slate-500">Yearly share of carbon greenhouse output calculated using scientific indicators.</p>
          </div>
          <div className="text-[10px] font-bold text-slate-500 font-mono tracking-widest">VALUES SECURELY ISOLATED</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Bars */}
          <div className="space-y-5">
            {[
              { key: 'transport', label: 'Transportation & Travel', color: 'bg-rose-500', barBg: 'bg-rose-950/20', text: 'text-rose-400' },
              { key: 'energy', label: 'Household Energy Use', color: 'bg-amber-500', barBg: 'bg-amber-950/20', text: 'text-amber-400' },
              { key: 'diet', label: 'Dietary Choice & Nutrition', color: 'bg-emerald-500', barBg: 'bg-emerald-950/20', text: 'text-emerald-400' },
              { key: 'waste', label: 'Municipal Waste Production', color: 'bg-indigo-500', barBg: 'bg-indigo-950/20', text: 'text-indigo-400' }
            ].map(category => {
              const value = breakdown[category.key as keyof FootprintBreakdown] || 0;
              const ratio = pct[category.key as keyof typeof pct] || 0;
              return (
                <div key={category.key} className="space-y-2 p-3 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 font-bold text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${category.color}`} />
                      {category.label}
                    </span>
                    <span className="font-mono text-white">{value.toFixed(2)} t CO2e ({Math.round(ratio)}%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${category.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${ratio}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graphical gauge representer */}
          <div className="flex flex-col items-center justify-center p-6 bg-white/[0.01] rounded-3xl border border-white/5">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Simple beautiful circular representation */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-white/5 fill-transparent" 
                  strokeWidth="8"
                />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-emerald-500 fill-transparent" 
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: Math.max(0, 251.2 - (251.2 * Math.min(100, (total / WESTERN_AVERAGE) * 100)) / 100) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold font-mono">PARIS FIT</div>
                <div className="text-2xl font-bold text-white mt-1">{total === 0 ? '0%' : `${Math.round(Math.max(1, (PARIS_TARGET / total) * 100))}%`}</div>
                <div className="text-[9px] text-emerald-400 font-bold mt-1 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Overview</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center mt-5 leading-relaxed font-medium">
              Your overall footprint targets <span className="font-bold text-slate-200">{Math.round((total / DomesticCapitaMax(total)) * 100)}%</span> of regional thresholds.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DomesticCapitaMax(val: number) {
  return val > 12.5 ? val * 1.5 : 12.5;
}
