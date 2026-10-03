# Speed Tuning: boosts de ATB condicionais

## Objetivo

Evitar que o Spd Tuning aplique automaticamente boosts de ATB que podem não
acontecer, sem criar exceções por monstro e sem adicionar um seletor de
habilidade.

Boosts fixos e garantidos continuarão ativos por padrão. Boosts condicionais
continuarão disponíveis para edição, mas partirão de um valor conservador e
serão identificados na interface.

## Modelo das habilidades

`SpeedTuningEffect` passará a separar três informações:

- `percent`: intensidade conhecida do efeito;
- `defaultPercent`: valor aplicado quando o monstro é selecionado;
- `conditional`: indica que o resultado depende do estado da batalha.

As exceções ficarão associadas ao ID da habilidade em
`src/data/speed-tuning.ts`. Nenhuma regra será associada ao ID ou ao nome de um
monstro.

Toda habilidade passiva que aumenta o ATB de aliados será considerada
condicional por padrão. Habilidades ativas condicionais serão marcadas
explicitamente nos overrides porque os dados importados não oferecem um campo
estruturado confiável para essa distinção.

As habilidades ativas inicialmente classificadas como condicionais serão:

- Pride Will Fall, de Hwahee;
- Furious March, de Janssen;
- Blade Fan, de Mihyang e Yeonhong;
- Amuse, de Wolyung;
- Cutting Magic, de Lisa, Emma e Sylvia;
- Fiery Dance, de Colleen;
- Purifying Mediation, de Neriope e Arella;
- Sword of Justice, de Agrenia e Theonia;
- Judgment Storm, de Driana.

Essa lista será registrada por IDs de habilidade, não pelos nomes acima.

## Valores iniciais

As regras de inicialização serão:

1. Boost fixo e garantido: `defaultPercent` igual a `percent`.
2. Boost passivo ou que pode resultar em zero: `defaultPercent` igual a `0`.
3. Boost com parcela mínima garantida e bônus condicional: `defaultPercent`
   igual ao mínimo garantido.

Woonsa terá intensidade total conhecida de 20%, valor inicial de 10% e será
marcado como condicional. Wedjat terá intensidade máxima de 30%, valor inicial
de 10% e também será marcado como condicional.

Ragdoll será normalizado para 10%, conforme a descrição da habilidade, mas
continuará iniciando em 0% por ser uma passiva dependente de um acerto crítico
recebido.

O valor continua editável de 0% a 100%. Informar 0% desativa o efeito no
cálculo, como ocorre atualmente.

## Habilidades que enchem a barra

Habilidades cujo efeito detectado enche 100% da barra serão excluídas
genericamente das capacidades do Spd Tuning. Elas não serão apresentadas como
boost configurável e não participarão da escolha da habilidade representativa
do monstro.

Com isso, monstros com outra habilidade de boost poderão continuar expondo
essa outra habilidade. Não haverá seletor de habilidade nesta alteração.

## Interface e estado compartilhável

O campo continuará no formato numérico atual. Para efeitos condicionais, seu
rótulo será:

`Boost de ATB (%) · Condicional`

Em inglês, o sufixo será `Conditional`. O marcador permanecerá visível mesmo
depois que o usuário editar o percentual, pois descreve a natureza da
habilidade, não o valor escolhido.

O estado da URL continuará registrando apenas valores que diferem do padrão da
habilidade. Assim, um boost condicional iniciado em 0% será incluído na URL
quando o usuário informar um valor positivo, enquanto Woonsa e Wedjat usarão
10% como padrão para serialização e restauração.

## Correções relacionadas

- O override da habilidade 1355 será documentado corretamente como Wedjat, em
  vez de Imesety.
- O valor de Ragdoll será corrigido de 15% para 10%.
- O cálculo do valor conhecido de Woonsa considerará a parcela garantida e a
  parcela adicional, totalizando 20%, sem mudar o padrão conservador de 10%.

## Testes e validação

Os testes unitários cobrirão:

- Bernard como boost fixo, garantido e ativo por padrão;
- Mihyang como boost condicional iniciado em 0%;
- Woonsa e Wedjat como condicionais iniciados em 10%;
- Ragdoll com intensidade de 10% e padrão 0%;
- exclusão de habilidades que enchem 100% da barra;
- preservação e restauração dos valores manuais pela URL.

O teste end-to-end do Spd Tuning confirmará que o rótulo condicional aparece
para Mihyang, não aparece para Bernard e permanece visível após a edição do
percentual.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` depois
da geração do build.
