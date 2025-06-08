import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO CRÍTICO: Variáveis de ambiente do Supabase não foram carregadas!");
  throw new Error('Configuração do Supabase incompleta.');
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Método não permitido' });
  }


  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorização ausente ou malformado.' });
  }
  const token = authHeader.split(' ')[1];

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: 'Usuário não autenticado ou token inválido.' });
  }

  try {

    const { data, error } = await supabase
      .from('agendamentos_coleta')
      .select('id, status, data_coleta, hora_coleta, endereco, materiais')
      .eq('usuario_id', user.id) 
      .order('data_coleta', { ascending: false }); 

    if (error) {
      throw error;
    }
    

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro na API ao buscar agendamentos:', err);
    return res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
  }
}
