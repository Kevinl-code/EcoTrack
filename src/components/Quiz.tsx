import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, RotateCcw, Award, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which global sector contributes the largest share of greenhouse gas emissions annually?",
    options: [
      "Transportation & Logistics",
      "Electricity & Heat Production",
      "Agriculture, Forestry & Land-use",
      "Industrial Heavy Manufacturing"
    ],
    answerIndex: 1,
    explanation: "Electricity and utility heat generation represents approximately 25% of global emissions, closely followed by agriculture and land-use changes (~21%)."
  },
  {
    id: 2,
    question: "How much CO2 does a healthy, mature tree absorb on average in a single year?",
    options: [
      "~2.2 kilograms",
      "~22 kilograms",
      "~120 kilograms",
      "~220 kilograms"
    ],
    answerIndex: 1,
    explanation: "A mature tree absorbs roughly 22 kilograms (48 lbs) of carbon dioxide annually, whilst converting carbon into organic oxygen molecules."
  },
  {
    id: 3,
    question: "Which diet type is scientifically proven to produce the lowest carbon footprint?",
    options: [
      "Flexitarian (meat occasional)",
      "Lacto-Ovo Vegetarian",
      "Vegan / Plant-Based strict diet",
      "Paleolithic meat-centric model"
    ],
    answerIndex: 2,
    explanation: "A plant-based (vegan) diet produces an annual baseline of only ~0.9 t CO2e, representing a 60%+ drop relative to high-consumption red meat lines."
  },
  {
    id: 4,
    question: "Which chemical compound accounts for the overwhelming majority of global human-caused greenhouse gases?",
    options: [
      "Carbon Dioxide (CO2)",
      "Methane (CH4)",
      "Nitrous Oxide (N2O)",
      "Fluorinated Greenhouse Gases"
    ],
    answerIndex: 0,
    explanation: "Carbon Dioxide (CO2) accounts for roughly 76% of total worldwide human gas output, driven primarily by fuel comburents."
  },
  {
    id: 5,
    question: "What is the primary target threshold set by the global Paris Climate Agreement?",
    options: [
      "Keep global thermal temperature increases within 3.5°C",
      "Halt fossil-fuel operations entirely within five years",
      "Keep temperature rises well below 2.0°C, aiming to restrict it to 1.5°C",
      "Stabilize ocean levels strictly at 2010 measures"
    ],
    answerIndex: 2,
    explanation: "The historic Paris Accord targets holding surface heating well below 2.0°C, aiming for a safer boundary of 1.5°C above pre-industrial averages."
  }
];

export default function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionClick = (index: number) => {
    if (submitted) return;
    setSelectedIdx(index);
  };

  const handleSubmit = () => {
    if (selectedIdx === null || submitted) return;
    setSubmitted(true);
    if (selectedIdx === QUIZ_QUESTIONS[currentIdx].answerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const passed = score >= Math.ceil(QUIZ_QUESTIONS.length / 2);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 text-center max-w-xl mx-auto"
        id="quiz-results-container"
      >
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-950/20">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Eco-Literacy Completed!</h3>
        <p className="text-slate-400 mt-2 font-medium">You scored <span className="font-extrabold text-white text-lg">{score}</span> out of {QUIZ_QUESTIONS.length} correct answers.</p>
        
        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl my-6 text-xs text-slate-400 leading-relaxed font-semibold font-mono">
          {passed 
            ? "Fantastic job! You demonstrate an excellent baseline understanding of global decarbonization pathways." 
            : "A solid attempt! Reviewing standard greenhouse drivers and action items can elevate your environmental knowledge."}
        </div>

        <button
          onClick={handleReset}
          id="btn-quiz-reset"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-emerald-950/20 cursor-pointer text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Restart Challenge
        </button>
      </motion.div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto cursor-default" role="region" aria-labelledby="quiz-section-heading">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 id="quiz-section-heading" className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Eco-Literacy Challenge</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Test your climate science comprehension.</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 rounded-full">
          Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
        </span>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <p className="text-base sm:text-lg font-bold text-white mb-6 leading-snug">
        {currentQuestion.question}
      </p>

      {/* Selectable Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === currentQuestion.answerIndex;
          
          let btnStyle = "border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02]/50 text-slate-300";
          if (isSelected) {
            btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold ring-1 ring-emerald-500";
          }
          if (submitted) {
            if (isCorrect) {
              btnStyle = "border-green-500/40 bg-green-500/10 text-green-400 font-bold ring-1 ring-green-600";
            } else if (isSelected) {
              btnStyle = "border-red-500/40 bg-red-500/10 text-red-400 font-bold ring-1 ring-red-500";
            } else {
              btnStyle = "border-white/5 bg-white/[0.005] opacity-25 cursor-not-allowed text-slate-500";
            }
          }

          return (
            <button
              key={idx}
              id={`quiz-option-${idx}`}
              disabled={submitted}
              onClick={() => handleOptionClick(idx)}
              className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span className="font-semibold pr-4">{option}</span>
              {submitted && isCorrect && <Check className="w-5 h-5 text-green-400 flex-shrink-0" />}
              {submitted && isSelected && !isCorrect && <X className="w-5 h-5 text-red-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Answer Callout & Navigation */}
      <AnimatePresence>
        {submitted && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.01] border border-white/5 p-4.5 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-slate-400 mt-6 leading-relaxed"
          >
            <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-200 font-bold mb-0.5">Scientific Insight</strong>
              {currentQuestion.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
        {!submitted ? (
          <button
            id="btn-quiz-submit"
            disabled={selectedIdx === null}
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl disabled:opacity-35 transition-all text-sm shadow-md hover:shadow-lg hover:shadow-emerald-950/20 cursor-pointer"
          >
            Submit Answer
          </button>
        ) : (
          <button
            id="btn-quiz-next"
            onClick={handleNext}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-emerald-950/20 cursor-pointer"
          >
            <span>{currentIdx === QUIZ_QUESTIONS.length - 1 ? "Complete Challenge" : "Next Question"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
