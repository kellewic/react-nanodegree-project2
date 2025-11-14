import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import authReducer from './authSlice';
import questionsReducer from './questionsSlice';

export const store = configureStore({
    reducer: {
        users: usersReducer,
        auth: authReducer,
        questions: questionsReducer,
    },
});