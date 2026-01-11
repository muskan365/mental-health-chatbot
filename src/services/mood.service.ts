import api from './api';
import { MoodEntry, CreateMoodRequest, ApiEnvelope } from '@/types/api.types';

export const moodService = {
  // Log mood
  logMood: async (data: CreateMoodRequest): Promise<MoodEntry> => {
    const response = await api.post<ApiEnvelope<MoodEntry>>('/api/mood', data);
    return response.data.data;
  },

  // Get latest mood for user
  getLatestMood: async (userId: string): Promise<MoodEntry> => {
    const response = await api.get<ApiEnvelope<MoodEntry>>(`/api/mood/user/${userId}/latest`);
    return response.data.data;
  },
};
