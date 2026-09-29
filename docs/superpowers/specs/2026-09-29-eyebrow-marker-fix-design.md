# Correção do marcador dos cabeçalhos

## Problema

O seletor global `.eyebrow > span` aplica o estilo do losango decorativo a qualquer `span` filho. O texto dinâmico do Spd Tuning passou a usar um `span` próprio e, por isso, recebeu largura, altura, fundo e rotação do marcador.

## Solução

- Identificar o losango com a classe explícita `eyebrow-mark`.
- Restringir o seletor global a `.eyebrow > .eyebrow-mark`.
- Atualizar os quatro cabeçalhos que exibem o losango: Siege Counter, catálogo de monstros, Spd Tick e Spd Tuning.
- Manter os demais estilos, textos e comportamentos inalterados.

## Validação

- Confirmar que o texto dinâmico do Spd Tuning permanece horizontal e sem dimensões artificiais.
- Executar os testes pertinentes e o build.
