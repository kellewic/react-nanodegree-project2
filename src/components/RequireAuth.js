import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../store/selectors";
import UnauthenticatedPage from "../pages/UnauthenticatedPage";

/**
 * Wrapper component that requires authentication to access child routes.
 * Shows a "please log in" screen if not authenticated.
 */
function RequireAuth({ children }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <UnauthenticatedPage returnUrl={location.pathname} />;
    }

    return children;
}

export default RequireAuth;