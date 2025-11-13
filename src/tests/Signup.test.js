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
import { getAvatarUrl } from '../utils/user';
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

    // Helper function to set up form for testing
    const setupSignupForm = (customPreloadedState = {}) => {
        const defaultPreloadedState = {
            users: {
                byId: {},
                loading: false,
                error: null,
            },
            auth: {
                currentUser: null,
                isAuthenticated: false,
            },
        };

        // Merge custom state with defaults
        const preloadedState = {
            users: { ...defaultPreloadedState.users, ...customPreloadedState.users },
            auth: { ...defaultPreloadedState.auth, ...customPreloadedState.auth },
        };

        renderWithProviders(<Signup />, { preloadedState });

        const user = userEvent.setup();
        const fullNameInput = screen.getByLabelText(/full name/i);
        const userIdInput = screen.getByLabelText(/user id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /create account/i });

        return { user, fullNameInput, userIdInput, passwordInput, submitButton };
    };

    // Helper function for common assertions
    const assertNoAccountCreated = () => {
        expect(mockNavigate).not.toHaveBeenCalled();
        const localUsers = getLocalStorageUsers();
        expect(Object.keys(localUsers)).toHaveLength(0);
        const authData = getLocalStorageAuth();
        expect(authData).toBeNull();
    };

    describe('Test #1: Create account with existing user ID', () => {
        it('should display error message when trying to create an account with an existing user ID', async () => {
            // Create existing user in the store
            const existingUser = createMockUser({
                id: 'johndoe',
                name: 'John Doe',
                password: 'password123',
            });

            // Add existing user to localStorage to simulate they were previously created
            setupLocalStorageUsers({ [existingUser.id]: existingUser });

            // Setup form with existing user in store
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm({
                users: {
                    byId: { [existingUser.id]: existingUser },
                    loading: false,
                    error: null,
                },
            });

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

    describe('Test #2: Empty form field validation', () => {
        it('should display error message when full name is empty', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            // Remove required attribute to bypass browser validation
            fullNameInput.removeAttribute('required');

            // Leave fullName empty, fill other fields
            await user.type(userIdInput, 'johndoe');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            // Check for error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/all fields are required/i);
                expect(errorMessage).toBeInTheDocument();
            });

            assertNoAccountCreated();
        });

        it('should display error message when userId is empty', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            // Remove required attribute to bypass browser validation
            userIdInput.removeAttribute('required');

            await user.type(fullNameInput, 'Jane Smith');
            // Leave userId empty
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(/all fields are required/i);
                expect(errorMessage).toBeInTheDocument();
            });

            assertNoAccountCreated();
        });

        it('should display error message when password is empty', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            // Remove required attribute to bypass browser validation
            passwordInput.removeAttribute('required');

            await user.type(fullNameInput, 'Jane Smith');
            await user.type(userIdInput, 'johndoe');
            // Leave password empty
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(/all fields are required/i);
                expect(errorMessage).toBeInTheDocument();
            });

            assertNoAccountCreated();
        });

        it('should display error message when all fields are empty', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            // Remove required attributes to bypass browser validation
            fullNameInput.removeAttribute('required');
            userIdInput.removeAttribute('required');
            passwordInput.removeAttribute('required');

            // Submit form without filling any fields
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(/all fields are required/i);
                expect(errorMessage).toBeInTheDocument();
            });

            assertNoAccountCreated();
        });
    });

    describe('Test #3: Avatar preview functionality', () => {
        it('should show placeholder text initially', async () => {
            setupSignupForm();

            // Verify initial helper text is displayed
            expect(screen.getByText(/enter a user id to see your avatar/i)).toBeInTheDocument();
        });

        it('should not display avatar image initially', async () => {
            setupSignupForm();

            // Avatar image should not be in the document initially
            const avatar = screen.queryByAltText(/avatar preview/i);
            expect(avatar).not.toBeInTheDocument();
        });

        it('should display avatar image after entering userId and blurring field', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Type userId and blur the field
            await user.type(userIdInput, 'testuser');
            await user.tab(); // Tab away to trigger blur event

            // Avatar should now be visible
            await waitFor(() => {
                const avatar = screen.getByAltText(/avatar preview/i);
                expect(avatar).toBeInTheDocument();
                expect(avatar).toHaveAttribute('src', getAvatarUrl('testuser'));
            });
        });

        it('should update helper text after userId is entered', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Initially shows placeholder text
            expect(screen.getByText(/enter a user id to see your avatar/i)).toBeInTheDocument();

            // Type userId and blur the field
            await user.type(userIdInput, 'johndoe');
            await user.tab();

            // Helper text should change
            await waitFor(() => {
                expect(screen.getByText(/this will be your avatar/i)).toBeInTheDocument();
                expect(screen.queryByText(/enter a user id to see your avatar/i)).not.toBeInTheDocument();
            });
        });

        it('should update avatar src when userId changes', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Enter first userId
            await user.type(userIdInput, 'user1');
            await user.tab();

            await waitFor(() => {
                const avatar = screen.getByAltText(/avatar preview/i);
                expect(avatar).toHaveAttribute('src', getAvatarUrl('user1'));
            });

            // Clear and enter new userId
            await user.clear(userIdInput);
            await user.type(userIdInput, 'user2');
            await user.tab();

            await waitFor(() => {
                const avatar = screen.getByAltText(/avatar preview/i);
                expect(avatar).toHaveAttribute('src', getAvatarUrl('user2'));
            });
        });
    });

    describe('Test #4: Create new account successfully', () => {
        it('should create a new account and save it to localStorage', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            // Fill out form with valid data
            await user.type(fullNameInput, 'Jane Smith');
            await user.type(userIdInput, 'janesmith');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            // Wait for success screen to appear
            await waitFor(() => {
                expect(screen.getByText(/account created/i)).toBeInTheDocument();
            });

            // Verify user was created in localStorage with correct structure
            const localUsers = getLocalStorageUsers();
            expect(localUsers['janesmith']).toBeDefined();
            expect(localUsers['janesmith']).toEqual({
                id: 'janesmith',
                name: 'Jane Smith',
                password: 'password123',
                avatarURL: getAvatarUrl('janesmith'),
                answers: {},
                questions: [],
            });

            // Verify user was logged in
            const authData = getLocalStorageAuth();
            expect(authData).not.toBeNull();
            expect(authData.currentUser).toBe('janesmith');
            expect(authData.isAuthenticated).toBe(true);
        });

        it('should display success message with user name', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            await user.type(fullNameInput, 'John Doe');
            await user.type(userIdInput, 'johndoe');
            await user.type(passwordInput, 'test123');
            await user.click(submitButton);

            // Verify success screen shows user's name
            await waitFor(() => {
                expect(screen.getByText(/account created/i)).toBeInTheDocument();
                expect(screen.getByText(/welcome, john doe/i)).toBeInTheDocument();
            });
        });

        it('should display user avatar on success screen', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            await user.type(fullNameInput, 'Jane Smith');
            await user.type(userIdInput, 'janesmith');
            await user.type(passwordInput, 'test123');
            await user.click(submitButton);

            // Verify avatar is displayed on success screen
            await waitFor(() => {
                const avatar = screen.getByAltText(/your avatar/i);
                expect(avatar).toBeInTheDocument();
                expect(avatar).toHaveAttribute('src', getAvatarUrl('janesmith'));
            });
        });
    });

    describe('Test #5: Whitespace-only input validation', () => {
        it('should display error message when full name contains only whitespace', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            // Only whitespace
            await user.type(fullNameInput, '   ');
            await user.type(userIdInput, 'johndoe');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(/all fields are required/i);
                expect(errorMessage).toBeInTheDocument();
            });

            assertNoAccountCreated();
        });

        it('should display error message when userId contains only whitespace', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            await user.type(fullNameInput, 'Jane Smith');
            // Only whitespace
            await user.type(userIdInput, '   ');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(/all fields are required/i);
                expect(errorMessage).toBeInTheDocument();
            });

            assertNoAccountCreated();
        });

        it('should display error message when password contains only whitespace', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            await user.type(fullNameInput, 'Jane Smith');
            await user.type(userIdInput, 'johndoe');
            // Only whitespace
            await user.type(passwordInput, '   ');
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(/all fields are required/i);
                expect(errorMessage).toBeInTheDocument();
            });

            assertNoAccountCreated();
        });
    });

    describe('Test #6: Form field state changes', () => {
        it('should update full name input value when typing', async () => {
            const { user, fullNameInput } = setupSignupForm();

            // Initially empty
            expect(fullNameInput).toHaveValue('');

            // Type into the field
            await user.type(fullNameInput, 'John Doe');

            // Verify value is updated
            expect(fullNameInput).toHaveValue('John Doe');
        });

        it('should update userId input value when typing', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Initially empty
            expect(userIdInput).toHaveValue('');

            // Type into the field
            await user.type(userIdInput, 'johndoe123');

            // Verify value is updated
            expect(userIdInput).toHaveValue('johndoe123');
        });

        it('should update password input value when typing', async () => {
            const { user, passwordInput } = setupSignupForm();

            // Initially empty
            expect(passwordInput).toHaveValue('');

            // Type into the field
            await user.type(passwordInput, 'securepass456');

            // Verify value is updated
            expect(passwordInput).toHaveValue('securepass456');
        });

        it('should update all fields independently', async () => {
            const { user, fullNameInput, userIdInput, passwordInput } = setupSignupForm();

            // Type into all fields
            await user.type(fullNameInput, 'Jane Smith');
            await user.type(userIdInput, 'janesmith');
            await user.type(passwordInput, 'password123');

            // Verify all fields have correct values
            expect(fullNameInput).toHaveValue('Jane Smith');
            expect(userIdInput).toHaveValue('janesmith');
            expect(passwordInput).toHaveValue('password123');
        });

        it('should allow clearing and retyping in fields', async () => {
            const { user, fullNameInput } = setupSignupForm();

            // Type initial value
            await user.type(fullNameInput, 'Initial Name');
            expect(fullNameInput).toHaveValue('Initial Name');

            // Clear the field
            await user.clear(fullNameInput);
            expect(fullNameInput).toHaveValue('');

            // Type new value
            await user.type(fullNameInput, 'New Name');
            expect(fullNameInput).toHaveValue('New Name');
        });
    });

    describe('Test #7: UserId blur handler', () => {
        it('should trigger blur handler when userId field loses focus', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Type in userId
            await user.type(userIdInput, 'testuser');

            // Focus should still be on the input
            expect(userIdInput).toHaveFocus();

            // Tab to trigger blur
            await user.tab();

            // Focus should have moved away
            expect(userIdInput).not.toHaveFocus();
        });

        it('should not show avatar preview while typing (only after blur)', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Type userId but don't blur
            await user.type(userIdInput, 'testuser');

            // Avatar should not be visible yet (displayUserId not set)
            const avatar = screen.queryByAltText(/avatar preview/i);
            expect(avatar).not.toBeInTheDocument();

            // Now trigger blur
            await user.tab();

            // Avatar should now appear
            await waitFor(() => {
                expect(screen.getByAltText(/avatar preview/i)).toBeInTheDocument();
            });
        });

        it('should update displayUserId when clicking outside userId field', async () => {
            const { user, userIdInput, fullNameInput } = setupSignupForm();

            // Type userId
            await user.type(userIdInput, 'johndoe');

            // Avatar not shown yet
            expect(screen.queryByAltText(/avatar preview/i)).not.toBeInTheDocument();

            // Click on another field to trigger blur
            await user.click(fullNameInput);

            // Avatar should now appear
            await waitFor(() => {
                expect(screen.getByAltText(/avatar preview/i)).toBeInTheDocument();
            });
        });

        it('should update avatar when userId is changed and blurred again', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Type and blur first userId
            await user.type(userIdInput, 'firstuser');
            await user.tab();

            await waitFor(() => {
                const avatar = screen.getByAltText(/avatar preview/i);
                expect(avatar).toHaveAttribute('src', getAvatarUrl('firstuser'));
            });

            // Clear, type new userId, but don't blur yet
            await user.clear(userIdInput);
            await user.type(userIdInput, 'seconduser');

            // Avatar should still show first user
            const avatarBeforeBlur = screen.getByAltText(/avatar preview/i);
            expect(avatarBeforeBlur).toHaveAttribute('src', getAvatarUrl('firstuser'));

            // Now blur
            await user.tab();

            // Avatar should update to second user
            await waitFor(() => {
                const avatarAfterBlur = screen.getByAltText(/avatar preview/i);
                expect(avatarAfterBlur).toHaveAttribute('src', getAvatarUrl('seconduser'));
            });
        });

        it('should handle blur on empty userId field', async () => {
            const { user, userIdInput } = setupSignupForm();

            // Focus and blur without typing
            await user.click(userIdInput);
            await user.tab();

            // No avatar should appear
            expect(screen.queryByAltText(/avatar preview/i)).not.toBeInTheDocument();

            // Helper text should still show placeholder
            expect(screen.getByText(/enter a user id to see your avatar/i)).toBeInTheDocument();
        });
    });

    describe('Test #8: Navigation after signup', () => {
        it('should navigate to home page after countdown completes', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            await user.type(fullNameInput, 'Jane Smith');
            await user.type(userIdInput, 'janesmith');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            // Wait for success screen
            await waitFor(() => {
                expect(screen.getByText(/account created/i)).toBeInTheDocument();
            });

            // Wait for navigation to be called (should happen after 5 seconds)
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/');
            }, { timeout: 6000 });
        }, 10000);

        it('should display countdown starting at 5', async () => {
            const { user, fullNameInput, userIdInput, passwordInput, submitButton } = setupSignupForm();

            await user.type(fullNameInput, 'John Doe');
            await user.type(userIdInput, 'johndoe');
            await user.type(passwordInput, 'test123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/account created/i)).toBeInTheDocument();
            });

            // Verify countdown displays initial value
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText(/redirecting in/i)).toBeInTheDocument();
        });
    });
});