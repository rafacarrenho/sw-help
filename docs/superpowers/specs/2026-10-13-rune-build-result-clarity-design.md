# Clareza do resultado do otimizador de runas

## Objetivo

Reformular os resultados do Rune Optimizer para seguir a leitura usada no
Summoners War: o valor adicional é a informação principal, acompanhado do total
final da build. A interface mostrará somente como a build ficará depois das
melhorias determinísticas já suportadas pelo motor. Os stats da build atual não
serão exibidos.

## Resumo da build

O cabeçalho de cada resultado destacará o atributo escolhido em duas linhas:

- `SPD adicional +N`;
- `SPD total N`.

Isso se aplicará a HP, ATK, DEF, SPD, CR, CD, RES e ACC. O adicional final será
calculado como `total potencial - atributo base do monstro`, incluindo os efeitos
das seis runas e dos sets ativados. O total será o mesmo valor potencial usado
para classificar e validar a build.

## Tabela de atributos

A comparação atual/potencial será substituída por três colunas:

1. atributo base do monstro;
2. adicional final;
3. total final.

Valores adicionais usarão sempre um sinal explícito, como `+215`. CR, CD, RES e
ACC continuarão formatados como porcentagem. A tabela não mostrará stats da
runagem atual nem uma coluna de estado intermediário.

## Identificação das runas

Cada uma das seis runas será mostrada em um card próprio, ordenado pelo slot. O
card conterá:

- slot, set, estrelas, nível final projetado e indicação Ancient;
- localização atual, bloqueio e monstro equipado, quando houver;
- atributo principal no valor final de +15;
- atributo inato, quando existir;
- todos os substats existentes no JSON.

Os substats serão exibidos no valor final usado pelo otimizador. Quando houver
grind possível, um texto separado explicará o ganho, por exemplo
`SPD +30 · +5 por grind possível`. O valor final não simulará novos rolls nem
novas gems. Substats gemados serão identificados sem alterar sua interpretação.

O atributo principal mostrará somente seu valor final e a indicação `+15`. A
interface não exibirá a diferença para o nível atual da runa, pois a decisão do
jogador é baseada no resultado final.

## Dados e cálculo

O motor continuará calculando os cenários atual e potencial internamente para
manter compatibilidade e ordenação estável, mas a apresentação consumirá apenas
`potential`. A contribuição adicional será derivada na interface a partir dos
stats base do monstro selecionado, evitando duplicar valores persistidos ou
alterar o snapshot sanitizado.

Uma função compartilhada calculará o valor final de cada efeito da runa e o
ganho de grind possível. Essa função será usada pelos cards e coberta por testes
unitários para runas normais, Ancient, com grind parcial, grind completo, innate
e substat gemado.

## Responsividade e acessibilidade

No desktop, os cards de runa formarão uma grade de duas colunas. No celular,
cada runa ocupará uma linha. A tabela de atributos continuará rolável quando
necessário, sem reduzir textos principais abaixo de 16 px ou textos secundários
abaixo de 14 px.

Títulos dos cards indicarão o slot em texto, e as listas de atributos usarão
marcação semântica. Cor não será o único meio de diferenciar base, adicional,
total ou melhoria possível.

## Validação

Os testes devem confirmar:

- cálculo e formatação do adicional final;
- ausência dos stats atuais no resultado renderizado;
- presença de principal, innate e todos os substats das seis runas;
- indicação correta de grind potencial normal e Ancient;
- navegação e leitura dos resultados em desktop e mobile;
- `pnpm test`, `pnpm build` e `pnpm test:e2e` aprovados.
