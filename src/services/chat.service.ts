import api from './api';
import {
  ChatSessionDetail,
  ChatSessionSummary,
  SendMessageRequest,
  SendMessageResponse,
  CreateChatSessionRequest,
  ApiEnvelope,
} from '@/types/api.types';

export const chatService = {
  // Create new chat session
  createSession: async (data: CreateChatSessionRequest): Promise<ChatSessionDetail> => {
    const response = await api.post<ApiEnvelope<ChatSessionDetail>>('/api/Chat/session', data);
    return response.data.data;
  },

  // Send message
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await api.post<ApiEnvelope<SendMessageResponse>>('/api/Chat/message', data);
    return response.data.data;
  },

  // Get session by ID
  getSession: async (sessionId: string): Promise<ChatSessionDetail> => {
    const response = await api.get<ApiEnvelope<ChatSessionDetail>>(`/api/Chat/session/${sessionId}`);
    return response.data.data;
  },

  // Get all sessions for user (userId passed as query param)
  getSessions: async (userId: string): Promise<ChatSessionSummary[]> => {
    const response = await api.get<ApiEnvelope<ChatSessionSummary[]>>(`/api/Chat/sessions`, {
      params: { userId },
    });
    return response.data.data;
  },

  // Delete session
  deleteSession: async (sessionId: string, userId: string): Promise<void> => {
    await api.delete(`/api/Chat/session/${sessionId}/${userId}`);
  },
};
