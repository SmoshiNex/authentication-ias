import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, Check, Mail, RotateCcw, Terminal, ShieldAlert, Database, Zap } from "lucide-react";
import { register, verifyOtp } from "../services/api";
import { useToast } from "../components/Toast";

const ease = [0.16, 1, 0.3, 1];

const rules = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One number", test: (p) => /[0-9]/.test(p) },
];

const ATTACK_TYPES = [
    { icon: Database, label: "Classic Injection", desc: "' OR '1'='1", color: "#f87171" },
    { icon: ShieldAlert, label: "Blind SQLi", desc: "Time-based & boolean", color: "#60a5fa" },
    { icon: Zap, label: "Union Attacks", desc: "Extract hidden data", color: "#a78bfa" },
];

function LeftPanel({ step }) {
    return (
        <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 bg-[#0d1117] flex-col justify-between p-12 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#fff" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-[100px]" />

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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }}
                className="relative space-y-6">
                <div className="space-y-2">
                    <p className="text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-white/30">// join the lab</p>
                    <h1 className="text-[34px] xl:text-[40px] font-semibold text-white leading-[1.1] tracking-[-0.03em]">
                        Learn to break.<br />Learn to defend.
                    </h1>
                    <p className="text-[14px] text-white/40 leading-relaxed max-w-[300px] pt-1">
                        Hands-on SQL injection training in a safe, legal environment. No setup required.
                    </p>
                </div>

                <div className="space-y-3">
                    {ATTACK_TYPES.map((a, i) => (
                        <motion.div key={a.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease }}
                            className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${a.color}15` }}>
                                <a.icon size={15} style={{ color: a.color }} />
                            </div>
                            <div>
                                <p className="text-[13px] font-medium text-white/80">{a.label}</p>
                                <p className="text-[11px] font-mono text-white/30 mt-0.5">{a.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                    {["Account details", "Verify email"].map((label, i) => {
                        const active = (step === "form" && i === 0) || (step === "otp" && i === 1);
                        const done = step === "otp" && i === 0;
                        return (
                            <div key={label} className="flex items-center gap-2">
                                <motion.div animate={{ backgroundColor: done || active ? "#fff" : "rgba(255,255,255,0.1)" }}
                                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                    {done
                                        ? <Check size={9} className="text-gray-900" strokeWidth={3} />
                                        : <span className="text-[10px] font-semibold text-gray-900">{i + 1}</span>
                                    }
                                </motion.div>
                                <span className={`text-[12px] font-medium ${active || done ? "text-white/70" : "text-white/20"}`}>{label}</span>
                                {i === 0 && <div className="w-5 h-px bg-white/10 mx-1" />}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
                className="relative text-[11px] font-mono text-white/20">
                © 2025 InjectionX · For educational use only
            </motion.p>
        </div>
    );
}

// ── Step 1 ─────────────────────────────────────────────────────────────────
function StepForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(null);
    const [pwTouched, setPwTouched] = useState(false);
    const toast = useToast();

    async function handle(e) {
        e.preventDefault();
        if (password !== confirm) {
            toast.error("Passwords don't match", "Make sure both password fields are identical.");
            return;
        }
        setLoading(true);
        try {
            await register({ email, password });
            toast.success("Code sent!", `We emailed a verification code to ${email}.`);
            onSuccess(email);
        } catch (err) {
            toast.error("Registration failed", err.error || err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div key="form" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }} className="space-y-8">
            <div className="space-y-1.5">
                <h2 className="text-[26px] font-semibold text-gray-900 tracking-[-0.02em]">Create account</h2>
                <p className="text-[14px] text-gray-400">Join the lab. Start learning today.</p>
            </div>

            <form onSubmit={handle} className="space-y-4">
                <FloatingInput id="email" type="email" label="Email address" value={email} onChange={setEmail}
                    autoComplete="email" focused={focused} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />

                <div className="space-y-2">
                    <FloatingInput id="password" type={showPw ? "text" : "password"} label="Password" value={password}
                        onChange={(v) => { setPassword(v); setPwTouched(true); }}
                        autoComplete="new-password" focused={focused} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                        suffix={
                            <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-300 hover:text-gray-500 transition-colors">
                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        }
                    />
                    <AnimatePresence>
                        {pwTouched && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="space-y-1.5 pt-1 overflow-hidden">
                                {rules.map((rule) => {
                                    const passed = rule.test(password);
                                    return (
                                        <motion.div key={rule.label} animate={{ color: passed ? "#10b981" : "#9ca3af" }} className="flex items-center gap-2 text-[12px]">
                                            <motion.div animate={{ backgroundColor: passed ? "#10b981" : "#e5e7eb" }}
                                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0">
                                                {passed && <Check size={8} className="text-white" strokeWidth={3} />}
                                            </motion.div>
                                            {rule.label}
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <FloatingInput id="confirm" type="password" label="Confirm password" value={confirm}
                    onChange={setConfirm} autoComplete="new-password" focused={focused}
                    onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)}
                    suffix={confirm.length > 0 && password === confirm ? <Check size={15} className="text-emerald-500" /> : null}
                />

                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.985 }}
                    className="w-full h-11 bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors mt-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Continue</span><ArrowRight size={15} /></>}
                </motion.button>
            </form>

            <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[12px] text-gray-300 font-medium">HAVE AN ACCOUNT?</span>
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Link to="/login" className="flex items-center justify-center gap-2 w-full h-11 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-[14px] font-medium rounded-xl transition-all">
                Sign in instead
            </Link>

            <p className="text-center text-[12px] text-gray-300">
                By continuing, you agree to our{" "}
                <span className="text-gray-400 underline underline-offset-2 cursor-pointer">Terms</span>{" "}and{" "}
                <span className="text-gray-400 underline underline-offset-2 cursor-pointer">Privacy Policy</span>
            </p>
        </motion.div>
    );
}

// ── Step 2 ─────────────────────────────────────────────────────────────────
function StepOtp({ email, onBack }) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resent, setResent] = useState(false);
    const inputs = useRef([]);
    const navigate = useNavigate();
    const toast = useToast();

    function handleChange(i, val) {
        if (!/^\d*$/.test(val)) return;
        const next = [...otp];
        next[i] = val.slice(-1);
        setOtp(next);
        if (val && i < 5) inputs.current[i + 1]?.focus();
    }

    function handleKeyDown(i, e) {
        if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
    }

    function handlePaste(e) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) { setOtp(pasted.split("")); inputs.current[5]?.focus(); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) {
            toast.warning("Incomplete code", "Please enter all 6 digits.");
            return;
        }
        setLoading(true);
        try {
            const res = await verifyOtp({ email, otp: code });
            localStorage.setItem("token", res.token);
            toast.success("Email verified!", "Your account is ready. Welcome to InjectionX.");
            navigate("/");
        } catch (err) {
            toast.error("Invalid code", err.error || err.message || "That code didn't work. Try again.");
            setOtp(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        try { await register({ email, password: "__resend__" }); } catch {}
        setResent(true);
        toast.info("Code resent", `A new code was sent to ${email}.`);
        setTimeout(() => setResent(false), 4000);
    }

    return (
        <motion.div key="otp" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }} className="space-y-8">
            <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                    <Mail size={22} className="text-gray-400" />
                </div>
                <div className="space-y-1.5">
                    <h2 className="text-[26px] font-semibold text-gray-900 tracking-[-0.02em]">Check your email</h2>
                    <p className="text-[14px] text-gray-400 leading-relaxed">
                        We sent a 6-digit code to{" "}
                        <span className="text-gray-700 font-medium">{email}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2.5" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                        <motion.input key={i} ref={(el) => (inputs.current[i] = el)}
                            type="text" inputMode="numeric" maxLength={1} value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            whileFocus={{ scale: 1.04 }} transition={{ duration: 0.15 }}
                            className="w-full aspect-square text-center text-[20px] font-semibold text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] transition-all caret-transparent"
                        />
                    ))}
                </div>

                <motion.button type="submit" disabled={loading || otp.some(d => !d)} whileTap={{ scale: 0.985 }}
                    className="w-full h-11 bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Verify email</span><ArrowRight size={15} /></>}
                </motion.button>
            </form>

            <div className="flex items-center justify-between text-[13px]">
                <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5">
                    <ArrowRight size={13} className="rotate-180" /> Use different email
                </button>
                <button onClick={handleResend} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5">
                    {resent
                        ? <><Check size={13} className="text-emerald-500" /><span className="text-emerald-500">Sent!</span></>
                        : <><RotateCcw size={13} /><span>Resend code</span></>
                    }
                </button>
            </div>
        </motion.div>
    );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Register() {
    const [step, setStep] = useState("form");
    const [email, setEmail] = useState("");

    return (
        <div className="min-h-screen bg-[#fafafa] flex">
            <LeftPanel step={step} />
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-[400px]">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
                            <Terminal size={16} className="text-white" />
                        </div>
                        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">InjectionX</span>
                    </div>
                    <AnimatePresence mode="wait">
                        {step === "form"
                            ? <StepForm key="form" onSuccess={(e) => { setEmail(e); setStep("otp"); }} />
                            : <StepOtp key="otp" email={email} onBack={() => setStep("form")} />
                        }
                    </AnimatePresence>
                </div>
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
