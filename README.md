# Samuel Frutas — Pedidos

Sistema independente da loja de pedidos e do painel de cadastro de produtos.

## Estrutura

- `loja/` — loja e montagem do pedido
- `painel/` — cadastro, edição e arquivamento de produtos
- `login/` — autenticação do painel
- `js/` — Firebase e regras de cálculo compartilhadas
- `.github/workflows/` — publicação no GitHub Pages

O sistema usa o mesmo projeto Firebase do sistema de pedidos atual, mantendo as coleções `products`, `orders` e `config`.

## Antes da publicação

Preencha `js/config.js` com a configuração Web atual do Firebase do sistema de Pedidos. O arquivo foi deixado com placeholders para evitar copiar credenciais automaticamente durante a migração.
