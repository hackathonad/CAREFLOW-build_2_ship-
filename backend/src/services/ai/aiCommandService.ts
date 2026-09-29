import { AIProviderService } from './aiProviderService.js';
import { AutomationEngine } from '../automation/automationEngine.js';
import {
  AICommandResponse,
  CommandExecutionResult,
} from '../../types/index.js';

export interface CommandProcessingResult {
  parsed: AICommandResponse;
  execution: CommandExecutionResult | null;
  status: 'executed' | 'missing_requirements' | 'analyzed_only' | 'unrecognized';
  message: string;
  providerUsed?: string;
  modelUsed?: string;
}

export class AICommandService {
  public static async handleCommand(
    message: string,
    execute: boolean = true
  ): Promise<CommandProcessingResult> {
    // 1. Natural language understanding via AIProviderService (Gemini -> Groq -> Deterministic NLP)
    const { parsed, providerUsed, modelUsed } = await AIProviderService.parseCommand(message);

    // 2. Unrecognized intent check
    if (parsed.intent === 'unknown') {
      return {
        parsed,
        execution: null,
        status: 'unrecognized',
        message: 'Could not classify into an authorized operational automation workflow.',
        providerUsed,
        modelUsed,
      };
    }

    // 3. Critical verification: if missing information is identified, NEVER execute
    if (parsed.missingInformation.length > 0) {
      return {
        parsed,
        execution: null,
        status: 'missing_requirements',
        message: `Action paused: missing required operational parameters (${parsed.missingInformation.join(', ')}).`,
        providerUsed,
        modelUsed,
      };
    }

    // 4. If execution was explicitly requested
    if (execute) {
      const executionResult = await AutomationEngine.processCommand(parsed);
      return {
        parsed,
        execution: executionResult,
        status: executionResult.success ? 'executed' : 'missing_requirements',
        message: executionResult.message,
        providerUsed,
        modelUsed,
      };
    }

    // 5. Analysis only (preview mode)
    return {
      parsed,
      execution: null,
      status: 'analyzed_only',
      message: 'Request analyzed successfully. Operational actions proposed.',
      providerUsed,
      modelUsed,
    };
  }
}
