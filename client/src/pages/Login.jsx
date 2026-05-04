import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, Terminal } from "lucide-react";
import { login } from "../services/api";
import { useToast } from "../components/Toast";

const ease = [0.16, 1, 0.3, 1];

const SQL_LINES = [
    { text: "SELECT * FROM users", color: "#60a5fa" },
    { text: "WHERE email = 'admin'", color: "#e2e8f0" },
    { text: "OR '1'='1' --", color: "#f87171" },
    { text: "", color: "" },
    { text: "-- Authentication bypassed ✓", color: "#4ade80" },
    { text: "", color: "" },
    { text: "DROP TABLE sessions;", color: "#f87171" },
    { text: "INSERT INTO logs VALUES", color: "#60a5fa" },
    { text: "  ('pwned', NOW());", color: "#e2e8f0" },
    { text: "", color: "" },
    { text: "UNION SELECT username,", color: "#60a5fa" },
    { text: "  password FROM admin", color: "#e2e8f0" },
    { text: "  WHERE '1'='1'", color: "#f87171" },
];

function TerminalPanel() {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        if (visibleLines >= SQL_LINES.length) return;
        const t = setTimeout(() => setVisibleLines((v) => v + 1), 180);
        return () => clearTimeout(t);
    }, [visibleLines]);

    return (
        <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 bg-[#0d1117] flex-col justify-between p-12 relative overflow-hidden">
            {/* Grid overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#fff" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Glow */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-[100px]" />

            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
                className="relative flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
                    <Terminal size={16} className="text-white" />
                </div>
                <div>
                    <span className="text-[15px] font-semibold text-white tracking-tight">InjectionX</span>
                    <span className="ml-2 text-[10px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded">v1.0</span>
                </div>
            </motion.div>

            {/* Terminal window */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }}
                className="relative space-y-5">
                <div className="space-y-2">
                    <p className="text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-white/30">// learn by doing</p>
                    <h1 className="text-[34px] xl:text-[40px] font-semibold text-white leading-[1.1] tracking-[-0.03em]">
                        Master SQL<br />Injection.
                    </h1>
                    <p className="text-[14px] text-white/40 leading-relaxed max-w-[300px] pt-1">
                        Understand how attackers exploit databases — and how to stop them.
                    </p>
                </div>

                {/* Terminal block */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                        <span className="ml-2 text-[11px] font-mono text-white/20">injection_demo.sql</span>
                    </div>
                    {/* Code */}
                    <div className="p-5 font-mono text-[12px] leading-[1.8] min-h-[200px]">
                        {SQL_LINES.slice(0, visibleLines).map((line, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
                                {line.text
                                    ? <span style={{ color: line.color }}>{line.text}</span>
                                    : <br />
                                }
                            </motion.div>
                        ))}
                        {visibleLines < SQL_LINES.length && (
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}
                                className="inline-block w-2 h-4 bg-white/60 align-middle ml-0.5" />
                        )}
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { val: "50+", label: "Challenges" },
                        { val: "12", label: "Attack types" },
                        { val: "100%", label: "Hands-on" },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease }}
                            className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-3 text-center">
                            <p className="text-[18px] font-semibold text-white tracking-tight">{s.val}</p>
                            <p className="text-[11px] text-white/30 mt-0.5">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
                className="relative text-[11px] font-mono text-white/20">
                © 2025 InjectionX · For educational use only
            </motion.p>
        </div>
    );
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    async function handle(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login({ email, password });
            localStorage.setItem("token", res.token);
            toast.success("Welcome back", "You've signed in successfully.");
            navigate("/");
        } catch (err) {
            toast.error("Sign in failed", err.error || err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#fafafa] flex">
            <TerminalPanel />

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
                    className="w-full max-w-[400px] space-y-10">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
                            <Terminal size={16} className="text-white" />
                        </div>
                        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">InjectionX</span>
                    </div>

                    <div className="space-y-1.5">
                        <h2 className="text-[26px] font-semibold text-gray-900 tracking-[-0.02em]">Sign in</h2>
                        <p className="text-[14px] text-gray-400">Welcome back. Ready to hack?</p>
                    </div>

                    <form onSubmit={handle} className="space-y-4">
                        <FloatingInput id="email" type="email" label="Email address" value={email} onChange={setEmail}
                            autoComplete="email" focused={focused} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />

                        <FloatingInput id="password" type={showPw ? "text" : "password"} label="Password" value={password}
                            onChange={setPassword} autoComplete="current-password" focused={focused}
                            onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                            suffix={
                                <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            }
                        />

                        <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.985 }}
                            className="w-full h-11 bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors mt-2">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Continue</span><ArrowRight size={15} /></>}
                        </motion.button>
                    </form>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[12px] text-gray-300 font-medium">NEW HERE?</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <Link to="/register"
                        className="flex items-center justify-center gap-2 w-full h-11 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-[14px] font-medium rounded-xl transition-all">
                        Create an account
                    </Link>

                    <p className="text-center text-[12px] text-gray-300">
                        By continuing, you agree to our{" "}
                        <span className="text-gray-400 underline underline-offset-2 cursor-pointer">Terms</span>
                        {" "}and{" "}
                        <span className="text-gray-400 underline underline-offset-2 cursor-pointer">Privacy Policy</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function FloatingInput({ id, type, label, value, onChange, autoComplete, focused, onFocus, onBlur, suffix }) {
    const isActive = focused === id || value.length > 0;
    return (
        <div className="relative">
            <div className={`relative flex items-center border rounded-xl transition-all duration-200 bg-white ${focused === id ? "border-gray-400 shadow-[0_0_0_3px_rgba(0,0,0,0.04)]" : "border-gray-200"}`}>
                <input id={id} type={type} required autoComplete={autoComplete} value={value}
                    onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur}
                    className="w-full px-4 pt-5 pb-2 text-[14px] text-gray-900 bg-transparent outline-none placeholder-transparent"
                    placeholder={label}
                />
                <motion.label htmlFor={id}
                    animate={{ y: isActive ? -8 : 0, scale: isActive ? 0.78 : 1, color: focused === id ? "#6b7280" : "#9ca3af" }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{ originX: 0 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none font-normal">
                    {label}
                </motion.label>
                {suffix && <div className="pr-4">{suffix}</div>}
            </div>
        </div>
    );
}
