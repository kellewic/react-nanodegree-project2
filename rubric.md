# Rubric

Use this project rubric to understand and assess the project criteria.

**Application Setup**

|**Criteria**|**Submission Requirements**|
|---|---|
|Is the application easy to install and start?|The application requires only npm install and npm start to install and launch.|
|Does the application include README with clear installation and launch instructions?|A README is included with the project. The README includes a description and clear instructions for installing and launching the project.|

**Login Flow**

|**Criteria**|**Submission Requirements**|
|---|---|
|Does the application have a way to log in and log out?<br><br>Does the application work correctly regardless of which person the user impersonates?|1. There should be a way for the user to impersonate/ log in as an existing user. (This could be as simple as having a login box that appears at the root of the application. The user could then select a name from the list of existing users.)<br>2. The application works correctly regardless of which user is selected.<br>3. The application allows the user to log out and log back in. The user should be logged in to submit new polling questions, vote, and view the leaderboard.<br>4. Once the user logs in, the home page is shown.<br>5. Whenever the user types something in the address bar, the user is asked to log in before the requested page is shown.|

**Application Functionality**

|**Criteria**|**Submission Requirements**|
|---|---|
|Does the home page have the desired functionality?|1. The answered and unanswered polls are both available at the root.<br>2. The user can alternate between viewing answered and unanswered polls.<br>3. The unanswered questions are shown by default.<br>4. The name of the logged in user is visible on the page.<br>5. The user can navigate to the leaderboard.<br>6. The user can navigate to the form that allows the user to create a new poll.|
|Are the polling questions listed in the correct category (Unanswered vs Answered), and do they have the desired functionality on the home page?|1. Each polling question resides in the correct category. For example, if a question hasn’t been answered by the current user, it should be in the “Unanswered” category.<br>2. A polling question links to details of that poll.<br>3. The polls in both categories are arranged from the most recently created (top) to the least recently created (bottom).|
|Are the details of each poll displayed with all of the relevant information?|1. The details of the poll are available at questions/:question_id.<br>2. When a poll is clicked on the home page, the following is shown:<br><br>- the text “Would You Rather”;<br>- the avatar of the user who posted the polling question; and<br>- the two options.<br><br>4. For answered polls, each of the two options contains the following:<br><br>- the text of the option;<br>- the number of people who voted for that option;<br>- the percentage of people who voted for that option.<br><br>6. The option selected by the logged in user should be clearly marked.<br>7. When the user is logged in, the details of the poll are shown. If the user is logged out, he/she is asked to log in before before being able to access the poll.<br>8. The application asks the user to sign in and shows a 404 page if that poll does not exist. (In other words, if a user creates a poll and then the same or another user tries to access that poll by its url, the user should be asked to sign in and then be shown a 404 page. Please keep in mind that new polls will not be accessible at their url because of the way the backend is set up in this application.)|
|Does the voting mechanism work correctly?|1. Upon voting in a poll, all of the information of the answered poll is displayed.<br>2. The user’s response is recorded and is clearly visible on the poll details page.<br>3. When the user comes back to the home page, the polling question appears in the “Answered” column.<br>4. The voting mechanism works correctly, and the data on the leaderboard changes appropriately.|
|Can users add new polls?|1. The form is available at/add.<br>2. The application shows the text “Would You Rather” and has a form for creating two options.<br>3. Upon submitting the form, a new poll is created and the user is taken to the home page.<br>4. The new polling question appears in the correct category on the home page.|
|Does the leaderboard work correctly and have the desired functionality?|1. The Leaderboard is available at/leaderboard.<br>2. Each entry on the leaderboard contains the following:<br><br>- the user’s name;<br>- the user’s avatar;<br>- the number of questions the user asked; and<br>- the number of questions the user answered.<br><br>4. Users are ordered in descending order based on the sum of the number of questions they’ve answered and the number of questions they’ve asked.|
|Is the application navigable?|1. The app contains a navigation bar that is visible on all of the pages.<br>2. The user can navigate between the page for creating new polls, and the leaderboard page, and the home page without typing the address into the address bar.|
|Does the application interact with the backend correctly?|1. The data that’s initially displayed is populated correctly from the backend.<br>2. Each user’s answer and each new poll is correctly recorded on the backend.|
|Does the code run without errors? Is the code free of warnings that resulted from not following the best practices listed in the documentation, such as using key for list items? Is the code formatted properly?|The code runs without errors. There are no warnings that resulted from not following the best practices listed in the documentation, such as using key for list items. All code is functional and formatted properly.|

**Architecture**

|**Criteria**|**Submission Requirements**|
|---|---|
|Does the store serve as the application’s single source of truth?|The store is the application’s source of truth.<br><br>Components read the necessary state from the store; they do not have their own versions of the same state.<br><br>There are no direct API calls in the components' lifecycle methods.|
|Is application state managed by Redux?|Most application state is managed by the Redux store. State-based props are mapped from the store rather than stored as component state.<br><br>Form inputs and controlled components may have some state handled by the component.|
|Does application state update correctly?|Updates are triggered by dispatching action creators to reducers.<br><br>Reducers and actions are written properly and correctly return updated state to the store.|
|Does the architecture of the application make sense?|The code is structured and organized in a logical way.<br><br>Components are modular and reusable.|

**Unit Testing**

|**Criteria**|**Submission Requirements**|
|---|---|
|Are jest, @testing-library/react, and @testing-library/jest-dom present in the project?|The package.json file should include the following under devDependencies:<br><br>1. jest<br>2. @testing-library/react<br>3. @testing-library/jest-dom|
|Can all the unit test be run by entering the npm start test command?|The application requires only npm start test in order to run all the unit tests in the project.|
|Do all the unit tests pass?|After running npm start test, all unit tests should pass. There should be no failing tests.|
|Are there at least 10 unit tests?|The project requires a minimum of 10 passing unit tests.|
|Are There two unit tests written which test the _saveQuestion() function in _DATA.js?|The following two unit tests must be present for _saveQuestion():<br><br>1. An async unit test to verify that the saved question is returned and all expected fields are populated when correctly formatted data is passed to the function.<br>2. An async unit test to verify that an error is returned if incorrect data is passed to the function.|
|Are there two unit tests written which test the _saveQuestionAnswer() function in _DATA.js?|The following two unit tests must be present for _saveQuestionAnswer():<br><br>1. An async unit test to verify that true is returned when correctly formatted data is passed to the function.<br>2. An async unit test to verify that an error is returned if incorrect data is passed to the function.|
|Is there at least one snapshot test present?|At least one test must call the toMatchSnapshot() function from jest. Doing this will generate a folder called **snapshots** where the snapshot will be stored.|
|Is there is at least one DOM test which uses the fireEvent function?|At least one unit test must use the render method from @testing-library/react to render one of your React components. The unit test should then perform some actions on the component using fireEvent such as fireEvent.click() or fireEvent.change(). After calling fireEvent, call the expect() method from jest to verify that a change occurred in the UI after the event was fired.|