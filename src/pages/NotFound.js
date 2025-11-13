import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.css";

/**
 * Page shown when a user tries to access a non-existent route.
 * 
 * @returns {JSX.Element} NotFound component
 */
function NotFound() {
    return (
        <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${styles.gradientBg}`}>
            {/* Animated Background Blobs */}
            <div className={`absolute w-72 h-72 bg-red-600/30 rounded-full blur-3xl ${styles.floating} top-20 left-20`}></div>
            <div className={`absolute w-96 h-96 bg-orange-600/30 rounded-full blur-3xl ${styles.floating} bottom-20 right-20`} style={{ animationDelay: "2s" }}></div>
            <div className={`absolute w-64 h-64 bg-purple-700/30 rounded-full blur-3xl ${styles.floating} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} style={{ animationDelay: "4s" }}></div>

            {/* 404 Container */}
            <div className="relative z-10 w-full max-w-2xl px-4">
                {/* Glass Card */}
                <div className={`${styles.glassEffect} rounded-3xl shadow-2xl p-8 md:p-12 text-center`}>
                    {/* Animated 404 Icon */}
                    <div className="inline-block mb-6">
                        <div className="relative">
                            {/* Orbiting circles */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={styles.orbitRing}>
                                    <div className={styles.orbitDot}></div>
                                </div>
                            </div>

                            {/* 404 Icon */}
                            <div className="relative p-6 bg-white/20 rounded-3xl backdrop-blur-sm">
                                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 404 Text */}
                    <h1 className={`text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight ${styles.glitch}`} data-text="404">
                        404
                    </h1>

                    {/* Error Message */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off into the digital void.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/"
                            className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="px-8 py-3 bg-white/20 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            Go Back
                        </button>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-white/60 text-sm mb-4">Need help? Try these:</p>
                        <div className="flex flex-wrap gap-4 justify-center text-sm">
                            <Link to="/" className="text-white/80 hover:text-white transition-colors">
                                Home
                            </Link>
                            <span className="text-white/40">•</span>
                            <Link to="/login" className="text-white/80 hover:text-white transition-colors">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;