// Common API response wrapper
export interface ApiEnvelope<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  department?: string;
  year?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  department: string;
  year: string;
}

export interface AuthUserData {
  userId: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}

export type AuthResponseEnvelope = ApiEnvelope<AuthUserData>;

// Assessment Types
export interface AssessmentScoresSummary {
  userId: string;
  phq9Score: number;
  phq9Severity: string;
  phq9Date: string;
  gad7Score: number;
  gad7Severity: string;
  gad7Date: string;
}

export interface AssessmentSubmission {
  userId: string;
  type: string; // backend expects string discriminator
  score: number;
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  type: string;
  score: number;
  severity: string;
  createdAt: string;
}

// Chat Types
export interface ChatMessage {
  sender: string;
  text: string;
  sentiment: string;
  timestamp: string;
}

export interface ChatSessionDetail {
  id: string;
  userId: string;
  messages: ChatMessage[];
  sessionStart: string;
  sessionEnd: string;
  detectedStressLevel: string;
}

export interface ChatSessionSummary {
  id: string;
  userId: string;
  messageCount: number;
  sessionStart: string;
  sessionEnd: string;
  detectedStressLevel: string;
}

export interface CreateChatSessionRequest {
  userId: string;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
}

export interface SendMessageResponse {
  sessionId: string;
  botReply: string;
  sentiment: string;
  stressLevel: string;
  timestamp: string;
}

// Forum Types
export interface ForumThread {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdByName?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
  likes?: number;
}

export interface CreateThreadRequest {
  title: string;
  description: string;
  createdBy: string;
  tags: string[];
}

export interface UpdateThreadRequest {
  title: string;
  description: string;
  tags: string[];
}

export interface ForumComment {
  id: string;
  threadId: string;
  userId: string;
  userName?: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCommentRequest {
  threadId: string;
  userId: string;
  message: string;
}

// Mood Types
export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  note: string;
  createdAt: string;
}

export interface CreateMoodRequest {
  userId: string;
  mood: string;
  note: string;
}
