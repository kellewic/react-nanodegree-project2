import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/AddPoll.module.css";

function AddPoll() {
    const usersLoading = useSelector((state) => state.users.loading);

    if (usersLoading) {
        return <LoadingScreen message="Loading Employee Polls..." />;
    }

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className="text-3xl font-bold">Add Poll</div>
            </main>
        </div>
    );
}

export default AddPoll;
