# Controles simplificados do Comparador de SPD

## Objetivo

Remover do Comparador de SPD uma escolha que não altera a fórmula e deixar a
configuração inicial alinhada ao uso mais comum: monstros equipados com Swift.

## Lideranças sem seletor de conteúdo

O seletor `Siege | Arena | RTA` e seu texto auxiliar serão removidos da página.
O comparador exibirá, para qualquer monstro selecionado, todos os percentuais
únicos encontrados nas habilidades de liderança de SPD do catálogo, além de
`Sem líder`.

Área e elemento da habilidade de liderança não filtrarão a lista. O comparador
é uma ferramenta estrutural; cabe à pessoa escolher a porcentagem que representa
o cenário desejado.

O estado do comparador deixará de possuir `mode`. O parâmetro legado `mode`
será ignorado na leitura e removido da URL na próxima sincronização, sem impedir
que links antigos abram normalmente.

## Swift ativo por padrão

Os dois controles `Usa Swift` começarão marcados, inclusive no estado vazio e
desabilitado dos cartões. Selecionar, trocar ou limpar um monstro restaurará o
Swift daquele lado para ativo. A pessoa ainda poderá desmarcá-lo após selecionar
um monstro.

Na leitura da URL, ausência do parâmetro de Swift significará `ativo`. O valor
`0` significará `inativo`; o valor legado `1` continuará sendo aceito como
`ativo`.

Na escrita da URL, o padrão ativo será omitido. Somente uma escolha inativa de
um lado com monstro selecionado será persistida como `allySwift=0` ou
`enemySwift=0`. Parâmetros legados com valor `1` serão removidos na próxima
sincronização.

## Implementação

- A página removerá o `fieldset` de conteúdo e marcará os checkboxes Swift no
  HTML inicial.
- A função de catálogo das lideranças retornará todos os percentuais de SPD sem
  receber modo ou elemento.
- O estado puro e o script da interface removerão as dependências de
  `SpeedTuningMode`.
- Seleção, troca, limpeza e restauração pela URL usarão Swift ativo como padrão.
- A fórmula estrutural, as torres independentes e os estados visuais de
  vantagem, desvantagem e empate não serão alterados.

## Testes

Os testes unitários e de navegação verificarão:

- ausência do seletor de conteúdo;
- disponibilidade de todos os percentuais de liderança, incluindo `20%` e
  `30%`, para qualquer monstro;
- Swift marcado por padrão nos dois lados;
- seleção de monstro preservando o padrão ativo;
- desativação persistida por `Swift=0` e padrão ativo omitido da URL;
- normalização de links antigos que contenham `mode` ou `Swift=1`;
- cálculos, estados semânticos e layout móvel preservados.

A validação executará `pnpm test`, `pnpm build` e `pnpm test:e2e`.
