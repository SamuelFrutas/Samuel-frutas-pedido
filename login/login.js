import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Login isolado: usa exatamente a mesma configuração Firebase do APK do Painel de Pedidos.
const firebaseConfig = {
  apiKey: 'AIzaSyB1E9oQsIwYO2-r4W5-uQK4ax92OmxISOI',
  authDomain: 'samuelfrutasbot.firebaseapp.com',
  projectId: 'samuelfrutasbot',
  storageBucket: 'samuelfrutasbot.firebasestorage.app',
  messagingSenderId: '1052699327049',
  appId: '1:1052699327049:web:cf22d68c76d064d56b5d98'
};

const app = initializeApp(firebaseConfig, 'samuel-frutas-login');
const auth = getAuth(app);

const form = document.querySelector('#login');
const error = document.querySelector('#error');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
let redirecting = false;

onAuthStateChanged(auth, user => {
  if (user && !redirecting) {
    redirecting = true;
    location.replace('../painel/admin.html');
  }
});

const messages = {
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/wrong-password': 'E-mail ou senha inválidos.',
  'auth/user-not-found': 'E-mail ou senha inválidos.',
  'auth/invalid-api-key': 'Erro na configuração do Firebase: chave de API inválida.',
  'auth/api-key-not-valid': 'Erro na configuração do Firebase: chave de API inválida.',
  'auth/unauthorized-domain': 'O endereço deste site ainda não está autorizado no Firebase Authentication.',
  'auth/network-request-failed': 'Falha de conexão com o Firebase. Verifique a internet e tente novamente.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
};

form.onsubmit = async e => {
  e.preventDefault();
  error.textContent = '';
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) return;

  redirecting = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.replace('../painel/admin.html');
  } catch (err) {
    redirecting = false;
    console.error(err);
    error.textContent = messages[err.code] || `${err.code || 'erro'}: ${err.message || 'Não foi possível entrar.'}`;
  }
};
