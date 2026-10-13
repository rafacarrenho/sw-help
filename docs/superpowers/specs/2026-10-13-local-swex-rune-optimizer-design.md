# Importação local SWEX e otimizador de runas

## Objetivo

Adicionar ao PlayerDojo uma área de conta inteiramente local que importe um
JSON gerado pelo Summoners War Exporter (SWEX), remova dados pessoais e de
sessão e use somente os dados normalizados para calcular builds de runas.

A primeira entrega disponibiliza um otimizador exato para um monstro por vez,
com presets e configuração livre. Cálculo de dano com artefatos e otimização de
times ficam explicitamente fora desta entrega e serão construídos sobre o mesmo
modelo em entregas posteriores.

## Privacidade e armazenamento

O arquivo selecionado será lido no navegador e nunca será enviado ao servidor.
O JSON bruto ficará somente em memória durante a importação e não será salvo.
O importador aceitará o payload `HubUserLogin` com `ret_code` igual a zero e
validará a presença das coleções essenciais antes de iniciar a normalização.

Campos de sessão, conta, nome, guilda, amigos, mensagens, eventos e demais
campos não reconhecidos serão descartados por uma lista positiva. Identificadores
originais de conta, unidade e runa serão substituídos por identificadores locais
gerados durante a importação.

O IndexedDB armazenará uma única versão sanitizada contendo:

- monstros possuídos e seu `unit_master_id` convertido para o `com2usId` do
  catálogo local;
- runas equipadas e no inventário, sua localização local, bloqueio, slot, set,
  raridade, nível, principal, innate e substats;
- valor e grind atual de cada substat, além da indicação de gem já aplicada;
- artefatos sanitizados, reservados para a futura entrega de dano;
- níveis das torres necessários aos cálculos suportados;
- data de importação e versão do schema interno.

A troca de snapshot será atômica. Um arquivo inválido ou uma falha de quota não
removerá a importação anterior. `localStorage` será usado somente para
preferências pequenas de interface. A página terá ações para substituir a
importação e apagar todos os dados locais.

Analytics poderá registrar somente eventos genéricos da ferramenta. Nenhum
monstro, atributo, runa, restrição, resultado ou conteúdo importado será
incluído em eventos. A política de privacidade explicará o processamento local.

## Rota e navegação

A ferramenta será publicada como `Rune Optimizer` na navegação de Summoners War
e terá uma rota localizada em cada idioma já suportado. A página será estática;
importação, persistência e otimização acontecerão somente depois da hidratação
no navegador.

Sem importação, a página mostrará uma introdução curta, garantias de privacidade
e uma área de seleção ou arraste do arquivo. Depois da importação, o cabeçalho
mostrará apenas contagens sanitizadas, data da importação e ações de atualizar e
apagar. Nome e identificador da conta não serão exibidos nem persistidos.

## Modelo normalizado

Os tipos públicos do recurso ficarão separados do formato SWEX. O restante do
site nunca consumirá o payload original.

Uma runa normalizada conterá:

- ID local, slot de 1 a 6, set e localização;
- raridade, estrelas, nível e indicação Ancient;
- principal, innate e substats em um vocabulário comum;
- valor base do substat, grind atual e indicação de gem;
- monstro local equipado, quando houver;
- bloqueio informado pelo arquivo.

Os atributos normalizados serão HP flat, HP%, ATK flat, ATK%, DEF flat, DEF%,
SPD, CR, CD, RES e ACC. IDs de set e atributos desconhecidos serão ignorados com
um aviso agregado, sem interromper a importação das entradas válidas.

Um monstro importado conterá apenas ID local, `com2usId`, forma, nível, estrelas
atuais e referências locais aos equipamentos. Stats base e metadados públicos
virão do catálogo do PlayerDojo para evitar persistir cópias desnecessárias.

## Potencial das runas

O otimizador trabalhará com o potencial determinístico definido abaixo:

- o atributo principal será projetado para o valor conhecido em +15;
- substats existentes manterão seus rolls atuais;
- rolls futuros de power-up não serão inventados;
- gems novas não serão simuladas;
- gems já presentes no arquivo serão preservadas;
- apenas substats de HP, ATK, DEF e SPD poderão receber grind potencial;
- innate e atributo principal não receberão grind;
- o grind potencial será o maior entre o grind atual e o máximo de um grind
  lendário compatível.

