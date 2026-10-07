# Configuração genérica de counters com overrides por defesa

## Objetivo

Permitir que o mesmo trio ofensivo seja reutilizado contra várias defesas de
Siege sem duplicar toda a configuração. Cada vínculo entre counter e defesa
poderá alterar somente o que muda naquele confronto, como instruções, runas,
ordem de ataque, Tick e fontes.

A página da defesa também poderá exibir uma ordem de eliminação própria do
confronto. O primeiro caso será aplicado aos counters com Shihwa contra
`Morris · Trevor · Figaro`.

## Abordagens consideradas

### Manter um registro completo por defesa

É a estrutura atual. Tem implementação simples, mas replica time, runas e
atributos em cada defesa. Isso já fez descrições genéricas serem copiadas para
confrontos que exigem estratégias diferentes. A abordagem será substituída.

### Configuração genérica com overrides explícitos por confronto

É a abordagem escolhida. Cada trio ofensivo terá uma configuração-base e uma
lista de confrontos. O confronto herdará a base e declarará apenas os campos
que precisar alterar. O resolvedor aceitará uma lista limitada e tipada de
overrides, evitando alterações acidentais na identidade do counter.

### Herança livre por deep merge

Permitiria sobrescrever qualquer chave do objeto. Apesar de flexível, tornaria
difícil prever o resultado de arrays e objetos aninhados, além de permitir que
um confronto alterasse o trio e deixasse de representar o mesmo counter. Essa
abordagem não será usada.

## Modelo de dados

`src/data/counters.json` deixará de armazenar uma cópia completa para cada
defesa. O arquivo terá uma definição por trio ofensivo:

```json
{
  "id": "platy-shihwa-iona",
  "team": ["platy-fire-835", "shihwa-fire-244", "iona-light-661"],
  "turnOrder": ["platy-fire-835", "shihwa-fire-244", "iona-light-661"],
  "runes": [],
  "tick": 5,
  "sources": [],
  "matchups": [
    {
      "defenseId": "morris-trevor-figaro",
      "killOrder": ["morris-wind-1020", "figaro-light-663", "trevor-fire-894"],
      "overrides": {}
    }
  ]
}
```

`id` e `team` formam a identidade da configuração-base e não poderão ser
alterados por um confronto. Se o trio ofensivo mudar, será outro counter.
`defenseId` identifica o vínculo, e `killOrder` pertence exclusivamente a esse
vínculo porque é formado pelos monstros inimigos.

Os campos permitidos em `overrides` serão:

- `turnOrder`;
- `runes`;
- `tick`;
- `sources`.

`turnOrder` e `sources` substituirão integralmente os valores genéricos quando
forem declarados. `tick` substituirá o valor escalar.

### Merge de runas

Os overrides de runa serão identificados por `monsterId`. Monstros sem override
continuarão usando sua runa genérica. Para o monstro alterado:

- `sets`, quando presente, substituirá os sets genéricos;
- `stats` será mesclado atributo por atributo;
- um atributo de `stats` com valor `null` removerá a meta genérica;
- `preferredStats`, quando presente, substituirá a lista genérica;
- uma lista vazia de `preferredStats` removerá todas as preferências genéricas.

O resolvedor produzirá um objeto novo e não modificará a definição-base. Assim,
um override de uma defesa não poderá vazar para outra defesa.

## Conteúdo localizado

Cada arquivo `src/data/locales/<locale>/counters.json` passará a ser organizado
pelo ID genérico do counter. Toda configuração terá uma instrução genérica e
poderá ter instruções específicas por defesa:

```json
{
  "platy-shihwa-iona": {
    "instruction": "Generic instructions.",
    "matchups": {
      "morris-trevor-figaro": "Defense-specific instructions."
    }
  }
}
```

O texto específico será usado quando existir; caso contrário, será usada a
instrução genérica. A cobertura em inglês será a matriz editorial: se o inglês
declarar uma instrução específica para determinado counter e defesa, `pt-BR`,
`es`, `fr` e `de` deverão declarar o mesmo vínculo traduzido.

Nomes de monstros e nomes ou descrições de habilidades importados do SWARFARM
continuarão em inglês. Somente a orientação autoral do PlayerDojo será
localizada.

