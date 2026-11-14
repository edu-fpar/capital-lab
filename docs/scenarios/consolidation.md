# Périmètre de consolidation
> Intégration globale, mise en équivalence… et la différence entre pourcentage de contrôle et pourcentage d'intérêt.

## 1. La société mère
**Mère SA** détient trois participations directes. Selon le degré de contrôle, chacune sera traitée différemment dans les comptes consolidés.

```scene
societe M "Mère SA"
societe F1 "Filiale 1"
societe F2 "Associée 2"
societe F3 "Participation 3"
lien M -> F1 80%
lien M -> F2 30%
lien M -> F3 8%
vue M
```
## 2. Contrôle exclusif → intégration globale
Avec 80 % des voix, Mère SA contrôle **Filiale 1** : ses comptes sont repris **à 100 %** (intégration globale). Les 20 % des autres actionnaires apparaissent en **intérêts minoritaires** (participations ne donnant pas le contrôle).

```scene
focus F1
note F1 "Intégration globale (IG)"
```
## 3. Influence notable → mise en équivalence
Entre **20 % et 50 %** des voix, on présume une **influence notable** : Associée 2 est **mise en équivalence** (on ne reprend que la quote-part de capitaux propres et de résultat).

Sous 20 %, Participation 3 reste un simple titre financier, **non consolidé**.

```scene
focus F2 F3
note F2 "Mise en équivalence (MEE)"
note F3 "Non consolidée"
```
## 4. Une sous-filiale : contrôle ≠ intérêt
Filiale 1 détient **60 %** de **Sous-filiale**.

- **Pourcentage de contrôle** de Mère SA : 60 % (les voix de la société qu'elle contrôle) → **intégration globale**.
- **Pourcentage d'intérêt** : 80 % × 60 % = **48 %** → c'est la quote-part du résultat qui revient au groupe.

```scene
societe SF "Sous-filiale"
lien F1 -> SF 60%
focus SF
note SF "Contrôle 60 % · Intérêt 48 %"
```
## 5. Contrôle conjoint → coentreprise
Mère SA et un partenaire industriel créent **JV Co** à 50/50, avec un pacte exigeant l'unanimité pour les décisions clés : c'est un **contrôle conjoint**. En normes IFRS (IFRS 11), une coentreprise est mise en équivalence.

```scene
societe PART "Partenaire industriel"
societe JV "JV Co"
lien M -> JV 50%
lien PART -> JV 50%
concert PACTE_JV "Pacte JV" M PART
focus JV
```