# Employee Polls

A modern React-Redux web application that enables employees to create, answer, and track "Would You Rather" style polls within their organization. Built as part of the [Udacity React Nanodegree](https://www.udacity.com/course/react-nanodegree--nd019) program.

## Overview

Employee Polls is an internal collaboration tool designed to improve transparency and engagement within companies. Employees can create polls with two options, vote on polls from their colleagues, and compete on a leaderboard based on their participation. The application features user authentication, real-time poll tracking, user impersonation for testing, and a comprehensive leaderboard system.

## Features

- **User Authentication & Authorization**
  - Login with user ID and password
  - New user registration with avatar preview
  - Protected routes requiring authentication
  - User impersonation/switching for testing different perspectives

- **Poll Management**
  - Create "Would You Rather" polls with two options
  - View answered and unanswered polls
  - Vote on polls with instant feedback
  - Real-time vote statistics and percentages
  - Visual indication of user's selected choice

- **Interactive Dashboard**
  - Toggle between answered and unanswered polls
  - Polls sorted by most recent first
  - Author information displayed with avatars
  - Quick navigation to poll details

- **Leaderboard System**
  - Users ranked by total participation (questions asked + answered)
  - Visual badges for top 3 positions
  - Detailed statistics for each user
  - Encourages engagement through friendly competition

- **Modern UI/UX**
  - Beautiful gradient backgrounds with animated effects
  - Glass-morphism design elements
  - Responsive layout for all screen sizes
  - Smooth animations and transitions
  - Accessible design following WCAG 2.1 AA standards

- **Data Persistence**
  - Redux state management
  - LocalStorage integration for data persistence
  - Seamless synchronization between sessions

## Installation

### Steps

**Clone the repository** (or download the project files)

```
git clone <repository-url>
cd react-nanodegree-project2
```

**Install dependencies**

```
npm install
```

## Running the Application

### Development Mode

To run the app in development mode with hot reload:

```
npm run dev
```

The application will open at [http://localhost:3001](http://localhost:3001)

### Production Mode

To build and run the production version:

```
npm start
```

The application will be available at [http://localhost:3001](http://localhost:3001)

### Build Only

To create a production build without running:

```
npm run build
```

## How to Use

### Getting Started

1. **Login or Sign Up**
   - On first visit, you'll see the login page
   - Log in with existing credentials (see default users below) or click "Sign up" to create a new account
   - New users can preview their avatar by entering a user ID

2. **Home Dashboard** (`/`)
   - After logging in, you'll see the home page with two tabs:
     - **Unanswered**: Polls you haven't voted on yet (shown by default)
     - **Answered**: Polls you've already voted on
   - Click "Show" on any poll card to view details and vote

3. **Vote on Polls** (`/questions/:question_id`)
   - View the poll question with two options
   - Click on your preferred option to cast your vote
   - After voting, see real-time statistics:
     - Vote counts for each option
     - Percentage breakdown
     - Visual indication of your choice
     - Total number of votes

4. **Create a New Poll** (`/add`)
   - Click "Add Poll" in the sidebar navigation
   - Enter two options for your "Would You Rather" question
   - Submit to create your poll
   - Your new poll appears in the "Unanswered" tab for other users

5. **View Leaderboard** (`/leaderboard`)
   - Click "Leaderboard" in the sidebar to see user rankings
   - Users are ranked by total participation (questions asked + questions answered)
   - Top 3 users receive special badges
   - View statistics for each user:
     - Number of polls answered
     - Number of polls created
     - Total score

6. **User Impersonation** (Optional)
   - Click "Switch User" in the sidebar
   - Select a different user to impersonate
   - Experience the app from their perspective
   - Click "Stop" to return to your original account

7. **Logout**
   - Click "Log Out" in the sidebar to end your session

### Default Users

The application comes with pre-configured test users:

| User ID         | Password      | Name              |
| --------------- | ------------- | ----------------- |
| `sarahedo`      | `password123` | Sarah Edo         |
| `tylermcginnis` | `abc321`      | Tyler McGinnis    |
| `mtsamis`       | `xyz123`      | Mike Tsamis       |
| `zoshikanlu`    | `pass246`     | Zenobia Oshikanlu |

## Testing

This project includes comprehensive test coverage with 52 passing tests.

### Run All Tests

```bash
npm test
```

### View Test Coverage

```bash
npm test -- --coverage
```

Then open `coverage/lcov-report/index.html` in your browser.

## Implementation Notes

### Architecture & State Management

- **Redux Toolkit** for centralized state management
  - `authSlice`: User authentication and impersonation state
  - `usersSlice`: User data with async thunks for loading
  - `questionsSlice`: Poll/question data management
  - Memoized selectors for optimized performance
- **React Router v7** for client-side routing with protected routes
- **Component Architecture**: Modular, reusable components following atomic design principles

### Data Persistence

- Mock backend API in `src/data/_DATA.js`
- LocalStorage integration for data persistence across sessions
- Automatic synchronization between Redux store and LocalStorage
- Seamless merging of static and user-generated data

### UI/UX Implementation

- **Tailwind CSS v4.1** for utility-first styling
- Custom CSS modules for component-specific styles
- Glass-morphism effects with backdrop filters
- Animated gradient backgrounds
- Responsive design with mobile-first approach
- Dark-themed color palette with high contrast

### Performance Optimizations

- [React Compiler](https://react.dev/learn/react-compiler) for automatic component memoization
- Memoized Redux selectors using `createSelector` from Redux Toolkit
- Lazy loading patterns for optimal bundle size

### Code Quality

- Constants exported from slice files to avoid magic strings
- Detailed JSDoc comments for components and functions
- Consistent code formatting and organization
- No direct API calls in component lifecycle methods

### Testing

- **Jest v30** for test running and assertions
- **React Testing Library** for component testing
- **52 comprehensive tests** covering:
  - Backend function validation
  - Component rendering and interactions
  - User authentication flows
  - Form validation
  - Snapshot testing
- **66.85% code coverage** overall

## Technologies Used

### Core Technologies

- **React v19** - UI library with latest features
- **Redux Toolkit v2** - State management with modern Redux patterns
- **React Router v7** - Declarative routing for React applications
- **Vite v7** - Fast build tool and development server

### Styling

- **Tailwind CSS v4.1** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styling

### Testing

- **Jest v30** - JavaScript testing framework
- **React Testing Library v16** - Testing utilities for React components
- **@testing-library/jest-dom v6** - Custom Jest matchers for DOM
- **@testing-library/user-event v14** - User interaction simulation

### Development Tools

- **Babel** - JavaScript transpiler
- **ESLint** - Code linting
- **React Compiler** - Automatic memoization

See `package.json` for complete dependency list.

## API Backend

The project uses a mock backend API provided by Udacity, located in `src/data/_DATA.js`. The API provides the following methods:

- `_getUsers()` - Retrieve all users
- `_getQuestions()` - Retrieve all questions/polls
- `_saveQuestion(question)` - Save a new poll
- `_saveQuestionAnswer(answer)` - Save a user's vote

Data persists across sessions using LocalStorage, with new users and polls automatically synced.

## Contributing

This is an educational project and is not open for contributions. However, feel free to fork and modify for your own learning purposes.

## License

This project was created for educational purposes as part of Udacity's React Nanodegree program.

## Acknowledgments

- Udacity for the project requirements and starter code
- [Pravatar](https://pravatar.cc/) for avatar generation
- The React and Redux communities for excellent documentation and support
