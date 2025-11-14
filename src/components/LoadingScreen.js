import styles from '../styles/LoadingScreen.module.css';
import logo from '../images/logo.png';

/**
 * Loading screen component with spinner animation
 * Displays during data fetching operations
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Optional loading message to display
 * @returns {JSX.Element} LoadingScreen component
 */
function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img
            src={logo}
            alt="Employee Polls"
            className={styles.logo}
          />
        </div>

        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>

        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;

