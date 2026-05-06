import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Terminal, RotateCcw } from "lucide-react";

// ── MCQ (options array) ────────────────────────────────────────────────────
function McqChallenge({ challenge, onCorrect, alreadyDone }) {
    const correct = challenge.options.find((o) => o.correct);
    const [selected, setSelected] = useState(alreadyDone ? correct?.id : null);
    const [submitted, setSubmitted] = useState(alreadyDone);
    const isRight = selected === correct?.id;

    function submit() {
        if (!selected) return;
        setSubmitted(true);
        if (isRight) setTimeout(onCorrect, 1400);
    }

    function retry() {
        setSelected(null);
        setSubmitted(false);
    }

    return (
        <div className="space-y-4">
            {challenge.code && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1117]">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        </div>
                    </div>
                    <pre className="bg-[#0d1117] px-5 py-4 overflow-x-auto">
                        <code className="text-[13px] font-mono text-gray-300 whitespace-pre">{challenge.code}</code>
                    </pre>
                </div>
            )}

            <p className="text-[14px] font-medium text-gray-800">{challenge.question}</p>

            <div className="space-y-2">
                {challenge.options.map((opt) => {
                    let style = "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50";
                    if (submitted) {
                        if (opt.correct) style = "border-emerald-300 bg-emerald-50 text-emerald-800";
                        else if (opt.id === selected && !opt.correct) style = "border-red-300 bg-red-50 text-red-700";
                        else style = "border-gray-100 bg-gray-50 text-gray-400";
                    } else if (selected === opt.id) {
                        style = "border-gray-400 bg-gray-50 text-gray-900";
                    }

                    return (
                        <button key={opt.id} disabled={submitted} onClick={() => setSelected(opt.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] text-left transition-all ${style}`}>
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold">
                                {opt.id.toUpperCase()}
                            </span>
                            {opt.text}
                            {submitted && opt.correct && <CheckCircle2 size={14} className="ml-auto text-emerald-500 shrink-0" />}
                            {submitted && opt.id === selected && !opt.correct && <XCircle size={14} className="ml-auto text-red-400 shrink-0" />}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {submitted && (
                    <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className={`rounded-xl px-4 py-3 text-[13px] leading-relaxed border ${isRight ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
                        <div className="flex items-center justify-between gap-3">
                            <span><strong>{isRight ? "Correct! " : "Not quite. "}</strong>{challenge.explanation}</span>
                            {!isRight && (
                                <button onClick={retry}
                                    className="shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                    <RotateCcw size={11} /> Retry
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!submitted && (
                <button onClick={submit} disabled={!selected}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black disabled:opacity-40 text-white text-[13px] font-medium rounded-xl transition-colors">
                    Submit answer
                    <ArrowRight size={14} />
                </button>
            )}
        </div>
    );
}

// ── Snippet picker ─────────────────────────────────────────────────────────
function SnippetChallenge({ challenge, onCorrect, alreadyDone }) {
    const correct = challenge.snippets.find((s) => s.correct);
    const [selected, setSelected] = useState(alreadyDone ? correct?.id : null);
    const [submitted, setSubmitted] = useState(alreadyDone);
    const isRight = selected === correct?.id;

    function submit() {
        if (!selected) return;
        setSubmitted(true);
        if (isRight) setTimeout(onCorrect, 1400);
    }

    function retry() {
        setSelected(null);
        setSubmitted(false);
    }

    return (
        <div className="space-y-4">
            <p className="text-[14px] font-medium text-gray-800">{challenge.question}</p>

            <div className="space-y-3">
                {challenge.snippets.map((snip) => {
                    let ring = "border-gray-200";
                    if (submitted) {
                        if (snip.correct) ring = "border-emerald-400";
                        else if (snip.id === selected) ring = "border-red-400";
                    } else if (selected === snip.id) {
                        ring = "border-gray-500";
                    }

                    return (
                        <button key={snip.id} disabled={submitted} onClick={() => setSelected(snip.id)}
                            className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all ${ring}`}>
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117]">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                                </div>
                                <span className="text-[11px] font-mono text-white/30">{snip.label}</span>
                                {submitted && snip.correct && <CheckCircle2 size={12} className="ml-auto text-emerald-400" />}
                                {submitted && snip.id === selected && !snip.correct && <XCircle size={12} className="ml-auto text-red-400" />}
                            </div>
                            <pre className="bg-[#0d1117] px-4 py-3 overflow-x-auto border-t border-white/[0.05]">
                                <code className="text-[12px] font-mono text-gray-300 whitespace-pre">{snip.code}</code>
                            </pre>
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {submitted && (
                    <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className={`rounded-xl px-4 py-3 text-[13px] leading-relaxed border ${isRight ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
                        <div className="flex items-center justify-between gap-3">
                            <span><strong>{isRight ? "Correct! " : "Not quite. "}</strong>{challenge.explanation}</span>
                            {!isRight && (
                                <button onClick={retry}
                                    className="shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                    <RotateCcw size={11} /> Retry
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!submitted && (
                <button onClick={submit} disabled={!selected}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black disabled:opacity-40 text-white text-[13px] font-medium rounded-xl transition-colors">
                    Submit answer <ArrowRight size={14} />
                </button>
            )}
        </div>
    );
}

// ── Free-text input ────────────────────────────────────────────────────────
function InputChallenge({ challenge, onCorrect, alreadyDone }) {
    const [value, setValue] = useState(alreadyDone ? (challenge.successValue ?? "") : "");
    const [submitted, setSubmitted] = useState(alreadyDone);
    const [showHint, setShowHint] = useState(false);
    const [isRight, setIsRight] = useState(alreadyDone);

    function submit(e) {
        e.preventDefault();
        if (!value.trim()) return;
        const result = challenge.validate(value);
        setIsRight(result);
        setSubmitted(true);
        if (result) setTimeout(onCorrect, 1600);
    }

    function retry() {
        setSubmitted(false);
        setValue("");
        setIsRight(false);
    }

    return (
        <div className="space-y-4">
            {challenge.code && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1117]">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-[11px] font-mono text-white/30">query</span>
                    </div>
                    <pre className="bg-[#0d1117] px-5 py-4 overflow-x-auto">
                        <code className="text-[13px] font-mono text-gray-300 whitespace-pre">{challenge.code}</code>
                    </pre>
                </div>
            )}

            {/* Live query preview */}
            {value && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="px-4 py-2 bg-[#0d1117] flex items-center gap-2">
                        <Terminal size={11} className="text-white/30" />
                        <span className="text-[10px] font-mono text-white/30">live preview</span>
                    </div>
                    <pre className="bg-[#111827] px-5 py-3 overflow-x-auto">
                        <code className="text-[12px] font-mono text-gray-400 whitespace-pre">
                            {challenge.code?.replace(`[${challenge.field?.toUpperCase() || "INPUT"}]`, value)}
                        </code>
                    </pre>
                </div>
            )}

            <form onSubmit={submit} className="space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={submitted && isRight}
                        placeholder={challenge.placeholder || "Enter your payload..."}
                        className="flex-1 px-4 py-2.5 font-mono text-[13px] text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] transition-all placeholder-gray-300"
                    />
                    {!submitted || !isRight ? (
                        <button type="submit" disabled={!value.trim()}
                            className="px-4 py-2.5 bg-gray-900 hover:bg-black disabled:opacity-40 text-white text-[13px] font-medium rounded-xl transition-colors shrink-0">
                            Run
                        </button>
                    ) : null}
                </div>

                <AnimatePresence>
                    {submitted && (
                        <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                            className={`rounded-xl px-4 py-3 text-[13px] leading-relaxed border ${isRight ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
                            {isRight ? (
                                <><strong>✓ Injection successful. </strong>{challenge.successMessage}</>
                            ) : (
                                <div className="flex items-center justify-between gap-3">
                                    <span><strong>✗ Not quite. </strong>That payload didn't work. Try again.</span>
                                    <button type="button" onClick={retry}
                                        className="shrink-0 text-[12px] underline underline-offset-2">Retry</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            {/* Hint */}
            {challenge.hint && (
                <div>
                    <button onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
                        <Lightbulb size={13} />
                        {showHint ? "Hide hint" : "Show hint"}
                    </button>
                    <AnimatePresence>
                        {showHint && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                                className="mt-2 px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-xl text-[13px] text-yellow-700 overflow-hidden">
                                💡 {challenge.hint}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

// ── Main ExerciseView ──────────────────────────────────────────────────────
export default function ExerciseView({ step, alreadyDone, onComplete, onReset }) {
    const [done, setDone] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const { challenge } = step;

    function handleCorrect() {
        setDone(true);
    }

    function handleReset() {
        setDone(false);
        setResetKey((k) => k + 1);
        onReset();
    }

    const hasOptions = challenge.options && !challenge.snippets;
    const hasSnippets = !!challenge.snippets;
    const hasInput = challenge.type === "input";
    const isCompleted = alreadyDone || done;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="space-y-6">
            <p className="text-[14px] text-gray-600 leading-relaxed">{challenge.description}</p>

            {/* Challenge — always rendered, remounts on reset via resetKey */}
            {hasInput && <InputChallenge key={resetKey} challenge={challenge} onCorrect={handleCorrect} alreadyDone={alreadyDone} />}
            {hasOptions && <McqChallenge key={resetKey} challenge={challenge} onCorrect={handleCorrect} alreadyDone={alreadyDone} />}
            {hasSnippets && <SnippetChallenge key={resetKey} challenge={challenge} onCorrect={handleCorrect} alreadyDone={alreadyDone} />}

            {/* Completed state — rendered below the exercise */}
            {isCompleted && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-[13px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                        <CheckCircle2 size={14} />
                        Exercise complete
                    </div>
                    <button onClick={handleReset}
                        className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 text-[13px] font-medium rounded-xl transition-colors">
                        <RotateCcw size={13} /> Reset exercise
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
