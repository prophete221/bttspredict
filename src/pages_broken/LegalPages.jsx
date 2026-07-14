import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SITE } from '../data/constants'

/* ═══ Shared Layout ═══ */
function LegalLayout({ title, slug, children }) {
  return (
    <>
      <Helmet>
        <title>{title} | {SITE.name}</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE.url}/${slug}`} />
      </Helmet>

      <div className="min-h-screen pt-8 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-sm text-gray-500"
          >
            <Link to="/" className="hover:text-emerald transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{title}</span>
          </motion.nav>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-black text-white mb-10"
          >
            {title}
          </motion.h1>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose-dark"
          >
            {children}
          </motion.div>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <Link to="/" className="text-emerald hover:underline text-sm">
              &larr; Retour à l'accueil
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}

/* ═══ Mentions Légales ═══ */
export function MentionsLegales() {
  return (
    <LegalLayout title="Mentions Légales" slug="mentions-legales">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>{SITE.name}</strong> est édité à titre informatif et d'affiliation par un éditeur indépendant.
        Il s'agit d'un site indépendant qui n'est pas une plateforme de paris sportifs et ne collecte aucun fond.
        L'éditeur exerce son activité en toute indépendance éditoriale vis-à-vis des partenaires commerciaux.
      </p>
      <p>
        <strong>Directeur de la publication :</strong> Le propriétaire du nom de domaine bttsbet.online
        <br />
        <strong>Siège social :</strong> Douala, Cameroun
        <br />
        <strong>Numéro RCS :</strong> En cours d'immatriculation
        <br />
        <strong>N° TVA intracommunautaire :</strong> Non applicable (structure hors UE)
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question ou réclamation, vous pouvez nous contacter via WhatsApp au numéro indiqué sur notre site,
        ou par email à contact@{SITE.url.replace('https://', '').replace('http://', '')}.
        Nous nous engageons à répondre à toute demande dans un délai maximum de 30 jours ouvrés.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site <strong>{SITE.name}</strong> est hébergé par un prestataire d'hébergement web professionnel.
        Les données personnelles des visiteurs ne sont pas collectées à l'exception des données de navigation
        anonymisées nécessaires au bon fonctionnement du site (cookies analytiques, soumis à consentement).
      </p>
      <p>
        <strong>Hébergeur :</strong> GitHub Pages / Service d'hébergement statique
        <br />
        <strong>Adresse :</strong> 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis
        <br />
        <strong>Téléphone :</strong> +1 (415) 448-6672
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble du contenu de ce site (textes, images, logos, algorithmes) est protégé par le droit d'auteur.
        Toute reproduction, même partielle, sans autorisation préalable est interdite. Le nom {SITE.name},
        le logo et les éléments graphiques du site sont la propriété exclusive de l'éditeur.
      </p>

      <h2>Liens hypertextes et affiliation</h2>
      <p>
        Ce site contient des liens d'affiliation vers des plateformes de paris sportifs, notamment Linebet.
        Lorsqu'un utilisateur s'inscrit via ces liens, l'éditeur peut percevoir une commission sans aucun coût
        supplémentaire pour l'utilisateur. Ces liens sont identifiés par l'attribut <code>rel="sponsored nofollow"</code>
        conformément aux recommandations de Google. La présence de ces liens n'influence pas le contenu éditorial
        du site ni les pronostics générés par l'IA.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        {SITE.name} fournit des pronostics générés par intelligence artificielle à titre informatif uniquement.
        Ces pronostics ne constituent en aucun cas des conseils financiers ou des garanties de gain.
        L'utilisateur est seul responsable de ses décisions de pari et de la gestion de son budget.
        L'éditeur ne saurait être tenu responsable des pertes financières résultant de l'utilisation
        des pronostics publiés sur ce site.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit international. En cas de litige,
        les parties s'efforceront de trouver une solution amiable avant toute procédure judiciaire.
      </p>

      <p><em>Dernière mise à jour : 1er juin 2026</em></p>
    </LegalLayout>
  )
}

/* ═══ Politique de Confidentialité ═══ */
export function PolitiqueConfidentialite() {
  return (
    <LegalLayout title="Politique de Confidentialité" slug="politique-confidentialite">
      <h2>Collecte des données</h2>
      <p>
        {SITE.name} s'engage à respecter la vie privée de ses utilisateurs. Nous ne collectons aucune donnée
        personnelle identifiable (nom, email, numéro de téléphone) sauf si vous nous contactez volontairement
        via WhatsApp. Les seules données collectées automatiquement sont les données de navigation standards
        nécessaires au fonctionnement du site.
      </p>

      <h2>Cookies et technologies similaires</h2>
      <p>
        Nous utilisons des cookies techniques indispensables au bon fonctionnement du site. Nous pouvons
        également utiliser des cookies analytiques (anonymisés) pour comprendre comment les visiteurs
        utilisent notre site et améliorer notre service. Aucun cookie publicitaire tiers n'est utilisé.
        Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais cela peut
        affecter certaines fonctionnalités du site.
      </p>

      <h2>Données de navigation</h2>
      <p>
        Les données de navigation collectées peuvent inclure : adresse IP (anonymisée), type de navigateur,
        pages visitées, durée de la visite, système d'exploitation, et source de trafic. Ces données sont
        utilisées exclusivement à des fins statistiques et d'amélioration du site. Elles ne sont jamais
        vendues, louées ou partagées avec des tiers à des fins commerciales.
      </p>

      <h2>Liens externes</h2>
      <p>
        Notre site contient des liens vers des sites tiers (plateformes de paris sportifs). Ces sites ont
        leur propre politique de confidentialité que nous vous invitons à consulter. {SITE.name} n'est pas
        responsable des pratiques de confidentialité de ces sites tiers.
      </p>

      <h2>Sécurité des données</h2>
      <p>
        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour
        protéger les données contre tout accès non autorisé, modification, divulgation ou destruction.
        Le site utilise le protocole HTTPS pour chiffrer les communications entre votre navigateur
        et notre serveur.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément aux réglementations applicables en matière de protection des données (RGPD, lois nationales),
        vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données
        personnelles. Pour exercer ces droits, contactez-nous via les coordonnées indiquées dans nos
        mentions légales.
      </p>

      <h2>Modifications</h2>
      <p>
        Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
        Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous
        recommandons de consulter cette page régulièrement.
      </p>

      <p><em>Dernière mise à jour : 1er juin 2026</em></p>
    </LegalLayout>
  )
}

/* ═══ Jouer Responsable ═══ */
export function JouerResponsable() {
  return (
    <LegalLayout title="Jouer Responsable" slug="jouer-responsable">
      <h2>Engagement de {SITE.name}</h2>
      <p>
        {SITE.name} est un site informatif qui fournit des pronostics générés par intelligence artificielle.
        Nous ne sommes pas une plateforme de paris et ne collectons aucun fond. Cependant, nous prenons
        très au sérieux la question du jeu responsable et nous engageons à promouvoir des pratiques
        de pari saines et responsables auprès de nos utilisateurs.
      </p>

      <h2>Les paris sportifs comportent des risques</h2>
      <p>
        Les paris sportifs comportent des risques financiers réels. Il est important de comprendre que
        même avec des pronostics basés sur l'intelligence artificielle, aucun résultat n'est garanti.
        Notre taux de précision historique d'environ 87% signifie que près de 13 pronostics sur 100
        ne se réalisent pas. Les résultats passés ne garantissent en aucun cas les résultats futurs.
        Ne misez jamais plus que ce que vous pouvez vous permettre de perdre.
      </p>

      <h2>Conseils pour jouer responsable</h2>
      <p><strong>Fixez-vous un budget</strong> — Définissez un montant que vous êtes prêt à perdre sans que cela n'affecte votre vie quotidienne. Ce budget doit être distinct de vos dépenses essentielles (loyer, nourriture, factures).</p>
      <p><strong>Ne poursuivez pas vos pertes</strong> — Si vous perdez, ne tentez pas de récupérer vos pertes en augmentant vos mises. C'est le comportement le plus dangereux dans les paris sportifs. Acceptez la perte et passez à autre chose.</p>
      <p><strong>Misez de petites sommes</strong> — Ne misez jamais plus de 5% de votre bankroll sur un seul pari. La gestion de bankroll est la compétence la plus importante pour un parieur.</p>
      <p><strong>Ne pariez pas sous l'influence</strong> — L'alcool, la colère ou l'euphorie peuvent fausser votre jugement. Prenez vos décisions de pari à froid et de manière réfléchie.</p>
      <p><strong>Faites des pauses régulières</strong> — Ne pariez pas tous les jours. Prenez le temps de vous détacher des paris sportifs et de profiter d'autres activités.</p>

      <h2>Signes d'un problème lié au jeu</h2>
      <p>
        Demandez-vous honnêtement si vous présentez l'un de ces signes : vous pariez plus que prévu,
        vous avez du mal à arrêter, vous cachez vos habitudes de pari à vos proches, vous empruntez
        de l'argent pour parier, vous vous sentez anxieux ou irritable quand vous ne pariez pas.
        Si vous répondez oui à l'une de ces questions, il est temps de demander de l'aide.
      </p>

      <h2>Lignes d'écoute et ressources</h2>
      <p><strong>France :</strong> 09-74-75-13-13 (Joueurs Info Service) — Service gratuit et confidentiel, disponible du lundi au dimanche de 8h à 2h.</p>
      <p><strong>Cameroun :</strong> Contactez le MINSANT (Ministère de la Santé) ou appelez le 111 pour une orientation.</p>
      <p><strong>Sénégal :</strong> 33 867 22 22 — Centre d'écoute et de soutien.</p>
      <p><strong>Côte d'Ivoire :</strong> 143 — Numéro vert national de soutien psychologique.</p>
      <p><strong>Mali :</strong> Contactez les services de santé mentale de l'hôpital du Point G à Bamako.</p>
      <p><strong>International :</strong> <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer">BeGambleAware.org</a> — Ressources et soutien en anglais.</p>

      <h2>Auto-exclusion</h2>
      <p>
        Si vous ressentez le besoin de faire une pause, la plupart des plateformes de paris proposent
        des outils d'auto-exclusion temporaire ou permanente. N'hésitez pas à les utiliser. Sur Linebet,
        vous pouvez activer l'auto-exclusion dans les paramètres de votre compte. Rien ne vous empêche
        de continuer à consulter nos pronostics gratuitement sans parier.
      </p>

      <p><em>Dernière mise à jour : 1er juin 2026</em></p>
    </LegalLayout>
  )
}

/* ═══ CGU ═══ */
export function CGU() {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation" slug="cgu">
      <h2>Objet</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site
        {SITE.name} accessible à l'adresse {SITE.url}. En accédant au site, vous acceptez
        sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas
        utiliser le site.
      </p>

      <h2>Nature du service</h2>
      <p>
        {SITE.name} est un site informatif qui fournit des pronostics sportifs générés par
        intelligence artificielle pour les marchés BTTS (Both Teams To Score) et Over/Under 2.5 buts.
        Le site ne prend pas de paris, ne collecte pas de fonds, et ne gère pas de comptes de jeu.
        Les pronostics sont fournis gratuitement et à titre informatif uniquement.
      </p>

      <h2>Utilisation des pronostics</h2>
      <p>
        Les pronostics publiés sur {SITE.name} sont générés par un algorithme d'intelligence
        artificielle et ne constituent pas des conseils financiers, des garanties de gain ou des
        recommandations de pari. L'utilisateur est seul responsable de l'utilisation qu'il fait
        de ces pronostics et des décisions de pari qu'il prend. Les résultats historiques présentés
        sur le site reflètent des performances passées et ne préjugent pas des résultats futurs.
      </p>

      <h2>Liens d'affiliation</h2>
      <p>
        Le site contient des liens d'affiliation vers des plateformes de paris sportifs partenaires.
        Lorsqu'un utilisateur s'inscrit via ces liens et utilise le code promo VISION221, l'éditeur
        peut percevoir une commission. Cette commission n'entraîne aucun surcoût pour l'utilisateur.
        Les liens d'affiliation n'influencent pas le contenu éditorial ni les pronostics générés.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Tous les contenus du site (textes, algorithmes, logos, design) sont protégés par le droit
        de la propriété intellectuelle. Toute reproduction, représentation, modification ou distribution
        du contenu du site, même partielle, sans autorisation préalable écrite de l'éditeur est strictement
        interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        L'éditeur du site met tout en oeuvre pour fournir des informations exactes et des pronostics
        de qualité, mais ne peut garantir l'exactitude, la complétude ou l'actualité des informations
        diffusées. L'éditeur décline toute responsabilité pour les dommages directs ou indirects
        résultant de l'utilisation du site ou des pronostics publiés, y compris les pertes financières
        liées aux paris sportifs.
      </p>

      <h2>Disponibilité du service</h2>
      <p>
        L'éditeur s'efforce de maintenir le site accessible en permanence, mais ne saurait être tenu
        responsable des interruptions, qu'elles soient dues à des opérations de maintenance, des mises
        à jour, des force majeure ou des problèmes techniques indépendants de sa volonté. Les pronostics
        sont mis à jour quotidiennement via un processus automatisé ; en cas d'échec de ce processus,
        les pronostics affichés peuvent ne pas être actualisés.
      </p>

      <h2>Modifications des CGU</h2>
      <p>
        L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications
        prennent effet dès leur publication sur le site. L'utilisation continue du site après la
        publication des modifications constitue une acceptation de celles-ci.
      </p>

      <h2>Droit applicable et juridiction</h2>
      <p>
        Les présentes CGU sont régies par le droit international. Tout litige relatif à l'interprétation
        ou à l'exécution des présentes sera soumis à la compétence des tribunaux compétents.
      </p>

      <p><em>Dernière mise à jour : 1er juin 2026</em></p>
    </LegalLayout>
  )
}
