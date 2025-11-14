import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { _saveQuestionAnswer, _getUsers } from "../data/_DATA";
import { addAnswerToUser } from "../store/usersSlice";
import { addAnswerToQuestion } from "../store/questionsSlice";
import { selectQuestionById } from "../store/selectors";
import { formatDate } from "../utils/date";
import PageLayout from "../components/PageLayout";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/ViewPoll.module.css";

function ViewPoll() {
    const { question_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [justVoted, setJustVoted] = useState(false);

    const usersLoading = useSelector((state) => state.users.loading);
    const questionsLoading = useSelector((state) => state.questions.loading);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const question = useSelector(selectQuestionById(question_id));

    if (usersLoading || questionsLoading) {
        return <LoadingScreen message="Loading Employee Polls..." />;
    }

    // Redirect to 404 if question doesn't exist
    if (!question) {
        navigate('/404', { replace: true });
        return null;
    }

    const hasAnswered = !!question.userAnswer;

    // Calculate vote statistics
    const optionOneVotes = question.optionOne.votes.length;
    const optionTwoVotes = question.optionTwo.votes.length;
    const totalVotes = optionOneVotes + optionTwoVotes;
    const optionOnePercent = totalVotes > 0 ? Math.round((optionOneVotes / totalVotes) * 100) : 0;
    const optionTwoPercent = totalVotes > 0 ? Math.round((optionTwoVotes / totalVotes) * 100) : 0;

    const handleVote = async (option) => {
        if (isSubmitting || hasAnswered) return;

        setIsSubmitting(true);

        try {
            // Only save to _DATA.js if user exists in the mock data.
            // There's no function in _DATA.js that saves users and 
            // _saveQuestionAnswer doesn't check if user exists.
            const mockDataUsers = Object.keys(await _getUsers());

            if (mockDataUsers.includes(currentUser)) {
                await _saveQuestionAnswer({
                    authedUser: currentUser,
                    qid: question_id,
                    answer: option
                });
            }

            // Always update Redux state and localStorage (this is the source of truth)
            dispatch(addAnswerToUser({
                userId: currentUser,
                questionId: question_id,
                answer: option
            }));

            dispatch(addAnswerToQuestion({
                questionId: question_id,
                option: option,
                userId: currentUser
            }));

            setJustVoted(true);
            setIsSubmitting(false);
        } catch (err) {
            console.error('Failed to save answer:', err);
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout centered={true} maxWidth="900px">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Would You Rather</h1>
                    <div className={styles.authorSection}>
                        <img
                            src={question.author?.avatarURL}
                            alt={`${question.author?.name}'s avatar`}
                            className={styles.avatar}
                        />
                        <div className={styles.authorInfo}>
                            <h3 className={styles.authorName}>{question.author?.name}</h3>
                            <p className={styles.authorId}>@{question.author?.id}</p>
                        </div>
                    </div>
                    <p className={styles.timestamp}>{formatDate(question.timestamp)}</p>
                </div>

                {/* Success message when just voted */}
                {justVoted && (
                    <div className={styles.successBanner}>
                        <span className={styles.successIcon}>🎉</span>
                        Your vote has been recorded!
                    </div>
                )}

                {/* Options */}
                <div className={styles.optionsContainer}>
                    {/* Option One */}
                    <div
                        className={`${styles.optionCard} ${styles.glassEffect} ${hasAnswered ? styles.answered : styles.unanswered
                            } ${question.userAnswer === 'optionOne' ? styles.userChoice : ''}`}
                        onClick={() => !hasAnswered && handleVote('optionOne')}
                        role={hasAnswered ? 'presentation' : 'button'}
                        tabIndex={hasAnswered ? -1 : 0}
                    >
                        {/* User's choice indicator */}
                        {question.userAnswer === 'optionOne' && (
                            <div className={styles.choiceIndicator}>
                                <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                                Your Choice
                            </div>
                        )}

                        {/* Option text */}
                        <div className={styles.optionText}>{question.optionOne.text}</div>

                        {/* Stats for answered polls */}
                        {hasAnswered && (
                            <>
                                <div className={styles.statsRow}>
                                    <div className={styles.voteCount}>
                                        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {optionOneVotes} {optionOneVotes === 1 ? 'vote' : 'votes'}
                                    </div>
                                    <div className={styles.percentage}>{optionOnePercent}%</div>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${optionOnePercent}%` }}
                                    />
                                </div>
                            </>
                        )}

                        {/* Hover hint for unanswered */}
                        {!hasAnswered && !isSubmitting && (
                            <div className={styles.hoverHint}>Click to vote</div>
                        )}
                    </div>

                    {/* OR Divider */}
                    <div className={styles.orDivider}>OR</div>

                    {/* Option Two */}
                    <div
                        className={`${styles.optionCard} ${styles.glassEffect} ${hasAnswered ? styles.answered : styles.unanswered
                            } ${question.userAnswer === 'optionTwo' ? styles.userChoice : ''}`}
                        onClick={() => !hasAnswered && handleVote('optionTwo')}
                        role={hasAnswered ? 'presentation' : 'button'}
                        tabIndex={hasAnswered ? -1 : 0}
                    >
                        {/* User's choice indicator */}
                        {question.userAnswer === 'optionTwo' && (
                            <div className={styles.choiceIndicator}>
                                <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                                Your Choice
                            </div>
                        )}

                        {/* Option text */}
                        <div className={styles.optionText}>{question.optionTwo.text}</div>

                        {/* Stats for answered polls */}
                        {hasAnswered && (
                            <>
                                <div className={styles.statsRow}>
                                    <div className={styles.voteCount}>
                                        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {optionTwoVotes} {optionTwoVotes === 1 ? 'vote' : 'votes'}
                                    </div>
                                    <div className={styles.percentage}>{optionTwoPercent}%</div>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${optionTwoPercent}%` }}
                                    />
                                </div>
                            </>
                        )}

                        {/* Hover hint for unanswered */}
                        {!hasAnswered && !isSubmitting && (
                            <div className={styles.hoverHint}>Click to vote</div>
                        )}
                    </div>
                </div>

                {/* Total votes summary */}
                {hasAnswered && (
                    <div className={styles.totalVotes}>
                        Total Votes: {totalVotes}
                    </div>
                )}

                {/* Loading overlay when submitting */}
                {isSubmitting && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}>
                            <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

export default ViewPoll;
