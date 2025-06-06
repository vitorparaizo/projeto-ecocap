import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Supabase URL e/ou Key não configurados!');
  throw new Error('Configuração do Supabase incompleta');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ 
      error: 'Método não permitido',
      allowed_methods: ['POST']
    });
  }

  const { endereco, data_coleta, hora_coleta, materiais } = req.body;

  // Recuperar o usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(req.headers.authorization);

  if (userError || !user) {
    return res.status(401).json({ 
      error: 'Usuário não autenticado ou token inválido',
      details: userError?.message
    });
  }

  if (!endereco || !data_coleta || !hora_coleta || !materiais) {
    return res.status(400).json({ 
      error: 'Dados incompletos',
      required_fields: {
        endereco: 'string (obrigatório)',
        data_coleta: 'string (formato YYYY-MM-DD)',
        hora_coleta: 'string (formato HH:MM)',
        materiais: 'array ou string separada por vírgulas'
      },
      received: req.body
    });
  }

  try {
    const agendamentoData = {
      usuario_id: user.id,
      endereco: endereco,
      data_coleta: new Date(data_coleta).toISOString().split('T')[0],
      hora_coleta: hora_coleta,
      materiais: Array.isArray(materiais) ? materiais : materiais.split(','),
      status: 'pendente',
      ponto_coleta: 'A definir',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('agendamentos_coleta')
      .insert([agendamentoData])
      .select();

    if (insertError) {
      console.error('Erro ao inserir agendamento:', insertError);
      return res.status(500).json({ 
        error: 'Erro ao criar agendamento',
        details: insertError.message
      });
    }

    return res.status(201).json({ 
      success: true,
      message: 'Agendamento criado com sucesso!',
      agendamento: insertedData[0]
    });

  } catch (err) {
    console.error('Erro geral no servidor:', err);
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: err.message
    });
  }
}
