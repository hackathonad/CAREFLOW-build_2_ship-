import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  AI_PROVIDER: z.enum(['gemini', 'groq']).default('gemini'),
  AI_FALLBACK_PROVIDER: z.enum(['groq', 'gemini', 'none']).default('groq'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GROQ_API_KEY: z.string().optional().default(''),
  SUPABASE_URL: z.string().optional().default(''),
  SUPABASE_ANON_KEY: z.string().optional().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
  GOV_DATA_API_KEY: z.string().optional().default(''),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const config = {
  port: parsedEnv.data.PORT,
  nodeEnv: parsedEnv.data.NODE_ENV,
  frontendUrl: parsedEnv.data.FRONTEND_URL,
  aiProvider: parsedEnv.data.AI_PROVIDER,
  aiFallbackProvider: parsedEnv.data.AI_FALLBACK_PROVIDER,
  geminiApiKey: parsedEnv.data.GEMINI_API_KEY,
  groqApiKey: parsedEnv.data.GROQ_API_KEY,
  supabaseUrl: parsedEnv.data.SUPABASE_URL,
  supabaseAnonKey: parsedEnv.data.SUPABASE_ANON_KEY,
  supabaseServiceKey: parsedEnv.data.SUPABASE_SERVICE_ROLE_KEY,
  govDataApiKey: parsedEnv.data.GOV_DATA_API_KEY,
  hasSupabase: Boolean(parsedEnv.data.SUPABASE_URL && parsedEnv.data.SUPABASE_ANON_KEY),
  hasGemini: Boolean(parsedEnv.data.GEMINI_API_KEY && parsedEnv.data.GEMINI_API_KEY.trim() !== ''),
  hasGroq: Boolean(parsedEnv.data.GROQ_API_KEY && parsedEnv.data.GROQ_API_KEY.trim() !== ''),
};
