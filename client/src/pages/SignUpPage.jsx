import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, User, Lock } from "lucide-react";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Username Input */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Username</span></label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Nandhu"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input
                            type="email"
                            className="input input-bordered w-full"
                            placeholder="nandhu@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input input-bordered w-full"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                        {isSigningUp ? <Loader2 className="animate-spin" /> : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;