import { useSelector } from "react-redux";
import PageLayout from "../components/PageLayout";
import LoadingScreen from "../components/LoadingScreen";

function AddPoll() {
    const usersLoading = useSelector((state) => state.users.loading);

    if (usersLoading) {
        return <LoadingScreen message="Loading Employee Polls..." />;
    }

    return (
        <PageLayout centered={true} maxWidth="900px">
            <div className="text-3xl font-bold">Add Poll</div>
        </PageLayout>
    );
}

export default AddPoll;
