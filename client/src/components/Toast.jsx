import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const VARIANTS = {
    success: {
        icon: CheckCircle2,
        bg: "bg-emerald-500",
        text: "text-white",
        iconClass: "text-white",
        subtext: "text-white/80",
    },
    error: {
        icon: XCircle,
        bg: "bg-red-500",
        text: "text-white",
        iconClass: "text-white",
        subtext: "text-white/80",
    },
    warning: {
        icon: AlertTriangle,
        bg: "bg-yellow-400",
        text: "text-gray-900",
        iconClass: "text-gray-900",
        subtext: "text-gray-900/70",
    },
    info: {
        icon: Info,
        bg: "bg-gray-900",
        text: "text-white",
        iconClass: "text-white",
        subtext: "text-white/70",
    },
};

function ToastItem({ toast, onDismiss }) {
    const v = VARIANTS[toast.type] || VARIANTS.info;
    const Icon = v.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-center gap-3 w-[420px] max-w-[calc(100vw-32px)] rounded-2xl shadow-xl shadow-black/20 px-4 py-3.5 ${v.bg}`}
        >
            <Icon size={18} className={`${v.iconClass} shrink-0`} />

            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className={`text-[13px] font-semibold leading-snug ${v.text}`}>{toast.title}</p>
                )}
                {toast.message && (
                    <p className={`text-[12px] leading-relaxed mt-0.5 ${v.subtext}`}>{toast.message}</p>
                )}
            </div>

            <button onClick={() => onDismiss(toast.id)}
                className={`shrink-0 ${v.iconClass} opacity-70 hover:opacity-100 transition-opacity`}>
                <X size={15} />
            </button>

            {/* Progress bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-[3px] bg-black/20 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: toast.duration / 1000, ease: "linear" }}
            />
        </motion.div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        clearTimeout(timers.current[id]);
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);
        timers.current[id] = setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    // Convenience methods
    toast.success = (title, message, opts) => toast({ type: "success", title, message, ...opts });
    toast.error   = (title, message, opts) => toast({ type: "error",   title, message, ...opts });
    toast.warning = (title, message, opts) => toast({ type: "warning", title, message, ...opts });
    toast.info    = (title, message, opts) => toast({ type: "info",    title, message, ...opts });

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Portal-like fixed container */}
            <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto">
                            <ToastItem toast={t} onDismiss={dismiss} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}
