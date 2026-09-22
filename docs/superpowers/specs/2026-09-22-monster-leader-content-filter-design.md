# Filtro de conteúdo da habilidade de líder

## Objetivo

Adicionar ao Catálogo de Monstros um filtro para o contexto em que a habilidade de líder se aplica. O novo campo deve aparecer imediatamente depois de “Habilidade de líder” e funcionar em conjunto com todos os filtros existentes.

## Interface

O campo será um seletor chamado “Conteúdo da habilidade de líder”. Ele terá as opções:

- Todos
- Global
- Arena
- Masmorras
- Guild
- Por elemento
- Global + Arena
- Global + Guild

O seletor reutilizará o layout responsivo dos filtros atuais. A opção “Todos” não restringirá os resultados.

## Regras de filtragem

Os contextos individuais correspondem aos valores de origem do catálogo: `General`, `Arena`, `Dungeon`, `Guild` e `Element`. O rótulo “Global” representa `General`.

As opções customizadas representam a soma dos contextos:

- “Global + Arena” inclui monstros cuja habilidade de líder seja `General` ou `Arena`.
- “Global + Guild” inclui monstros cuja habilidade de líder seja `General` ou `Guild`.

O filtro de conteúdo será combinado com os demais por interseção. Por exemplo, “SPD” em “Habilidade de líder” e “Global + Arena” em conteúdo retornará apenas líderes de SPD globais ou de Arena. Selecionar um contexto exclui naturalmente monstros sem habilidade de líder.

## Estado e navegação

O valor será representado pelo parâmetro `leaderScope` na URL, validado junto aos demais filtros. Ele deverá ser preservado na paginação, no histórico do navegador e na ida e volta entre o catálogo e a ficha do monstro. Valores inválidos serão ignorados.

## Validação

Os testes unitários cobrirão contextos individuais, as duas uniões customizadas, a combinação com o atributo da liderança e a rejeição de valores inválidos. O teste de navegação confirmará a posição do campo, a atualização dos resultados e a persistência do valor pela URL e pela ficha.
