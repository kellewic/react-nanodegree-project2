import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { _saveQuestion } from "../data/_DATA";
import { addQuestionToUser } from "../store/usersSlice";
import { addQuestion } from "../store/questionsSlice";
import PageLayout from "../components/PageLayout";
import LoadingScreen from "../components/LoadingScreen";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/AddPoll.module.css";

function AddPoll() {
    const [optionOneText, setOptionOneText] = useState("");
    const [optionTwoText, setOptionTwoText] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usersLoading = useSelector((state) => state.users.loading);
    const questionsLoading = useSelector((state) => state.questions.loading);
    const currentUser = useSelector((state) => state.auth.currentUser);

    if (usersLoading || questionsLoading) {
        return <LoadingScreen message="Loading Employee Polls..." />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!optionOneText.trim() || !optionTwoText.trim()) {
            setError("Please provide both options");
            return;
        }

        if (optionOneText.trim().length < 3 || optionTwoText.trim().length < 3) {
            setError("Each option must be at least 3 characters");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create question (adds it to _DATA.js in-memory)
            const newQuestion = await _saveQuestion({
                optionOneText: optionOneText.trim(),
                optionTwoText: optionTwoText.trim(),
                author: currentUser
            });

            // Add question to Redux state and localStorage
            dispatch(addQuestion(newQuestion));

            // Update user's questions array in Redux state and localStorage
            dispatch(addQuestionToUser({
                userId: currentUser,
                questionId: newQuestion.id
            }));

            // Navigate to home page on success
            navigate("/");
        } catch (err) {
            setError(err || "Failed to create poll. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout centered={true} maxWidth="1200px">
            <div className={styles.pageContainer}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Would You Rather</h1>
                    <p className={styles.subtitle}>Create Your Own Poll</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.errorContainer}>
                        <ErrorMessage message={error} />
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Two Option Cards Side by Side */}
                    <div className={styles.cardsContainer}>
                        {/* Option One Card */}
                        <div className={`${styles.optionCard} ${styles.glassEffect}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                </div>
                                <h2 className={styles.cardTitle}>First Option</h2>
                            </div>
                            <div className={styles.cardContent}>
                                <label htmlFor="optionOne" className={styles.label}>
                                    What's the first option?
                                </label>
                                <textarea
                                    id="optionOne"
                                    name="optionOne"
                                    value={optionOneText}
                                    onChange={(e) => setOptionOneText(e.target.value)}
                                    placeholder="e.g., Work from home"
                                    required
                                    disabled={isSubmitting}
                                    rows="4"
                                    className={`${styles.textarea} ${styles.inputFocus}`}
                                    maxLength="200"
                                />
                                <div className={styles.charCount}>
                                    {optionOneText.length}/200
                                </div>
                            </div>
                        </div>

                        {/* OR Divider */}
                        <div className={styles.divider}>
                            <div className={styles.dividerLine}></div>
                            <span className={styles.dividerText}>OR</span>
                            <div className={styles.dividerLine}></div>
                        </div>

                        {/* Option Two Card */}
                        <div className={`${styles.optionCard} ${styles.glassEffect}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h2 className={styles.cardTitle}>Second Option</h2>
                            </div>
                            <div className={styles.cardContent}>
                                <label htmlFor="optionTwo" className={styles.label}>
                                    What's the second option?
                                </label>
                                <textarea
                                    id="optionTwo"
                                    name="optionTwo"
                                    value={optionTwoText}
                                    onChange={(e) => setOptionTwoText(e.target.value)}
                                    placeholder="e.g., Work from office"
                                    required
                                    disabled={isSubmitting}
                                    rows="4"
                                    className={`${styles.textarea} ${styles.inputFocus}`}
                                    maxLength="200"
                                />
                                <div className={styles.charCount}>
                                    {optionTwoText.length}/200
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className={styles.submitContainer}>
                        <button
                            type="submit"
                            disabled={isSubmitting || !optionOneText.trim() || !optionTwoText.trim()}
                            className={styles.submitButton}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Poll...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Poll
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
}

export default AddPoll;
