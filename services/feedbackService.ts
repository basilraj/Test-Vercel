
import { FeedbackFormData, ApiResponse } from '../types';

/**
 * Submits feedback data to the backend API.
 * @param data The feedback data (name, email, phone).
 * @returns A promise that resolves to an ApiResponse indicating success or failure.
 */
export const submitFeedback = async (data: FeedbackFormData): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/submit-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json() as ApiResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'An unknown error occurred during submission.' };
  }
};
