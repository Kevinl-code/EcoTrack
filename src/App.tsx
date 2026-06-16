import { useState, useEffect } from 'react';
import { Leaf, Award, BarChart3, GraduationCap, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import ActionTracker from './components/ActionTracker';
import Quiz from './components/Quiz';
import { calculateFootprint, CalculatorInputs } from './utils/calculations';

const DEFAULT_INPUTS: CalculatorInputs = {
  carType: 'petrolCar',
  carKmPerWeek: 155,
  publicKmPerWeek: 45,
  flightHoursPerYear: 8,
  electricityKwhPerMonth: 275,
  gasKwhPerMonth: 380,
  dietType: 'averageMeat',
  recycleEnabled: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'actions' | 'quiz'>('dashboard');
  
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    try {
      const saved = localStorage.getItem('ecoaware_carbon_inputs_v1');
      return saved ? JSON.parse(saved) : DEFAULT_INPUTS;
    } catch {
      return DEFAULT_INPUTS;
    }
  });

  const [completedActions, setCompletedActions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ecoaware_completed_actions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist State to local store safely
  useEffect(() => {
    localStorage.setItem('ecoaware_carbon_inputs_v1', JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem('ecoaware_completed_actions_v1', JSON.stringify(completedActions));
  }, [completedActions]);

  const handleUpdateInputs = (newValues: Partial<CalculatorInputs>) => {
    setInputs(prev => ({ ...prev, ...newValues }));
  };

  const handleToggleAction = (actionId: string) => {
    setCompletedActions(prev =>
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId) 
        : [...prev, actionId]
    );
  };

  const results = calculateFootprint(inputs);

  return (
    <div className="min-h-screen bg-[#0A0D0B] text-slate-300 flex flex-col justify-between" id="app-root-container">
      {/* Header Layout */}
      <header className="bg-[#0A0D0B] border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-opacity-70" id="app-header">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1">
                <span>EcoAware</span>
                <span className="text-emerald-500">.</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Personal Decarbonization Console</p>
            </div>
          </div>

          {/* Navigation Menus */}
          <nav className="flex bg-white/[0.03] border border-white/5 p-1 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-none" aria-label="Main navigation menu">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'calculator', label: 'Calculator', icon: Leaf },
              { id: 'actions', label: 'Action Plan', icon: Award },
              { id: 'quiz', label: 'Academy', icon: GraduationCap }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  aria-selected={isActive}
                  role="tab"
                  className={`flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Live Progress Info Block */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Progress</p>
              <p className="text-sm font-bold text-emerald-400">{results.total <= 4.0 ? '-24%' : '-12%'} this year</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 p-0.5">
              <div className="w-full h-full rounded-full bg-[#121614] border border-emerald-500/10 flex items-center justify-center text-[10px] font-mono text-emerald-400 font-extrabold">
                {results.total === 0 ? "0" : results.total.toFixed(0)}T
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-grow" id="app-main-content">
        {/* Quick Calculator Prompt Banner if values are fully blank or reset */}
        {results.total === 1.11 && activeTab === 'dashboard' && (
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider font-mono">ESTIMATION HIGHLIGHT</span>
              <p className="text-sm font-semibold text-slate-200">Values are customized. Adjust transportation metrics and domestic energy numbers to calculate precisely.</p>
            </div>
            <button
              id="cta-go-estimator"
              onClick={() => setActiveTab('calculator')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg hover:shadow-emerald-950/30"
            >
              <span>Verify Inputs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab views with nice transition containers */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'dashboard' && (
            <Dashboard breakdown={results.breakdown} total={results.total} />
          )}
          {activeTab === 'calculator' && (
            <Calculator currentInputs={inputs} onUpdate={handleUpdateInputs} />
          )}
          {activeTab === 'actions' && (
            <ActionTracker completedActions={completedActions} onToggleAction={handleToggleAction} />
          )}
          {activeTab === 'quiz' && (
            <Quiz />
          )}
        </div>
      </main>

      {/* Footer Content */}
      <footer className="bg-black/40 border-t border-white/5 py-8 text-[11px] text-slate-500" id="app-footer">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="bg-white/5 p-1.5 rounded-lg text-emerald-500 border border-white/5">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-200 tracking-tight">EcoAware Decarbonization Platform</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span>100% Secure Local Execution Mode Active.</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <p className="leading-relaxed">
              © 2026 EcoAware. Numerical constants modeled from IPCC assessments. Data localized on client client-side state safely.
            </p>
            <p className="flex items-center gap-1 justify-center whitespace-nowrap text-slate-400">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" />
              <span>for a resilient biosphere</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

