# SW Help — tabela de status sem rolagem no desktop

## Objetivo

Eliminar a rolagem horizontal da tabela de status dos counters de Siege no
desktop, tanto com o menu lateral aberto quanto fechado, sem reduzir a
legibilidade nem remover atributos. No celular, a rolagem horizontal continua
permitida porque as onze colunas não cabem de forma legível na viewport.

## Alternativas consideradas

Foram consideradas três opções:

1. compactar colunas, espaços e fontes no layout lateral atual;
2. combinar a sequência com a coluna de monstro e abreviar mais valores;
3. colocar o resumo em uma faixa compacta no topo e dar à tabela toda a largura
   do card.

A terceira opção foi escolhida. As duas primeiras dependeriam da largura da
janela e ainda poderiam produzir rolagem em notebooks ou espremer conteúdo. A
faixa superior resolve a causa do problema e reforça a prioridade visual dos
status.

## Layout do card

Em viewports de desktop, o card deixa de usar a divisão lateral 30/70 e passa a
ter duas linhas:

- uma faixa superior compacta com a composição do counter e a instrução curta;
- a tabela de status usando toda a largura disponível do card.

A faixa superior mantém a composição à esquerda e a orientação à direita, sem
voltar aos textos longos removidos anteriormente. Fontes e identificação de
conteúdo demonstrativo permanecem compactas quando existirem.

A tabela conserva as colunas `Monstro`, `Seq.`, `Runa`, `HP`, `ATK`, `DEF`,
`SPD`, `CR`, `CD`, `RES` e `ACC`. A semântica dos valores, o badge `Desejável`,
o cálculo automático de SPD e o formato `Tick 5` não mudam.

Todos os cabeçalhos e valores da tabela serão alinhados à esquerda. Isso inclui
`Seq.`, runas, status numéricos, valores ausentes, SPD e badges `Desejável`, sem
exceções de alinhamento por coluna. Larguras, conteúdo e comportamento
responsivo permanecem inalterados.

## Comportamento responsivo

O breakpoint seguirá o padrão responsivo já usado pela página:

- no desktop, a tabela deve caber integralmente no card, com o menu lateral
  aberto ou fechado, sem barra de rolagem horizontal;
- no celular, composição e instrução são empilhadas e a tabela permanece em uma
  região rolável horizontalmente;
- a indicação para arrastar continua visível somente quando a tabela puder
  rolar no layout móvel;
- a primeira coluna continua fixa durante a rolagem móvel para manter a linha
  identificável.

Não serão reduzidos os mínimos de legibilidade do projeto: 16 px para conteúdo
principal, 14 px para conteúdo secundário e 12 px para etiquetas curtas.

## Implementação

A mudança fica restrita ao template e aos estilos do card de counter. O modelo
de dados e os cálculos de status não precisam ser alterados.

O contêiner da tabela continuará protegendo a página contra overflow. No
desktop, sua largura mínima será compatível com a área integral do card; no
celular, a largura mínima necessária às colunas produzirá a rolagem intencional.
A barra não deverá aparecer apenas por causa de padding, bordas ou da largura do
menu lateral.

## Acessibilidade

- Cabeçalhos abreviados mantêm seus nomes acessíveis.
- A região rolável conserva sua identificação para leitores de tela.
- A ordem do documento será composição, instrução e tabela, coerente com a ordem
  visual em todas as larguras.
- Nenhuma informação será comunicada apenas por cor.

## Validação

- O teste E2E verificará que a tabela não possui overflow horizontal em desktop
  com o menu aberto e com o menu fechado.
- O teste E2E confirmará o alinhamento à esquerda de cabeçalhos e células,
  incluindo a coluna `Seq.` e uma coluna de status.
- O teste E2E móvel confirmará que a região ainda aceita rolagem horizontal e
  que a indicação de arrastar permanece presente.
- Uma inspeção visual confirmará que todas as colunas estão visíveis no desktop
  e que a faixa superior não compete com a tabela.
- A entrega será validada com `pnpm test`, `pnpm build` e `pnpm test:e2e` após a
  geração do build.

## Fora do escopo

Não serão alterados os valores de status, a ordem dos monstros, os sets de runa,
as instruções cadastradas, o cálculo de SPD ou o comportamento geral do menu
lateral.

## Critério de conclusão

Em desktop, o usuário visualiza todas as colunas de status sem rolagem
horizontal, independentemente do estado do menu lateral. Em celular, a tabela
continua legível por meio da rolagem horizontal já sinalizada pela interface.
