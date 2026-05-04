import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MODULES, getStep, getNextStep, getPrevStep } from "../data/curriculum";
import { useProgress } from "../hooks/useProgress";
import Layout from "../components/Layout";
import StepHeader from "../components/StepHeader";
import LessonView from "../components/LessonView";
import ExerciseView from "../components/ExerciseView";
import AssessmentView from "../components/AssessmentView";

export default function LearnPage() {
    const { moduleId, stepId } = useParams();
    const navigate = useNavigate();
    const { markComplete, isComplete } = useProgress();

    const result = getStep(moduleId, stepId);

    // Scroll to top on step change
    useEffect(() => { window.scrollTo(0, 0); }, [moduleId, stepId]);

    if (!result) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-64 space-y-3">
                    <p className="text-gray-400 text-[14px]">Step not found.</p>
                    <button onClick={() => navigate("/dashboard")}
                        className="text-[13px] text-gray-600 underline underline-offset-2">
                        Back to dashboard
                    </button>
                </div>
            </Layout>
        );
    }

    const { module, step } = result;
    const next = getNextStep(moduleId, stepId);
    const prev = getPrevStep(moduleId, stepId);
    const alreadyDone = isComplete(moduleId, stepId);

    // Find step index within module
    const stepIndex = module.steps.findIndex((s) => s.id === stepId);
    // Total steps across all modules for the progress dots (use module steps only)
    const totalSteps = module.steps.length;

    function handleComplete() {
        markComplete(moduleId, stepId);
        if (next) {
            navigate(`/learn/${next.moduleId}/${next.stepId}`);
        } else {
            navigate("/dashboard");
        }
    }

    function goNext() {
        if (next) navigate(`/learn/${next.moduleId}/${next.stepId}`);
        else navigate("/dashboard");
    }

    function goPrev() {
        if (prev) navigate(`/learn/${prev.moduleId}/${prev.stepId}`);
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8">
                <StepHeader
                    module={module}
                    step={step}
                    stepIndex={stepIndex}
                    totalSteps={totalSteps}
                />

                <motion.div
                    key={`${moduleId}-${stepId}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    {step.type === "lesson" && (
                        <LessonView
                            step={step}
                            onComplete={handleComplete}
                        />
                    )}
                    {step.type === "exercise" && (
                        <ExerciseView
                            step={step}
                            onComplete={handleComplete}
                        />
                    )}
                    {step.type === "assessment" && (
                        <AssessmentView
                            step={step}
                            onComplete={handleComplete}
                        />
                    )}
                </motion.div>

                {/* Prev / Next nav — always visible for already-completed steps */}
                {alreadyDone && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button onClick={goPrev} disabled={!prev}
                            className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors">
                            <ArrowLeft size={14} /> Previous
                        </button>
                        <button onClick={goNext}
                            className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
                            {next ? "Next" : "Dashboard"} <ArrowRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
