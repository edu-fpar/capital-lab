# Action de concert : contrôler à plusieurs
> Deux minoritaires qui s'entendent peuvent contrôler ensemble.

## 1. Un capital éclaté
Omega SA : **A Invest** détient 30 %, **B Capital** 25 %, le public 45 %. Aucun bloc ne dépasse 50 % : Omega n'est **pas contrôlée**.

```scene
holding A "A Invest"
fonds B "B Capital"
public PUB "Public"
societe OMEGA "Omega SA"
lien A -> OMEGA 30%
lien B -> OMEGA 25%
lien PUB -> OMEGA 45%
focus OMEGA
```
## 2. Le pacte d'actionnaires
A Invest et B Capital signent un **pacte** : ils s'engagent à voter dans le même sens pour mettre en œuvre une politique commune. Ils **agissent de concert** (art. L233-10 C. com.).

Ensemble, ils réunissent 55 % des voix : ils **contrôlent conjointement** Omega (art. L233-3, III).

```scene
concert PACTE "Pacte Omega" A B
focus OMEGA
note OMEGA "Contrôle conjoint : 30 % + 25 %"
```
## 3. Qui est derrière A Invest ?
A Invest est elle-même détenue à 70 % par **Mme Durand**. Mme Durand contrôle A Invest et participe donc, à travers elle, au contrôle conjoint d'Omega.

Le point de vue de Mme Durand montre son intérêt économique dans Omega : 70 % × 30 % = **21 %**.

```scene
personne DURAND "Mme Durand"
lien DURAND -> A 70%
vue DURAND
focus A
```
## 4. Fin du pacte
Le pacte est dénoncé. Chacun retrouve sa liberté de vote : Omega redevient **sans contrôle**.

> 💡 Dans une société cotée, des actionnaires qui franchissent **de concert** le seuil de 30 % doivent déposer une **offre publique** obligatoire.

```scene
retirer PACTE
vue aucune
focus OMEGA
```