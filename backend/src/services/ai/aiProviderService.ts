import { config } from '../../config/index.js';
import { GeminiService } from './geminiService.js';
import { GroqService } from './groqService.js';
import { AICommandResponse } from '../../types/index.js';

export interface AIProviderResult {
  parsed: AICommandResponse;
  providerUsed: 'gemini' | 'groq' | 'deterministic_nlp';
  modelUsed: string;
}

export class AIProviderService {
  public static async parseCommand(message: string): Promise<AIProviderResult> {
    const primary = config.aiProvider;
    const fallback = config.aiFallbackProvider;

    // Helper to run a specific provider
    const runProvider = async (
      provider: 'gemini' | 'groq'
    ): Promise<AIProviderResult | null> => {
      if (provider === 'gemini' && config.hasGemini) {
        try {
          const result = await GeminiService.parseCommand(message);
          if (result) {
            return {
              parsed: result,
              providerUsed: 'gemini',
              modelUsed: 'gemini-3.5-flash',
            };
          }
        } catch (err: any) {
          console.warn('Gemini provider error, proceeding to fallback:', err?.message || err);
        }
      }

      if (provider === 'groq' && config.hasGroq) {
        try {
          const result = await GroqService.parseCommand(message);
          if (result) {
            return {
              parsed: result,
              providerUsed: 'groq',
              modelUsed: 'openai/gpt-oss-120b',
            };
          }
        } catch (err: any) {
          console.warn('Groq provider error, proceeding to fallback:', err?.message || err);
        }
      }

      return null;
    };

    // 1. Try Primary Provider
    if (primary === 'gemini' || primary === 'groq') {
      const primaryRes = await runProvider(primary);
      if (primaryRes) {
        return primaryRes;
      }
    }

    // 2. Try Fallback Provider
    if (fallback === 'gemini' || fallback === 'groq') {
      if (fallback !== primary) {
        console.log(`⚡ Switching to AI fallback provider: ${fallback}`);
        const fallbackRes = await runProvider(fallback);
        if (fallbackRes) {
          return fallbackRes;
        }
      }
    }

    // 3. Resilient Deterministic NLP Engine Fallback
    console.log('🛡️ Utilizing deterministic hospital operations NLP engine fallback.');
    const deterministicParsed = GeminiService.deterministicNLPParser(message);
    return {
      parsed: deterministicParsed,
      providerUsed: 'deterministic_nlp',
      modelUsed: 'rule-based-nlp-engine',
    };
  }
}
