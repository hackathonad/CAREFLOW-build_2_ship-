import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { CommandInput } from '../components/ai-command-center/CommandInput';
import { CommandResult } from '../components/ai-command-center/CommandResult';
import { CommandProcessingResult } from '../types';
import { Bot, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const AICommandCenterPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CommandProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (executeDirectly: boolean) => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const res = await aiService.sendCommand(input.trim(), executeDirectly);
      setResult(res);
    } catch (err: any) {
      console.error('AI command error:', err);
      setError(err?.message || 'Failed to communicate with AI command service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteNow = async () => {
    if (!result) return;
    try {
      setIsLoading(true);
      const res = await aiService.sendCommand(input.trim(), true);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Automation execution failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              AI Command Center
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Natural language hospital operations orchestration. Interprets directives and initiates
            verified backend workflows.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>Deterministic Execution Guardrails Active</span>
        </div>
      </div>

      {/* Input Component */}
      <CommandInput
        input={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onSelectPrompt={(p) => setInput(p)}
      />

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 text-xs text-rose-300">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <CommandResult
          result={result}
          onExecuteNow={handleExecuteNow}
          isExecuting={isLoading}
        />
      )}
    </div>
  );
};
