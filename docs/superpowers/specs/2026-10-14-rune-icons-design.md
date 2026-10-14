# Ícones compostos das runas

## Objetivo

Tornar cada runa do resultado reconhecível como no Summoners War. O ícone deve
representar simultaneamente o slot, o set, a qualidade e o nível da runa, sem
remover a identificação textual existente.

## Composição visual

Cada miniatura será composta por assets locais em três camadas:

1. fundo da qualidade da runa, com variante própria para Ancient;
2. pedra com formato específico para cada slot de 1 a 6;
3. símbolo dourado do set, centralizado sobre a pedra.

O nível `+15` será sobreposto no canto inferior direito. As estrelas continuarão
no texto do cabeçalho para preservar a leitura em tamanhos compactos. O ícone
ficará à esquerda de `Slot N · Set`, com tamanho estável em desktop e celular.

### Refinamento de cor e respiro

O fundo de qualidade preencherá o wrapper e não será recolorido, preservando a
distinção entre raridades e a variante Ancient. A pedra do slot manterá seus tons
escuros originais e ficará menor, centralizada sobre o fundo. O símbolo do set
será armazenado já em amarelo/dourado no próprio PNG: a interface não aplicará
`filter`, máscara, sobreposição de cor ou outro tratamento em tempo de execução.

O wrapper manterá uma área estável para não deslocar o texto entre slots. As
pedras serão ancoradas pelo mesmo centro dentro do fundo de `58 × 58 px`. Os
formatos horizontais dos slots 2, 3, 5 e 6 manterão a área de `42 × 50 px`; os
formatos verticais dos slots 1 e 4 usarão `35 × 42 px` para que sua altura visual
não fique maior que a das demais runas. O símbolo usará uma caixa de `28 × 28
px`, ancorada nesse mesmo centro nos seis slots. O indicador `+15` ficará preso
ao canto inferior direito do fundo, como na interface do jogo.

## Assets e cobertura

Os assets serão armazenados em `public/images/runes/`, sem dependência de rede em
tempo de execução. A integração cobrirá os seis formatos de slot, as qualidades
normal, magic, rare, hero e legend, suas variantes Ancient e todos os 23 sets
aceitos pelo importador.

Os arquivos vêm do repositório público do SWARFARM e as imagens do jogo pertencem
à Com2uS. As variantes douradas serão arquivos estáticos derivados dos símbolos
originais, mantendo seu contorno e transparência. Um README junto aos assets
registrará a origem, a derivação e a propriedade.

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
- ausência de filtro visual e centralização uniforme do símbolo nos seis slots;
- escala reduzida e idêntica para os formatos verticais dos slots 1 e 4;
- funcionamento em desktop e mobile.
