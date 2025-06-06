import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL e Key devem ser configurados');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, endereco, data_coleta, hora_coleta, materiais } = req.body;

  // Validação dos dados
  if (!email || !endereco || !data_coleta || !hora_coleta || !materiais) {
    return res.status(400).json({ 
      error: 'Dados incompletos',
      details: {
        email: !email,
        endereco: !endereco,
        data_coleta: !data_coleta,
        hora_coleta: !hora_coleta,
        materiais: !materiais
      }
    });
  }

  try {
    // 1. Buscar usuário pelo e-mail
    const { data: usuario, error: erroUsuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (erroUsuario || !usuario) {
      console.error('Erro ao buscar usuário:', erroUsuario);
      return res.status(404).json({ 
        error: 'Usuário não encontrado',
        email_enviado: email
      });
    }

    const usuario_id = usuario.id;

    // 2. Validar formato da data
    const dataColetaObj = new Date(data_coleta);
    if (isNaN(dataColetaObj.getTime())) {
      return res.status(400).json({ 
        error: 'Formato de data inválido',
        data_recebida: data_coleta,
        formato_esperado: 'YYYY-MM-DD'
      });
    }

    // 3. Criar o agendamento
    const { data, error } = await supabase
      .from('agendamentos_coleta')
      .insert([{
        usuario_id,
        endereco,
        data_coleta: dataColetaObj.toISOString(),
        hora_coleta,
        materiais: Array.isArray(materiais) ? materiais : materiais.split(','),
        status: 'pendente',
        criado_em: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Erro ao criar agendamento:', error);
      return res.status(500).json({ 
        error: 'Erro ao salvar agendamento',
        details: error.message
      });
    }

    return res.status(200).json({ 
      message: 'Agendamento criado com sucesso!',
      data: data[0],
      agendamento_id: data[0].id
    });

  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: err.message
    });
  }
}