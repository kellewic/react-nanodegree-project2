import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/Home.module.css";

function Home() {
  const usersLoading = useSelector((state) => state.users.loading);

  if (usersLoading) {
    return <LoadingScreen message="Loading Employee Polls..." />;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="text-3xl font-bold">Home</div>
      </main>
    </div>
  );
}

export default Home;
