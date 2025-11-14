/**
 * Unit tests for _DATA.js backend functions
 * 
 * These tests verify the behavior of _saveQuestion and _saveQuestionAnswer
 * functions as required by the project rubric.
 */
import { _saveQuestion, _saveQuestionAnswer } from '../data/_DATA';

describe('_DATA.js Backend Functions', () => {
    /**
     * Tests for _saveQuestion function
     */
    describe('_saveQuestion', () => {
        /**
         * Test 1: Verify that _saveQuestion returns the saved question with all expected fields
         * when correctly formatted data is passed to the function.
         */
        it('should return the saved question with all expected fields when correctly formatted data is passed', async () => {
            // Create a valid question object
            const validQuestion = {
                optionOneText: 'Work from home',
                optionTwoText: 'Work from office',
                author: 'sarahedo'
            };

            // Save question
            const result = await _saveQuestion(validQuestion);

            // Verify expected fields are present and populated
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('author');
            expect(result).toHaveProperty('optionOne');
            expect(result).toHaveProperty('optionTwo');

            // Verify id is a non-empty string
            expect(typeof result.id).toBe('string');
            expect(result.id.length).toBeGreaterThan(0);

            // Verify timestamp is a number and reasonable (recent)
            expect(typeof result.timestamp).toBe('number');
            expect(result.timestamp).toBeGreaterThan(0);
            expect(result.timestamp).toBeLessThanOrEqual(Date.now());

            // Verify author matches input
            expect(result.author).toBe(validQuestion.author);

            // Verify optionOne structure and content
            expect(result.optionOne).toHaveProperty('text');
            expect(result.optionOne).toHaveProperty('votes');
            expect(result.optionOne.text).toBe(validQuestion.optionOneText);
            expect(Array.isArray(result.optionOne.votes)).toBe(true);
            expect(result.optionOne.votes).toHaveLength(0); // New questions start with no votes

            // Verify optionTwo structure and content
            expect(result.optionTwo).toHaveProperty('text');
            expect(result.optionTwo).toHaveProperty('votes');
            expect(result.optionTwo.text).toBe(validQuestion.optionTwoText);
            expect(Array.isArray(result.optionTwo.votes)).toBe(true);
            expect(result.optionTwo.votes).toHaveLength(0); // New questions start with no votes
        });

        /**
         * Test 2: Verify _saveQuestion returns error when incorrect data is passed
         */
        it('should return an error when optionOneText is missing', async () => {
            // Create invalid question missing optionOneText
            const invalidQuestion = {
                optionTwoText: 'Work from office',
                author: 'sarahedo'
            };

            // Expect promise to reject
            await expect(_saveQuestion(invalidQuestion)).rejects.toEqual(
                "Please provide optionOneText, optionTwoText, and author"
            );
        });

        it('should return an error when optionTwoText is missing', async () => {
            // Create invalid question missing optionTwoText
            const invalidQuestion = {
                optionOneText: 'Work from home',
                author: 'sarahedo'
            };

            // Expect promise to reject
            await expect(_saveQuestion(invalidQuestion)).rejects.toEqual(
                "Please provide optionOneText, optionTwoText, and author"
            );
        });

        it('should return an error when author is missing', async () => {
            // Create invalid question missing author
            const invalidQuestion = {
                optionOneText: 'Work from home',
                optionTwoText: 'Work from office'
            };

            // Expect promise to reject
            await expect(_saveQuestion(invalidQuestion)).rejects.toEqual(
                "Please provide optionOneText, optionTwoText, and author"
            );
        });

        it('should return an error when all fields are missing', async () => {
            // Create completely invalid question (empty object)
            const invalidQuestion = {};

            // Expect promise to reject
            await expect(_saveQuestion(invalidQuestion)).rejects.toEqual(
                "Please provide optionOneText, optionTwoText, and author"
            );
        });
    });

    /**
     * Tests for _saveQuestionAnswer function
     */
    describe('_saveQuestionAnswer', () => {
        /**
         * Test 3: Verify _saveQuestionAnswer returns true when correctly formatted
         * data is passed to the function.
         */
        it('should return true when correctly formatted data is passed', async () => {
            // Create a valid answer object
            const validAnswer = {
                authedUser: 'sarahedo',
                qid: '8xf0y6ziyjabvozdd253nd',
                answer: 'optionOne'
            };

            // Save answer
            const result = await _saveQuestionAnswer(validAnswer);

            // Verify true is returned
            expect(result).toBe(true);
        });

        it('should return true when answering with optionTwo', async () => {
            // Create a valid answer object for optionTwo
            const validAnswer = {
                authedUser: 'tylermcginnis',
                qid: '6ni6ok3ym7mf1p33lnez',
                answer: 'optionTwo'
            };

            // Save answer
            const result = await _saveQuestionAnswer(validAnswer);

            // Verify true is returned
            expect(result).toBe(true);
        });

        /**
         * Test 4: Verify _saveQuestionAnswer returns error when incorrect
         * data is passed to the function.
         */
        it('should return an error when authedUser is missing', async () => {
            // Create invalid answer missing authedUser
            const invalidAnswer = {
                qid: '8xf0y6ziyjabvozdd253nd',
                answer: 'optionOne'
            };

            // Expect promise to reject
            await expect(_saveQuestionAnswer(invalidAnswer)).rejects.toEqual(
                "Please provide authedUser, qid, and answer"
            );
        });

        it('should return an error when qid is missing', async () => {
            // Create invalid answer missing qid
            const invalidAnswer = {
                authedUser: 'sarahedo',
                answer: 'optionOne'
            };

            // Expect promise to reject
            await expect(_saveQuestionAnswer(invalidAnswer)).rejects.toEqual(
                "Please provide authedUser, qid, and answer"
            );
        });

        it('should return an error when answer is missing', async () => {
            // Create invalid answer missing answer field
            const invalidAnswer = {
                authedUser: 'sarahedo',
                qid: '8xf0y6ziyjabvozdd253nd'
            };

            // Expect promise to reject
            await expect(_saveQuestionAnswer(invalidAnswer)).rejects.toEqual(
                "Please provide authedUser, qid, and answer"
            );
        });

        it('should return an error when all fields are missing', async () => {
            // Create completely invalid answer (empty object)
            const invalidAnswer = {};

            // Expect promise to reject
            await expect(_saveQuestionAnswer(invalidAnswer)).rejects.toEqual(
                "Please provide authedUser, qid, and answer"
            );
        });
    });
});

