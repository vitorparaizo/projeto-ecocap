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

  try {

    const { data, error } = await supabase
      .from('catadores')
      .select('nome, telefone, endereco');

    if (error) {
      throw error;
    }
    

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro na API ao buscar catadores:', err);
    return res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
  }
}
