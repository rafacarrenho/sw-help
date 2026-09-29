# Comparador estrutural de SPD

## Objetivo

Criar uma página que compare a vantagem estrutural de velocidade entre dois
monstros sem exigir as builds de runas. A comparação deve responder quem parte
na frente e quantos pontos de SPD adicional das runas o lado vencedor pode
ceder sem perder o primeiro turno.

Exemplo principal: comparar Adriana com liderança de 24% e Swift contra Triton
com Swift e sem liderança.

## Escopo

A nova rota será `/comparador-spd/` e terá um item `Comparador de SPD` na
navegação principal. A ferramenta aceitará os mesmos contextos do Spd Tuning:

- Siege;
- Arena;
- RTA.

O comparador não montará equipes, não simulará boosts de barra de ataque e não
receberá a SPD real das runas. Ele compara somente as vantagens presentes antes
dos atributos adicionais individuais das runas.

## Entradas

Haverá um seletor global de modo `Siege | Arena | RTA` e dois lados
independentes: `Seu monstro` e `Monstro inimigo`.

Cada lado terá:

- busca e seleção de um monstro do catálogo;
- seletor de liderança de SPD;
- controle `Usa Swift`;
- seletor de torre de SPD de 0% a 15%.

As torres aliada e inimiga serão independentes e começarão em 15%.

As opções de liderança serão derivadas dos dados do catálogo, sem uma lista
manual de porcentagens. Serão filtradas pelas áreas válidas do modo:

- Siege: General, Guild e Element;
- Arena e RTA: General, Arena e Element.

Porcentagens repetidas serão exibidas uma única vez. `Sem líder` sempre estará
disponível. Isso inclui todas as possibilidades aplicáveis do catálogo, como a
liderança elemental de 30%. Lideranças elementais só entrarão nas opções quando
o catálogo tiver aquele percentual para o elemento do monstro selecionado.

Trocar o modo preservará os monstros, Swift e torres. Se uma liderança deixar
de ser válida, ela será redefinida para `Sem líder`.

## Cálculo

A SPD estrutural é a SPD de combate considerando apenas:

- SPD base do monstro;
- bônus percentual da torre daquele lado;
- liderança daquele lado;
- bônus fixo de 25% do conjunto Swift, quando ativo.

Neste documento, `SPD adicional das runas` significa apenas a SPD fornecida
pelos atributos principal e secundários das runas. O bônus fixo do conjunto
Swift já pertence à SPD estrutural e não entra novamente nessa diferença.

O cálculo seguirá a mesma regra de arredondamento já usada pelas ferramentas de
SPD do projeto. Para reutilizar a função de SPD de combate existente, o bônus
verde estrutural de Swift será `ceil(baseSPD * 25 / 100)` e a correção interna
de Swift continuará removendo somente o excesso visual de arredondamento.

De forma equivalente:

```text
spdEstrutural = ceil(
  baseSPD * (1 + torre / 100 + liderança / 100 + swift / 100)
)
```

onde `swift` vale 25 quando ativo e 0 quando inativo.

A vantagem estrutural será o valor absoluto da diferença entre os dois
resultados. Se a diferença for `D > 0`:

- o vencedor pode ter até `D - 1` pontos a menos de SPD adicional das runas e
  ainda agir primeiro;
- com exatamente `D` pontos a menos, os dois chegam à mesma SPD de combate;
- a ferramenta não garantirá quem age primeiro em um empate entre equipes.

Se `D = 0`, o resultado será `Empate estrutural`. A página explicará que um
único ponto adicional de SPD pode decidir a disputa.

Com torre de 15%, Adriana de SPD base 111, líder 24% e Swift terá 183 SPD
estrutural. Triton de SPD base 116, sem líder e com Swift terá 163. A vantagem
da Adriana será 20 SPD, permitindo até 19 SPD adicionais a menos sem perder a
comparação estrita.

## Interface e conteúdo

A introdução seguirá o padrão visual das páginas de ferramenta existentes,
com título `Comparador de SPD` e explicação curta de que a página compara a
vantagem antes das velocidades individuais das runas.

Em telas largas, os dois cards ficarão lado a lado. Em telas menores, serão
empilhados. Cada card mostrará retrato, nome, elemento e SPD base do monstro
selecionado. Textos principais terão pelo menos 16 px, secundários 14 px,
etiquetas curtas 12 px e controles interativos pelo menos 44 px.

O resultado aparecerá após os cards e terá:

- nome e retrato do vencedor;
- SPD estrutural calculada dos dois lados;
- diferença em destaque, por exemplo `Vantagem de 20 SPD`;
- consequência prática, por exemplo `Adriana pode ter até 19 SPD adicional a
  menos e ainda agir primeiro`;
- linha de empate, por exemplo `Com 20 SPD adicional a menos, as velocidades
  empatam`.

Enquanto um dos lados estiver vazio, o resultado mostrará uma orientação para
selecionar os dois monstros, sem números parciais apresentados como conclusão.

Uma nota explicará que o cálculo mede vantagem estrutural. Velocidades das
runas, passivas, buffs, debuffs, boosts de barra, artefatos e efeitos de batalha
podem alterar a ordem real.

## Arquitetura

O cálculo ficará em um módulo puro e testável, separado da interface. Esse
módulo será responsável por:

- descobrir as porcentagens de liderança válidas para cada modo;
- calcular a SPD estrutural de um lado;
- comparar os lados e produzir vencedor, diferença e tolerância de runas;
- normalizar o estado recebido pela URL.

A página Astro serializará apenas os dados necessários do catálogo. Um script
de cliente controlará os comboboxes, mudanças de modo, recálculo e sincronização
da URL. A busca de monstros seguirá o comportamento acessível já utilizado no
Spd Tuning, incluindo teclado, fechamento, limpeza e retrato de fallback.

## Estado compartilhável

O estado será salvo em query parameters. Serão serializados:

- `mode`, somente quando diferente de Siege;
- `ally` e `enemy`, com os IDs dos monstros;
- `allyLeader` e `enemyLeader`, somente quando diferentes de zero;
- `allySwift` e `enemySwift`, com valor `1` somente quando ativos;
- `allyTower` e `enemyTower`, somente quando diferentes do padrão de 15%.

Parâmetros desconhecidos serão preservados. IDs inexistentes, percentuais de
liderança inválidos, torres fora de 0–15 e modos desconhecidos terão fallback
seguro. Nenhum `NaN`, infinito ou valor negativo será exibido.

## Testes

Os testes unitários cobrirão:

- descoberta completa das lideranças por modo, incluindo 30%;
- exclusão de áreas incompatíveis com o modo;
- cálculo com e sem Swift;
- torres diferentes nos dois lados;
- vitória aliada, vitória inimiga e empate;
- regra `diferença - 1` para a folga estrita;
- exemplo Adriana 183 contra Triton 163;
- leitura, escrita e normalização da URL.

Os testes de navegação cobrirão:

- acesso pelo novo item do menu;
- seleção dos dois monstros por mouse e teclado;
- troca entre Siege, Arena e RTA;
- opções completas de liderança;
- atualização imediata do resultado e da URL;
- restauração de uma comparação por link;
- estados vazios e parâmetros inválidos;
- layout lado a lado no desktop e empilhado no celular.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` após a
geração do build.
