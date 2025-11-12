import styles from "../styles/Login.module.css";

function Login() {
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
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-white/20 rounded-2xl mb-4">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-white/80">Sign in to continue to your account</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className={`${styles.inputFocus} w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50`}
                                placeholder="you@example.com"
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
                                required
                                className={`${styles.inputFocus} w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50`}
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center text-white/80">
                        <div>Don't have an account?</div>
                        <a href="#" className="text-white font-semibold hover:text-white/90 transition-colors">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;