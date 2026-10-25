import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { browserLocalPersistence, getAuth, setPersistence } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { PEDIDOS_CONFIG } from './config.js?v=5';

const app = initializeApp(PEDIDOS_CONFIG.firebase, 'samuel-frutas-pedidos');
export const db = getFirestore(app);
export const auth = getAuth(app);

// O módulo só termina de carregar depois que a persistência da sessão estiver pronta.
// Assim login e painel nunca executam o guard de autenticação antes da sessão ser configurada.
await setPersistence(auth, browserLocalPersistence);
export const authReady = Promise.resolve();
export { app };
