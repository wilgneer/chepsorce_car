const form = document.getElementById('loginForm');
const usuarioInput = document.getElementById('usuario');
const senhaInput = document.getElementById('senha');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cdusuario = usuarioInput.value;
  const cdpassword = senhaInput.value;

  try {
    const response = await fetch('http://127.0.0.1:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cdusuario, cdpassword })
    });

    const data = await response.json();

    if (response.ok && data.usuario) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      window.location.href = '../menu/menu.html'; // redirecionamento correto
    } else {
      alert(data.erro || 'Usuário ou senha incorretos.');
    }
  } catch (error) {
    alert('Erro ao conectar com o servidor.');
    console.error(error);
  }
});
