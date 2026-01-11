import api from './api';
import { AssessmentSubmission, AssessmentRecord, AssessmentScoresSummary, ApiEnvelope } from '@/types/api.types';

export const assessmentService = {
  // Get user's assessment scores
  getScores: async (userId: string): Promise<AssessmentScoresSummary> => {
    const response = await api.get<ApiEnvelope<AssessmentScoresSummary>>(`/api/Assessment/user/${userId}/scores`);
    return response.data.data;
  },

  // Submit assessment (generic)
  submitAssessment: async (data: AssessmentSubmission): Promise<AssessmentRecord> => {
    const response = await api.post<ApiEnvelope<AssessmentRecord>>('/api/Assessment/submit', data);
    return response.data.data;
  },

  // Submit PHQ9
  submitPHQ9: async (data: Omit<AssessmentSubmission, 'type'>): Promise<AssessmentRecord> => {
    const response = await api.post<ApiEnvelope<AssessmentRecord>>('/api/Assessment/submit', {
      ...data,
      type: 'PHQ-9',
    });
    return response.data.data;
  },

  // Submit GAD7
  submitGAD7: async (data: Omit<AssessmentSubmission, 'type'>): Promise<AssessmentRecord> => {
    const response = await api.post<ApiEnvelope<AssessmentRecord>>('/api/Assessment/submit', {
      ...data,
      type: 'GAD-7',
    });
    return response.data.data;
  },

  // Calculate severity level
  getSeverity: (score: number, type: 'PHQ9' | 'GAD7'): string => {
    if (type === 'PHQ9') {
      if (score <= 4) return 'Minimal';
      if (score <= 9) return 'Mild';
      if (score <= 14) return 'Moderate';
      if (score <= 19) return 'Moderately Severe';
      return 'Severe';
    } else {
      // GAD7
      if (score <= 4) return 'Minimal';
      if (score <= 9) return 'Mild';
      if (score <= 14) return 'Moderate';
      return 'Severe';
    }
  },
};
