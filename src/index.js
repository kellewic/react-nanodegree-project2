import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/global.js";
import { loadUsers } from "./store/usersSlice.js";
import { loadQuestions } from "./store/questionsSlice.js";
import "./styles/shared.css";
import Home from "./pages/Home.js";
import AddPoll from "./pages/AddPoll.js";
import ViewPoll from "./pages/ViewPoll.js";
import Leaderboard from "./pages/Leaderboard.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import NotFound from "./pages/NotFound.js";
import RequireAuth from "./components/RequireAuth.js";

// Load initial data
store.dispatch(loadUsers());
store.dispatch(loadQuestions());

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <Routes>
                    {/* Protected routes */}
                    <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="/add" element={<RequireAuth><AddPoll /></RequireAuth>} />
                    <Route path="/questions/:question_id" element={<RequireAuth><ViewPoll /></RequireAuth>} />
                    <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />

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