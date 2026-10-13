# Runas bloqueadas na busca máxima

## Problema

O Rune Optimizer inicia com `Permitir runas bloqueadas` desmarcado. Como builds
equipadas normalmente usam runas bloqueadas, a busca pode descartar a melhor
build já existente e sugerir um adicional menor. No JSON de validação, as seis
runas da Adriana estão bloqueadas: sem elas o melhor potencial é `+220 SPD`; com
elas, o motor encontra corretamente `+227 SPD`.

## Decisão

O filtro de runas bloqueadas continuará disponível, mas começará marcado. A
busca padrão representará o maior resultado possível com todas as runas da
conta, independentemente do bloqueio. O jogador ainda poderá desmarcar a opção
para planejar apenas com runas desbloqueadas.

Não será adicionada comparação com a build equipada nem alterado o algoritmo de
otimização. O resultado continuará mostrando apenas como a build selecionada
ficará, conforme a decisão anterior do produto.

## Validação

O teste de navegador confirmará que o filtro começa marcado e que uma runa
bloqueada participa da melhor build por padrão. Os testes do motor continuarão
garantindo que `includeLocked: false` exclui essas runas quando o usuário opta
por desmarcar o filtro.
