# Spd Tuning para Siege, Arena e RTA

## Objetivo

Expandir o Spd Tuning atual para calcular a primeira sequência de turnos em
Siege, Arena e RTA na mesma página, preservando a experiência e os links de
Siege existentes.

O cálculo deve informar a SPD adicional mínima de cada seguidor para manter a
ordem escolhida sem cortes, considerando torre, liderança, Swift, boosts de
ATB, buffs de SPD, efeitos de aumento de SPD dos artefatos e passivas já
suportadas.

## Modos de conteúdo

A ferramenta terá um seletor segmentado e acessível com três modos:

| Modo  | Monstros efetivos | Constante de tick | Lideranças de SPD válidas |
| ----- | ----------------: | ----------------: | ------------------------- |
| Siege |                 3 |          `0.0007` | General, Guild e Element  |
| Arena |                 4 |          `0.0007` | General, Arena e Element  |
| RTA   |                 4 |         `0.00015` | General, Arena e Element  |

RTA representará os quatro monstros que efetivamente entram na batalha após o
ban. A simulação de cinco escolhas e diferentes resultados de ban não pertence
a este escopo.

Siege será o modo padrão. URLs antigas sem um parâmetro de modo continuarão
abrindo como Siege. Arena e RTA serão identificados respectivamente por
`mode=arena` e `mode=rta`; valores desconhecidos usarão o fallback de Siege.

## Arquitetura do cálculo

O cálculo continuará centralizado em uma única implementação. Uma configuração
de modo fornecerá:

- identificador do modo;
- quantidade de slots ativos;
- constante de tick;
- áreas de liderança aceitas.

A fórmula de SPD de combate continuará igual à atual. A constante de tick será
recebida pelo cálculo de tuning, em vez de permanecer fixa para Siege.

Para cada seguidor, o cálculo deverá:

1. determinar quantos ticks o primeiro monstro levou para ganhar seu turno;
2. acrescentar a posição do seguidor na sequência;
3. aplicar os boosts de ATB acumulados antes do turno daquele seguidor;
4. aplicar o buff de SPD apenas aos ticks posteriores à sua ativação;
5. considerar o aumento de efeito de SPD dos artefatos;
6. encontrar a menor SPD de combate inteira que mantém o seguidor na
   sequência;
7. converter essa SPD de combate na SPD adicional mínima das runas;
8. validar a sequência completa de trás para frente, elevando seguidores
   anteriores quando um monstro posterior os ultrapassaria.

O quarto slot usará a iteração `3`. A validação não ficará limitada a um par
específico: deverá preservar toda a sequência `1 -> 2 -> 3 -> 4` nos modos de
quatro monstros e `1 -> 2 -> 3` em Siege.

## Lideranças

A descoberta de liderança de SPD passará a receber o modo de conteúdo.

- Siege aceitará lideranças General, Guild e Element.
- Arena e RTA aceitarão lideranças General, Arena e Element.
- Lideranças Element continuarão sendo aplicadas individualmente apenas aos
  monstros do elemento correspondente.
- Apenas uma liderança poderá estar ativa.
- Se a liderança ativa deixar de ser válida após uma troca de modo, será
  ativada automaticamente a liderança válida de maior valor disponível.
- Em caso de empate, será escolhido o monstro mais à esquerda.
- O usuário continuará podendo desativar todas as lideranças válidas.

## Efeitos e alvos

Boosts de ATB e buffs de SPD continuarão sendo descobertos a partir do catálogo
e dos overrides existentes.

Nos modos Arena e RTA, efeitos de alvo único dos três primeiros monstros
poderão apontar para qualquer monstro posterior, incluindo o quarto. O quarto
monstro não oferecerá controles de efeito para a primeira sequência, pois não
há um seguidor após ele.

Boosts e buffs serão acumulados apenas quando o efeito alcançar o monstro que
está sendo calculado. Remover, substituir ou reordenar um provedor deverá
recalcular todos os resultados posteriores.

## Interface

O seletor `Siege | Arena | RTA` ficará junto aos controles gerais da
ferramenta. A troca será imediata e atualizará:

- textos de contexto;
- quantidade de cards;
- lideranças disponíveis;
- opções de alvo;
- resultados calculados;
- URL compartilhável.

Siege exibirá os três cards atuais. Arena e RTA acrescentarão `Monstro 4`, com
o subtítulo `Quarto turno`.

Os quatro cards ficarão em uma sequência horizontal apenas quando houver
largura suficiente para manter a legibilidade. Abaixo desse breakpoint, serão
empilhados e as setas apontarão para baixo. Textos principais continuarão com
pelo menos 16 px, textos secundários com 14 px, etiquetas curtas com 12 px e
controles interativos com pelo menos 44 px.

Ao alternar temporariamente para Siege, o estado do quarto slot será preservado
em memória e reaparecerá ao voltar para Arena ou RTA. Esse estado oculto não
será necessário para restaurar uma URL em modo Siege. O botão `Limpar time`
limpará todos os quatro slots, inclusive o slot oculto.

A nota inferior explicará que Siege e Arena usam ticks de 7%, enquanto RTA usa
ticks de 1,5%.

## Estado e URLs

O estado compartilhável será generalizado para quatro slots, mantendo o
significado de todos os parâmetros atuais. O quarto slot poderá usar `m4`,
`swift4`, `artifact4` e `startBuffs4` quando cada parâmetro for aplicável. O
terceiro slot passará a aceitar `boost3`, `buff3` e `target3` para efeitos que
alcancem o quarto monstro. Não haverá parâmetros de provedor de efeito para o
quarto slot.

O modo deverá ser serializado apenas quando não for Siege. A leitura validará o
modo antes de determinar a quantidade de slots e as lideranças aplicáveis.

Trocar de modo preservará os três primeiros monstros e seus controles. Se uma
liderança se tornar incompatível, ela será substituída conforme as regras de
liderança automática.

## Estados incompletos e inválidos

A sequência deverá ser preenchida da esquerda para a direita. Quando existir
um slot vazio antes de um monstro selecionado, os cards posteriores não
mostrarão um número calculado; mostrarão uma orientação para preencher o slot
anterior.

As validações atuais serão preservadas e ampliadas:

- torre limitada ao intervalo de 0% a 15%;
- boosts de ATB e artefatos limitados ao intervalo de 0% a 100%;
- SPD das runas não negativa;
- modo desconhecido tratado como Siege;
- IDs e alvos inexistentes ignorados com fallback seguro;
- resultados incompletos apresentados como `—`;
- nenhum resultado `NaN`, infinito ou negativo será exibido.

## Testes

Os testes unitários cobrirão:

- configuração, constante e quantidade de slots de cada modo;
- equivalência de Siege e Arena nos três primeiros slots para entradas iguais;
- resultados de RTA calculados com `0.00015`;
- quarto seguidor com e sem boosts acumulados;
- buff de SPD iniciado em diferentes posições;
- efeitos de alvo único direcionados ao quarto slot;
- validação em cascata da sequência de quatro monstros;
- aceitação e rejeição de lideranças por modo;
- aplicação individual de liderança Element;
- seleção automática de liderança após troca de modo;
- leitura e escrita das URLs dos três modos;
- fallback de parâmetros inválidos.

Os testes de navegação cobrirão:

- troca entre Siege, Arena e RTA;
- renderização de três ou quatro cards;
- preservação dos monstros ao alternar modos;
- restauração direta por URL;
- limpeza do quarto slot quando oculto;
- opções de alvo para o quarto slot;
- operação por teclado e estados acessíveis;
- layouts horizontal e empilhado.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` após o
build.

## Fora do escopo

Esta entrega não incluirá:

- cinco picks de RTA com simulação de bans;
- equipe inimiga ou disputa de primeiro turno;
- aumento progressivo de ATK e redução de HP do RTA;
- múltiplas rotações de turnos;
- procs de Violent, Revenge ou Nemesis;
- outros eventos aleatórios de batalha.

O escopo termina ao calcular com segurança a primeira sequência planejada do
time efetivo.
