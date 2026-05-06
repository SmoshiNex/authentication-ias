import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from "lucide-react";

export default function AssessmentView({ step, alreadyDone, onComplete, onReset }) {
    const { questions } = step.challenge;
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // If already done, show completed state immediately
    if (alreadyDone) {
        return (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="space-y-8">
                <p className="text-[14px] text-gray-600 leading-relaxed">{step.challenge.description}</p>
                <div className="rounded-2xl p-6 border bg-emerald-50 border-emerald-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-100">
                        <Trophy size={24} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[18px] font-bold tracking-tight text-emerald-800">Assessment Passed!</p>
                        <p className="text-[13px] mt-0.5 text-emerald-600">You've already completed this assessment.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onReset}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-200 text-emerald-700 text-[13px] font-medium rounded-xl hover:bg-emerald-50 transition-colors shrink-0">
                            <RotateCcw size={13} /> Reset
                        </button>
                        <button onClick={onComplete}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-medium rounded-xl transition-colors shrink-0">
                            Next <ArrowRight size={13} />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    function select(qId, optId) {
        if (submitted) return;
        setAnswers((prev) => ({ ...prev, [qId]: optId }));
    }

    function submit() {
        if (Object.keys(answers).length < questions.length) return;
        let correct = 0;
        questions.forEach((q) => {
            const correctOpt = q.options.find((o) => o.correct);
            if (answers[q.id] === correctOpt?.id) correct++;
        });
        setScore(correct);
        setSubmitted(true);
    }

    function reset() {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    }

    const passing = score >= Math.ceil(questions.length * 0.8); // 80% to pass
    const pct = Math.round((score / questions.length) * 100);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="space-y-8">

            <p className="text-[14px] text-gray-600 leading-relaxed">{step.challenge.description}</p>

            {/* Score banner */}
            <AnimatePresence>
                {submitted && (
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-2xl p-6 border flex items-center gap-5 ${passing ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${passing ? "bg-emerald-100" : "bg-red-100"}`}>
                            {passing ? <Trophy size={24} className="text-emerald-600" /> : <XCircle size={24} className="text-red-500" />}
                        </div>
                        <div className="flex-1">
                            <p className={`text-[18px] font-bold tracking-tight ${passing ? "text-emerald-800" : "text-red-700"}`}>
                                {passing ? "Assessment Passed!" : "Not quite there yet"}
                            </p>
                            <p className={`text-[13px] mt-0.5 ${passing ? "text-emerald-600" : "text-red-500"}`}>
                                {score}/{questions.length} correct · {pct}% · {passing ? "80%+ required ✓" : "80% required to pass"}
                            </p>
                        </div>
                        {!passing && (
                            <button onClick={reset}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-[13px] font-medium rounded-xl hover:bg-red-50 transition-colors shrink-0">
                                <RotateCcw size={13} /> Retry
                            </button>
                        )}
                        {passing && (
                            <button onClick={onComplete}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-medium rounded-xl transition-colors shrink-0">
                                Finish <ArrowRight size={13} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Questions */}
            <div className="space-y-6">
                {questions.map((q, qi) => {
                    const correctOpt = q.options.find((o) => o.correct);
                    const userAnswer = answers[q.id];
                    const isCorrect = submitted && userAnswer === correctOpt?.id;
                    const isWrong = submitted && userAnswer && userAnswer !== correctOpt?.id;

                    return (
                        <div key={q.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${submitted ? isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                                    {qi + 1}
                                </span>
                                <p className="text-[14px] font-medium text-gray-800 leading-snug">{q.text}</p>
                            </div>

                            <div className="ml-9 space-y-2">
                                {q.options.map((opt) => {
                                    let style = "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50";
                                    if (submitted) {
                                        if (opt.correct) style = "border-emerald-300 bg-emerald-50 text-emerald-800";
                                        else if (opt.id === userAnswer) style = "border-red-300 bg-red-50 text-red-700";
                                        else style = "border-gray-100 bg-gray-50 text-gray-400";
                                    } else if (userAnswer === opt.id) {
                                        style = "border-gray-500 bg-gray-50 text-gray-900";
                                    }

                                    return (
                                        <button key={opt.id} disabled={submitted} onClick={() => select(q.id, opt.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-[13px] text-left transition-all ${style}`}>
                                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 text-[9px] font-bold">
                                                {opt.id.toUpperCase()}
                                            </span>
                                            <span className="flex-1">{opt.text}</span>
                                            {submitted && opt.correct && <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />}
                                            {submitted && opt.id === userAnswer && !opt.correct && <XCircle size={13} className="text-red-400 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Submit */}
            {!submitted && (
                <button onClick={submit}
                    disabled={Object.keys(answers).length < questions.length}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-xl transition-colors">
                    Submit assessment
                    <ArrowRight size={14} />
                </button>
            )}

            {!submitted && Object.keys(answers).length < questions.length && (
                <p className="text-[12px] text-gray-400">
                    Answer all {questions.length} questions to submit · {Object.keys(answers).length}/{questions.length} answered
                </p>
            )}
        </motion.div>
    );
}
