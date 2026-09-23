# SW Help — status prioritários nos counters de Siege

## Objetivo

Refatorar os cards de counters para que as metas de build sejam a informação
principal. A orientação de uso deixa de ocupar metade do card e passa a ser uma
instrução curta, enquanto a configuração de cada monstro reúne runas, ordem,
Tick e todos os bônus de status em uma tabela comparável.

## Layout do card

No desktop, cada card terá duas áreas:

- à esquerda, cerca de 30% da largura, ficam a identificação da ofensiva, o
  trio de monstros e uma seção “Como jogar” com uma ou duas frases;
- à direita, cerca de 70% da largura, fica a tabela de configuração, que é o
  conteúdo visualmente prioritário.

O card não exibirá mais título de estratégia, parágrafo longo nem “Plano de
batalha” com uma lista de passos. Fontes continuam disponíveis de forma
compacta quando existirem. A identificação de conteúdo demonstrativo permanece
visível e nenhuma meta sem fonte será apresentada como validada.

No celular, as áreas serão empilhadas: composição e instrução primeiro, tabela
depois. A tabela poderá rolar horizontalmente, mantendo a coluna do monstro
fixa para que cada linha continue identificável.

## Tabela de configuração

Cada monstro ocupará uma linha. A tabela terá as colunas:

1. Monstro
2. Seq.
3. Runa
4. Tick
5. HP
6. ATK
7. DEF
8. SPD
9. CR
10. CD
11. RES
12. ACC

Os sets de runa permanecem um por linha, sem separação por `/`. O Tick mantém a
inicial maiúscula e o formato atual, como `Tick 5`.

Todos os status representam somente o adicional fornecido pela build, nunca o
status total do monstro. A apresentação usa sinal de positivo: HP, ATK e DEF
podem ser abreviados em milhares (`+30k`); SPD usa número inteiro (`+120`); CR,
CD, RES e ACC usam porcentagem (`+85%`). Status sem meta cadastrada aparecem
como `—`.

## Modelo de dados

Cada entrada de configuração de runa continuará vinculada por `monsterId` e
ganhará um objeto opcional de bônus com valores numéricos:

- `hp`, `attack`, `defense` e `speed`;
- `critRate`, `critDamage`, `resistance` e `accuracy`.

Um valor ausente significa que não há meta cadastrada e produz `—`. Guardar os
valores como números permite validar dados e centralizar a formatação visual.
O texto antigo de estratégia, etapas e cuidado será substituído no contrato do
counter por um único campo curto de instrução.

Os counters existentes não receberão números inventados. Eles serão migrados
para o novo formato com os bônus ausentes até que metas reais sejam cadastradas.
As instruções existentes serão condensadas sem afirmar taxas de vitória ou
validação competitiva.

## Componentes e comportamento

A página de detalhe continuará sendo estática. A montagem de cada linha parte
da ordem de ataque e combina o monstro com sua configuração por `monsterId`.
Um pequeno formatador puro será responsável pelos três formatos de bônus
(milhares, inteiro e porcentagem), evitando regras duplicadas no template.

Não haverá interação nova, consulta externa ou estado no navegador. A mudança
fica limitada ao tipo de counter, aos dados locais, ao template da página e aos
estilos do card.

## Acessibilidade e responsividade

- Cabeçalhos abreviados terão nomes acessíveis quando necessário.
- A região rolável da tabela terá identificação para leitores de tela.
- Texto principal manterá pelo menos 16 px; conteúdo secundário, 14 px; e
  etiquetas curtas, 12 px.
- A coluna fixa usará contraste e fundo próprios para não se misturar às demais
  células durante a rolagem.
- A ordem visual no celular seguirá a ordem de leitura do documento.

## Validação

- Testes unitários cobrirão a validação dos bônus e a formatação de milhares,
  inteiros, porcentagens e valores ausentes.
- O build confirmará que todos os IDs e estruturas de counter permanecem
  válidos.
- O fluxo E2E da página de Siege verificará a instrução curta, todos os
  cabeçalhos da tabela e a leitura do card em viewport móvel.
- A entrega será validada com `pnpm test`, `pnpm build` e `pnpm test:e2e` após o
  build.

## Fora do escopo

Não serão adicionados cálculo automático de runas, importação da conta,
recomendação de metas, taxa de vitória ou edição de counters pelo navegador.

## Critério de conclusão

O usuário consegue comparar, por monstro, ordem, runas, Tick e todos os bônus
de status em uma única tabela. A instrução de jogo permanece curta e
secundária, sem competir visualmente com a configuração da build.
