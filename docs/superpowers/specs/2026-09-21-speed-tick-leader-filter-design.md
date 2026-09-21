# Filtro de liderança no Spd Tick

## Objetivo

Permitir que o usuário escolha entre comparar todas as lideranças de SPD ou
visualizar somente uma porcentagem na tabela de breakpoints.

## Experiência

- Adicionar o seletor `Líder SPD` à área de filtros da calculadora.
- Usar `Todos` como seleção inicial, preservando a tabela comparativa completa.
- Listar depois de `Todos` as mesmas porcentagens da tabela, incluindo `0%`, em
  ordem crescente.
- Ao selecionar uma porcentagem, manter as linhas de Tick e mostrar somente a
  coluna correspondente.
- Ao voltar para `Todos`, restaurar imediatamente todas as colunas.
- Preservar a seleção de liderança quando o monstro ou a Torre SPD mudar.

## Layout responsivo

No desktop, Monstro, Torre SPD e Líder SPD ficarão na mesma linha. Em telas
pequenas, Monstro e Torre SPD continuarão juntos na primeira linha, conforme o
layout já aprovado, enquanto Líder SPD ocupará a segunda linha inteira. Essa
distribuição evita seletores estreitos e mantém alvos de toque adequados.

## Dados e renderização

As opções do novo seletor usarão a mesma coleção deduplicada e ordenada que
gera os cabeçalhos da tabela. Não haverá uma segunda lista manual de percentuais.

O script manterá o valor selecionado como parte do estado dos controles. Em
cada renderização, ele filtrará as porcentagens visíveis antes de criar as
células e sincronizará a visibilidade dos cabeçalhos. Os cálculos existentes não
serão alterados.

Se um valor inválido chegar ao controle, a interface usará `Todos` como fallback
e continuará exibindo a tabela completa.

## Acessibilidade

O controle será um `select` nativo com label visível. Cabeçalhos que não fazem
parte da seleção serão removidos da navegação e da árvore de acessibilidade por
meio do atributo `hidden`, mantendo a correspondência semântica entre cada
cabeçalho e sua coluna.

## Validação

- Confirmar que `Todos` exibe as 13 porcentagens atuais.
- Selecionar uma porcentagem e confirmar um único cabeçalho e uma célula por
  linha.
- Trocar monstro e Torre SPD e confirmar que a liderança escolhida permanece.
- Voltar para `Todos` e confirmar a restauração das colunas.
- Validar o grid dos filtros em desktop e celular.
- Executar `pnpm test`, `pnpm build` e o E2E específico de Spd Tick.

## Fora do escopo

Selecionar múltiplas porcentagens arbitrárias, persistir o filtro na URL,
mostrar nomes ou áreas dos monstros líderes e alterar a fórmula de velocidade.
