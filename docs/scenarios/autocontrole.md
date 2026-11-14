# Participations croisées et autocontrôle
> Quand une société se « contrôle » elle-même… et qu'une famille en profite.

## 1. Alpha et sa famille fondatrice
La famille Roux détient **46 %** d'Alpha SA ; le reste est dispersé dans le public. Personne n'a la majorité absolue : Alpha n'est **pas contrôlée** (la présomption de contrôle de fait est désactivée dans ce scénario).

```scene
regle 40 off
personne ROUX "Famille Roux"
societe ALPHA "Alpha SA"
lien ROUX -> ALPHA 46%
focus ALPHA
```
## 2. Alpha contrôle Beta
Alpha détient **60 %** de Beta : elle la contrôle.

```scene
societe BETA "Beta"
lien ALPHA -> BETA 60%
focus BETA
```
## 3. Beta détient 10 % d'Alpha
Beta détient **10 %** du capital d'Alpha (par exemple une participation acquise avant qu'Alpha n'en prenne le contrôle — le Code de commerce encadre strictement ces participations réciproques, art. L233-29 et s.).

Beta étant contrôlée par Alpha, ces actions sont de l'**autocontrôle**. La loi **prive de droit de vote** les actions d'autocontrôle (art. L233-31) : sinon les dirigeants d'Alpha voteraient… pour eux-mêmes, avec l'argent de la société.

Conséquence mécanique : il ne reste que 90 % de voix exerçables. La famille Roux pèse désormais 46 / 90 = **51,1 %** des voix : elle **prend le contrôle** sans acheter une seule action !

```scene
lien BETA -> ALPHA 10%
focus ROUX ALPHA
note ALPHA "10 % de voix neutralisées"
```
## 4. L'auto-détention
Alpha rachète aussi **5 %** de ses propres actions (programme de rachat). Ces actions sont également **privées de droit de vote** (art. L225-210).

Il ne reste que 85 % de voix exerçables : la famille pèse 46 / 85 = **54,1 %**.

```scene
lien ALPHA -> ALPHA 5%
focus ALPHA
note ALPHA "Auto-détention 5 % + autocontrôle 10 %"
```
## 5. Les garde-fous
- Une SA ne peut détenir plus de **10 %** de ses propres actions (art. L225-210).
- Les participations réciproques entre sociétés sont plafonnées (art. L233-29 et L233-30).
- Les actions d'autocontrôle sont **privées du droit de vote** (art. L233-31).

> 💡 Dans le canevas, les liens d'autocontrôle apparaissent en **pointillés gris** : leurs voix sont neutralisées et les autres pourcentages sont recalculés (« effectifs »).

```scene
vue ROUX
selection ALPHA
```