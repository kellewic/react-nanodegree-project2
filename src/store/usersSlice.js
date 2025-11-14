/**
 * This slice is responsible for managing user state.
 * 
 *   References:
 *   - https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice
 *   - https://redux-toolkit.js.org/api/createAsyncThunk
 *   - https://redux-toolkit.js.org/api/createSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getUsers } from '../data/_DATA';

export const USERS_STORAGE_KEY = 'employeePolls_localUsers';

// Load users from _DATA.js and merge with localStorage
export const loadUsers = createAsyncThunk(
    'users/loadUsers',
    async () => {
        const staticUsers = await _getUsers();
        const localUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');

        // Merge users
        const mergedUsers = { ...staticUsers, ...localUsers };

        // Normalize all users to ensure they have required properties
        const normalizedUsers = {};
        for (const userId in mergedUsers) {
            normalizedUsers[userId] = {
                ...mergedUsers[userId],
                // Ensure answers property exists
                answers: mergedUsers[userId].answers || {},
                // Ensure questions property exists
                questions: mergedUsers[userId].questions || []
            };
        }

        // Save normalized users back to localStorage to fix any missing properties
        // Only save non-static users (users that were added locally)
        const localOnlyUsers = {};
        for (const userId in normalizedUsers) {
            if (!staticUsers[userId]) {
                localOnlyUsers[userId] = normalizedUsers[userId];
            }
        }
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(localOnlyUsers));

        return normalizedUsers;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        byId: {},
        loading: false,
        error: null
    },
    reducers: {
        addUser: (state, action) => {
            const user = action.payload;
            state.byId[user.id] = user;

            // Also save to localStorage
            const localUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
            localUsers[user.id] = user;
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(localUsers));
        },
        addQuestionToUser: (state, action) => {
            const { userId, questionId } = action.payload;

            // Update Redux state
            if (state.byId[userId]) {
                state.byId[userId].questions = [
                    ...(state.byId[userId].questions || []),
                    questionId
                ];

                // Update localStorage
                const localUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');

                // Get user from localStorage or from current state
                const userToUpdate = localUsers[userId] || state.byId[userId];

                localUsers[userId] = {
                    ...userToUpdate,
                    questions: [
                        ...(userToUpdate.questions || []),
                        questionId
                    ]
                };

                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(localUsers));
            }
        },
        addAnswerToUser: (state, action) => {
            const { userId, questionId, answer } = action.payload;

            // Update Redux state
            if (state.byId[userId]) {
                state.byId[userId].answers = {
                    ...(state.byId[userId].answers || {}),
                    [questionId]: answer
                };

                // Update localStorage
                const localUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');

                // Get user from localStorage or from current state
                const userToUpdate = localUsers[userId] || state.byId[userId];

                localUsers[userId] = {
                    ...userToUpdate,
                    answers: {
                        ...(userToUpdate.answers || {}),
                        [questionId]: answer
                    }
                };

                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(localUsers));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.byId = action.payload;
            })
            .addCase(loadUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { addUser, addQuestionToUser, addAnswerToUser } = usersSlice.actions;
export default usersSlice.reducer;