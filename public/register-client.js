document.querySelector('.register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();

  if (response.ok) {
    alert('Registro realizado com sucesso!');
    // Redirecionar ou limpar formulário
  } else {
    alert('Erro: ' + result.error);
  }
});
