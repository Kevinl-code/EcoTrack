import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Circle, Car, Lightbulb, Utensils, Trash2, ShieldAlert } from 'lucide-react';

export interface ActionItem {
  id: string;
  title: string;
  category: 'transport' | 'energy' | 'diet' | 'waste';
  reduction: number; // in t CO2e
  description: string;
}

export const SUGGESTED_ACTIONS: ActionItem[] = [
  { id: 'act_bike', title: 'Cycle or use light electric vehicles for local commutes', category: 'transport', reduction: 0.60, description: 'Commuting by bicycle or walking instead of driving a fossil-fueled car directly reduces tailpipe emissions.' },
  { id: 'act_led', title: 'Equip home with smart High-Efficiency LEDs', category: 'energy', reduction: 0.15, description: 'Smart LEDs consume up to 80% less electric energy. Extends operational life tenfold over standard halogen filaments.' },
  { id: 'act_diet', title: 'Introduce vegetarian or vegan meal plans weekly', category: 'diet', reduction: 0.45, description: 'Farming red meat requires significant land expansion and emits methane. Substituting non-meat proteins is an alternative.' },
  { id: 'act_compost', title: 'Implement strict organic composting & glass recycling', category: 'waste', reduction: 0.10, description: 'Diverts kitchen scraps from tightly sealed landfills to aerated composters, preventing clean methane outputs.' },
  { id: 'act_temp', title: 'Lower winter thermostats by 1.5°C & adjust summer AC settings', category: 'energy', reduction: 0.30, description: 'Fossil gas furnaces and grid AC units consume significant power. Small temperature adjustments yield substantial savings.' },
  { id: 'act_wash', title: 'Wash laundry in cold temperatures & air-dry when possible', category: 'energy', reduction: 0.12, description: 'Heating water represents accounts for almost 90% of a washing machine\'s electricity total. Dryers account for substantial home utility strain.' }
];

interface ActionTrackerProps {
  completedActions: string[];
  onToggleAction: (actionId: string) => void;
}

const CATEGORY_ICONS = {
  transport: { bg: 'bg-rose-500/10 border border-rose-500/10', text: 'text-rose-400', icon: Car },
  energy: { bg: 'bg-amber-500/10 border border-amber-500/10', text: 'text-amber-400', icon: Lightbulb },
  diet: { bg: 'bg-emerald-500/10 border border-emerald-500/10', text: 'text-emerald-400', icon: Utensils },
  waste: { bg: 'bg-indigo-500/10 border border-indigo-500/10', text: 'text-indigo-400', icon: Trash2 },
};

export default function ActionTracker({ completedActions, onToggleAction }: ActionTrackerProps) {
  const totalSaved = SUGGESTED_ACTIONS
    .filter(action => completedActions.includes(action.id))
    .reduce((sum, action) => sum + action.reduction, 0);

  return (
    <div className="space-y-8" id="action-planner-section">
      {/* Planner Summary Header */}
      <div className="bg-white/[0.03] rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 id="action-planner-title" className="text-2xl font-bold text-white tracking-tight">Personalized Action Planner</h2>
          <p className="text-sm text-slate-400 mt-1">Acquire small habits that reduce global heating. Select completed/planned habits to calculate cumulative savings.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/10 rounded-2xl px-5 py-4 flex items-center gap-3.5 flex-shrink-0">
          <Sparkles className="text-emerald-400 w-6 h-6 flex-shrink-0" />
          <div>
            <span className="block text-xs text-emerald-400 font-extrabold uppercase tracking-wider">Projected Annual Savings</span>
            <span className="text-xl font-bold text-emerald-300 font-mono tracking-tight">{totalSaved.toFixed(2)} Tons CO2e</span>
          </div>
        </div>
      </div>

      {/* Habit Actions Grid */}
      <div className="space-y-4">
        {SUGGESTED_ACTIONS.map((action, idx) => {
          const isCompleted = completedActions.includes(action.id);
          const iconMeta = CATEGORY_ICONS[action.category];
          const CategoryIcon = iconMeta.icon;

          return (
            <motion.button
              key={action.id}
              onClick={() => onToggleAction(action.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              aria-pressed={isCompleted}
              id={`action-item-btn-${action.id}`}
              className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer focus-visible:ring-emerald-500 ${
                isCompleted 
                  ? 'bg-emerald-500/5 border-emerald-500/20 shadow-none' 
                  : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
              }`}
            >
              {/* Check Radio Box */}
              <div className="mt-1 flex-shrink-0">
                {isCompleted ? (
                   <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                )}
              </div>

              {/* Action content details */}
              <div className="flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className={`font-bold text-sm sm:text-base tracking-tight ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {action.title}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full inline-block w-fit whitespace-nowrap">
                    Saves -{action.reduction.toFixed(2)} t
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                  {action.description}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2 mt-3.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${iconMeta.bg} ${iconMeta.text}`}>
                    <CategoryIcon className="w-3 h-3" />
                    {action.category}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 py-0.5 px-2 rounded-md">
                      ACTIVE ACTION
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Information Alert */}
      <div className="bg-white/[0.02] text-slate-400 rounded-3xl p-6 flex flex-col sm:flex-row items-start gap-4 leading-relaxed border border-white/5">
        <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="block font-bold text-slate-100 text-sm mb-1">Cumulative Impact Strategy</span>
          Combined implementation of all listed habits will save up to <span className="font-bold text-white">1.72 metric tons</span> of clean greenhouse emissions annually, aligning your emissions with key restorative global goals.
        </div>
      </div>
    </div>
  );
}
