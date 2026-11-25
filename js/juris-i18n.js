/* ============================================================
 * Capital Lab — textes juridiques de chaque droit dans les autres langues de l'interface.
 * P.JURIS (js/model.js) écrit les seuils, la légende et les textes d'analyse d'un droit dans la
 * langue de ce droit (droit français en français, UK/US en anglais, droit espagnol en espagnol).
 * Ici : leur traduction, pour qu'un scénario britannique affiché avec l'interface en français
 * (par exemple) garde une légende et une analyse en français.
 *   P.JURIS_I18N[droit][langue] = { cats: { clé: [libellé, texte] }, txt: { … } }
 * Les clés de txt : control, autocontrol ({name}), concert (HTML), deFacto,
 * blockMinority ({names}), blockController.
 * ============================================================ */
window.P = window.P || {};
P.JURIS_I18N = {
  /* ---------------------------------------------------------------- droit français */
  fr: {
    en: {
      cats: {
        retrait: ['≥ 90% — squeeze-out possible', 'At least 90% of the capital and voting rights: in a listed company, the majority shareholder can carry out a compulsory buy-out (squeeze-out) of the minority.'],
        qualifiee: ['≥ 2/3 — qualified majority (EGM)', 'At least two thirds of the votes: the shareholder decides alone at the extraordinary general meeting (amending the articles, capital increase, merger…).'],
        majorite: ['> 50% — majority, control', 'More than 50% of the voting rights: exclusive control "in law" (art. L233-3, I, 1° French Commercial Code). The shareholder decides alone at the ordinary general meeting.'],
        blocage: ['> 1/3 — blocking minority', 'More than one third of the votes: blocking minority at the EGM (SA). The shareholder can prevent any amendment of the articles.'],
        influence: ['≥ 20% — significant influence', 'At least 20% of the votes: significant influence is presumed — in consolidated accounts, the company is in principle equity-accounted.'],
        participation: ['≥ 10% — participation', 'Between 10% and 50% of the capital: a "participation" within the meaning of art. L233-2 French Commercial Code.'],
        placement: ['< 10% — investment', 'Less than 10%: a mere financial investment (in listed companies, threshold crossings are declared from 5%).']
      },
      txt: {
        control: 'art. L233-3 French Commercial Code',
        autocontrol: 'shares held by {name} itself or by companies it controls — art. L225-210 and L233-31 French Commercial Code',
        concert: 'Acting in concert (art. L233-10 French Commercial Code): the members are treated as <b>a single voting block</b>. If together they hold more than 50% of the votes of a company, they control it jointly (art. L233-3, III).',
        deFacto: 'Presumption of de facto control: more than 40% of the votes and no other shareholder holding more (art. L233-3 II French Commercial Code)',
        blockMinority: '🛑 Blocking minority (more than 1/3 of the votes at the EGM): {names}.',
        blockController: 'The controller decides alone at the ordinary general meeting, but does not reach the 2/3 needed at the EGM.'
      }
    },
    es: {
      cats: {
        retrait: ['≥ 90 % — exclusión obligatoria posible', 'Al menos el 90 % del capital y de los derechos de voto: en una sociedad cotizada, el accionista mayoritario puede excluir obligatoriamente a los minoritarios (squeeze-out).'],
        qualifiee: ['≥ 2/3 — mayoría cualificada (junta extraordinaria)', 'Al menos dos tercios de los votos: el accionista decide solo en la junta general extraordinaria (modificación de estatutos, ampliación de capital, fusión…).'],
        majorite: ['> 50 % — mayoría, control', 'Más del 50 % de los derechos de voto: control exclusivo «de derecho» (art. L233-3, I, 1.º del Código de Comercio francés). El accionista decide solo en la junta general ordinaria.'],
        blocage: ['> 1/3 — minoría de bloqueo', 'Más de un tercio de los votos: minoría de bloqueo en la junta extraordinaria (SA). El accionista puede impedir cualquier modificación de los estatutos.'],
        influence: ['≥ 20 % — influencia significativa', 'Al menos el 20 % de los votos: se presume influencia significativa — en la consolidación, la sociedad se integra en principio por el método de la participación.'],
        participation: ['≥ 10 % — participación', 'Entre el 10 % y el 50 % del capital: «participación» en el sentido del art. L233-2 del Código de Comercio francés.'],
        placement: ['< 10 % — inversión', 'Menos del 10 %: simple inversión financiera (en las sociedades cotizadas, los cruces de umbral se declaran desde el 5 %).']
      },
      txt: {
        control: 'art. L233-3 del Código de Comercio francés',
        autocontrol: 'acciones de {name} en su propia cartera o en manos de sociedades que controla — art. L225-210 y L233-31 del Código de Comercio francés',
        concert: 'Actuación concertada (art. L233-10 del Código de Comercio francés): los miembros se tratan como <b>un solo bloque de voto</b>. Si juntos superan el 50 % de los votos de una sociedad, la controlan conjuntamente (art. L233-3, III).',
        deFacto: 'Presunción de control de hecho: más del 40 % de los votos y ningún otro socio por encima (art. L233-3 II del Código de Comercio francés)',
        blockMinority: '🛑 Minoría de bloqueo (más de 1/3 de los votos en la junta extraordinaria): {names}.',
        blockController: 'El controlador decide solo en la junta ordinaria, pero no alcanza los 2/3 necesarios en la junta extraordinaria.'
      }
    }
  },
  /* ---------------------------------------------------------------- droit britannique */
  uk: {
    fr: {
      cats: {
        'uk-squeeze': ['≥ 90 % — retrait obligatoire (squeeze-out)', "Au moins 90 % : après une offre publique, l'initiateur peut racheter de force les actionnaires restants (Companies Act 2006, s. 979)."],
        'uk-special': ['≥ 75 % — résolution spéciale', 'Au moins 75 % des voix : adopte seul les résolutions spéciales (s. 283) — modifier les statuts (s. 21), écarter le droit préférentiel de souscription, réduire le capital…'],
        'uk-majority': ['> 50 % — résolution ordinaire, contrôle', 'Plus de 50 % des droits de vote : adopte les résolutions ordinaires (s. 282), nomme et révoque les administrateurs. La société est sa filiale (subsidiary, s. 1159) : contrôle.'],
        'uk-bid': ['≥ 30 % — offre obligatoire (Rule 9)', "Au moins 30 % des droits de vote d'une société soumise au Takeover Code : franchir ce seuil oblige à déposer une offre sur le reste du capital (Rule 9). Au-dessus de 25 %, l'actionnaire bloque aussi les résolutions spéciales."],
        'uk-blocking': ['> 25 % — minorité de blocage', "Plus de 25 % des voix : peut faire échouer toute résolution spéciale (75 % requis). C'est aussi une personne exerçant un contrôle significatif (registre PSC)."],
        'uk-influence': ['≥ 20 % — influence notable', 'Au moins 20 % des voix : influence notable présumée (IAS 28 / FRS 102) — dans les comptes de groupe, la société est normalement une entreprise associée, mise en équivalence.'],
        'uk-notifiable': ['≥ 3 % — participation à déclarer', "Au moins 3 % des droits de vote d'une société cotée : la participation doit être déclarée (règles DTR 5 de la FCA)."],
        'uk-investment': ['< 3 % — placement', 'Moins de 3 % : simple placement financier.']
      },
      txt: {
        control: 'Companies Act 2006, s. 1159 et s. 1162',
        autocontrol: "actions détenues par {name} elle-même (les actions autodétenues n'ont pas de droit de vote, s. 726) ou par une société qu'elle contrôle (une filiale ne peut pas être actionnaire de sa société mère, s. 136)",
        concert: "Personnes agissant de concert (Takeover Code, Definitions) : les membres sont traités comme <b>un seul bloc de vote</b>. S'ils détiennent ensemble plus de 50 % des voix d'une société, ils la contrôlent conjointement.",
        blockMinority: '🛑 Minorité de blocage (plus de 25 % des voix : peut faire échouer une résolution spéciale) : {names}.',
        blockController: "Le contrôleur adopte seul les résolutions ordinaires, mais n'atteint pas les 75 % requis pour une résolution spéciale."
      }
    },
    es: {
      cats: {
        'uk-squeeze': ['≥ 90 % — venta forzosa (squeeze-out)', 'Al menos el 90 %: tras una oferta pública de adquisición, el oferente puede comprar forzosamente las acciones de los demás accionistas (Companies Act 2006, s. 979).'],
        'uk-special': ['≥ 75 % — acuerdo especial', 'Al menos el 75 % de los votos: aprueba solo los acuerdos especiales (special resolutions, s. 283) — modificar los estatutos (s. 21), suprimir el derecho de suscripción preferente, reducir el capital…'],
        'uk-majority': ['> 50 % — acuerdo ordinario, control', 'Más del 50 % de los derechos de voto: aprueba los acuerdos ordinarios (s. 282), nombra y cesa a los administradores. La sociedad es su filial (s. 1159): control.'],
        'uk-bid': ['≥ 30 % — OPA obligatoria (Rule 9)', 'Al menos el 30 % de los derechos de voto de una sociedad sujeta al Takeover Code: alcanzar esta participación obliga a formular una oferta por el resto (Rule 9). Por encima del 25 %, también bloquea los acuerdos especiales.'],
        'uk-blocking': ['> 25 % — minoría de bloqueo', 'Más del 25 % de los votos: puede impedir cualquier acuerdo especial (se exige el 75 %). También es una persona con control significativo (registro PSC).'],
        'uk-influence': ['≥ 20 % — influencia significativa', 'Al menos el 20 % de los votos: se presume influencia significativa (NIC 28 / FRS 102) — en las cuentas del grupo, la sociedad es normalmente una asociada, por el método de la participación.'],
        'uk-notifiable': ['≥ 3 % — participación notificable', 'Al menos el 3 % de los derechos de voto de una sociedad cotizada: la participación debe comunicarse (normas DTR 5 de la FCA).'],
        'uk-investment': ['< 3 % — inversión', 'Menos del 3 %: inversión financiera.']
      },
      txt: {
        control: 'Companies Act 2006, s. 1159 y s. 1162',
        autocontrol: 'acciones de {name} en su propia cartera (las acciones propias no tienen voto, s. 726) o en manos de una sociedad que controla (una filial no puede ser socia de su matriz, s. 136)',
        concert: 'Personas que actúan concertadamente (Takeover Code, Definitions): los miembros se tratan como <b>un solo bloque de voto</b>. Si juntos tienen más del 50 % de los votos de una sociedad, la controlan conjuntamente.',
        blockMinority: '🛑 Minoría de bloqueo (más del 25 % de los votos: puede impedir un acuerdo especial): {names}.',
        blockController: 'El controlador aprueba solo los acuerdos ordinarios, pero no alcanza el 75 % necesario para un acuerdo especial.'
      }
    }
  },
  /* ---------------------------------------------------------------- droit américain */
  us: {
    fr: {
      cats: {
        'us-shortform': ['≥ 90 % — fusion simplifiée', "Au moins 90 % de chaque catégorie d'actions : la société mère peut absorber sa filiale sans vote des actionnaires (DGCL §253)."],
        'us-majority': ['> 50 % — majorité, contrôle', "Plus de 50 % des droits de vote : élit le conseil et approuve les modifications des statuts (charter) et les fusions (DGCL §242, §251 : majorité des actions en circulation). Contrôle. Il n'y a pas de minorité de blocage légale : une majorité renforcée ne s'applique que si les statuts la prévoient."],
        'us-influence': ['≥ 20 % — influence notable', "Au moins 20 % des droits de vote : influence notable présumée (ASC 323) — l'investisseur applique normalement la mise en équivalence. Dès 15 %, il est aussi un « interested stockholder » (DGCL §203)."],
        'us-interested': ['≥ 15 % — « interested stockholder »', "Au moins 15 % des droits de vote : « interested stockholder » (DGCL §203) — les rapprochements avec la société sont interdits pendant 3 ans, sauf accord du conseil."],
        'us-insider': ['≥ 10 % — initié (Section 16)', "Au moins 10 % d'une catégorie cotée : le bénéficiaire est traité comme un initié (Exchange Act §16) : déclarations et règle des profits à court terme."],
        'us-beneficial': ['> 5 % — Schedule 13D/13G', "Plus de 5 % d'une catégorie cotée : le bénéficiaire doit déposer un Schedule 13D (ou le 13G simplifié) auprès de la SEC (Exchange Act §13(d))."],
        'us-investment': ['≤ 5 % — placement', '5 % ou moins : simple placement financier.']
      },
      txt: {
        control: 'majorité des droits de vote',
        autocontrol: "actions détenues par {name} elle-même (treasury stock) ou par une filiale qu'elle détient majoritairement : elles ne votent pas (DGCL §160(c))",
        concert: "Un « group » (Exchange Act §13(d)(3)) : les membres agissant ensemble sont traités comme <b>un seul bloc de vote</b>. S'ils détiennent ensemble plus de 50 % des voix d'une société, ils la contrôlent conjointement."
      }
    },
    es: {
      cats: {
        'us-shortform': ['≥ 90 % — fusión simplificada', 'Al menos el 90 % de cada clase de acciones: la matriz puede absorber a la filial sin votación de los accionistas (DGCL §253).'],
        'us-majority': ['> 50 % — mayoría, control', 'Más del 50 % de los derechos de voto: elige al consejo y aprueba las modificaciones de los estatutos (charter) y las fusiones (DGCL §242, §251: mayoría de las acciones en circulación). Control. No existe minoría de bloqueo legal: solo hay mayoría reforzada si los estatutos la exigen.'],
        'us-influence': ['≥ 20 % — influencia significativa', 'Al menos el 20 % de los derechos de voto: se presume influencia significativa (ASC 323) — el inversor aplica normalmente el método de la participación. Desde el 15 %, también es un «interested stockholder» (DGCL §203).'],
        'us-interested': ['≥ 15 % — «interested stockholder»', 'Al menos el 15 % de los derechos de voto: «interested stockholder» (DGCL §203) — las operaciones de integración con la sociedad quedan restringidas durante 3 años salvo aprobación del consejo.'],
        'us-insider': ['≥ 10 % — insider (Section 16)', 'Al menos el 10 % de una clase cotizada: el titular se trata como un insider (Exchange Act §16): declaraciones y regla de beneficios a corto plazo.'],
        'us-beneficial': ['> 5 % — Schedule 13D/13G', 'Más del 5 % de una clase cotizada: el titular debe presentar el Schedule 13D (o el 13G abreviado) ante la SEC (Exchange Act §13(d)).'],
        'us-investment': ['≤ 5 % — inversión', 'El 5 % o menos: inversión financiera.']
      },
      txt: {
        control: 'mayoría de los derechos de voto',
        autocontrol: 'acciones de {name} en su propia cartera (treasury stock) o en manos de una filial participada mayoritariamente: no votan (DGCL §160(c))',
        concert: 'Un «group» (Exchange Act §13(d)(3)): los miembros que actúan juntos se tratan como <b>un solo bloque de voto</b>. Si juntos tienen más del 50 % de los votos de una sociedad, la controlan conjuntamente.'
      }
    }
  },
  /* ---------------------------------------------------------------- droit espagnol */
  es: {
    fr: {
      cats: {
        'es-venta': ['≥ 90 % — vente forcée (squeeze-out)', "Au moins 90 % : après une OPA portant sur la totalité du capital, l'initiateur peut exiger la vente forcée des actions des minoritaires."],
        'es-reforzada': ['≥ 2/3 — majorité renforcée', "Au moins les deux tiers : dans la SA, si moins de 50 % du capital est présent, modifier les statuts exige 2/3 du capital présent ou représenté (art. 201.2 LSC) ; dans la SL, la transformation, la fusion, la scission ou la suppression du droit préférentiel exigent 2/3 des voix (art. 199 b LSC)."],
        'es-mayoria': ['> 50 % — majorité, contrôle', "Plus de 50 % des droits de vote : majorité absolue en assemblée et contrôle de la société (art. 42 du Código de Comercio)."],
        'es-bloqueo': ['> 1/3 — minorité de blocage', "Plus d'un tiers des voix : peut empêcher les décisions qui exigent les deux tiers (SL, art. 199 b LSC ; SA lorsque moins de 50 % du capital est présent)."],
        'es-opa': ['≥ 30 % — OPA obligatoire', "Au moins 30 % des droits de vote d'une société cotée : l'actionnaire qui franchit ce seuil doit lancer une OPA sur la totalité du capital (RD 1066/2007, art. 4)."],
        'es-influencia': ['≥ 20 % — influence notable', 'Au moins 20 % des voix : influence notable présumée (IAS 28) — dans les comptes consolidés, la société est mise en équivalence.'],
        'es-minoria': ['≥ 5 % — droits de la minorité', "Au moins 5 % du capital : droits de la minorité — demander la convocation de l'assemblée, compléter l'ordre du jour, exercer l'action sociale en responsabilité (3 % dans les sociétés cotées)."],
        'es-inversion': ['< 5 % — placement', 'Moins de 5 % : placement financier (dans les sociétés cotées, les participations sont déclarées dès 3 %).']
      },
      txt: {
        control: 'art. 42 du Código de Comercio',
        autocontrol: "actions de {name} détenues par elle-même (autocartera, art. 148 LSC) ou par des sociétés qu'elle contrôle (art. 134 et s. LSC) : leurs droits de vote sont suspendus",
        concert: "Action de concert (RD 1066/2007, art. 5) : les membres sont traités comme <b>un seul bloc de vote</b>. S'ils dépassent ensemble 50 % des voix d'une société, ils la contrôlent conjointement.",
        blockMinority: "🛑 Minorité de blocage (plus d'un tiers des voix face aux décisions à majorité renforcée) : {names}.",
        blockController: "Le contrôleur décide seul à la majorité absolue, mais n'atteint pas les 2/3 de la majorité renforcée."
      }
    },
    en: {
      cats: {
        'es-venta': ['≥ 90% — squeeze-out', 'At least 90%: after a takeover bid for the whole capital, the bidder can require the minority to sell their shares (squeeze-out).'],
        'es-reforzada': ['≥ 2/3 — reinforced majority', 'At least two thirds: in an SA, if less than 50% of the capital attends, amending the articles requires 2/3 of the capital present or represented (art. 201.2 LSC); in an SL, conversion, merger, division or removal of pre-emption rights require 2/3 of the votes (art. 199 b LSC).'],
        'es-mayoria': ['> 50% — majority, control', 'More than 50% of the voting rights: absolute majority at the general meeting and control of the company (art. 42 Spanish Commercial Code).'],
        'es-bloqueo': ['> 1/3 — blocking minority', 'More than one third of the votes: can prevent resolutions requiring two thirds (SL, art. 199 b LSC; SA when less than 50% of the capital attends).'],
        'es-opa': ['≥ 30% — mandatory bid', 'At least 30% of the voting rights of a listed company: whoever reaches it must launch a takeover bid for the whole capital (RD 1066/2007, art. 4).'],
        'es-influencia': ['≥ 20% — significant influence', 'At least 20% of the votes: significant influence is presumed (IAS 28) — in consolidated accounts, the company is equity-accounted.'],
        'es-minoria': ['≥ 5% — minority rights', 'At least 5% of the capital: minority rights — requisitioning a general meeting, adding items to the agenda, bringing a derivative action (3% in listed companies).'],
        'es-inversion': ['< 5% — investment', 'Less than 5%: a financial investment (in listed companies, holdings are disclosed from 3%).']
      },
      txt: {
        control: 'art. 42 Spanish Commercial Code',
        autocontrol: 'shares of {name} held by itself (treasury shares, art. 148 LSC) or by companies it controls (art. 134 ff. LSC): their voting rights are suspended',
        concert: 'Acting in concert (RD 1066/2007, art. 5): the members are treated as <b>a single voting block</b>. If together they hold more than 50% of the votes of a company, they control it jointly.',
        blockMinority: '🛑 Blocking minority (more than one third of the votes against reinforced-majority resolutions): {names}.',
        blockController: 'The controller decides alone by absolute majority, but does not reach the 2/3 of the reinforced majority.'
      }
    }
  }
};

/* le droit par défaut a été choisi avant le chargement de ce fichier : on le réapplique traduit */
if (P.setJuris && P.juris) P.setJuris(P.juris);
