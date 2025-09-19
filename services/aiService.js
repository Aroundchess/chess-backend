const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';

    // Debug logging
    console.log('API Key exists:', !!this.apiKey);
    console.log('API Key length:', this.apiKey ? this.apiKey.length : 0);
  }

  async analyzeChessPosition(fen, question) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = this.buildChessPrompt(fen, question);

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a chess grandmaster and expert analyst. You understand FEN notation perfectly and can analyze chess positions in detail. Provide clear, accurate, and helpful analysis of chess positions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        analysis: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.status >= 500) {
        throw new Error('OpenAI service temporarily unavailable');
      } else {
        throw new Error('Failed to analyze position with AI');
      }
    }
  }

  buildChessPrompt(fen, question) {
    return `
Chess Position Analysis Request:

FEN: ${fen}

Question: ${question}

Please analyze this chess position and answer the question. Consider:
- Current piece placement and material balance
- King safety and potential threats
- Tactical patterns and combinations
- Strategic themes and positional factors
- Possible next moves and their consequences

Provide a clear and educational response that helps understand the position.
    `.trim();
  }
}

module.exports = new AIService();