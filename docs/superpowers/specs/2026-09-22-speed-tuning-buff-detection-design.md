# Speed Tuning: detecção de buff de SPD e ordem do alvo

## Objetivo

Corrigir a identificação de monstros que aplicam buff de SPD ao time, incluindo Adriana e Chilling, e posicionar o seletor de alvo imediatamente depois do campo de boost de ATB.

## Detecção do buff de SPD

Uma habilidade será reconhecida como buff de SPD do time quando:

- possuir o efeito estruturado `Increase ATK SPD`; e
- estiver marcada como `aoe: true` no catálogo de habilidades; e
- a descrição confirmar que o efeito alcança todos os aliados.

O indicador estruturado de área será combinado ao contexto da descrição antes da análise textual existente. A análise da descrição continuará como fallback para habilidades de alvo único ou registros em que o campo de área não seja suficiente.

Habilidades passivas, buffs próprios e ataques em área que aumentem somente a velocidade do usuário não serão classificados como buff do time apenas por possuírem o efeito `Increase ATK SPD`.

## Ordem dos controles

Nos dois primeiros slots, a ordem relevante será:

1. SPD das runas, quando disponível;
2. liderança de SPD;
3. boost de ATB;
4. alvo do efeito, quando necessário;
5. buff de SPD;
6. aumento do efeito de SPD, quando aplicável;
7. Swift.

O seletor de alvo continuará visível somente para efeitos de alvo único e será renderizado imediatamente após o boost de ATB.

## Estado e cálculo

A mudança não altera as fórmulas do Speed Tuning. Uma vez reconhecido, o buff de SPD continuará usando o bônus padrão de 30% e participará do mesmo fluxo de cálculo, query params e restauração já existente.

## Testes

- Confirmar que Adriana possui buff de SPD do time.
- Confirmar que Chilling possui buff de SPD do time pela habilidade ativa em área.
- Preservar a identificação de buffs individuais, como Dova.
- Confirmar que ataques em área com buff próprio, como o de Clara, não sejam classificados como buff do time.
- Confirmar que o seletor de alvo aparece imediatamente depois do boost de ATB.
- Executar testes unitários, build e testes end-to-end do Speed Tuning.
