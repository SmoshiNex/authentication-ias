import { useState, useEffect, useCallback } from "react";
import { MODULES, TOTAL_STEPS } from "../data/curriculum";
import { fetchProgress, saveProgress } from "../services/api";

const CACHE_KEY = "injectionx_progress_cache";

function loadCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
    catch { return {}; }
}

function toMap(rows) {
    // rows: [{ moduleId, stepId }]
    return rows.reduce((acc, r) => {
        acc[`${r.moduleId}:${r.stepId}`] = true;
        return acc;
    }, {});
}

export function useProgress() {
    const [completed, setCompleted] = useState(loadCache);
    const [loading, setLoading] = useState(true);

    // Load from server on mount
    useEffect(() => {
        fetchProgress()
            .then((rows) => {
                const map = toMap(rows);
                setCompleted(map);
                localStorage.setItem(CACHE_KEY, JSON.stringify(map));
            })
            .catch(() => {
                // Server unreachable — fall back to cache silently
            })
            .finally(() => setLoading(false));
    }, []);

    const markComplete = useCallback((moduleId, stepId) => {
        const key = `${moduleId}:${stepId}`;
        // Optimistic update
        setCompleted((prev) => {
            const next = { ...prev, [key]: true };
            localStorage.setItem(CACHE_KEY, JSON.stringify(next));
            return next;
        });
        // Persist to server
        saveProgress(moduleId, stepId).catch(() => {
            // If it fails, it's fine — will re-sync on next load
        });
    }, []);

    const isComplete = useCallback(
        (moduleId, stepId) => !!completed[`${moduleId}:${stepId}`],
        [completed]
    );

    const moduleProgress = useCallback((moduleId) => {
        const mod = MODULES.find((m) => m.id === moduleId);
        if (!mod) return 0;
        const done = mod.steps.filter((s) => completed[`${moduleId}:${s.id}`]).length;
        return Math.round((done / mod.steps.length) * 100);
    }, [completed]);

    const totalCompleted = Object.keys(completed).length;
    const overallProgress = Math.round((totalCompleted / TOTAL_STEPS) * 100);

    const resetProgress = useCallback(() => {
        localStorage.removeItem(CACHE_KEY);
        setCompleted({});
    }, []);

    return { completed, loading, markComplete, isComplete, moduleProgress, overallProgress, totalCompleted, resetProgress };
}
