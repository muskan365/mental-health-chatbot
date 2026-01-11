import api from './api';
import {
  ForumThread,
  CreateThreadRequest,
  UpdateThreadRequest,
  ForumComment,
  CreateCommentRequest,
  ApiEnvelope,
} from '@/types/api.types';

export const forumService = {
  // Thread operations
  createThread: async (data: CreateThreadRequest): Promise<ForumThread> => {
    const response = await api.post<ApiEnvelope<ForumThread>>('/api/Forum/thread', data);
    return response.data.data;
  },

  getAllThreads: async (): Promise<ForumThread[]> => {
    const response = await api.get<ApiEnvelope<ForumThread[]>>('/api/Forum/threads');
    return response.data.data;
  },

  getThreadById: async (threadId: string): Promise<ForumThread> => {
    const response = await api.get<ApiEnvelope<ForumThread>>(`/api/Forum/thread/${threadId}`);
    return response.data.data;
  },

  updateThread: async (threadId: string, data: UpdateThreadRequest): Promise<ForumThread> => {
    const response = await api.put<ApiEnvelope<ForumThread>>(`/api/Forum/thread/${threadId}`, data);
    return response.data.data;
  },

  deleteThread: async (threadId: string): Promise<void> => {
    await api.delete(`/api/Forum/thread/${threadId}`);
  },

  // Comment operations
  createComment: async (data: CreateCommentRequest): Promise<ForumComment> => {
    const response = await api.post<ApiEnvelope<ForumComment>>('/api/Forum/comment', data);
    return response.data.data;
  },

  getThreadComments: async (threadId: string): Promise<ForumComment[]> => {
    const response = await api.get<ApiEnvelope<ForumComment[]>>(`/api/Forum/thread/${threadId}/comments`);
    return response.data.data;
  },

  deleteComment: async (commentId: string, userId: string): Promise<void> => {
    await api.delete(`/api/Forum/comment/${commentId}`, { params: { userId } });
  },
};
