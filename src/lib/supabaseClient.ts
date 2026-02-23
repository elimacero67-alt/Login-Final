import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // Esto ayuda a detectar configuración faltante temprano (dev y build).
  throw new Error(
    'Faltan variables de entorno de Supabase. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (por ejemplo en .env.local)'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
