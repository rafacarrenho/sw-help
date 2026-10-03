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

Os resultados exibidos serão os resultados diretos de `tuneFollower`. A
função já incorpora a posição do seguidor por meio de `iteration` e considera
os boosts e buffs acumulados aplicáveis. A interface não fará uma segunda
normalização baseada apenas na comparação entre SPDs de combate.

Serão removidos de `SpeedTuning.astro`:

- o helper `raiseFollowerToCombatSpeed`;
- o laço reverso que eleva a SPD de um seguidor para igualar a SPD do próximo.

A fórmula de `tuneFollower`, o cálculo da SPD de combate e as regras de alcance
dos efeitos permanecerão inalterados. Não haverá exceções por monstro.

## Validação

Uma regressão unitária reproduzirá os valores intermediários do cenário:

- Kroa com 401 SPD de combate;
- Tirsa, na segunda posição, com 15% de boost e buff de SPD: +165 SPD e 338 SPD
  de combate;
- Mihyang, na terceira posição, sem o boost direcionado e com buff de SPD:
  +221 SPD e 365 SPD de combate.

Uma regressão end-to-end configurará a mesma equipe e confirmará que a página
exibe +165 SPD para Tirsa e +221 SPD para Mihyang. A suíte existente continuará
cobrindo cenários sem efeitos diferentes e os modos Siege, Arena e RTA.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` após a
geração do build.
