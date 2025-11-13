import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/global.js";
import { loadUsers } from "./store/usersSlice.js";
import "./styles/shared.css";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import NotFound from "./pages/NotFound.js";
import RequireAuth from "./components/RequireAuth.js";

// Load initial data
store.dispatch(loadUsers());

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <Routes>
                    {/* Protected routes */}
                    <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />

                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Catch all routes */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Provider>
        </BrowserRouter>
    </StrictMode>
);