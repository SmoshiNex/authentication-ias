import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

// Minimal markdown-like renderer: handles ```code blocks``` and `inline code`
function renderTheory(text) {
    const blocks = text.split(/(```[\s\S]*?```)/g);
    return blocks.map((block, i) => {
        if (block.startsWith("```")) {
            const code = block.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
            return (
                <div key={i} className="my-4 rounded-xl overflow-hidden border border-gray-100">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1117] border-b border-white/[0.06]">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-[10px] font-mono text-white/20 ml-1">sql</span>
                    </div>
                    <pre className="bg-[#0d1117] px-5 py-4 overflow-x-auto">
                        <code className="text-[13px] font-mono leading-relaxed text-gray-300 whitespace-pre">{code}</code>
                    </pre>
                </div>
            );
        }
        // Inline code + bold + italic
        const parts = block.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
            <p key={i} className="text-[15px] text-gray-600 leading-relaxed my-3">
                {parts.map((part, j) => {
                    if (part.startsWith("`") && part.endsWith("`"))
                        return <code key={j} className="font-mono text-[13px] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">{part.slice(1, -1)}</code>;
                    if (part.startsWith("**") && part.endsWith("**"))
                        return <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                    if (part.startsWith("*") && part.endsWith("*"))
                        return <em key={j}>{part.slice(1, -1)}</em>;
                    return part;
                })}
            </p>
        );
    });
}

export default function LessonView({ step, alreadyDone, onComplete, onReset }) {
    const [read, setRead] = useState(false);
    const { theory, keyPoints } = step.content;
    const isDone = alreadyDone || read;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
        >
            {/* Theory */}
            <div className="prose-none space-y-1">
                {renderTheory(theory)}
            </div>

            {/* Key points */}
            {keyPoints?.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400">Key Takeaways</p>
                    <ul className="space-y-2.5">
                        {keyPoints.map((pt, i) => (
                            <motion.li key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
                                className="flex items-start gap-2.5 text-[13px] text-gray-600"
                            >
                                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                {pt}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mark as read / completed state */}
            {!isDone ? (
                <button
                    onClick={() => setRead(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-xl transition-colors"
                >
                    Mark as read
                    <CheckCircle2 size={14} />
                </button>
            ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-[13px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                        <CheckCircle2 size={14} />
                        Lesson complete
                    </div>
                    <button onClick={onReset}
                        className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 text-[13px] font-medium rounded-xl transition-colors">
                        <RotateCcw size={13} /> Reset lesson
                    </button>
                    <button onClick={onComplete}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-xl transition-colors">
                        Next step <ArrowRight size={14} />
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}
