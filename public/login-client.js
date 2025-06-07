document.querySelector('.login-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('auth_token', result.session.access_token);
      localStorage.setItem('user_email', result.user.email);
      localStorage.setItem('user_id', result.user.id);
      

      sessionStorage.setItem('is_logged_in', 'true');
      
      alert('Login realizado com sucesso!');
      window.location.href = 'home.html';
    } else {
      alert('Erro: ' + (result.error || 'Credenciais inválidas'));
    }
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
});