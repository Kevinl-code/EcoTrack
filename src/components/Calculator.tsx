import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, ChevronRight, ChevronLeft, Car, Home, Leaf, Trash2 } from 'lucide-react';
import { CalculatorInputs } from '../utils/calculations';

interface CalculatorProps {
  currentInputs: CalculatorInputs;
  onUpdate: (inputs: Partial<CalculatorInputs>) => void;
}

const STEPS = [
  { id: 'transport', label: 'Transportation', icon: Car },
  { id: 'energy', label: 'Home Energy', icon: Home },
  { id: 'diet', label: 'Food & Waste', icon: Leaf }
];

export default function Calculator({ currentInputs, onUpdate }: CalculatorProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onUpdate({ [name]: checked });
    } else {
      // Normalize number inputs
      if (type === 'number') {
        const numVal = Math.max(0, parseFloat(value) || 0);
        onUpdate({ [name]: numVal });
      } else {
        onUpdate({ [name]: value });
      }
    }
  };

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  return (
    <div id="calculator-section" className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 id="calculator-title" className="text-2xl font-bold text-white tracking-tight">Footprint Estimator</h2>
          <p className="text-sm text-slate-400 mt-1">Provide estimates for your daily habits to generate your environmental footprint baseline.</p>
        </div>
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto bg-white/[0.02] border border-white/5 p-1 rounded-2xl font-medium">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            return (
              <button
                key={step.id}
                id={`step-tab-${step.id}`}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                    : isCompleted
                    ? 'text-emerald-400 hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                aria-label={`Go to ${step.label} step`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden" role="progressbar" aria-valuenow={Math.round(((activeStep + 1) / STEPS.length) * 100)} aria-valuemin={0} aria-valuemax={100}>
        <motion.div 
          className="bg-emerald-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Interactive Form Controls */}
      <div className="min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 rounded-xl">
                    <Car className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Transportation & Commuting</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="carType" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Car Engine/Fuel Type</label>
                    <select
                      id="carType"
                      name="carType"
                      value={currentInputs.carType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 bg-[#121614] text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                    >
                      <option value="petrolCar" className="bg-[#121614] text-slate-200">Petrol Car (Standard Gas)</option>
                      <option value="dieselCar" className="bg-[#121614] text-slate-200">Diesel Engine Car</option>
                      <option value="electricCar" className="bg-[#121614] text-slate-200">Electric Vehicle (EV)</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Select electric if you charge on a regional power grid.</p>
                  </div>

                  <div>
                    <label htmlFor="carKmPerWeek" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Average Vehicle Drive Mileage (km / week)</label>
                    <div className="relative">
                      <input
                        id="carKmPerWeek"
                        name="carKmPerWeek"
                        type="number"
                        min="0"
                        value={currentInputs.carKmPerWeek || ''}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 pl-4 pr-16 py-3 bg-[#121614] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md">km</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="publicKmPerWeek" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Public transit usage (Bus/Train) (km / week)</label>
                    <div className="relative">
                      <input
                        id="publicKmPerWeek"
                        name="publicKmPerWeek"
                        type="number"
                        min="0"
                        value={currentInputs.publicKmPerWeek || ''}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 pl-4 pr-16 py-3 bg-[#121614] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md">km</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="flightHoursPerYear" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total annual flight travel duration (hours / year)</label>
                    <div className="relative">
                      <input
                        id="flightHoursPerYear"
                        name="flightHoursPerYear"
                        type="number"
                        min="0"
                        value={currentInputs.flightHoursPerYear || ''}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 pl-4 pr-16 py-3 bg-[#121614] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md">hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 rounded-xl">
                    <Home className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Home Energy Consumption</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="electricityKwhPerMonth" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Household Electricity usage (kWh / month)</label>
                    <div className="relative">
                      <input
                        id="electricityKwhPerMonth"
                        name="electricityKwhPerMonth"
                        type="number"
                        min="0"
                        value={currentInputs.electricityKwhPerMonth || ''}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 pl-4 pr-16 py-3 bg-[#121614] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md">kWh</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Standard average home uses ~300 kWh per month.</p>
                  </div>

                  <div>
                    <label htmlFor="gasKwhPerMonth" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Household Natural Gas usage (kWh / month)</label>
                    <div className="relative">
                      <input
                        id="gasKwhPerMonth"
                        name="gasKwhPerMonth"
                        type="number"
                        min="0"
                        value={currentInputs.gasKwhPerMonth || ''}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 pl-4 pr-16 py-3 bg-[#121614] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md">kWh</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Combustion generates 0.18 kg CO2e per kWh.</p>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex gap-3.5 text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">
                  <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-200 mb-0.5">Energy Coefficient Reference</span>
                    Average global electricity production produces ~0.38 kg CO2e per kWh, depending heavily on regional generator setups.
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 rounded-xl">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Diet & Organic Waste</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dietType" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Daily Dietary Habit</label>
                    <select
                      id="dietType"
                      name="dietType"
                      value={currentInputs.dietType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 bg-[#121614] text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                    >
                      <option value="heavyMeat" className="bg-[#121614] text-slate-200">Heavy Meat Consumer (Daily red meat)</option>
                      <option value="averageMeat" className="bg-[#121614] text-slate-200">Medium Meat Consumer (Poultry/occasional pork/beef)</option>
                      <option value="lowMeat" className="bg-[#121614] text-slate-200">Minimal Meat/Flexitarian (Primarily vegetarian)</option>
                      <option value="vegetarian" className="bg-[#121614] text-slate-200">Vegetarian (No meat, does consume dairy/eggs)</option>
                      <option value="vegan" className="bg-[#121614] text-slate-200">Vegan / Plant-based strict diet</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Plant-based diets significantly compress environmental footprints.</p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Household Recycling Habits</div>
                    <label className="flex items-center gap-3.5 bg-white/[0.01] border border-white/5 p-4 rounded-2xl cursor-pointer hover:bg-white/[0.03] transition-all select-none">
                      <input
                        id="recycleEnabled"
                        type="checkbox"
                        name="recycleEnabled"
                        checked={currentInputs.recycleEnabled}
                        onChange={handleChange}
                        className="w-5 h-5 rounded text-emerald-600 border-white/10 focus:ring-emerald-500 focus:ring-offset-[#0A0D0B] bg-[#121614] cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-200 block">Active Composting & Recycling</span>
                        <span className="text-xs text-slate-500 block font-medium mt-0.5">We separate glass, paper, aluminum and plastics regularly.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex gap-3.5 text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">
                  <Trash2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-200 mb-0.5">Methane Generation Impact</span>
                    Decomposing food and paper inside landfills releases strong methane (CH4) gas. Regular recycling redirects waste to low-impact processors, saving up to 270 kg CO2e annually.
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
          <button
            id="btn-prev-wizard"
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-300 border border-white/10 rounded-xl hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {activeStep < STEPS.length - 1 ? (
            <button
              id="btn-next-wizard"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-950/20 transition-all cursor-pointer"
            >
              Configure Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-400 font-bold bg-emerald-500/10 px-4.5 py-2.5 rounded-xl border border-emerald-500/15">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Inputs Preserved Locally</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
