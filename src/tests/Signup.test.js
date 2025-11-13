import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
    renderWithProviders,
    createMockUser,
    setupLocalStorageUsers,
    getLocalStorageUsers,
    getLocalStorageAuth,
} from './test-utils';
import Signup from '../pages/Signup';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Signup Component', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('Test #1: Create account with existing user ID', () => {
        it('should display error message when trying to create an account with an existing user ID', async () => {
            // Create existing user in the store
            const existingUser = createMockUser({
                id: 'johndoe',
                name: 'John Doe',
                password: 'password123',
            });

            const preloadedState = {
                users: {
                    byId: {
                        [existingUser.id]: existingUser,
                    },
                    loading: false,
                    error: null,
                },
                auth: {
                    currentUser: null,
                    isAuthenticated: false,
                },
            };

            // Add existing user to localStorage to simulate they were previously created
            setupLocalStorageUsers({ [existingUser.id]: existingUser });

            // Render the component with existing user in store
            renderWithProviders(<Signup />, { preloadedState });

            // Fill out form with existing user ID
            const user = userEvent.setup();

            const fullNameInput = screen.getByLabelText(/full name/i);
            const userIdInput = screen.getByLabelText(/user id/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /create account/i });

            await user.type(fullNameInput, 'Jane Smith');
            await user.type(userIdInput, 'johndoe'); // Using existing user ID
            await user.type(passwordInput, 'newpassword123');
            await user.click(submitButton);

            // Check for error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/this user id is already taken/i);
                expect(errorMessage).toBeInTheDocument();
            });

            // Verify navigation wasn't called
            expect(mockNavigate).not.toHaveBeenCalled();

            // Verify localStorage wasn't updated with new user (should still be old user)
            const localUsers = getLocalStorageUsers();
            expect(localUsers['johndoe']).toEqual(existingUser);

            // Verify user wasn't logged in
            const authData = getLocalStorageAuth();
            expect(authData).toBeNull();
        });
    });
});