const BOT_API = 'https://samuel-frutas-bot.onrender.com';
const TOKEN_KEY = 'pedidosBotToken';
const PRODUCTS_COLLECTION = 'products';
const LEGACY_CONFIG_ID = '_config';
const $ = id => document.getElementById(id);
const money = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = v => String(v ?? '').replace(/[&<>\\"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\\"': '&quot;', "'": '&#039;' }[x]));
const units = ['Un', 'Lote', 'Duplo', 'Dz', '1/8', '1/4', 'Bdj', 'Cx', '1/2', 'GF', 'Inteiro'];
let products = [], archived = false, editing = null, offline = false;

function token() {
  return sessionStorage.getItem(TOKEN_KEY) || '';
}

async function api(path, options = {}) {
  const currentToken = token();
  if (!currentToken) {
    location.replace('../login/index.html');
    throw new Error('Sessão expirada.');
  }
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${currentToken}` };
  const response = await fetch(`${BOT_API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    sessionStorage.removeItem(TOKEN_KEY);
    location.replace('../login/index.html');
    throw new Error('Sessão expirada.');
  }
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a operação.');
  return data;
}

function row(m = { quantity: 1, unit: 'Un', price: 0 }) {
  const d = document.createElement('div');
  d.className = 'measure-row';
  d.innerHTML = `<input class="mq" type="number" min="1" step="1" value="${m.quantity || 1}"><select class="mu">${units.map(u => `<option ${u === (m.unit || 'Un') ? 'selected' : ''}>${u}</option>`).join('')}</select><input class="mp" type="number" min="0" step="0.01" value="${m.price || 0}"><button type="button" class="remove">✕</button>`;
  d.querySelector('.remove').onclick = () => { if ($('measures').children.length > 1) d.remove(); };
  $('measures').appendChild(d);
}

function openForm(p) {
  editing = p?.id || null;
  $('modalTitle').textContent = p ? 'Editar produto' : 'Novo produto';
  $('error').textContent = '';
  $('name').value = p?.name || '';
  $('imageUrl').value = p?.image || p?.imageUrl || '';
  $('measures').innerHTML = '';
  (p?.measures?.length ? p.measures : [{ quantity: 1, unit: p?.unit || 'Un', price: p?.price || 0 }]).forEach(row);
  preview();
  $('modal').classList.add('show');
}

function closeForm() {
  $('modal').classList.remove('show');
  editing = null;
}

function read() {
  return [...$('measures').children]
    .map(r => ({ quantity: Number(r.querySelector('.mq').value || 1), unit: r.querySelector('.mu').value, price: Number(r.querySelector('.mp').value || 0) }))
    .filter(x => x.quantity > 0 && x.price >= 0);
}

function render() {
  const q = $('search').value.toLocaleLowerCase('pt-BR').trim();
  const list = products
    .filter(p => p.id !== LEGACY_CONFIG_ID && Boolean(p.archived) === archived && (!q || String(p.name || '').toLocaleLowerCase('pt-BR').includes(q)))
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR'));

  $('list').innerHTML = list.length ? list.map(p => `<article class="card"><div class="topline"><div><div class="name">${esc(p.name)}</div></div><span class="badge">${archived ? 'Arquivado' : 'Ativo'}</span></div>${(p.measures || []).map(m => `<div class="measure"><span>${esc(m.quantity || 1)} ${esc(m.unit || 'Un')}</span><b>${money(m.price)}</b></div>`).join('')}<div class="actions"><button data-edit="${p.id}">Editar</button>${archived ? `<button data-restore="${p.id}">Desarquivar</button><button data-delete="${p.id}">Excluir</button>` : `<button data-archive="${p.id}">Arquivar</button>`}</div></article>`).join('') : '<p class="muted">Nenhum produto nesta lista.</p>';

  $('list').onclick = async e => {
    const b = e.target.closest('button');
    if (!b) return;
    const id = b.dataset.edit || b.dataset.archive || b.dataset.restore || b.dataset.delete;
    const p = products.find(x => x.id === id);
    try {
      if (b.dataset.edit) return openForm(p);
      if (b.dataset.archive) await api(`/api/pedidos/products/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: true }) });
      if (b.dataset.restore) await api(`/api/pedidos/products/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: false }) });
      if (b.dataset.delete) {
        if (!confirm('Excluir permanentemente este produto?')) return;
        await api(`/api/pedidos/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
      }
      await loadProducts();
    } catch (e) {
      alert(e.message || 'Não foi possível concluir a operação.');
    }
  };
}

async function loadProducts() {
  const data = await api('/api/pedidos/products');
  products = Array.isArray(data.products) ? data.products : [];
  render();
}

async function loadConfig() {
  const data = await api('/api/pedidos/config');
  offline = Boolean(data.siteOffline);
  siteButton();
}

$('productForm').onsubmit = async e => {
  e.preventDefault();
  const name = $('name').value.trim();
  const measures = read();
  if (!name) return $('error').textContent = 'Informe o nome do produto.';
  if (!measures.length || !measures.some(x => x.price > 0)) return $('error').textContent = 'Adicione pelo menos uma medida com preço.';
  const data = {
    name,
    image: $('imageUrl').value.trim(),
    imageUrl: $('imageUrl').value.trim(),
    measures,
    unit: measures[0].unit,
    price: measures[0].price,
    priceTiers: measures.filter(x => x.unit === measures[0].unit && x.quantity > 1).map(x => ({ minQty: x.quantity, unitPrice: x.price })),
    archived: false,
    active: true
  };
  try {
    if (editing) await api(`/api/pedidos/products/${encodeURIComponent(editing)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    else await api('/api/pedidos/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    closeForm();
    await loadProducts();
  } catch (e) {
    $('error').textContent = e.message || 'Não foi possível salvar.';
    console.error(e);
  }
};

function preview() {
  const u = $('imageUrl').value.trim();
  const w = $('imagePreviewWrap');
  const im = $('imagePreview');
  if (!u) { w.style.display = 'none'; return; }
  w.style.display = 'block';
  im.src = u;
  im.onerror = () => { $('imageStatus').textContent = 'Não foi possível carregar esta imagem.'; };
  im.onload = () => { $('imageStatus').textContent = 'Imagem carregada.'; };
}

function siteButton() {
  $('siteToggle').textContent = offline ? 'Site: FORA DO AR' : 'Site: ONLINE';
  $('siteToggle').classList.toggle('offline', offline);
}

$('new').onclick = () => openForm();
$('close').onclick = closeForm;
$('cancel').onclick = closeForm;
$('addMeasure').onclick = () => row();
$('search').oninput = render;
$('reload').onclick = () => loadProducts().catch(e => alert(e.message));
$('activeTab').onclick = () => { archived = false; $('activeTab').className = 'btn'; $('archivedTab').className = 'sec'; render(); };
$('archivedTab').onclick = () => { archived = true; $('activeTab').className = 'sec'; $('archivedTab').className = 'btn'; render(); };
$('imageUrl').oninput = preview;
$('logout').onclick = async () => {
  try { await api('/api/admin/logout', { method: 'POST' }); } catch (_) {}
  sessionStorage.removeItem(TOKEN_KEY);
  location.replace('../login/index.html');
};
$('siteToggle').onclick = async () => {
  const next = !offline;
  try {
    const data = await api('/api/pedidos/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siteOffline: next }) });
    offline = Boolean(data.siteOffline);
  } catch (e) {
    alert(e.message || 'Não foi possível alterar o status do site.');
  }
  siteButton();
};

if (!token()) {
  location.replace('../login/index.html');
} else {
  document.body.style.visibility = 'visible';
  Promise.all([loadProducts(), loadConfig()]).catch(e => {
    console.error(e);
    if (e.message !== 'Sessão expirada.') alert(e.message || 'Não foi possível carregar o painel.');
  });
}
