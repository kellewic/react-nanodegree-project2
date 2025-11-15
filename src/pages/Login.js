import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import ErrorMessage from "../components/ErrorMessage";
import UserDropdown from "../components/UserDropdown";
import styles from "../styles/Login.module.css";

/**
 * Page shown to user to login.
 * 
 * @returns {JSX.Element} Login component
 */
function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const users = useSelector((state) => state.users.byId);
    const usersLoading = useSelector((state) => state.users.loading);

    // Get return URL from location state, default to home
    const returnUrl = location.state?.returnUrl || '/';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!userId.trim() || !password.trim()) {
            setError("Please enter both user ID and password");
            return;
        }

        // Check if user exists
        const user = users[userId];
        if (!user) {
            setError("User ID not found. Please check your credentials or sign up.");
            return;
        }

        // Check password
        if (user.password !== password) {
            setError("Incorrect password. Please try again.");
            return;
        }

        // Login successful
        dispatch(login(userId));
        navigate(returnUrl);
    };

    const handleQuickLogin = (selectedUserId) => {
        setError("");
        dispatch(login(selectedUserId));
        navigate(returnUrl);
    };

    return (
        <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${styles.gradientBg}`}>
            {/* Animated Background Blobs */}
            <div className={`absolute w-72 h-72 bg-blue-600/30 rounded-full blur-3xl ${styles.floating} top-20 left-20`}></div>
            <div className={`absolute w-96 h-96 bg-slate-600/30 rounded-full blur-3xl ${styles.floating} bottom-20 right-20`} style={{ animationDelay: "2s" }}></div>
            <div className={`absolute w-64 h-64 bg-blue-700/30 rounded-full blur-3xl ${styles.floating} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} style={{ animationDelay: "4s" }}></div>

            {/* Login Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                {/* Glass Card */}
                <div className={`${styles.glassEffect} rounded-3xl shadow-2xl p-8 md:p-12`}>
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-block p-3 bg-white/20 rounded-2xl mb-4">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-white/80 mb-4">Sign in to continue to your account</p>

                        {/* Sign Up Link */}
                        <div className="text-white/70 text-sm">
                            Don't have an account? <Link to="/signup" className="text-white font-semibold hover:text-white/90 transition-colors">Sign up</Link>
                        </div>
                    </div>

                    {/* Error Message */}
                    <ErrorMessage message={error} />

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* User ID Input */}
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-white mb-2">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                                disabled={usersLoading}
                                className={`${styles.inputFocus} w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50`}
                                placeholder="Enter your user ID"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={usersLoading}
                                className={`${styles.inputFocus} w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50`}
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={usersLoading}
                            className="w-full py-3 px-4 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {usersLoading ? 'Loading...' : 'Sign In'}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className={styles.divider}>
                        <span className={styles.dividerText}>OR</span>
                    </div>

                    {/* Quick Login Section */}
                    <div className={styles.quickLoginSection}>
                        <div className={styles.quickLoginHeader}>
                            <h2 className={styles.quickLoginTitle}>Quick Login</h2>
                        </div>
                        <UserDropdown
                            title="Select User"
                            clickHandler={handleQuickLogin}
                            styleOverrides={{
                                container: {
                                    position: 'static',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    maxHeight: '200px',
                                    animation: 'none'
                                },
                                header: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.75rem'
                                },
                                option: {
                                    fontSize: '0.875rem'
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;