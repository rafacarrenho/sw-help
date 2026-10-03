# Speed Tuning: ordem com efeitos diferentes

## Contexto

O Speed Tuning calcula corretamente cada seguidor com `tuneFollower`, usando a
posição no time, os boosts de barra de ataque e os buffs de SPD que alcançam o
monstro. Depois desse cálculo, a interface executa uma segunda passagem que
compara somente a SPD de combate dos seguidores e eleva um monstro anterior
sempre que sua SPD é menor que a do próximo.

Essa comparação é inválida quando os monstros recebem efeitos diferentes. No
caso Kroa, Tirsa e Mihyang, Tirsa recebe 15% de barra e o buff de SPD, enquanto
Mihyang recebe apenas o buff. O cálculo por posição retorna corretamente Tirsa
com +165 SPD, ou 338 SPD de combate, e Mihyang com +221 SPD, ou 365 SPD de
combate. A passagem posterior ignora a vantagem de barra de Tirsa e a eleva
artificialmente para 365 SPD de combate, exibindo +192 SPD.

## Decisão

Cada posição continuará sendo calculada inicialmente por `tuneFollower`, que
incorpora `iteration` e os boosts e buffs acumulados aplicáveis. A preservação
da ordem deixará de comparar apenas as SPDs de combate e passará a comparar o
progresso de barra dos dois seguidores no instante em que o primeiro deles
deve agir.

Essa comparação considerará somente efeitos aplicados por monstros que já
agiram naquele instante. Se o primeiro seguidor estiver atrás, sua SPD será
elevada até igualar ou superar o progresso do próximo. Se uma SPD menor for
compensada por um boost ou buff mais favorável, ela será preservada.

O cálculo do progresso compartilhará a mesma janela de ticks usada por
`tuneFollower`. A fórmula da SPD de combate e as regras de alcance dos efeitos
permanecerão inalteradas. Não haverá exceções por monstro.

## Validação

Uma regressão unitária reproduzirá os valores intermediários do cenário:

- Kroa com 401 SPD de combate;
- Tirsa, na segunda posição, com 15% de boost e buff de SPD: +165 SPD e 338 SPD
  de combate;
- Mihyang, na terceira posição, sem o boost direcionado e com buff de SPD:
  +221 SPD e 365 SPD de combate.

Uma regressão end-to-end configurará a mesma equipe e confirmará que a página
exibe +165 SPD para Tirsa e +221 SPD para Mihyang. A suíte existente continuará
cobrindo cenários sem efeitos diferentes e os modos Siege, Arena e RTA. O caso
Kabilla, Gemini e Talisman continuará exigindo +178 SPD para Gemini porque os
dois seguidores recebem o mesmo boost e a ordem depende da SPD de combate.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` após a
geração do build.
