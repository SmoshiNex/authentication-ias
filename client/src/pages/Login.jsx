import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handle(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await login({ email, password });
            localStorage.setItem("token", res.token);
            navigate("/");
        } catch (err) {
            setError(err.error || err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
                </div>

                <form onSubmit={handle} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-violet-600 hover:underline font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