Runas normais usarão máximos de +550 HP, +30 ATK, +30 DEF, +10% HP/ATK/DEF e
+5 SPD. Runas Ancient usarão +610 HP, +34 ATK, +34 DEF, +12% HP/ATK/DEF e
+6 SPD. Esses valores ficarão centralizados em uma tabela versionada e terão
testes dedicados.

Cada build exibirá os stats atuais das seis runas e os stats potenciais usados
na classificação, destacando ganho do principal e ganho de grind por runa.

## Sets e validade da build

O construtor aceitará:

- nenhum set obrigatório;
- um set de quatro peças e duas peças livres;
- um set de quatro peças e um set de duas peças obrigatório;
- até três sets de duas peças;
- peças totalmente livres.

Peças livres poderão ativar incidentalmente um set e receberão seu bônus real.
Intangible completará um set incompleto conforme a regra do jogo e no máximo uma
runa Intangible poderá ser usada na mesma build. Sets sem bônus direto de stats,
como Violent, Despair, Vampire e Will, ainda serão validados normalmente.

Os bônus individuais de Energy, Guard, Swift, Blade, Rage, Focus, Endure, Fatal,
Fight, Determination, Enhance, Accuracy e Tolerance serão aplicados aos stats
finais. Efeitos que dependem de aliados fora da build não serão inventados; os
bônus dos sets presentes no próprio monstro continuarão válidos para ele.

## Configuração livre e presets

O formulário permitirá selecionar:

- monstro possuído;
- sets obrigatórios e comportamento das peças restantes;
- objetivo principal: HP, ATK, DEF, SPD, CR, CD, RES ou ACC;
- mínimo e máximo opcional para cada atributo;
- pool de runas: todas ou somente inventário;
- inclusão de runas bloqueadas;
- exclusão das runas equipadas em monstros escolhidos;
- modo Siege, Arena ou RTA, torre de SPD, liderança e Tick opcional.

Presets serão apenas configurações nomeadas que preenchem esse mesmo formulário.
A primeira coleção incluirá maior SPD, Swift mais rápido, Violent/Will suporte,
Rage máximo dano estrutural, bruiser Violent e suporte Tick 5. O usuário poderá
alterar qualquer campo depois de aplicar um preset.

O preset de dano estrutural maximizará a combinação de ATK, CR e CD, mas não será
apresentado como dano real de habilidade. Dano real, alvo e artefatos pertencem à
segunda entrega.

## Cálculo dos stats

O motor calculará stats finais a partir dos stats base do monstro, contribuições
flat e percentuais, principal, innate, substats, grinds e bônus de sets. CR, RES
e ACC serão apresentados com limite efetivo de 100%, preservando o valor bruto
para diagnóstico de excesso.

Swift usará a mesma regra de arredondamento já adotada pelas calculadoras do
PlayerDojo. Torre, líder e modificadores de combate não serão misturados aos
stats exibidos na tela do monstro. Eles serão aplicados somente ao cálculo de
SPD de combate e Tick.

Uma restrição de Tick será convertida no mínimo de SPD adicional necessário por
meio das funções existentes de Speed Tick e Speed Tuning. A build somente será
aceita se alcançar esse mínimo sob o modo, torre, liderança e Swift resultantes.

## Motor de otimização

A otimização será executada em um Web Worker e aceitará somente o snapshot
sanitizado e a consulta normalizada. A interface nunca executará a busca
combinatória na thread principal.

Para cada consulta, o motor:

1. calcula a contribuição atual e potencial de cada runa;
2. agrupa candidatas por slot e set;
3. gera as assinaturas de sets compatíveis com a configuração;
4. elimina somente runas dominadas no mesmo slot e contexto de set, considerando
   todos os atributos presentes no objetivo ou nas restrições;
5. calcula limites superiores para os slots restantes;
6. percorre as combinações com branch-and-bound;
7. valida sets, Intangible, mínimos, máximos e Tick;
8. mantém as dez melhores builds por ordem lexicográfica.

