import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { PEDIDOS_CONFIG } from './config.js?v=2';

const app = initializeApp(PEDIDOS_CONFIG.firebase, 'samuel-frutas-pedidos');
export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };
