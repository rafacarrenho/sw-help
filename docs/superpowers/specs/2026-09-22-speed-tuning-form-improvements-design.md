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

## Simplificação visual dos controles

Swift, liderança de SPD e buff de SPD usarão exatamente o mesmo controle:
checkbox e texto em linha, sem borda, fundo, estado visual no contêiner ou
contêiner intermediário. O estado marcado será indicado somente pelo próprio
checkbox.

O resumo do monstro continuará agrupando retrato, nome, elemento e SPD base para
fins de layout, mas não terá borda, fundo ou preenchimento que o faça parecer um
campo de formulário.

O boost de ATB será um campo simples no mesmo padrão da SPD de runas: texto do
label e input numérico ocupando a largura disponível. A unidade `%` ficará no
label e não exigirá um wrapper interno ao input.

O campo "Efeito de aumento de SPD" seguirá o mesmo padrão: unidade no label,
input direto e nenhum fundo, borda ou wrapper de sufixo.

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
- Remover wrappers de apresentação dos checkboxes e do boost de ATB.
- Remover wrappers de apresentação do efeito de aumento de SPD.
- Remover o tratamento visual de caixa do resumo do monstro.

## Validação

- Testar líder inicial automático, preservação de líder maior e troca para um
  líder novo de valor superior.
- Testar fallback para a maior liderança restante após remover o líder ativo.
- Testar boost aplicado com valor positivo e desativado com `0%`, mantendo
  input e seletor de alvo visíveis.
- Confirmar que os nomes das habilidades não são renderizados.
- Executar `pnpm test`, `pnpm build` e `pnpm test:e2e`.
