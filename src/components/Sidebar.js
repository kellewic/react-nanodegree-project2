import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    selectCurrentUser,
    selectLoggedInUser,
    selectIsImpersonating,
    selectImpersonatedUser,
    selectAvailableUsersForImpersonation
} from '../store/selectors';
import { logout, startImpersonation, stopImpersonation } from '../store/authSlice';
import styles from '../styles/Sidebar.module.css';
import UserDropdown from './UserDropdown';
import logo from '../images/logo.png';

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const currentUser = useSelector(selectCurrentUser);
    const loggedInUser = useSelector(selectLoggedInUser);
    const isImpersonating = useSelector(selectIsImpersonating);
    const impersonatedUser = useSelector(selectImpersonatedUser);
    const availableUsers = useSelector(selectAvailableUsersForImpersonation);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleStartImpersonation = (userId) => {
        dispatch(startImpersonation(userId));
        setShowUserDropdown(false);
    };

    const handleStopImpersonation = () => {
        dispatch(stopImpersonation());
    };

    if (!currentUser) {
        return null;
    }

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.sidebarContent}>
                {/* Header with logo */}
                <div className={styles.header}>
                    <div className={styles.logoSection}>
                        <div className={styles.logo}>
                            <img
                                src={logo}
                                alt="Employee Polls logo"
                                className={styles.logoIcon}
                            />
                        </div>
                        {!isCollapsed && <span className={styles.brandName}>Employee Polls</span>}
                    </div>
                </div>

                {/* Floating collapse button */}
                <button
                    onClick={toggleSidebar}
                    className={styles.collapseBtn}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!isCollapsed}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.collapseIcon}
                        aria-hidden="true"
                    >
                        <path d={isCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
                    </svg>
                </button>

                {/* User Profile - Shows Logged-In User */}
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                        <img
                            src={loggedInUser.avatarURL}
                            alt={`${loggedInUser.name}'s avatar`}
                            className={styles.avatarImg}
                        />
                    </div>
                    {!isCollapsed && (
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{loggedInUser.name}</div>
                            <div className={styles.userRole}>Team Member</div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className={styles.nav} aria-label="Main navigation">
                    <Link
                        to="/"
                        className={styles.navItem}
                        aria-label="Home"
                    >
                        <div className={styles.navIcon}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                        </div>
                        {!isCollapsed && <span className={styles.navLabel}>Home</span>}
                    </Link>

                    <Link
                        to="/add"
                        className={styles.navItem}
                        aria-label="Add Poll"
                    >
                        <div className={styles.navIcon}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                        </div>
                        {!isCollapsed && <span className={styles.navLabel}>Add Poll</span>}
                    </Link>

                    <Link
                        to="/leaderboard"
                        className={styles.navItem}
                        aria-label="Leaderboard"
                    >
                        <div className={styles.navIcon}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M8 21h8M12 3v18M4 7h16l-1.5 9H5.5L4 7z" />
                            </svg>
                        </div>
                        {!isCollapsed && <span className={styles.navLabel}>Leaderboard</span>}
                    </Link>
                </nav>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    {/* Impersonation Section */}
                    {isImpersonating ? (
                        <div className={styles.impersonationBanner}>
                            <div className={styles.impersonatedUser}>
                                <div className={`${styles.avatar} ${styles.impersonatedAvatar}`}>
                                    <img
                                        src={impersonatedUser.avatarURL}
                                        alt={`Impersonating ${impersonatedUser.name}`}
                                        className={styles.avatarImg}
                                    />
                                    <div className={styles.impersonationBadge} aria-label="Impersonating">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <polyline points="17 11 19 13 23 9" />
                                        </svg>
                                    </div>
                                </div>
                                {!isCollapsed && (
                                    <div className={styles.userInfo}>
                                        <div className={styles.impersonationLabel}>Impersonating</div>
                                        <div className={styles.userName}>{impersonatedUser.name}</div>
                                    </div>
                                )}
                            </div>
                            {!isCollapsed && (
                                <button
                                    onClick={handleStopImpersonation}
                                    className={styles.stopImpersonationBtn}
                                    aria-label="Stop impersonating"
                                >
                                    Stop
                                </button>
                            )}
                            {isCollapsed && (
                                <button
                                    onClick={handleStopImpersonation}
                                    className={styles.stopImpersonationBtnCollapsed}
                                    aria-label="Stop impersonating"
                                    title="Stop impersonating"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={styles.impersonationSection}>
                            {/* Switch User Button */}
                            <button
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className={styles.impersonateBtn}
                                aria-label="Switch user"
                                aria-expanded={showUserDropdown}
                            >
                                <div className={styles.navIcon}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <line x1="17" y1="11" x2="23" y2="11" />
                                        <line x1="20" y1="8" x2="20" y2="14" />
                                    </svg>
                                </div>
                                {!isCollapsed && <span className={styles.navLabel}>Switch User</span>}
                            </button>

                            {/* User Dropdown */}
                            {showUserDropdown && !isCollapsed && (
                                <UserDropdown title="Select User" clickHandler={handleStartImpersonation} />
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={styles.logoutBtn}
                        aria-label="Log out"
                    >
                        <div className={styles.navIcon}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        {!isCollapsed && <span className={styles.navLabel}>Log Out</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;

