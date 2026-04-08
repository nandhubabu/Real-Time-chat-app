import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-base-200">
            <div className="w-full max-w-md bg-base-100 rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-center text-primary mb-6">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="input input-bordered w-full"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input input-bordered w-full"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                        {isLoggingIn ? "Logging in..." : "Log In"}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-base-content/60">
                        Don't have an account? <Link to="/signup" className="link link-primary">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
