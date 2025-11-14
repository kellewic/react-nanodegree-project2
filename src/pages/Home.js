import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import LoadingScreen from "../components/LoadingScreen";
import { selectUnansweredQuestions, selectAnsweredQuestions } from "../store/selectors";
import styles from "../styles/Home.module.css";

function Home() {
  const [showAnswered, setShowAnswered] = useState(false);
  const usersLoading = useSelector((state) => state.users.loading);
  const questionsLoading = useSelector((state) => state.questions.loading);
  const unansweredQuestions = useSelector(selectUnansweredQuestions);
  const answeredQuestions = useSelector(selectAnsweredQuestions);

  if (usersLoading || questionsLoading) {
    return <LoadingScreen message="Loading Employee Polls..." />;
  }

  const currentQuestions = showAnswered ? answeredQuestions : unansweredQuestions;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <PageLayout centered={true} maxWidth="1200px">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Employee Polls</h1>
          <p className={styles.subtitle}>
            Vote on polls and see what your colleagues think
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className={styles.tabsContainer}>
          <button
            onClick={() => setShowAnswered(false)}
            className={`${styles.tab} ${!showAnswered ? styles.tabActive : ''}`}
            aria-pressed={!showAnswered}
          >
            <span className={styles.tabIcon}>📋</span>
            Unanswered
            <span className={styles.tabBadge}>{unansweredQuestions.length}</span>
          </button>
          <button
            onClick={() => setShowAnswered(true)}
            className={`${styles.tab} ${showAnswered ? styles.tabActive : ''}`}
            aria-pressed={showAnswered}
          >
            <span className={styles.tabIcon}>✅</span>
            Answered
            <span className={styles.tabBadge}>{answeredQuestions.length}</span>
          </button>
        </div>

        {/* Questions Grid */}
        <div className={styles.questionsGrid}>
          {currentQuestions.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                {showAnswered ? '🎉' : '📝'}
              </div>
              <h3 className={styles.emptyTitle}>
                {showAnswered ? 'No polls answered yet' : 'No new polls'}
              </h3>
              <p className={styles.emptyText}>
                {showAnswered
                  ? 'Start voting on polls to see them here!'
                  : 'Check back later for new polls from your colleagues.'}
              </p>
            </div>
          ) : (
            currentQuestions.map((question) => (
              <div key={question.id} className={`${styles.questionCard} ${styles.glassEffect}`}>
                {/* Author Info */}
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

                {/* Timestamp */}
                <div className={styles.timestamp}>
                  {formatDate(question.timestamp)}
                </div>

                {/* Question Preview */}
                <div className={styles.questionPreview}>
                  <h4 className={styles.questionTitle}>Would You Rather...</h4>
                  <div className={styles.optionsPreview}>
                    <div className={styles.optionText}>
                      {question.optionOne.text}
                    </div>
                    <div className={styles.orDivider}>OR</div>
                    <div className={styles.optionText}>
                      {question.optionTwo.text}
                    </div>
                  </div>
                </div>

                {/* Show Button */}
                <Link
                  to={`/questions/${question.id}`}
                  className={styles.showButton}
                >
                  Show
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default Home;
