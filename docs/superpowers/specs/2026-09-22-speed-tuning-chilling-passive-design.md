# Speed Tuning: passiva de velocidade do Chilling

## Objetivo

Representar no Speed Tuning a velocidade adicional concedida pela passiva `The Cunning` do Chilling quando ele começa a batalha com efeitos benéficos, especialmente a combinação comum de Will e Shield.

## Interface

Somente o monstro `chilling-water-958` exibirá o seletor `Buffs iniciais`, com as opções `0`, `1` e `2`.

- O valor padrão será `2`.
- O controle ficará depois da liderança de SPD e antes dos controles de boost e buff.
- Trocar o slot para outro monstro removerá o controle e zerará seu estado específico.
- Selecionar Chilling novamente restaurará o padrão de dois buffs, exceto durante a restauração explícita de uma URL compartilhada.

## Cálculo

Cada buff inicial adicionará `20 SPD` plana, totalizando:

- `0 buffs`: `+0 SPD`;
- `1 buff`: `+20 SPD`;
- `2 buffs`: `+40 SPD`.

O bônus será adicionado à SPD de combate depois dos componentes derivados da SPD base. Ele não será multiplicado pela torre, liderança ou Swift.

O mesmo bônus será considerado quando Chilling estiver em qualquer posição:

- como primeiro monstro, aumentará a SPD âncora usada para calcular os seguidores;
- como segundo ou terceiro monstro, reduzirá a SPD de runas necessária para atingir a SPD mínima de combate;
- se receber um buff de SPD durante a sequência, o cálculo de ticks continuará usando o fluxo já existente, agora partindo da SPD de combate que inclui a passiva.

No primeiro slot, o detalhe do resultado informará o bônus da passiva quando houver buffs iniciais. Nos seguidores, a SPD de combate calculada já refletirá o bônus.

## URL compartilhável

O estado usará um parâmetro por slot:

- `startBuffs1`;
- `startBuffs2`;
- `startBuffs3`.

Para Chilling, o padrão `2` será omitido. Os valores `0` e `1` serão preservados explicitamente. Parâmetros aplicados a outros monstros, valores inválidos ou valores fora do intervalo serão normalizados e removidos.

O reset removerá esses parâmetros junto com os demais parâmetros pertencentes ao Speed Tuning.

## Estrutura

O cálculo receberá um bônus opcional de SPD passiva com padrão zero. A página converterá a quantidade selecionada para SPD com a regra exclusiva do Chilling (`buffs × 20`). Dessa forma, a fórmula continua reutilizável sem acoplar a biblioteca de cálculo ao ID do monstro.

## Testes

- Validar o acréscimo de `0`, `20` e `40 SPD` no cálculo de combate.
- Validar Chilling como âncora e como seguidor.
- Validar o padrão de dois buffs na seleção inicial.
- Validar restauração, normalização e limpeza dos parâmetros `startBuffs`.
- Confirmar que outros monstros não exibam nem recebam o bônus.
- Executar testes unitários, build e testes end-to-end do Speed Tuning.
