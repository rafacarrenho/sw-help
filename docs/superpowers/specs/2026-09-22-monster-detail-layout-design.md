# Refinamento visual da ficha de monstros

## Objetivo

Melhorar a leitura das habilidades no desktop, redesenhar a progressão das
melhorias e substituir o emblema textual “L” pelo ícone correspondente ao
atributo da habilidade de líder.

## Habilidades no desktop

A lista usará uma grade de duas colunas a partir de 900 px e uma coluna abaixo
desse limite. Os cards terão alinhamento no topo, sem esticar o card menor para
igualar a altura do maior. A ordem visual continuará seguindo os slots das
habilidades: S1, S2, S3 e S4.

Uma coluna única com largura limitada deixaria espaço ocioso, enquanto um
layout masonry poderia alterar a leitura sequencial e produzir comportamento
confuso ao expandir detalhes. A grade regular é a solução mais previsível e
compatível.

## Progressão das melhorias

O `details` continuará oferecendo expansão nativa e acessível, mas será tratado
como um painel interno do card. O cabeçalho ocupará a largura disponível, terá
indicador de expansão, título e quantidade de melhorias. Quando aberto, cada
melhoria aparecerá em uma linha própria, com marcador numérico e o texto
original da API. Estados de foco e hover permanecerão visíveis.

## Ícones de habilidade de líder

O SWARFARM fornece o tipo da liderança, mas não uma imagem: tanto o registro do
monstro quanto `/api/v2/leader-skills/{id}/` contêm apenas atributo, quantidade,
área e elemento. O SWArena disponibiliza PNGs de 100×100 para todos os atributos
presentes no catálogo:

- Accuracy
- Attack Power
- Attack Speed
- Critical DMG
- Critical Rate
- Defense
- HP
- Resistance

Os oito arquivos serão armazenados em `public/leader-skills/`, evitando
dependência de rede e hotlink em produção. Uma função comum mapeará o atributo
do SWARFARM ao caminho local. Monstros sem habilidade de líder não exibirão um
ícone fictício. A ficha manterá o texto atual e acrescentará atribuição ao
SWArena na nota de fontes.

Fonte dos assets:
`https://swarena.gg/leader_pictures/leader_skill_{Attribute}.png`.

## Validação

Os testes unitários cobrirão o mapeamento dos oito atributos. Os testes E2E
verificarão a imagem de líder, a expansão da progressão e a grade em desktop,
além da ausência de overflow e da coluna única no celular. A entrega será
validada com `pnpm test`, `pnpm build` e `pnpm test:e2e`.
