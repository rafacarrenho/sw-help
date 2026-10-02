# SW Help — ação de limpar sempre visível

## Objetivo

Exibir uma ação de limpar em todo campo de busca sempre que ele tiver conteúdo,
inclusive quando o campo não estiver com foco nem sob o ponteiro. O ajuste deve
cobrir as buscas do catálogo de defesas, catálogo de monstros, Spd Tick e os
três seletores de monstro do Spd Tuning.

## Comportamento

- Cada `input[type="search"]` terá um botão explícito com ícone de fechar.
- O botão ficará visualmente oculto e fora da interação quando o campo estiver
  vazio.
- Ao existir qualquer conteúdo, o botão ficará permanentemente visível,
  independentemente de hover ou foco.
- Ao acioná-lo, o valor será apagado, um evento `input` será disparado e o foco
  retornará ao campo. Assim, filtros, resultados, URL e seleção de monstro serão
  atualizados pelos fluxos já existentes.
- O controle de limpeza nativo do navegador será ocultado para evitar dois
  ícones concorrentes.

## Estrutura

Os quatro contextos de busca reutilizarão a classe `search-clear-button` e o
atributo `data-search-clear`. Um script global pequeno associará o clique ao
campo de busca presente no mesmo contêiner. A visibilidade será controlada em
CSS por `:placeholder-shown`, que também reage a valores restaurados por URL ou
definidos programaticamente.

O botão terá alvo mínimo de 32 px, contraste compatível com o tema e nome
acessível `Limpar busca`. O foco por teclado terá o mesmo destaque dourado dos
demais controles.

## Responsividade

O botão ocupará espaço reservado à direita do campo, sem sobrepor texto. No
catálogo de defesas, ele permanecerá antes da dica “nomes em qualquer ordem”.
Nos seletores de monstro, ficará alinhado verticalmente no lado direito.

## Testes

- Confirmar que a ação está oculta quando o campo está vazio.
- Preencher e desfocar o campo; confirmar que a ação continua visível.
- Acionar a limpeza e confirmar campo vazio, foco restaurado e atualização do
  estado correspondente.
- Validar os quatro contextos em desktop e mobile nos testes E2E pertinentes.

## Fora do escopo

Não serão alterados algoritmos de busca, opções dos seletores, filtros,
cálculos de SPD ou a aparência de botões de reset completos.
