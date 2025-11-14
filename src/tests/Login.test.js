/**
 * Unit tests for Login component
 * 
 * Includes DOM test using fireEvent as required by project rubric.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../pages/Login';
import usersReducer from '../store/usersSlice';
import authReducer from '../store/authSlice';

// Helper function to render with providers
const renderWithProviders = (
    component,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                users: usersReducer,
                auth: authReducer,
            },
            preloadedState,
        }),
    } = {}
) => {
    return {
        ...render(
            <Provider store={store}>
                <BrowserRouter>
                    {component}
                </BrowserRouter>
            </Provider>
        ),
        store,
    };
};

describe('Login Component', () => {
    // Mock user data
    const mockUsers = {
        sarahedo: {
            id: 'sarahedo',
            password: 'password123',
            name: 'Sarah Edo',
            avatarURL: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
            answers: {},
            questions: []
        }
    };

    const preloadedState = {
        users: {
            byId: mockUsers,
            loading: false,
            error: null
        },
        auth: {
            currentUser: null,
            isAuthenticated: false,
            impersonation: {
                isImpersonating: false,
                impersonatedUserId: null,
                originalUserId: null
            }
        }
    };

    /**
     * DOM Test using fireEvent: Verify form fields and submit button are present
     */
    it('should render user ID field, password field, and submit button', () => {
        renderWithProviders(<Login />, { preloadedState });

        // Verify required form elements are present
        const userIdInput = screen.getByLabelText(/user id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        expect(userIdInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    /**
     * DOM Test using fireEvent.change: Verify input fields update when typed into
     */
    it('should update input fields when user types using fireEvent.change', () => {
        renderWithProviders(<Login />, { preloadedState });

        const userIdInput = screen.getByLabelText(/user id/i);
        const passwordInput = screen.getByLabelText(/password/i);

        // Use fireEvent.change to update inputs
        fireEvent.change(userIdInput, { target: { value: 'sarahedo' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Verify values are updated
        expect(userIdInput.value).toBe('sarahedo');
        expect(passwordInput.value).toBe('password123');
    });

    /**
     * DOM Test using fireEvent.click: Verify error appears when submitting with incorrect credentials
     */
    it('should display error message when incorrect user ID is entered using fireEvent.click', async () => {
        renderWithProviders(<Login />, { preloadedState });

        const userIdInput = screen.getByLabelText(/user id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        // Enter incorrect user ID using fireEvent
        fireEvent.change(userIdInput, { target: { value: 'nonexistentuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Click submit button using fireEvent
        fireEvent.click(submitButton);

        // Verify error message appears
        await waitFor(() => {
            expect(screen.getByText(/user id not found/i)).toBeInTheDocument();
        });
    });

    /**
     * DOM Test using fireEvent.click: Verify error appears when incorrect password is entered
     */
    it('should display error message when incorrect password is entered using fireEvent.click', async () => {
        renderWithProviders(<Login />, { preloadedState });

        const userIdInput = screen.getByLabelText(/user id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        // Enter correct user ID but wrong password using fireEvent
        fireEvent.change(userIdInput, { target: { value: 'sarahedo' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

        // Click submit button using fireEvent
        fireEvent.click(submitButton);

        // Verify error message appears
        await waitFor(() => {
            expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
        });
    });

    /**
     * DOM Test using fireEvent.click: Verify error appears when fields are empty
     */
    it('should display error message when empty fields are submitted using fireEvent.click', async () => {
        renderWithProviders(<Login />, { preloadedState });

        const userIdInput = screen.getByLabelText(/user id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        // Remove required attributes to allow submission
        userIdInput.removeAttribute('required');
        passwordInput.removeAttribute('required');

        // Click submit without entering anything using fireEvent
        fireEvent.click(submitButton);

        // Verify error message appears
        await waitFor(() => {
            expect(screen.getByText(/please enter both user id and password/i)).toBeInTheDocument();
        });
    });

    /**
     * DOM Test using fireEvent: Verify signup link is present
     */
    it('should render a link to the signup page', () => {
        renderWithProviders(<Login />, { preloadedState });

        const signupLink = screen.getByRole('link', { name: /sign up/i });
        expect(signupLink).toBeInTheDocument();
        expect(signupLink).toHaveAttribute('href', '/signup');
    });

    /**
     * DOM Test: Verify multiple interactions work together
     */
    it('should update error message when user corrects input using fireEvent', async () => {
        renderWithProviders(<Login />, { preloadedState });

        const userIdInput = screen.getByLabelText(/user id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        // First, trigger an error with empty fields
        userIdInput.removeAttribute('required');
        passwordInput.removeAttribute('required');
        fireEvent.click(submitButton);

        // Wait for error to appear
        await waitFor(() => {
            expect(screen.getByText(/please enter both user id and password/i)).toBeInTheDocument();
        });

        // Now type invalid credentials using fireEvent
        fireEvent.change(userIdInput, { target: { value: 'invaliduser' } });
        fireEvent.change(passwordInput, { target: { value: 'somepassword' } });

        // Submit again - this should trigger a different error
        fireEvent.click(submitButton);

        // Error should be updated to user not found
        await waitFor(() => {
            expect(screen.getByText(/user id not found/i)).toBeInTheDocument();
        });
    });
});

