import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, rol } = req.body;

  // Validaciones rápidas
  if (!email || !password || !rol) {
    return res.status(400).json({ error: 'Faltan datos (email, password o rol)' });
  }

  try {
    // Crear usuario en Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userError) {
      console.error('Error creando usuario:', userError.message);
      return res.status(500).json({ error: userError.message });
    }

    // Insertar usuario en staff_roles
    const { error: dbError } = await supabaseAdmin
      .from('staff_roles')
      .insert({ email, rol });

    if (dbError) {
      console.error('Error insertando en staff_roles:', dbError.message);
      return res.status(500).json({ error: dbError.message });
    }

    return res.status(200).json({ success: true, user: userData });
  } catch (err) {
    console.error('Error general:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