A ordem maximizará primeiro o objetivo selecionado. Empates serão resolvidos
pela soma normalizada dos atributos presentes nas restrições e por uma chave
local estável. O motor nunca substituirá a busca exata por uma heurística sem
aviso. Consultas novas cancelarão o worker anterior, e a interface terá uma ação
explícita de cancelar.

Se a consulta não tiver solução, o resultado apontará quais mínimos isolados já
excedem os maiores limites superiores encontrados. Isso ajuda o jogador a
ajustar a configuração sem alegar que uma build impossível existe.

## Interface

A página terá três estados principais:

1. importação;
2. construtor;
3. resultados.

No construtor, o seletor de monstro virá primeiro, seguido por presets, sets e
objetivo. Restrições avançadas, pool de runas e contexto de Tick ficarão em
seções recolhíveis, mantendo o fluxo inicial simples no celular.

O resultado principal mostrará o maior valor encontrado, os stats potenciais e
atuais, os sets ativados e as seis runas. Cada linha de runa mostrará slot, set,
principal, substats, localização atual e ganhos potenciais. Outros nove
resultados ficarão abaixo para comparação.

A interface mostrará progresso indeterminado, tempo decorrido e contagem de
combinações avaliadas quando fornecida pelo worker. Todos os controles e
resultados terão textos nos cinco idiomas, tamanhos mínimos definidos pelo
projeto e regiões `aria-live` para importação, busca, cancelamento e erros.

Nenhum resultado será colocado na URL, pois ele depende de dados locais. A
configuração sem IDs de runa poderá ser lembrada localmente para reabrir o mesmo
formulário depois de uma nova visita.

## Falhas e compatibilidade

O importador distinguirá:

- arquivo que não é JSON;
- JSON que não é um `HubUserLogin` bem-sucedido;
- export incompleto ou formato incompatível;
- ausência de monstros ou runas;
- entries individuais desconhecidas, que geram avisos agregados;
- armazenamento indisponível ou quota insuficiente;
- catálogo sem correspondência para uma forma possuída.

Falhas individuais não exibirão valores do arquivo. Mensagens de diagnóstico
usarão apenas nomes de campos e contagens. Em navegação privada ou sem IndexedDB,
o usuário poderá usar a importação apenas na sessão atual, com aviso de que ela
não será preservada.

O schema interno será versionado. Versões antigas serão migradas quando a
transformação for segura; caso contrário, a interface solicitará nova
importação sem tentar interpretar silenciosamente dados incompatíveis.

## Testes

Fixtures serão sintéticas e pequenas. O JSON pessoal usado para validar o
desenvolvimento não será copiado, transformado ou commitado.

Testes unitários cobrirão:

- validação e sanitização do payload;
- ausência de campos sensíveis no snapshot serializado;
- conversão de IDs de set e atributos;
- parse de principal, innate, substats, grind e gem;
- projeção de principal para +15;
- grind normal e Ancient;
- stats finais e limites de CR/RES/ACC;
- bônus de todos os sets suportados;
- validação de sets livres, obrigatórios e Intangible;
- restrições mínimas, máximas e Tick;
- dominância segura e resultado exato do branch-and-bound contra enumeração
  completa em pools pequenos;
- ordenação determinística das dez melhores builds;
- cancelamento e consulta sem solução.

Testes de navegador cobrirão:

- importação por seletor e arraste;
- atualização e remoção dos dados locais;
- recuperação do snapshot após navegação;
- fallback somente em memória quando IndexedDB falhar;
- aplicação de presets e personalização posterior;
- otimização livre e apresentação das runas;
- filtros de inventário, bloqueio e exclusão;
- resultado vazio, cancelamento e acessibilidade;
- layout em desktop e celular;
- navegação e traduções nas cinco rotas.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` após a
geração do build.

## Entregas posteriores

O cálculo real de dano será uma especificação separada. Ele acrescentará skill,
alvo, buffs, debuffs e otimização de dois artefatos sem alterar o formato de
runa ou as consultas básicas.

A otimização de times também terá especificação própria. Ela salvará e reservará
builds individuais, removerá suas runas do pool e integrará os resultados com
Spd Tuning, Comparador e counters antes de considerar otimização global de todo
o time.
