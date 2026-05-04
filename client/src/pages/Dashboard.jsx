import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, BookOpen, Zap, Trophy, Terminal, Flame, Database, EyeOff, ShieldCheck } from "lucide-react";
import { MODULES, TOTAL_STEPS } from "../data/curriculum";
import { useProgress } from "../hooks/useProgress";
import Layout from "../components/Layout";

const ease = [0.16, 1, 0.3, 1];
const MODULE_COLORS = { Database: "#60a5fa", Zap: "#f87171", EyeOff: "#a78bfa", ShieldCheck: "#4ade80" };
const MODULE_ICON_MAP = { Database, Zap, EyeOff, ShieldCheck };

function ProgressRing({ pct, color, size = 56 }) {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
                strokeLinecap="round" strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ - dash }}
                transition={{ duration: 1, delay: 0.3, ease }}
            />
        </svg>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { moduleProgress, overallProgress, totalCompleted, isComplete } = useProgress();

    // Find the next incomplete step across all modules
    function getNextStep() {
        for (const mod of MODULES) {
            for (const step of mod.steps) {
                if (!isComplete(mod.id, step.id)) {
                    return { moduleId: mod.id, stepId: step.id, moduleTitle: mod.title, stepTitle: step.title, type: step.type };
                }
            }
        }
        return null;
    }

    const nextStep = getNextStep();
    const allDone = !nextStep;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
                    className="space-y-1">
                    <p className="text-[11px] font-mono font-semibold tracking-[0.12em] uppercase text-gray-400">// welcome back</p>
                    <h1 className="text-[28px] font-semibold text-gray-900 tracking-[-0.02em]">
                        {allDone ? "You've completed InjectionX" : "Your Learning Path"}
                    </h1>
                    <p className="text-[14px] text-gray-400">
                        {allDone
                            ? "All modules complete. You're now equipped to identify and prevent SQL injection."
                            : `${totalCompleted} of ${TOTAL_STEPS} steps completed · Keep going.`}
                    </p>
                </motion.div>

                {/* Overall progress + next step */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* XP bar card */}
                    <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
                                    <Flame size={14} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-gray-900">Overall Progress</p>
                                    <p className="text-[11px] text-gray-400">{totalCompleted}/{TOTAL_STEPS} steps</p>
                                </div>
                            </div>
                            <span className="text-[22px] font-bold text-gray-900 tracking-tight">{overallProgress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gray-900 rounded-full"
                                initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }}
                                transition={{ duration: 1, delay: 0.2, ease }} />
                        </div>
                        <div className="flex gap-4 pt-1">
                            {[
                                { icon: BookOpen, label: "Lessons", count: MODULES.flatMap(m => m.steps).filter(s => s.type === "lesson").length, color: "text-blue-500" },
                                { icon: Zap, label: "Exercises", count: MODULES.flatMap(m => m.steps).filter(s => s.type === "exercise").length, color: "text-orange-500" },
                                { icon: Trophy, label: "Assessment", count: 1, color: "text-yellow-500" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center gap-1.5 text-[12px] text-gray-400">
                                    <stat.icon size={12} className={stat.color} />
                                    {stat.count} {stat.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next step CTA */}
                    {nextStep ? (
                        <motion.button onClick={() => navigate(`/learn/${nextStep.moduleId}/${nextStep.stepId}`)}
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            className="bg-gray-900 rounded-2xl p-6 text-left space-y-3 group">
                            <p className="text-[10px] font-mono font-semibold tracking-[0.1em] uppercase text-white/40">Next up</p>
                            <div>
                                <p className="text-[11px] text-white/40 mb-1">{nextStep.moduleTitle}</p>
                                <p className="text-[15px] font-semibold text-white leading-tight">{nextStep.stepTitle}</p>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                                <span className="text-[12px]">Continue</span>
                                <ArrowRight size={13} />
                            </div>
                        </motion.button>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                            <Trophy size={28} className="text-emerald-500" />
                            <p className="text-[14px] font-semibold text-emerald-700">All Complete!</p>
                            <p className="text-[12px] text-emerald-500">You've mastered SQL injection.</p>
                        </div>
                    )}
                </motion.div>

                {/* Module cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MODULES.map((mod, i) => {
                        const prog = moduleProgress(mod.id);
                        const done = prog === 100;
                        const color = MODULE_COLORS[mod.icon];
                        const completedSteps = mod.steps.filter((s) => isComplete(mod.id, s.id)).length;

                        // First incomplete step in this module
                        const firstIncomplete = mod.steps.find((s) => !isComplete(mod.id, s.id));

                        return (
                            <motion.div key={mod.id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease }}
                                className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${color}15` }}>
                                            {(() => { const Icon = MODULE_ICON_MAP[mod.icon] || Database; return <Icon size={18} style={{ color }} />; })()}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-gray-900">{mod.title}</p>
                                            <p className="text-[11px] text-gray-400">{completedSteps}/{mod.steps.length} steps</p>
                                        </div>
                                    </div>
                                    <ProgressRing pct={prog} color={done ? "#4ade80" : color} size={48} />
                                </div>

                                <p className="text-[13px] text-gray-400 leading-relaxed">{mod.description}</p>

                                {/* Step pills */}
                                <div className="flex flex-wrap gap-1.5">
                                    {mod.steps.map((step) => {
                                        const stepDone = isComplete(mod.id, step.id);
                                        return (
                                            <span key={step.id}
                                                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border ${stepDone ? "bg-emerald-50 border-emerald-100 text-emerald-600" : step.type === "lesson" ? "bg-blue-50 border-blue-100 text-blue-500" : step.type === "exercise" ? "bg-orange-50 border-orange-100 text-orange-500" : "bg-yellow-50 border-yellow-100 text-yellow-600"}`}>
                                                {stepDone && <CheckCircle2 size={9} />}
                                                {step.title}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => firstIncomplete
                                        ? navigate(`/learn/${mod.id}/${firstIncomplete.id}`)
                                        : navigate(`/learn/${mod.id}/${mod.steps[0].id}`)
                                    }
                                    className="w-full flex items-center justify-center gap-2 h-9 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-[13px] font-medium rounded-xl transition-all">
                                    {done ? "Review" : prog > 0 ? "Continue" : "Start"}
                                    <ArrowRight size={13} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}
