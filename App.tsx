
import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';

const App: React.FC = () => {
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  const handleSuccessfulSubmission = () => {
    setSubmissionSuccess(true);
  };

  const resetForm = () => {
    setSubmissionSuccess(false);
  };

  return (
    <div className="container mx-auto p-6 md:p-8 bg-white rounded-lg shadow-xl max-w-lg w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        User Feedback
      </h1>
      {submissionSuccess ? (
        <div className="text-center p-8 bg-green-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold text-green-700 mb-4">Thank you for your feedback!</p>
          <p className="text-gray-600">We appreciate you taking the time to share your thoughts.</p>
          <button
            onClick={resetForm}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <FeedbackForm onSubmitSuccess={handleSuccessfulSubmission} />
      )}
    </div>
  );
};

export default App;
