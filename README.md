# Samuel Frutas — Pedidos

Sistema independente da loja de pedidos e do painel de cadastro de produtos.

## Estrutura

- `loja/` — loja e montagem do pedido
- `painel/` — cadastro, edição e arquivamento de produtos
- `login/` — autenticação do painel
- `js/` — Firebase e regras de cálculo compartilhadas
- `.github/workflows/` — publicação no GitHub Pages

## Firebase

O sistema usa o mesmo projeto Firebase do sistema de Pedidos atual (`samuelfrutasbot`), mantendo separadas as coleções `products`, `orders` e `config`.

O número de WhatsApp usado ao finalizar um pedido é lido de `config/bot.responsibleNumber`. Não existe um número de WhatsApp duplicado neste repositório.

O status da loja também é lido de `config/bot.siteOffline`.
