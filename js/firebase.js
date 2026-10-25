import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { browserLocalPersistence, getAuth, setPersistence } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { PEDIDOS_CONFIG } from './config.js?v=5';

const app = initializeApp(PEDIDOS_CONFIG.firebase, 'samuel-frutas-pedidos');
export const db = getFirestore(app);
export const auth = getAuth(app);

// Garante que a sessão usada pelo login seja a mesma sessão recuperada pelo painel.
export const authReady = setPersistence(auth, browserLocalPersistence);
export { app };
