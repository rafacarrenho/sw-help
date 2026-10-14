# Poda exata por sets no otimizador de runas

## Problema

Uma busca com o preset `Violent + Will` e mínimo de `100 CR` permanece em
“Calculating exact combinations…”. Esses dois sets consomem os seis slots, mas a
busca atual ainda percorre candidatos de todos os outros sets e só rejeita a
combinação quando chega à sexta runa. Em inventários reais, esse produto
cartesiano fica grande demais.

## Solução

A busca continuará exata e não terá timeout ou limite aproximado.

1. Somar o número de peças exigido pelos sets selecionados.
2. Quando os sets exigidos ocuparem os seis slots, aceitar como candidatos
   apenas esses sets e `Intangible`, antes da poda de Pareto.
3. Durante a busca, usar uma verificação dinâmica de viabilidade que acompanhe
   as peças já escolhidas e determine se os slots restantes ainda conseguem
   completar todos os sets exigidos. Ramos inviáveis terminam imediatamente.
4. Quando os seis slots estiverem reservados pelos sets exigidos, calcular o
   teto otimista de atributos usando somente os bônus desses sets, sem supor
   bônus impossíveis de Blade, Energy ou outros sets.

O tratamento de `Intangible` continuará exato: no máximo uma runa poderá suprir
uma única peça ausente de um dos sets exigidos. Sets repetidos continuarão sendo
contados pela quantidade total de peças necessária.

## Resultado esperado

- `Violent + Will` com `100 CR` deve terminar em tempo prático no inventário
  importado e retornar as builds encontradas.
- Restrições realmente impossíveis devem retornar zero resultados rapidamente.
- Builds com espaços livres, sets quebrados, sets repetidos e `Intangible`
  devem manter o comportamento atual.
- A ordenação por objetivo e o caráter exato dos resultados não serão alterados.

## Validação

Um teste de regressão criará dezenas de candidatos Pareto de sets irrelevantes
por slot. Para `Violent + Will`, esses candidatos não poderão entrar no espaço de
busca, e somente as 15 distribuições válidas de quatro Violent e duas Will serão
avaliadas. Também serão executados os testes unitários, o build e o fluxo E2E do
otimizador em desktop e mobile.
