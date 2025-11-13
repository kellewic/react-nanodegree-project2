import { Link } from "react-router-dom";
import styles from "../styles/Login.module.css";

/**
 * Page shown when user is not authenticated and tries to access a protected route.
 * 
 * @param {string} returnUrl - URL to redirect to after authentication
 * @returns {JSX.Element} UnauthenticatedPage component
 */
function UnauthenticatedPage({ returnUrl = "/" }) {
    return (
        <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${styles.gradientBg}`}>
            {/* Animated Background Blobs */}
            <div className={`absolute w-72 h-72 bg-blue-600/30 rounded-full blur-3xl ${styles.floating} top-20 left-20`}></div>
            <div className={`absolute w-96 h-96 bg-slate-600/30 rounded-full blur-3xl ${styles.floating} bottom-20 right-20`} style={{ animationDelay: "2s" }}></div>
            <div className={`absolute w-64 h-64 bg-blue-700/30 rounded-full blur-3xl ${styles.floating} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} style={{ animationDelay: "4s" }}></div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                {/* Glass Card */}
                <div className={`${styles.glassEffect} rounded-3xl shadow-2xl p-8 md:p-12 text-center`}>
                    {/* Icon */}
                    <div className="inline-block p-4 bg-white/20 rounded-full mb-6">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>

                    {/* Header */}
                    <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
                    <p className="text-white/80 text-lg mb-8">
                        Please sign in to access this page
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <Link
                            to="/login"
                            state={{ returnUrl }}
                            className="block w-full py-3 px-4 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            state={{ returnUrl }}
                            className="block w-full py-3 px-4 bg-white/20 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnauthenticatedPage;