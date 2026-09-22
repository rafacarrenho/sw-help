# Speed Tuning: melhorias de liderança e efeitos

## Objetivo

Reduzir ações redundantes ao montar o time e deixar os controles de efeitos
mais diretos, sem alterar a fórmula de tuning.

## Liderança automática

Ao selecionar um monstro com liderança de SPD válida para Siege, a liderança
dele será ativada automaticamente quando:

- não houver outra liderança ativa; ou
- o valor da liderança nova for maior que o valor da liderança ativa.

Uma liderança ativa de valor maior ou igual não será substituída. O usuário
continuará podendo selecionar manualmente qualquer uma das lideranças
disponíveis, mantendo a regra de apenas uma liderança ativa.

Se o monstro que fornece a liderança ativa for removido ou substituído, a maior
liderança disponível entre os monstros restantes será ativada automaticamente.
Em caso de empate, será mantido o monstro mais à esquerda.

## Boost de ATB

O checkbox "Usar boost de ATB" será removido. O valor numérico será o único
controle do boost:

- o valor máximo conhecido continuará preenchido automaticamente;
- valores maiores que zero aplicam o boost no cálculo;
- `0%` desativa o boost;
- o input permanecerá visível em `0%`;
- para efeitos de alvo único, o seletor de alvo também permanecerá visível em
  `0%`.

## Buff de SPD e nomes de habilidades

O buff de SPD continuará usando checkbox porque não possui intensidade numérica
editável. Os nomes das habilidades deixarão de aparecer tanto no boost de ATB
quanto no buff de SPD. A detecção das capacidades continuará baseada nos mesmos
dados internos.

## Escopo técnico

- Simplificar o estado do slot removendo `boostEnabled`.
- Considerar `boostPercent > 0` ao acumular boosts.
- Manter o alvo visível sempre que o monstro possuir boost ou buff de alvo
  único, independentemente do valor atual do boost.
- Centralizar a escolha automática da liderança ao selecionar, remover ou
  substituir monstros.
- Remover a marcação e as referências JavaScript usadas apenas para exibir os
  nomes das habilidades.
- Ajustar estilos somente onde necessário para o novo bloco de boost.

## Validação

- Testar líder inicial automático, preservação de líder maior e troca para um
  líder novo de valor superior.
- Testar fallback para a maior liderança restante após remover o líder ativo.
- Testar boost aplicado com valor positivo e desativado com `0%`, mantendo
  input e seletor de alvo visíveis.
- Confirmar que os nomes das habilidades não são renderizados.
- Executar `pnpm test`, `pnpm build` e `pnpm test:e2e`.

