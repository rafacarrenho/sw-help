# Speed Tuning: amplificação do buff de SPD pela Miriam

## Objetivo

Representar no Spd Tuning a passiva `Blacksmith's Technique` da Miriam. Enquanto
ela fizer parte da equipe ativa, o efeito de um buff de SPD recebido por um
aliado será ampliado em 35%.

A passiva só altera o cálculo durante os ticks em que o monstro estiver sob
buff de SPD. Ela não concede SPD por conta própria, não modifica boost de barra
de ataque, liderança, torre, Swift nem bônus passivos como o do Chilling.

## Regra confirmada

O buff normal de SPD aumenta em 30% a velocidade usada para preencher a barra
de ataque. A Miriam amplia o efeito desse buff em 35%; portanto, sem artefato,
o modificador passa de 30% para 40,5%:

```text
efeito do buff = 30% × (1 + 35%) = 40,5%
```

O atributo de artefato `Increase SPD Effect` e a passiva da Miriam são
amplificadores aditivos entre si. Para um monstro com `A%` no artefato:

```text
efeito do buff = 30% × (1 + (A% + 35%) / 100)
```

Exemplos:

- sem Miriam e sem artefato: `30%`;
- com Miriam e sem artefato: `40,5%`;
- sem Miriam e com artefato de 20%: `36%`;
- com Miriam e artefato de 20%: `46,5%`.

Não se deve calcular `30% × 1,35 × 1,20`, pois isso multiplicaria entre si dois
amplificadores que o jogo soma. A habilidade também informa que efeitos iguais
não acumulam; duas Miriams continuam concedendo apenas 35% de amplificação.

### Fontes da regra

- O catálogo local importado do SWARFARM registra a passiva da Miriam com 35%
  e informa que efeitos iguais não acumulam (`skill 3261`).
- O histórico da Miriam no SWGT confirma a alteração da passiva de 25% para
  35%: <https://swgt.io/monsterSearch/?com2usID=25812>.
- A documentação de mecânicas da Ellia's Wiki descreve os amplificadores de
  buff como multiplicativos sobre o valor-base do buff e aditivos entre si,
  citando explicitamente a interação entre Miriam e artefatos:
  <https://elliabot.neocities.org/game_mechanics/damage_calculations/>.
- Uma implementação pública de ferramenta de tuning também identifica Miriam
  como `+35% speed buff effectiveness`:
  <https://lucksack.gg/ko/tools/speed-tuner>.

As duas últimas fontes são comunitárias. A fórmula será protegida por testes
unitários explícitos para que uma futura correção da mecânica possa ser feita em
um único ponto.

## Escopo da passiva

A amplificação ficará ativa quando `miriam-fire-1897` estiver em qualquer slot
visível do modo atual:

- os três slots de Siege;
- os quatro slots de Arena ou RTA.

Ela será aplicada a qualquer integrante da mesma equipe que esteja recebendo um
buff de SPD, inclusive a própria Miriam. A posição da Miriam na sequência não
importa, pois a passiva é automática e já está ativa antes de ela ganhar um
turno.

A amplificação não será aplicada quando:

- não houver Miriam em um slot ativo;
- o alvo ainda não tiver recebido buff de SPD naquele tick;
- o usuário desativar o buff de SPD do monstro que o fornece;
- um efeito de alvo único conceder o buff a outro integrante: somente o alvo
  selecionado receberá o buff ampliado;
- Miriam estiver guardada no quarto slot enquanto o modo Siege estiver ativo.

Trocar o modo ou remover Miriam recalculará imediatamente toda a equipe.

## Arquitetura do cálculo

`tuneFollower` receberá um campo explícito para a amplificação do buff causada
por uma passiva de equipe, separado de `artifactSpeedIncrease`. O modificador de
SPD durante os ticks com buff será calculado a partir da soma dos dois valores:

```text
speedModifier = 1 + 0,30 × (1 + (artifact + teamPassive) / 100)
```

O parâmetro terá valor padrão zero. Assim, consumidores existentes preservam o
comportamento atual e a biblioteca de cálculo não dependerá diretamente do ID
da Miriam.

A página continuará responsável por interpretar a composição da equipe. Ela
detectará a presença da Miriam apenas entre os slots ativos e enviará `35` ao
cálculo de cada seguidor. A regra será representada por constantes nomeadas para
o ID e a porcentagem, evitando números mágicos e permitindo localizar a exceção
facilmente.

O `speedBuffStartIteration` continuará sendo a autoridade para decidir se e
quando o alvo recebeu buff de SPD. A passiva apenas muda a intensidade do buff;
não cria um novo caminho de aplicação nem altera a escolha de alvos.

## Interface e estado compartilhável

Não haverá controle manual: a passiva é inerente à Miriam e será aplicada
automaticamente quando as condições forem atendidas.

Quando Miriam estiver em um slot ativo, a página exibirá uma indicação curta e
localizada informando que sua passiva de `+35% no efeito do buff de SPD` está
sendo considerada. A indicação não afirmará que todos os monstros estão mais
rápidos; ela deixará explícito que o efeito depende de um buff de SPD ativo.

Nenhum parâmetro novo será adicionado à URL. A presença da Miriam já é
persistida pelo parâmetro do monstro (`m1`, `m2`, `m3` ou `m4`), e o estado dos
buffs já usa os parâmetros `buffN` existentes.

## Interações futuras

Ao adicionar outra habilidade que amplifique buffs de SPD, deve-se primeiro
confirmar no jogo se ela acumula com a Miriam e com artefatos. O cálculo aceita
um percentual agregado de passivas da equipe, mas a página deve respeitar as
regras de não acumulação antes de formar esse valor.

Esta regra é diferente de três mecânicas já existentes:

- `Increase SPD Effect` do artefato pertence ao monstro que recebe o buff;
- a Miriam fornece uma amplificação de equipe enquanto estiver presente;
- a passiva do Chilling concede SPD plana por buff e não é um buff de SPD.

Essas grandezas devem permanecer em campos separados. Somente artefato e
amplificadores compatíveis entram na soma interna do efeito do buff. A SPD plana
do Chilling continua sendo adicionada à SPD de combate, fora do multiplicador.

## Validação

Os testes unitários cobrirão:

- buff normal sem Miriam nem artefato;
- buff ampliado pela Miriam para 40,5%;
- combinação aditiva de Miriam e artefato;
- passiva configurada sem buff ativo, sem alteração do resultado;
- valor padrão zero para preservar chamadas existentes;
- duas Miriams sem duplicação do bônus.

Os testes end-to-end cobrirão:

- Miriam antes e depois do provedor do buff na ordem do time;
- buff de equipe e buff de alvo único;
- desativação do buff removendo o efeito da passiva;
- remoção da Miriam restaurando o cálculo normal;
- quarto slot contado em Arena/RTA e ignorado em Siege;
- indicação visual nos idiomas inglês e português;
- preservação correta da composição em URL compartilhável.

Após a implementação, executar `pnpm test`, `pnpm build` e, com o build gerado,
`pnpm test:e2e`.
