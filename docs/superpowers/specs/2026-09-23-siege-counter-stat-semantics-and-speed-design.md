# SW Help — semântica dos status e SPD automática nos counters

## Objetivo

Definir metas de build úteis para os counters de Siege sem misturar bônus de
runa com atributos finais. Remover o Tick como coluna isolada e apresentar, na
coluna SPD, o Tick desejado junto da velocidade adicional calculada para cada
monstro.

Esta especificação complementa o novo layout dos cards de counter. A instrução
de jogo continua curta e a tabela permanece como informação prioritária.

## Semântica dos atributos

Os atributos são divididos em dois grupos:

- `HP`, `ATK`, `DEF` e `SPD` representam somente o bônus adicional da build e
  são exibidos com `+`, por exemplo `+30k HP`, `+1k ATK`, `+700 DEF` e
  `+149 SPD`;
- `CR`, `CD`, `RES` e `ACC` representam a meta final do atributo e são exibidos
  sem `+`, por exemplo `100% RES`.

Um atributo pode ser marcado como desejável sem receber uma meta numérica. A
célula correspondente exibe o badge `Desejável`. Isso será usado inicialmente
para ACC da Platy e da Shihwa, evitando inventar um percentual.

Valores ausentes e não marcados como desejáveis continuam exibidos como `—`.
Um mesmo atributo não pode ter simultaneamente uma meta numérica e a marcação
`Desejável`.

## Metas iniciais

As metas abaixo valem para todas as ocorrências desses monstros nos counters
atuais:

| Monstro | HP adicional | ATK adicional | DEF adicional | RES final | ACC       |
| ------- | ------------ | ------------- | ------------- | --------- | --------- |
| Platy   | +30k         | —             | +700          | 100%      | Desejável |
| Iona    | +30k         | —             | +700          | 100%      | —         |
| Betta   | +30k         | —             | +700          | 100%      | —         |
| Shihwa  | +20k         | +1k           | +700          | —         | Desejável |

Não serão criadas metas numéricas para os demais monstros sem informação do
usuário.

## Tick e cálculo automático de SPD

O campo textual `speed`, hoje preenchido como `Tick 5`, será substituído por um
campo numérico `tick`. A coluna exclusiva `Tick` será removida da tabela.

A coluna `SPD` exibirá duas linhas:

1. o alvo, como `Tick 5`;
2. o bônus de SPD necessário, como `+149`.

O bônus é calculado para cada linha com a função compartilhada de Speed Tick,
usando:

- a SPD base do monstro no catálogo;
- o breakpoint do Tick cadastrado no counter;
- torre de SPD fixa em 15%;
- a habilidade de líder do monstro em `team[0]`;
- somente lideranças de SPD válidas em Siege (`General`, `Guild` ou
  `Element`), respeitando a restrição elemental;
- o bônus de Swift quando os sets cadastrados incluírem `Swift`.

A ordem de ataque não define o líder. Mesmo quando outro monstro age primeiro,
o cálculo sempre usa `team[0]`, conforme a regra do catálogo.

Para Tick 5 e os sets atuais, os valores esperados incluem:

- time liderado por Platy: Platy `+149`, Shihwa `+144`, Iona `+131` e Betta
  `+128` quando presente;
- time liderado por Betta, que não possui liderança de SPD: Betta `+156`,
  Shihwa `+168` e Iona `+158`;
- time liderado por Mimirr: Mimirr `+142`, Loren `+144` e Elucia `+141`.

O valor calculado é o bônus adicional de SPD mostrado na tela do monstro, não a
SPD total de combate.

## Modelo de dados

Cada configuração de monstro mantém os sets e passa a aceitar:

- `stats`, com metas numéricas para HP, ATK, DEF, CR, CD, RES e ACC;
- `preferredStats`, uma lista de atributos desejáveis sem meta numérica.

SPD não será aceita em `stats`, pois é sempre derivada do Tick. O counter guarda
`tick` como inteiro correspondente a um breakpoint suportado pela calculadora.

Os dados continuam locais em `src/data/counters.json`. Embora as metas iniciais
se repitam em vários counters, permanecem ligadas à configuração de cada
monstro para permitir ajustes futuros por matchup sem alterar todos os usos do
monstro globalmente.

## Interface e acessibilidade

- A tabela passa a ter `Monstro`, `Seq.`, `Runa`, `HP`, `ATK`, `DEF`, `SPD`,
  `CR`, `CD`, `RES` e `ACC`.
- `Tick 5` aparece dentro da célula SPD, acima do bônus calculado.
- `Desejável` usa texto, não apenas cor, e mantém pelo menos 12 px.
- As abreviações continuam com nomes acessíveis.
- A rolagem horizontal e a coluna fixa do monstro são preservadas.

## Validação e falhas

A validação do catálogo deve rejeitar:

- Tick sem breakpoint correspondente;
- SPD preenchida manualmente nos status;
- valores negativos, não inteiros ou atributos desconhecidos;
- atributo numérico também marcado como desejável;
- liderança, monstro ou configuração com referência inválida, conforme as
  validações existentes.

Se o catálogo não tiver SPD base para um monstro, a célula SPD exibe `—` sem
interromper a renderização. O catálogo atual possui SPD base para todos os
monstros usados nos counters.

## Testes

- Testes unitários cobrirão a diferença entre adicionais e valores finais, o
  badge `Desejável` e a validação das combinações inválidas.
- O cálculo de SPD será testado para times liderados por Platy, Betta e Mimirr,
  com torre de 15%, além de um caso Swift.
- O E2E verificará a remoção da coluna Tick e a presença conjunta de `Tick 5` e
  do bônus calculado na célula SPD.
- A entrega será validada com `pnpm test`, `pnpm build` e `pnpm test:e2e` após o
  build.

## Fora do escopo

Não haverá formulário de edição no navegador, escolha de percentual de torre,
substituição manual da SPD calculada ou recomendação automática de metas para
outros atributos.

## Critério de conclusão

O usuário diferencia imediatamente bônus adicionais de metas finais, identifica
atributos apenas desejáveis e consulta, na própria coluna SPD, o Tick e o bônus
necessário calculado para o contexto real do counter.
