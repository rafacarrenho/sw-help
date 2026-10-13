# Comparação de SPD com runas

## Objetivo

Adicionar ao Comparador de SPD uma entrada opcional de SPD adicional para cada
monstro. A nova entrada deve permitir comparar builds reais sem remover nem
alterar o funcionamento da comparação estrutural existente.

A SPD adicional é o número verde exibido pelo jogo ao lado da SPD base. Ela
inclui os atributos principal e secundários das runas e, quando aplicável, o
bônus exibido do conjunto Swift. A ferramenta calculará a SPD total somando a
SPD base e a SPD adicional informada.

## Comportamento progressivo

Cada card terá um campo numérico opcional chamado `SPD adicional`.
O preenchimento dos campos determinará automaticamente o tipo de resultado:

- com os dois campos vazios, o comparador continuará apresentando a comparação
  estrutural atual;
- com apenas um campo preenchido, a build informada será a referência e o
  outro card mostrará a SPD adicional mínima necessária para empatar e para
  ultrapassar a referência;
- com os dois campos preenchidos, o comparador mostrará qual build age
  primeiro, se há empate e a diferença entre as velocidades de combate.

Não haverá seletor de modo. Apagar uma SPD adicional fará a interface retornar
imediatamente ao comportamento correspondente aos campos que permanecerem
preenchidos.

## Interface

O novo campo ficará junto aos controles de líder, torre, Swift e buffs
iniciais de cada card. Ele aceitará somente números inteiros e usará um texto
curto para explicar que o valor esperado é o número verde exibido na tela do
monstro. Ao lado do campo, a interface mostrará a SPD total calculada.

Quando nenhum valor for informado, os cards continuarão exibindo a SPD
estrutural e os mesmos estados de vantagem, desvantagem e empate que existem
hoje.

Quando apenas um valor for informado, o card sem build exibirá os dois limites
calculados, de forma equivalente a:

- `+134 SPD para empatar (250 total)`;
- `+135 SPD para ultrapassar (251 total)`.

Os valores acima são apenas um exemplo de formato. Os números reais dependerão
da SPD base, líder, torre, Swift, passivas e arredondamentos dos dois monstros.

Quando os dois valores forem informados, cada card exibirá sua SPD total e sua
SPD de combate calculadas, e o resultado principal identificará o vencedor ou
o empate.

Os textos seguirão os tamanhos mínimos do projeto e serão adicionados em todos
os idiomas atualmente suportados.

## Cálculo

No modo com runas, a SPD adicional exibida das runas será obtida por:

```text
spdTotal = spdBase + spdAdicionalInformada
```

A SPD adicional informada será enviada ao cálculo de SPD de combate já usado
pelo projeto, junto da SPD base, torre, liderança, Swift e bônus passivos. A
SPD total calculada será apresentada pela interface.

O checkbox `Usa Swift` não adicionará novamente 25% à SPD adicional informada.
Ele servirá somente para aplicar a correção de arredondamento interno do jogo:
o bônus de Swift já está incluído no número verde exibido na tela do monstro.

Liderança e torre não fazem parte da SPD mostrada na tela do monstro e serão
acrescentadas pelo cálculo. Bônus de combate que não aparecem na tela, como a
passiva do Chilling conforme seus buffs iniciais, também continuarão sendo
aplicados separadamente.

Para descobrir os limites do lado sem SPD informada, o comparador buscará o
menor inteiro de SPD adicional exibida que alcance a SPD de combate da
referência e o menor inteiro que a ultrapasse. A busca usará a mesma função de SPD de
combate da comparação real, evitando fórmulas paralelas e diferenças de
arredondamento.

## Validação

O campo ficará desabilitado até que um monstro seja selecionado. Um valor será
válido quando for um inteiro dentro de uma faixa possível para a configuração:

- sem Swift, o mínimo será zero;
- com Swift, o mínimo será `ceil(SPD base * 25%)`, pois esse bônus já aparece
  na SPD adicional verde mostrada pelo jogo.

Valores vazios não serão tratados como zero. Valores fracionários, negativos,
não numéricos ou abaixo do mínimo exibirão uma mensagem de validação e não
produzirão um resultado de build. O comparador não exibirá `NaN`, infinito ou
velocidade negativa.

Ao trocar o monstro ou alterar Swift de forma que o número deixe de ser
possível, o valor permanecerá visível para correção, acompanhado da mensagem
de erro. Ao limpar o monstro, sua SPD adicional também será limpa.

## Estado compartilhável

As SPDs adicionais válidas serão persistidas na URL como `allyBonusSpd` e
`enemyBonusSpd`.
Quando um campo estiver vazio ou inválido, seu parâmetro será omitido.

A leitura da URL aceitará somente inteiros válidos para o monstro e a
configuração restaurados. Valores inválidos serão ignorados e removidos na
próxima sincronização. Parâmetros desconhecidos continuarão preservados.

Os parâmetros e o comportamento existentes de monstro, líder, torre, Swift e
buffs iniciais não serão alterados.

## Arquitetura

O módulo puro `src/lib/speed-comparison.ts` será ampliado com funções para:

- converter SPD adicional exibida em SPD total e SPD de combate;
- validar a SPD adicional mínima possível;
- comparar duas builds informadas;
- calcular as SPDs adicionais mínimas para empate e ultrapassagem;
- ler e escrever as novas entradas na URL.

O script de cliente manterá a decisão de apresentação baseada em zero, uma ou
duas SPDs preenchidas. A página Astro fornecerá os campos e as regiões de
mensagem acessíveis, sem duplicar o comparador em uma segunda seção.

As funções novas reutilizarão `combatSpeed` para preservar a mesma regra de
arredondamento usada pelo Spd Tuning e pelo comparador estrutural.

## Testes

Os testes unitários cobrirão:

- conversão da SPD adicional exibida para SPD total e SPD de combate com e sem
  Swift;
- ausência de dupla aplicação do bônus Swift;
- aplicação de líder, torre e passiva do Chilling;
- cálculo do menor valor para empate e do menor valor para ultrapassagem;
- comparação com duas builds, incluindo vitória de cada lado e empate;
- mínimos válidos com e sem Swift;
- leitura, escrita e normalização de `allyBonusSpd` e `enemyBonusSpd`;
- preservação integral da comparação estrutural existente.

Os testes de navegação cobrirão:

- campos desabilitados antes da seleção dos monstros;
- comparação estrutural com os dois campos vazios;
- limites de empate e ultrapassagem ao preencher apenas um lado;
- inversão da referência ao preencher somente o outro lado;
- comparação real ao preencher os dois lados;
- retorno aos modos anteriores ao apagar um valor;
- mensagens para valores impossíveis;
- restauração da comparação por URL;
- comportamento responsivo dos novos controles.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` depois
da geração do build.
