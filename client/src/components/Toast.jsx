import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const VARIANTS = {
    success: {
        icon: CheckCircle2,
        bar: "bg-emerald-500",
        iconClass: "text-emerald-500",
        bg: "bg-white",
        border: "border-gray-100",
        title: "text-gray-900",
        msg: "text-gray-500",
    },
    error: {
        icon: XCircle,
        bar: "bg-red-500",
        iconClass: "text-red-500",
        bg: "bg-white",
        border: "border-gray-100",
        title: "text-gray-900",
        msg: "text-gray-500",
    },
    warning: {
        icon: AlertTriangle,
        bar: "bg-yellow-400",
        iconClass: "text-yellow-500",
        bg: "bg-white",
        border: "border-gray-100",
        title: "text-gray-900",
        msg: "text-gray-500",
    },
    info: {
        icon: Info,
        bar: "bg-blue-500",
        iconClass: "text-blue-500",
        bg: "bg-white",
        border: "border-gray-100",
        title: "text-gray-900",
        msg: "text-gray-500",
    },
};

function ToastItem({ toast, onDismiss }) {
    const v = VARIANTS[toast.type] || VARIANTS.info;
    const Icon = v.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex items-start gap-3 w-[340px] max-w-[calc(100vw-32px)] rounded-2xl border shadow-lg shadow-black/[0.06] overflow-hidden px-4 py-3.5 ${v.bg} ${v.border}`}
        >
            {/* Left color bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${v.bar}`} />

            {/* Icon */}
            <Icon size={17} className={`${v.iconClass} shrink-0 mt-0.5`} />

            {/* Text */}
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className={`text-[13px] font-semibold leading-snug ${v.title}`}>{toast.title}</p>
                )}
                {toast.message && (
                    <p className={`text-[12px] leading-relaxed mt-0.5 ${v.msg}`}>{toast.message}</p>
                )}
            </div>

            {/* Dismiss */}
            <button onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5">
                <X size={14} />
            </button>

            {/* Progress bar */}
            <motion.div
                className={`absolute bottom-0 left-0 h-[2px] ${v.bar} opacity-30`}
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
            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none">
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
