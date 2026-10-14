# Ícones compostos das runas

## Objetivo

Tornar cada runa do resultado reconhecível como no Summoners War. O ícone deve
representar simultaneamente o slot, o set, a qualidade e o nível da runa, sem
remover a identificação textual existente.

## Composição visual

Cada miniatura será composta por assets locais em três camadas:

1. fundo da qualidade da runa, com variante própria para Ancient;
2. pedra com formato específico para cada slot de 1 a 6;
3. símbolo do set, posicionado sobre a pedra de acordo com o slot.

O nível `+15` será sobreposto no canto inferior direito. As estrelas continuarão
no texto do cabeçalho para preservar a leitura em tamanhos compactos. O ícone
ficará à esquerda de `Slot N · Set`, com tamanho estável em desktop e celular.

### Refinamento de cor e respiro

O fundo de qualidade preencherá o wrapper e não será recolorido, preservando a
distinção entre raridades e a variante Ancient. A pedra do slot manterá seus tons
escuros originais e ficará menor, centralizada sobre o fundo. Apenas o símbolo do
set receberá o tratamento amarelo/dourado visto no jogo.

O wrapper manterá uma área estável para não deslocar o texto entre slots. A pedra
usará suas proporções originais de `42 × 50 px` dentro do fundo de `58 × 58 px`,
criando respiro sem reduzir a moldura de qualidade. O indicador `+15` ficará
preso ao canto inferior direito do fundo, como na interface do jogo.

## Assets e cobertura

Os assets serão armazenados em `public/images/runes/`, sem dependência de rede em
tempo de execução. A integração cobrirá os seis formatos de slot, as qualidades
normal, magic, rare, hero e legend, suas variantes Ancient e todos os 23 sets
aceitos pelo importador.

Os arquivos vêm do repositório público do SWARFARM e as imagens do jogo pertencem
à Com2uS. Um README junto aos assets registrará a origem e a propriedade.

## Renderização e fallback

O código escolherá os caminhos a partir dos dados normalizados da runa. Os nomes
de set já pertencem a uma união fechada, e qualidade e slot serão limitados aos
valores suportados. A identificação textual continuará visível, portanto um
asset ausente não impedirá o usuário de identificar a runa. As camadas serão
decorativas para leitores de tela, evitando repetir o texto adjacente.

## Validação

Os testes confirmarão:

- combinação correta de fundo, slot e set para uma Swift do slot 1;
- formato diferente para outro slot;
- fundo Ancient e fundo comum;
- cobertura de assets para todos os sets e slots suportados;
- manutenção do texto, nível e layout sem rolagem horizontal;
- funcionamento em desktop e mobile.
