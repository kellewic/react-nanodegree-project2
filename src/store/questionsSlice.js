/**
 * This slice is responsible for managing questions state.
 * Follows the same pattern as usersSlice - loads from _DATA.js and merges with localStorage
 * 
 *   References:
 *   - https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice
 *   - https://redux-toolkit.js.org/api/createAsyncThunk
 *   - https://redux-toolkit.js.org/api/createSlice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getQuestions } from '../data/_DATA';

export const QUESTIONS_STORAGE_KEY = 'employeePolls_localQuestions';

// Load questions from _DATA.js and merge with localStorage
export const loadQuestions = createAsyncThunk(
    'questions/loadQuestions',
    async () => {
        const staticQuestions = await _getQuestions();
        const localQuestions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '{}');
        // Merge: localStorage questions override/add to static questions
        return { ...staticQuestions, ...localQuestions };
    }
);

const questionsSlice = createSlice({
    name: 'questions',
    initialState: {
        byId: {},
        loading: false,
        error: null
    },
    reducers: {
        addQuestion: (state, action) => {
            const question = action.payload;
            state.byId[question.id] = question;

            // Also save to localStorage
            const localQuestions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '{}');
            localQuestions[question.id] = question;
            localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(localQuestions));
        },
        addAnswerToQuestion: (state, action) => {
            const { questionId, option, userId } = action.payload;

            // Update Redux state
            if (state.byId[questionId]) {
                const question = state.byId[questionId];
                if (question[option]) {
                    question[option].votes = [...question[option].votes, userId];
                }

                // Update localStorage
                const localQuestions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '{}');

                // Get question from localStorage or from current state
                const questionToUpdate = localQuestions[questionId] || state.byId[questionId];

                localQuestions[questionId] = {
                    ...questionToUpdate,
                    [option]: {
                        ...questionToUpdate[option],
                        votes: [...questionToUpdate[option].votes, userId]
                    }
                };

                localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(localQuestions));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadQuestions.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.byId = action.payload;
            })
            .addCase(loadQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { addQuestion, addAnswerToQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;

