// api/agendar.js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // <-- MUDANÇA: Adicionado para carregar o .env

// --- Bloco de Carregamento Padrão ---
// MUDANÇA: Removido o fallback com || e o prefixo NEXT_PUBLIC_
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verificação de segurança para garantir que as variáveis foram carregadas
if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO CRÍTICO: Variáveis de ambiente do Supabase não foram carregadas!");
  throw new Error('Configuração do Supabase incompleta. Verifique o arquivo .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);
// --- Fim do Bloco de Carregamento Padrão ---

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorização ausente ou malformado.' });
  }
  const token = authHeader.split(' ')[1];

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: 'Usuário não autenticado ou token inválido', details: userError?.message });
  }

  const { endereco, data_coleta, hora_coleta, materiais } = req.body;
  if (!endereco || !data_coleta || !hora_coleta || !materiais || materiais.length === 0) {
    return res.status(400).json({ error: 'Dados incompletos para o agendamento.' });
  }

  try {
    const agendamentoData = {
      usuario_id: user.id,
      endereco: endereco,
      data_coleta: new Date(data_coleta).toISOString().split('T')[0],
      hora_coleta: hora_coleta,
      materiais: materiais,
      status: 'pendente',
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('agendamentos_coleta')
      .insert(agendamentoData)
      .select()
      .single();

    if (insertError) throw insertError;

    return res.status(201).json({ success: true, message: 'Agendamento criado com sucesso!', agendamento: insertedData });
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    return res.status(500).json({ error: 'Erro interno no servidor ao agendar', details: err.message });
  }
}