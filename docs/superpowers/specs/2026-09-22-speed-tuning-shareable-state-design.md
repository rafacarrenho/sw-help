# Speed Tuning: estado compartilhável por URL

## Objetivo

Representar todo o estado editável do Speed Tuning em query params para que o
resultado possa ser copiado, aberto em outra aba e restaurado sem diferenças.
A URL será atualizada automaticamente a cada alteração, seguindo o padrão já
usado pelo Speed Tick.

## Formato dos parâmetros

Os parâmetros serão legíveis e usarão números de slot de `1` a `3`:

- `tower`: bônus da torre quando diferente do padrão de 15%;
- `m1`, `m2`, `m3`: IDs dos monstros;
- `r1`: SPD das runas do primeiro monstro quando maior que zero;
- `swift1`, `swift2`, `swift3`: presença de Swift, usando `1` para ativo;
- `leader`: slot da liderança ativa, usando `1`, `2` ou `3`; o valor `0`
  representa uma liderança deliberadamente desativada;
- `boost1`, `boost2`: boost de ATB quando diferente do valor padrão do monstro,
  incluindo `0` para representar o boost desativado;
- `buff1`, `buff2`: usa `0` quando o buff de SPD disponível foi desativado;
- `target1`, `target2`: slot alvo, em numeração de `1` a `3`, quando diferente
  do alvo padrão;
- `artifact2`, `artifact3`: efeito de aumento de SPD quando maior que zero.

Valores padrão serão omitidos para reduzir a URL. Parâmetros que não pertencem
ao Speed Tuning, como `utm_source`, e o hash atual serão preservados.

Exemplo:

```text
?m1=kabilla-light-430&r1=230&swift1=1&boost1=25&m2=gemini-light-657&leader=2&m3=talisman-light-1680
```

## Leitura, validação e navegação

A leitura será feita por funções puras em `src/lib/speed-tuning.ts`. IDs de
monstros serão validados contra o catálogo da página. Percentuais, índices e SPD
serão limitados aos intervalos aceitos pela interface. Estado dependente de uma
capacidade ausente no monstro será ignorado.

Ao carregar a página, o estado será hidratado antes da primeira renderização.
Alterações usarão `history.replaceState`, sem recarregar a página. Eventos de
`popstate` restaurarão o estado ao navegar para trás ou para frente. Depois da
restauração, parâmetros inválidos ou redundantes serão normalizados, mantendo
parâmetros externos e o hash.

Quando `leader` estiver ausente, a seleção automática escolherá a maior
liderança disponível, usando o slot mais à esquerda em caso de empate. Quando
existirem lideranças selecionadas, a URL normalizada sempre incluirá `leader`
para preservar exatamente a escolha ativa ou sua desativação com `leader=0`.

O botão "Limpar time" retornará torre, slots e efeitos aos padrões e removerá
somente os parâmetros pertencentes ao Speed Tuning.

## Campos numéricos zerados

Os inputs numéricos de SPD das runas, boost de ATB e efeito de aumento de SPD
mostrarão uma string vazia quando o estado interno for zero. Apagar um desses
campos continuará definindo seu valor como zero, preservando o comportamento do
cálculo e da URL.

O seletor Torre SPD não seguirá essa regra: a opção `0%` continuará visível
porque representa uma escolha explícita dentro de uma lista.

## Testes

- Testes unitários validarão leitura, escrita, valores padrão, limites,
  parâmetros inválidos e preservação de parâmetros externos.
- Testes E2E montarão um time completo, verificarão a URL e recarregarão a
  página para confirmar o mesmo resultado.
- Testes E2E cobrirão `popstate`, limpeza do time e normalização de URL inválida.
- Testes de interface confirmarão que estados numéricos iguais a zero aparecem
  como campos vazios em desktop e mobile.
- A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e`.
