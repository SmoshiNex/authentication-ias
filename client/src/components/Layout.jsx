import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal, LayoutDashboard, ChevronDown, ChevronRight,
    BookOpen, Zap, LogOut, Menu, CheckCircle2, Circle, Lock,
    Database, EyeOff, ShieldCheck, Trophy
} from "lucide-react";
import { MODULES } from "../data/curriculum";
import { useProgress } from "../hooks/useProgress";
import { useToast } from "./Toast";

const MODULE_ICON_MAP = {
    Database,
    Zap,
    EyeOff,
    ShieldCheck,
};

const STEP_TYPE_ICON = { lesson: BookOpen, exercise: Zap, assessment: Trophy };

function StepIcon({ type, size = 13 }) {
    const Icon = STEP_TYPE_ICON[type] || Circle;
    return <Icon size={size} />;
}

export default function Layout({ children }) {
    const { moduleId, stepId } = useParams();
    const navigate = useNavigate();
    const { isComplete, moduleProgress } = useProgress();
    const [expanded, setExpanded] = useState(moduleId || MODULES[0].id);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toast = useToast();

    function logout() {
        localStorage.removeItem("token");
        toast.info("Signed out", "You've been signed out successfully.");
        navigate("/login");
    }

    const Sidebar = () => (
        <div className="flex flex-col h-full bg-[#0d1117] border-r border-white/[0.06]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
                <div className="w-8 h-8 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Terminal size={14} className="text-white" />
                </div>
                <span className="text-[14px] font-semibold text-white tracking-tight">InjectionX</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {/* Dashboard link */}
                <Link to="/dashboard"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${!moduleId ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
                    <LayoutDashboard size={14} />
                    Dashboard
                </Link>

                <div className="pt-3 pb-1 px-3">
                    <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/20">Modules</p>
                </div>

                {MODULES.map((mod) => {
                    const prog = moduleProgress(mod.id);
                    const isExpanded = expanded === mod.id;
                    const isActiveModule = moduleId === mod.id;

                    return (
                        <div key={mod.id}>
                            <button
                                onClick={() => setExpanded(isExpanded ? null : mod.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-left ${isActiveModule ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
                            >
                                <span className="shrink-0 text-white/50">
                                                {(() => { const Icon = MODULE_ICON_MAP[mod.icon] || Database; return <Icon size={14} />; })()}
                                            </span>
                                <span className="flex-1 leading-tight">{mod.title}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                    {prog === 100
                                        ? <CheckCircle2 size={13} className="text-emerald-400" />
                                        : prog > 0
                                            ? <span className="text-[10px] text-white/30">{prog}%</span>
                                            : null
                                    }
                                    {isExpanded ? <ChevronDown size={12} className="text-white/30" /> : <ChevronRight size={12} className="text-white/30" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden ml-3 mt-0.5 mb-1 border-l border-white/[0.06] pl-3 space-y-0.5"
                                    >
                                        {mod.steps.map((step, idx) => {
                                            const done = isComplete(mod.id, step.id);
                                            const active = moduleId === mod.id && stepId === step.id;
                                            // Lock steps after first incomplete (except first step)
                                            const prevDone = idx === 0 || isComplete(mod.id, mod.steps[idx - 1].id);
                                            const locked = !done && !prevDone && idx > 0;

                                            return (
                                                <Link
                                                    key={step.id}
                                                    to={locked ? "#" : `/learn/${mod.id}/${step.id}`}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] transition-colors ${active ? "bg-white/10 text-white" : done ? "text-white/50 hover:text-white/70 hover:bg-white/5" : locked ? "text-white/20 cursor-not-allowed" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}
                                                >
                                                    <span className={`shrink-0 ${done ? "text-emerald-400" : active ? "text-white" : locked ? "text-white/20" : "text-white/30"}`}>
                                                        {done ? <CheckCircle2 size={12} /> : locked ? <Lock size={12} /> : <StepIcon type={step.type} />}
                                                    </span>
                                                    <span className="leading-tight">{step.title}</span>
                                                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${step.type === "lesson" ? "bg-blue-500/10 text-blue-400" : step.type === "exercise" ? "bg-orange-500/10 text-orange-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                                        {step.type === "assessment" ? "final" : step.type.slice(0, 3)}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            {/* User / logout */}
            <div className="border-t border-white/[0.06] px-4 py-4">
                <button onClick={logout}
                    className="flex items-center gap-2.5 text-[12px] text-white/30 hover:text-white/60 transition-colors w-full">
                    <LogOut size={13} />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] flex">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col fixed inset-y-0 left-0 z-30">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                        <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden">
                            <Sidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 lg:ml-64 xl:ml-72 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3.5 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-600">
                        <Menu size={20} />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2 text-[12px] text-gray-400">
                        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                            <Terminal size={11} className="text-white" />
                        </div>
                        <span className="hidden sm:block">InjectionX</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
