document.querySelector('.login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Login realizado com sucesso!');
      // Redirecionar para a página principal após o login
      window.location.href = '/';
    } else {
      alert('Erro: ' + result.error);
    }
  } catch (error) {
    alert('Erro na requisição: ' + error.message);
  }
});
