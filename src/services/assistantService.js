/**
 * AeroLens AI - Assistant Service
 * Natural language AI copilot for environmental intelligence queries.
 * Integrates with Azure OpenAI / FastAPI LLM endpoints.
 */

import { API_CONFIG, delay } from './apiConfig';
import { mockSuggestedQuestions, mockAssistantResponses, defaultAssistantResponse } from '../data/mockAssistantData';

export const assistantService = {
  /**
   * Return prompt recommendations
   */
  getSuggestedQuestions() {
    return mockSuggestedQuestions;
  },

  /**
   * Submit query to AeroLens AI Assistant
   */
  async askQuestion(query) {
    if (API_CONFIG.USE_MOCK_DATA) {
      // Simulate realistic AI reasoning delay (400ms)
      await delay(400);

      const normalizedQuery = query.toLowerCase().trim();
      
      // Match query against known knowledgebase keys
      for (const [key, answer] of Object.entries(mockAssistantResponses)) {
        if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
          return {
            query,
            response: answer,
            model: 'AeroLens-GeoEnsemble-v2.4 (Mock Engine)',
            timestamp: new Date().toISOString(),
            confidence: 0.94,
          };
        }
      }

      // Fallback response generator
      return {
        query,
        response: defaultAssistantResponse(query),
        model: 'AeroLens-GeoEnsemble-v2.4 (Mock Engine)',
        timestamp: new Date().toISOString(),
        confidence: 0.91,
      };
    }

    // Future Azure OpenAI / FastAPI Endpoint
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });
    if (!res.ok) throw new Error('Failed to query assistant');
    return await res.json();
  }
};
