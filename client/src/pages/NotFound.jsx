import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, ArrowLeft } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

export default function NotFound() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#fff" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-500/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="relative text-center space-y-8 max-w-md"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5">
                    <div className="w-8 h-8 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
                        <Terminal size={14} className="text-white" />
                    </div>
                    <span className="text-[14px] font-semibold text-white tracking-tight">InjectionX</span>
                </div>

                {/* Terminal block */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden text-left">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                        <span className="ml-2 text-[11px] font-mono text-white/20">error.log</span>
                    </div>
                    <div className="p-6 font-mono space-y-2">
                        <p className="text-[12px] text-white/30">$ GET {window.location.pathname}</p>
                        <p className="text-[28px] font-bold text-red-400 tracking-tight">404</p>
                        <p className="text-[13px] text-white/50">Route not found in the database.</p>
                        <p className="text-[12px] text-white/25 pt-2">
                            <span className="text-green-400">hint:</span> This page doesn't exist — unlike SQL injection vulnerabilities.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(token ? "/dashboard" : "/login")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-[13px] font-medium rounded-xl transition-colors"
                >
                    <ArrowLeft size={14} />
                    {token ? "Back to Dashboard" : "Back to Login"}
                </button>
            </motion.div>
        </div>
    );
}
