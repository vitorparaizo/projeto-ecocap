const form = document.querySelector('.register-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value.trim();

  if (!email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const res = await fetch('/api/register', {  // supondo que seu endpoint backend seja /api/register
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert('Erro: ' + (data.error || 'Algo deu errado'));
      return;
    }

    alert(data.message || 'Usuário registrado com sucesso!');
    form.reset();
  } catch (err) {
    alert('Erro na requisição: ' + err.message);
  }
});
