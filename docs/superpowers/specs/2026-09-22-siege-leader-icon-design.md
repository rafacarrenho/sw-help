# Ícone de liderança no Siege Counter

## Objetivo

Substituir o marcador textual “L” exibido sobre o primeiro monstro das equipes
do Siege Counter pelo ícone correspondente à habilidade de líder.

## Implementação

`Monster.astro` continuará recebendo a propriedade `leader`, definida por
`Team.astro` para `team[0]`. Quando ela estiver ativa, o componente consultará
`leaderSkillIcon()` com os dados do próprio monstro e renderizará o mesmo asset
local usado na ficha do catálogo.

O ícone ficará no canto superior esquerdo do retrato, equilibrando o badge de
elemento no canto superior direito. Ele terá 32 px, texto alternativo e tooltip
indicando que o monstro é o líder da composição. Se uma futura composição usar
um líder sem habilidade ou atributo mapeado, nenhum marcador fictício será
exibido.

Resolver o asset no componente compartilhado evita passar caminhos por várias
camadas e mantém defesas e ofensivas consistentes automaticamente.

## Validação

O fluxo E2E verificará que o primeiro monstro da defesa e da ofensiva usa o
asset esperado, que os demais não recebem o marcador e que não existe mais o
quadrado textual “L”. A entrega também será validada com `pnpm test`,
`pnpm build` e `pnpm test:e2e`.
