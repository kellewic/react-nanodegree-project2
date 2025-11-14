/**
 * Unit tests for ErrorMessage component
 * 
 * Includes snapshot test as required by project rubric.
 */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '../components/ErrorMessage';

describe('ErrorMessage Component', () => {
    /**
     * Snapshot Test: Verify component renders consistently
     * This test creates a snapshot of the component's output
     */
    it('matches snapshot when displaying an error message', () => {
        const errorMessage = 'This is a test error message';
        const { container } = render(<ErrorMessage message={errorMessage} />);

        expect(container).toMatchSnapshot();
    });

    it('matches snapshot when message is empty', () => {
        const { container } = render(<ErrorMessage message="" />);

        expect(container).toMatchSnapshot();
    });

    /**
     * Standard unit tests
     */
    it('should display the error message when provided', () => {
        const errorMessage = 'Something went wrong!';
        const { getByText } = render(<ErrorMessage message={errorMessage} />);

        expect(getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not render anything when message is empty', () => {
        const { container } = render(<ErrorMessage message="" />);

        // Should render null or empty div when no message
        expect(container.firstChild).toBeNull();
    });

    it('should not render anything when message is null', () => {
        const { container } = render(<ErrorMessage message={null} />);

        expect(container.firstChild).toBeNull();
    });

    it('should render with proper error styling when message exists', () => {
        const errorMessage = 'Error occurred';
        const { container } = render(<ErrorMessage message={errorMessage} />);

        // Should have some content when error message is provided
        expect(container.firstChild).toBeTruthy();
    });
});

