import React from 'react';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';

interface CommandInputProps {
  input: string;
  onChange: (value: string) => void;
  onSubmit: (executeDirectly: boolean) => void;
  isLoading: boolean;
  onSelectPrompt: (prompt: string) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  onSelectPrompt,
}) => {
  const examplePrompts = [
    'Admit patient Rahul Sharma to Cardiology.',
    'Find a bed for patient P1005.',
    'Schedule a health checkup for Rahul.',
    'Check which inventory items are below minimum stock.',
    'Assign an ambulance to the emergency request.',
    'Create a task for the ICU manager.',
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(true);
      }
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center space-x-2.5 mb-3">
        <div className="p-2 rounded-lg bg-brand-600/10 border border-brand-500/20 text-brand-400">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">CareFlow AI Command Center</h2>
          <p className="text-xs text-slate-400">
            Tell CareFlow what needs to be done across hospital operations in plain natural language.
          </p>
        </div>
      </div>

      {/* Large Input Box */}
      <div className="relative mt-4">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "Admit patient Rahul Sharma to Cardiology." or "Dispatch an ambulance to Western Express Highway."'
          disabled={isLoading}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none font-sans"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Press Enter to analyze & execute</span>
            <span>•</span>
            <span className="text-brand-400 font-medium">Deterministic Automation Protocol</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={!input.trim() || isLoading}
              onClick={() => onSubmit(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition-colors"
            >
              Analyze Only
            </button>
            <button
              type="button"
              disabled={!input.trim() || isLoading}
              onClick={() => onSubmit(true)}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Prompt Chips */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Quick test scenarios (Click to insert):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800/60 text-slate-300 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
