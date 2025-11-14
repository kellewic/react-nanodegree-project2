import Sidebar from './Sidebar';
import styles from '../styles/PageLayout.module.css';

/**
 * layout wrapper for authenticated pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {boolean} [props.centered=false] - Whether to center content with max-width
 * @param {string} [props.maxWidth='900px'] - Max width for centered content
 * @param {string} [props.className] - Additional CSS class for main content
 */
function PageLayout({
    children,
    centered = false,
    maxWidth = '900px',
    className = ''
}) {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={`${styles.mainContent} ${className}`}>
                {centered ? (
                    <div
                        className={styles.contentWrapper}
                        style={{ maxWidth }}
                    >
                        {children}
                    </div>
                ) : (
                    children
                )}
            </main>
        </div>
    );
}

export default PageLayout;