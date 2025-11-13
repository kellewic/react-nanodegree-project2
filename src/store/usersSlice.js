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

// Load users from _DATA.js and merge with localStorage
export const loadUsers = createAsyncThunk(
    'users/loadUsers',
    async () => {
        const staticUsers = await _getUsers();
        const localUsers = JSON.parse(localStorage.getItem('employeePolls_localUsers') || '{}');
        return { ...staticUsers, ...localUsers };
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
            const localUsers = JSON.parse(localStorage.getItem('employeePolls_localUsers') || '{}');
            localUsers[user.id] = user;
            localStorage.setItem('employeePolls_localUsers', JSON.stringify(localUsers));
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

export const { addUser } = usersSlice.actions;
export default usersSlice.reducer;