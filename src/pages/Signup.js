import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/usersSlice";
import { login } from "../store/authSlice";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/Signup.module.css";

/**
 * Page shown to user to sign up.
 * 
 * @returns {JSX.Element} Signup component
 */
function Signup() {
    const [userId, setUserId] = useState("");
    const [displayUserId, setDisplayUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const users = useSelector((state) => state.users.byId);

    // Get the return URL from location state, default to home
    const returnUrl = location.state?.returnUrl || '/';

    const handleUserIdBlur = () => {
        setDisplayUserId(userId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!fullName.trim() || !userId.trim() || !password.trim()) {
            setError("All fields are required");
            return;
        }

        // Check if user ID already exists
        if (users[userId]) {
            setError("This user ID is already taken. Please choose another.");
            return;
        }

        // Create new user
        const newUser = {
            id: userId,
            password: password,
            name: fullName,
            avatarURL: `https://i.pravatar.cc/150?u=${userId}`,
            answers: {},
            questions: []
        };

        // Add to Redux and localStorage
        dispatch(addUser(newUser));

        // Auto-login
        dispatch(login(userId));

        // Show success and start countdown
        setIsSuccess(true);

        let timeLeft = 5;
        const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);

            if (timeLeft === 0) {
                clearInterval(timer);
                navigate(returnUrl);
            }
        }, 1000);
    };

    // Success screen
    if (isSuccess) {
        return (
            <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${styles.gradientBg}`}>
                {/* Animated Background Blobs */}
                <div className={`absolute w-72 h-72 bg-green-600/30 rounded-full blur-3xl ${styles.floating} top-20 left-20`}></div>
                <div className={`absolute w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl ${styles.floating} bottom-20 right-20`} style={{ animationDelay: "2s" }}></div>

                <div className="relative z-10 w-full max-w-md px-4">
                    <div className={`${styles.glassEffect} rounded-3xl shadow-2xl p-8 md:p-12 text-center`}>
                        {/* Success Icon */}
                        <div className="inline-block p-4 bg-green-500/20 rounded-full mb-6">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-4">Account Created!</h1>
                        <p className="text-white/80 mb-6">
                            Welcome, {fullName}! Your account has been successfully created.
                        </p>

                        {/* Avatar Preview */}
                        <div className="flex justify-center mb-6">
                            <img
                                src={`https://i.pravatar.cc/150?u=${userId}`}
                                alt="Your avatar"
                                className="w-24 h-24 rounded-full border-2 border-white/50 shadow-lg"
                            />
                        </div>

                        {/* Countdown */}
                        <div className="text-white/90">
                            <p className="mb-2">Redirecting in...</p>
                            <div className="text-5xl font-bold">{countdown}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${styles.gradientBg}`}>
            {/* Animated Background Blobs */}
            <div className={`absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl ${styles.floating} top-20 left-20`}></div>
            <div className={`absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl ${styles.floating} bottom-20 right-20`} style={{ animationDelay: "2s" }}></div>
            <div className={`absolute w-64 h-64 bg-purple-700/30 rounded-full blur-3xl ${styles.floating} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} style={{ animationDelay: "4s" }}></div>

            {/* Signup Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                {/* Glass Card */}
                <div className={`${styles.glassEffect} rounded-3xl shadow-2xl p-8 md:p-12`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-white/20 rounded-2xl mb-4">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-white/80">Sign up to start creating polls</p>
                    </div>

                    {/* Error display */}
                    <ErrorMessage message={error} />

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className={`${styles.inputFocus} w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50`}
                                placeholder="Enter your full name"
                            />
                        </div>

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
                                onBlur={handleUserIdBlur}
                                required
                                className={`${styles.inputFocus} w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50`}
                                placeholder="Choose a unique user ID"
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
                                className={`${styles.inputFocus} w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50`}
                                placeholder="Create a password"
                            />
                        </div>

                        {/* Avatar Preview Section */}
                        <div className="text-center space-y-3">
                            <label className="block text-sm font-medium text-white">
                                Your Avatar Preview
                            </label>
                            <div className="flex justify-center">
                                <div className="relative w-[150px] h-[150px]">
                                    {/* Placeholder SVG */}
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center bg-white/10 rounded-full border-2 border-white/30 transition-opacity duration-500 ${displayUserId ? 'opacity-0' : 'opacity-100'}`}
                                    >
                                        <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>

                                    {/* Actual Avatar */}
                                    {displayUserId && (
                                        <img
                                            src={`https://i.pravatar.cc/150?u=${displayUserId}`}
                                            alt="Avatar preview"
                                            className={`absolute inset-0 w-full h-full rounded-full border-2 border-white/50 shadow-lg transition-opacity duration-500 ${displayUserId ? 'opacity-100' : 'opacity-0'}`}
                                            onError={(e) => {
                                                // Fallback if pravatar fails
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <p className="text-white/70 text-sm">
                                <svg className="w-5 h-5 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {displayUserId ? 'This will be your avatar' : 'Enter a user ID to see your avatar'}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center text-white/80">
                        <div>Already have an account?</div>
                        <Link to="/login" className="text-white font-semibold hover:text-white/90 transition-colors">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;