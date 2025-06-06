document.querySelector('.login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.querySelector('#email').value.trim();
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
      if (result.user && result.user.id) {
        localStorage.setItem('usuario_id', result.user.id);
      }

      alert('Login realizado com sucesso!');
      window.location.href = 'mapa.html';
    } else {
      alert('Erro: ' + result.error);
    }
  } catch (error) {
    alert('Erro na requisição: ' + error.message);
  }
});
