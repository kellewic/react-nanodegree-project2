import { useSelector } from "react-redux";
import PageLayout from "../components/PageLayout";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/LoadingScreen";
import { selectLeaderboard } from "../store/selectors";
import styles from "../styles/Leaderboard.module.css";

function Leaderboard() {
    const usersLoading = useSelector((state) => state.users.loading);
    const leaderboardData = useSelector(selectLeaderboard);

    if (usersLoading) {
        return <LoadingScreen message="Loading Employee Polls..." />;
    }

    const getRankBadge = (index) => {
        switch (index) {
            case 0:
                return { emoji: '🥇', label: '1st Place', className: styles.gold };
            case 1:
                return { emoji: '🥈', label: '2nd Place', className: styles.silver };
            case 2:
                return { emoji: '🥉', label: '3rd Place', className: styles.bronze };
            default:
                return { emoji: `#${index + 1}`, label: `${index + 1}th Place`, className: styles.regular };
        }
    };

    return (
        <PageLayout centered={true} maxWidth="900px">
            <div className={styles.header}>
                <h1 className={styles.title}>🏆 Leaderboard</h1>
                <p className={styles.subtitle}>Top contributors in Employee Polls</p>
            </div>

            <div className={styles.leaderboardList}>
                {leaderboardData.map((user, index) => {
                    const rankBadge = getRankBadge(index);
                    return (
                        <div
                            key={user.id}
                            className={`${styles.leaderboardCard} ${rankBadge.className}`}
                        >
                            {/* Rank Badge */}
                            <div className={styles.rankBadge}>
                                <span className={styles.rankEmoji}>{rankBadge.emoji}</span>
                            </div>

                            {/* User Info */}
                            <div className={styles.userSection}>
                                <div className={styles.avatarContainer}>
                                    <img
                                        src={user.avatarURL}
                                        alt={`${user.name}'s avatar`}
                                        className={styles.avatar}
                                    />
                                </div>
                                <div className={styles.userInfo}>
                                    <h3 className={styles.userName}>{user.name}</h3>
                                    <p className={styles.userId}>@{user.id}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className={styles.statsSection}>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>{user.answeredCount}</div>
                                    <div className={styles.statLabel}>Answered</div>
                                </div>
                                <div className={styles.statDivider}></div>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>{user.createdCount}</div>
                                    <div className={styles.statLabel}>Created</div>
                                </div>
                            </div>

                            {/* Total Score */}
                            <div className={styles.scoreSection}>
                                <div className={styles.scoreLabel}>Total Score</div>
                                <div className={styles.scoreValue}>{user.totalScore}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {leaderboardData.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No users found</p>
                </div>
            )}
        </PageLayout>
    );
}

export default Leaderboard;
