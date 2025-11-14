import { useSelector } from "react-redux";
import PageLayout from "../components/PageLayout";
import LoadingScreen from "../components/LoadingScreen";

function PollDetails() {
    const usersLoading = useSelector((state) => state.users.loading);

    if (usersLoading) {
        return <LoadingScreen message="Loading Employee Polls..." />;
    }

    return (
        <PageLayout centered={true} maxWidth="900px">
            <div className="text-3xl font-bold">Poll Details</div>
        </PageLayout>
    );
}

export default PollDetails;
