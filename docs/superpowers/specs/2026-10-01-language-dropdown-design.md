# Dropdown de idiomas escalável

## Objetivo

Substituir os botões lado a lado do seletor de idioma por um dropdown customizado,
inspirado no comportamento do Luabify e adaptado ao design escuro e dourado do SW
Help. O componente deve continuar simples com inglês e português, mas permanecer
usável quando o site receber cerca de dez novos idiomas.

## Interface

O seletor continuará na parte inferior da barra lateral. O cartão manterá o ícone
de globo e o rótulo localizado `Language` ou `Idioma`.

O controle será formado por:

- um botão com a bandeira, o nome nativo do idioma atual e uma seta;
- um menu flutuante com os demais idiomas disponíveis;
- uma opção por linha, também com bandeira e nome nativo.

O menu abrirá para cima para não ultrapassar a base da barra lateral. Ele terá
altura máxima e rolagem vertical, permitindo acomodar a futura lista de idiomas
sem aumentar a altura do cartão ou da navegação. Hover, foco e opção ativa usarão
as cores, bordas e raio já existentes no design system do projeto.

Quando a barra lateral estiver recolhida, o cartão será reduzido ao botão com a
bandeira do idioma atual. O nome e a seta ficarão ocultos, e o tooltip de
navegação existente identificará o controle. No layout móvel, o dropdown usará
a largura completa da barra lateral aberta.

## Configuração de idiomas

Os metadados visuais dos idiomas ficarão centralizados junto à configuração de
i18n. Cada locale disponível terá:

- código tipado;
- nome nativo;
- bandeira;
- abreviação curta.

A ordem da configuração determinará a ordem do menu. As rotas e mensagens
continuarão sendo obrigatórias para todo locale, de forma que adicionar um novo
idioma produza erro de tipo enquanto sua configuração estiver incompleta.

## Navegação e estado

O botão abre e fecha o menu sem mudar de página. As opções continuam sendo links
reais para que a navegação funcione de forma progressiva e preserve os benefícios
semânticos do HTML.

Ao selecionar um idioma, o usuário irá imediatamente para a rota localizada
equivalente. Parâmetros de rota, como o ID de um monstro, e a query string atual
serão preservados pelo mecanismo existente de `localizedHref` e pela correção
client-side usada nas páginas estáticas.

O idioma atual aparecerá no botão e não será repetido entre as alternativas,
seguindo o comportamento do Luabify. Com JavaScript desativado, as alternativas
permanecerão visíveis para garantir que a troca de idioma continue disponível.

## Acessibilidade e interação

O botão informará `aria-haspopup="menu"` e manterá `aria-expanded` sincronizado.
O menu terá nome acessível localizado, e cada alternativa será um link com o
atributo `lang` correspondente.

O dropdown fechará quando:

- uma alternativa for selecionada;
- houver clique fora do componente;
- a tecla `Escape` for pressionada;
- a barra lateral mudar de estado.

Ao abrir pelo teclado, `ArrowDown` moverá o foco para a primeira alternativa. Ao
fechar com `Escape`, o foco retornará ao botão. Os estilos de foco visível
existentes serão preservados.

## Validação

Os testes unitários verificarão os metadados de todos os locales configurados.
Os testes end-to-end cobrirão:

- o idioma atual exibido no botão;
- abertura e fechamento do menu;
- os links localizados de inglês e português;
- preservação de rota de detalhe e query string;
- interação por teclado;
- apresentação compacta com a barra lateral recolhida.

Após a implementação serão executados `pnpm test`, `pnpm build` e
`pnpm test:e2e`, com o build gerado antes do fluxo end-to-end.
