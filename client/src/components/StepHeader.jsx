import { BookOpen, Zap, Trophy, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const TYPE_CONFIG = {
    lesson:     { label: "Lesson",     bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100",   Icon: BookOpen },
    exercise:   { label: "Exercise",   bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", Icon: Zap },
    assessment: { label: "Assessment", bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100", Icon: Trophy },
};

export default function StepHeader({ module, step, stepIndex, totalSteps }) {
    const cfg = TYPE_CONFIG[step.type] || TYPE_CONFIG.lesson;
    const Icon = cfg.Icon;

    return (
        <div className="space-y-4 pb-6 border-b border-gray-100">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                <Link to="/dashboard" className="hover:text-gray-600 transition-colors">Dashboard</Link>
                <ChevronRight size={12} />
                <span className="text-gray-500 font-medium">{module.title}</span>
                <ChevronRight size={12} />
                <span className="text-gray-700 font-medium">{step.title}</span>
            </div>

            {/* Type badge + duration */}
            <div className="flex items-center gap-2.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    <Icon size={11} />
                    {cfg.label}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-gray-400">
                    <Clock size={11} />
                    {step.duration}
                </span>
                <span className="ml-auto text-[12px] text-gray-400 font-mono">
                    {stepIndex + 1} / {totalSteps}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-[24px] font-semibold text-gray-900 tracking-[-0.02em] leading-tight">
                {step.title}
            </h1>

            {/* Step progress dots */}
            <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === stepIndex ? "w-6 bg-gray-900" : i < stepIndex ? "w-3 bg-gray-300" : "w-3 bg-gray-100"}`} />
                ))}
            </div>
        </div>
    );
}
