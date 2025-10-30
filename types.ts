
export interface FeedbackFormData {
  name: string;
  email: string;
  phone?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
