import{onAuthStateChanged,signOut}from'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';import{auth,authReady}from'../js/firebase.js?v=5';
export async function requireAdmin(onReady){try{await authReady;onAuthStateChanged(auth,user=>{if(!user){location.replace('../login/index.html');return}onReady(user)})}catch(e){console.error(e);alert('Não foi possível preparar a sessão de acesso.')}}
export{auth,signOut};
