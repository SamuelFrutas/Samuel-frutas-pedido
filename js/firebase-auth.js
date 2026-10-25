import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { browserLocalPersistence, getAuth, setPersistence } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { PEDIDOS_CONFIG } from './config.js?v=5';

const app = initializeApp(PEDIDOS_CONFIG.firebase, 'samuel-frutas-pedidos');
export const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);
export const authReady = Promise.resolve();
