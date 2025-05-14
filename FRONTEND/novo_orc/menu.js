function verificarLogin() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) {
    window.location.href = '../login/login.html';
  }
}

document.addEventListener('DOMContentLoaded', verificarLogin);
window.addEventListener('pageshow', verificarLogin);

function irPara(pagina) {
  console.log('Redirecionando para:', pagina);
  window.location.href = pagina;
}

function logout() {
  localStorage.removeItem('usuario');
  window.location.replace('../login/login.html');
}
