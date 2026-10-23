const BOT_API = 'https://samuel-frutas-bot.onrender.com';
const form = document.querySelector('#login');
const error = document.querySelector('#error');
const passwordInput = document.querySelector('#password');
const TOKEN_KEY = 'pedidosBotToken';

if (sessionStorage.getItem(TOKEN_KEY)) location.replace('../painel/admin.html');

const messages = {
  'Senha inválida.': 'Senha inválida.',
  'Não autorizado.': 'Sessão expirada. Entre novamente.',
  'Failed to fetch': 'Não foi possível conectar ao painel. Tente novamente.'
};

form.onsubmit = async e => {
  e.preventDefault();
  error.textContent = '';
  const password = passwordInput.value;
  if (!password) return;

  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const response = await fetch(`${BOT_API}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok || !data.token) throw new Error(data.error || 'Não foi possível entrar.');
    sessionStorage.setItem(TOKEN_KEY, data.token);
    location.replace('../painel/admin.html');
  } catch (err) {
    console.error(err);
    error.textContent = messages[err.message] || err.message || 'Não foi possível entrar.';
    button.disabled = false;
  }
};
