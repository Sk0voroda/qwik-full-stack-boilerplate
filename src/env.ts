import { z } from 'zod';

const envVariables = z.object({
  PUBLIC_SUPABASE_URL: z.string(),
  PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

envVariables.parse(process.env);

declare global {
  interface ImportMetaEnv extends z.infer<typeof envVariables> {}
}
