# Clareza de contexto e vantagem no Comparador de SPD

## Objetivo

Deixar explícito por que o Comparador de SPD possui o seletor de conteúdo e
facilitar a identificação visual de quem está em vantagem, desvantagem ou
empate.

## Seletor de conteúdo

O seletor `Siege | Arena | RTA` será mantido. Embora não altere a fórmula da SPD
estrutural, ele impede combinações de liderança que não funcionam no conteúdo
escolhido.

Um texto curto será exibido junto ao controle:

> O conteúdo limita as lideranças disponíveis.

As regras existentes serão preservadas:

- Siege aceita lideranças General, Guild e Element;
- Arena e RTA aceitam lideranças General, Arena e Element;
- trocar o conteúdo redefine para `Sem líder` uma porcentagem que deixar de ser
  válida.

## Estados dos cartões de SPD

O bloco `SPD estrutural` de cada lado receberá um estado semântico somente
quando os dois monstros estiverem selecionados e o resultado puder ser
comparado.

- vencedor: verde e etiqueta `VANTAGEM`;
- perdedor: vermelho e etiqueta `DESVANTAGEM`;
- empate: amarelo e etiqueta `EMPATE` nos dois lados;
- comparação incompleta: estilo neutro atual, sem etiqueta de estado.

A cor será aplicada ao fundo, borda, título e valor do bloco, com contraste
suficiente no tema escuro. A etiqueta textual torna o significado acessível sem
depender somente da distinção entre vermelho e verde.

Os estados sempre representarão o resultado, não a posição:

- se o monstro aliado vencer, o cartão aliado ficará verde e o inimigo
  vermelho;
- se o inimigo vencer, o cartão inimigo ficará verde e o aliado vermelho;
- se houver empate, os dois ficarão amarelos.

Alterar monstro, liderança, Swift, torre ou conteúdo atualizará os dois estados
imediatamente. Limpar um monstro removerá os estados e restaurará o visual
neutro.

## Implementação

O resultado puro continuará sendo produzido pelo cálculo existente. O script
de interface usará o campo `winner` para atribuir classes semânticas aos dois
blocos e preencher suas etiquetas. Nenhuma fórmula, query parameter ou regra
de liderança será alterada.

## Testes

Os testes de navegação verificarão:

- o texto que explica o seletor de conteúdo;
- vencedor aliado verde com `VANTAGEM` e inimigo vermelho com `DESVANTAGEM`;
- inversão correta das cores e etiquetas quando o inimigo vencer;
- os dois lados amarelos com `EMPATE` quando as velocidades forem iguais;
- remoção dos estados ao limpar um dos monstros;
- preservação do filtro de lideranças por conteúdo.

A validação executará `pnpm test`, `pnpm build` e `pnpm test:e2e`.