## Counter com Shihwa contra Morris, Trevor e Figaro

Os três counters abaixo receberão instrução específica e a ordem de eliminação
`Morris → Figaro → Trevor`:

- `Platy · Shihwa · Iona`;
- `Platy · Shihwa · Betta`;
- `Betta · Shihwa · Iona`.

O sentido canônico da instrução será:

> Manter Trevor controlado com o sleep de Shihwa enquanto foca Morris. Depois
> de eliminar Morris, matar Figaro e deixar Trevor por último. Os revivers devem
> sustentar o time durante a luta.

Essa orientação será traduzida para os cinco idiomas. Nenhuma estratégia será
inventada para outros confrontos nesta etapa; eles continuarão usando a
instrução genérica até receberem conteúdo específico.

## Resolução em tempo de build

O catálogo expandirá cada definição genérica em um counter resolvido por
confronto. O ID técnico resolvido será formado por
`<counterId>-<defenseId>`, preservando IDs únicos para validação e diagnóstico.
O objeto resolvido também manterá `counterId` para identificação da configuração
genérica na interface e nos testes.

A ordem de resolução será:

1. carregar a configuração-base;
2. aplicar os overrides estruturais do confronto;
3. mesclar overrides de runas por `monsterId`;
4. selecionar a instrução localizada específica ou a genérica;
5. anexar `killOrder` quando existir;
6. entregar o counter resolvido aos componentes atuais.

## Interface da ordem de eliminação

A seção localizada de ordem de eliminação aparecerá logo abaixo de
“Como jogar” e antes das fontes. Ela seguirá a linguagem visual da evolução do
catálogo:

- retratos quadrados de 64 px com borda e cantos arredondados;
- setas entre os retratos;
- ordem da esquerda para a direita;
- nome do monstro no texto alternativo de cada imagem;
- fallback com as iniciais quando não houver retrato;
- quebra responsiva sem rolagem horizontal.

A seção será renderizada somente quando o confronto possuir `killOrder`. Os
títulos serão próprios de cada idioma: `Kill order`, `Ordem de eliminação`,
`Orden de eliminación`, `Ordre d’élimination` e
`Eliminierungsreihenfolge`.

## Validações

A validação de dados exigirá:

- IDs únicos nas configurações genéricas;
- ao menos um confronto por configuração;
- `defenseId` existente e sem duplicidade dentro do mesmo counter;
- trio ofensivo com três monstros distintos;
- ordem de ataque formada somente por membros do trio;
- overrides de runa referentes apenas a membros do trio e sem duplicidade;
- `killOrder`, quando presente, com os três monstros distintos da defesa e
  nenhum monstro externo;
- ID técnico resolvido único;
- cobertura das instruções genéricas em todos os idiomas;
- paridade das instruções específicas com os vínculos declarados em inglês.

Erros devem identificar counter, defesa, locale e campo inválido para facilitar
a correção editorial.

## Testes

Os testes unitários cobrirão:

- fallback para configuração e instrução genéricas;
- instrução específica por defesa;
- substituição de `turnOrder`, `tick` e `sources`;
- merge de runa por monstro, incluindo remoções com `null` e lista vazia;
- isolamento entre confrontos e imutabilidade da configuração-base;
- rejeição de defesa, monstro, ordem de eliminação e override inválidos;
- cobertura localizada genérica e específica.

Os testes E2E abrirão a defesa `Morris · Trevor · Figaro`, localizarão cada
counter de Shihwa pelo `counterId` e verificarão:

- a instrução específica no lugar do texto genérico;
- o título localizado da ordem de eliminação;
- os retratos na ordem `Morris → Figaro → Trevor`;
- ausência de rolagem horizontal em desktop e celular;
- preservação da tabela de runas herdada da configuração-base.

A entrega será validada com `pnpm test`, `pnpm build` e `pnpm test:e2e` após a
geração do build.

## Fora de escopo

- Criar estratégias específicas para todas as defesas existentes.
- Permitir que um confronto altere o ID ou o trio ofensivo.
- Traduzir nomes de monstros, habilidades ou descrições importadas do SWARFARM.
- Criar um editor administrativo para counters.
- Alterar as regras de cálculo de SPD ou Tick.
