# Detalhamento de grind nos substats

## Objetivo

Eliminar a ambiguidade entre o valor final projetado de um substat e o grind
que ainda pode ser aplicado. O jogador deve conseguir conferir de imediato como
o valor final foi formado.

## Apresentação

Cada substat que aceita grind mostrará duas linhas:

- `Final +32`, com o mesmo valor usado pelo otimizador;
- `Base +26 · Grind atual +5 · Possível +1`.

O valor base exclui qualquer grind. O grind atual vem do JSON importado. O valor
possível representa somente o ganho adicional que ainda cabe até o grind máximo
suportado pela runa normal ou Ancient. Assim, a relação sempre será
`base + grind atual + possível = final`.

Substats que não aceitam grind, como CR, CD, RES e ACC, mostrarão apenas o valor
final. Status principal e inato também continuarão mostrando apenas o valor
final, pois não usam grind.

## Dados e cálculo

A função compartilhada de efeitos potenciais passará a expor o valor base, o
grind atual, o grind possível e se o efeito aceita grind. O cálculo da build não
muda: somente a decomposição usada na apresentação fica explícita.

## Idiomas e responsividade

Os rótulos `Final`, `Grind atual` e `Possível` serão localizados nos cinco
idiomas do site. A decomposição poderá quebrar linha dentro do card sem provocar
rolagem horizontal e manterá o tamanho mínimo de texto definido pelo projeto.

## Validação

Os testes cobrirão runas normais e Ancient, grind parcial, grind completo,
substat sem grind e a renderização do detalhamento em desktop e mobile.
