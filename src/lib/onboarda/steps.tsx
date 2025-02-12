import { Tour } from "onborda/dist/types"

export const tours: Tour[] = [
  {
    tour: "firsttour",
    steps: [
      {
        icon: <>📂</>,
        title: "Explorer le menu de la barre latérale",
        content: (
          <>
            Dans la barre latérale, vous pouvez accéder à la section Explorer
            pour voir le flux de l&apos;application et toutes les publications
            d&apos;images et de vidéos, ainsi que les types de générations que
            vous pouvez effectuer.
          </>
        ),
        selector: "#tour1-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>👤</>,
        title: "Accéder à votre profil",
        content: (
          <>La section Profil vous redirigera vers votre profil utilisateur.</>
        ),
        selector: "#tour1-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🤝</>,
        title: "Affiliation",
        content: (
          <>
            Dans la section Affiliation, vous pouvez créer un lien
            d&apos;affiliation avec de nouveaux utilisateurs et gagner des
            bonus.
          </>
        ),
        selector: "#tour1-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🏆</>,
        title: "Classement",
        content: (
          <>
            Dans la section Classement, vous pouvez voir les classements par
            popularité des utilisateurs actifs sur la plateforme.
          </>
        ),
        selector: "#tour1-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔄</>,
        title: "Mettre à jour",
        content: <>Mettre à jour vos informations ou paramètres.</>,
        selector: "#tour1-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>💰</>,
        title: "Ajouter des jetons",
        content: (
          <>
            Ici, vous pouvez acheter plus de jetons pour les générations. Vous
            pouvez également créer un abonnement pour l&apos;ajout de jetons,
            que ce soit par semaine, par mois ou par année.
          </>
        ),
        selector: "#tour1-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🖼️</>,
        title: "Génération d'images IA",
        content: (
          <>La section IA IMAGE est dédiée à la génération d&apos;images.</>
        ),
        selector: "#tour1-step7",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🤖</>,
        title: "Assistant IA",
        content: (
          <>
            L&apos;assistant IA est une section où vous pouvez discuter avec une
            IA pour obtenir de l&apos;aide ou des suggestions.
          </>
        ),
        selector: "#tour1-step8",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎥</>,
        title: "Génération de vidéos",
        content: (
          <>
            Ici, vous pouvez générer des vidéos à partir de textes comme prompt
            et également avec des images pour les dynamiser.
          </>
        ),
        selector: "#tour1-step9",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎵</>,
        title: "Génération audio IA",
        content: (
          <>
            Avec l&apos;IA Audio, vous pouvez générer des sons audios à partir
            de textes en prompt.
          </>
        ),
        selector: "#tour1-step10",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "secondtour",
    steps: [
      {
        icon: <>💬</>,
        title: "Chat avec l'IA",
        content: (
          <>
            Vous serez redirigé vers une page où vous pourrez discuter avec une
            intelligence artificielle pour obtenir des réponses à vos questions
            ou des suggestions.
          </>
        ),
        selector: "#tour2-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🖼️</>,
        title: "Génération d'images",
        content: (
          <>
            Vous serez redirigé vers une page de génération d&apos;images où
            vous pouvez créer des images à partir de textes ou d&apos;autres
            images.
          </>
        ),
        selector: "#tour2-step2",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎥</>,
        title: "Image vers vidéo",
        content: (
          <>
            Vous serez redirigé vers une page de génération de vidéos à partir
            d&apos;une image, où vous pouvez transformer des images en vidéos.
          </>
        ),
        selector: "#tour2-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🤖</>,
        title: "Assistant IA",
        content: (
          <>
            Vous serez redirigé vers une page d&apos;assistance gérée par une
            intelligence artificielle pour obtenir de l&apos;aide ou des
            suggestions.
          </>
        ),
        selector: "#tour2-step4",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎵</>,
        title: "Génération audio",
        content: (
          <>
            Vous serez redirigé vers une page de génération de sons audios où
            vous pouvez créer des sons à partir de textes ou d&apos;autres
            audios.
          </>
        ),
        selector: "#tour2-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "thirdtour",
    steps: [
      {
        icon: <>📂</>,
        title: "Cacher le menu latéral",
        content: (
          <>
            Ce composant sert à montrer ou à cacher le menu latéral pour plus
            d&apos;espace pendant la navigation si besoin.
          </>
        ),
        selector: "#tour3-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>💰</>,
        title: "Jetons",
        content: (
          <>
            Cette section sur la barre de navigation vous montre le nombre
            actuel de jetons en votre possession, que vous pouvez utiliser pour
            différentes générations.
          </>
        ),
        selector: "#tour3-step2",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔄</>,
        title: "Améliorer l'abonnement",
        content: (
          <>
            Ici, vous pouvez améliorer votre plan d&apos;abonnement pour obtenir
            plus de fonctionnalités et de jetons.
          </>
        ),
        selector: "#tour3-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>⚙️</>,
        title: "Menu de connexion",
        content: (
          <>
            En l&apos;ouvrant, vous pouvez voir les menus suivants : Paramètres,
            Thèmes, Classement, Facturation et Déconnexion.
          </>
        ),
        selector: "#tour3-step4",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "fourthtour",
    steps: [
      {
        icon: <>📜</>,
        title: "Flux",
        content: (
          <>
            Dans le flux, vous pouvez voir toutes les images et vidéos générées
            et postées par leurs créateurs. Vous pouvez également interagir avec
            ces publications en les aimant, les commentant ou les partageant.
          </>
        ),
        selector: "#tour4-step1",
        side: "top-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "fifthtour",
    steps: [
      {
        icon: <>🖼️</>,
        title: "Modèle de génération",
        content: (
          <>
            Vous pouvez sélectionner différents modèles pour la génération
            d&apos;images, le modèle influencera le type d&apos;image que vous
            allez générer.
          </>
        ),
        selector: "#tour5-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎨</>,
        title: "Style prédéfini",
        content: <>Le style prédéfini définira le style de l&apos;image.</>,
        selector: "#tour5-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌈</>,
        title: "Contraste",
        content: (
          <>C&apos;est l&apos;option de contraste sur l&apos;image générée.</>
        ),
        selector: "#tour5-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔢</>,
        title: "Nombre d'images",
        content: <>Le nombre d&apos;images générées par la génération.</>,
        selector: "#tour5-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📏</>,
        title: "Dimensions de l'image",
        content: <>Ceci va définir le ratio de l&apos;image générée.</>,
        selector: "#tour5-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📐</>,
        title: "Résolution de l'image",
        content: <>Ceci va définir la résolution de l&apos;image générée.</>,
        selector: "#tour5-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "sixthtour",
    steps: [
      {
        icon: <>✏️</>,
        title: "Texte prompt",
        content: (
          <>
            Entrez ici un texte comme description de l&apos;image que vous
            voulez générer.
          </>
        ),
        selector: "#tour6-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🤖</>,
        title: "Texte IA",
        content: (
          <>
            Générez ou améliorez votre texte prompt avec une intelligence
            artificielle.
          </>
        ),
        selector: "#tour6-step2",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Bouton de génération",
        content: <>Bouton pour lancer la génération d&apos;image</>,
        selector: "#tour6-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔄</>,
        title: "Réutilisation du texte prompt",
        content: (
          <>Ceci sert à réutiliser le prompt de l&apos;image déjà générée.</>
        ),
        selector: "#tour6-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📋</>,
        title: "Copier le texte prompt",
        content: <>Copier le prompt de l&apos;image déjà générée.</>,
        selector: "#tour6-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📑</>,
        title: "Détails de l'image",
        content: (
          <>
            Ce sont les détails de l&apos;image générée : modèle, style
            prédéfini, contraste.
          </>
        ),
        selector: "#tour6-step6",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🗑️</>,
        title: "Menu",
        content: (
          <>
            Ceci contient les actions possibles sur l&apos;image générée comme
            la suppression de l&apos;image.
          </>
        ),
        selector: "#tour6-step7",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🖼️</>,
        title: "Image générée",
        content: (
          <>
            Ici se placent les images que vous avez générées, survolez
            l&apos;image pour voir les options : télécharger, publier.
          </>
        ),
        selector: "#tour6-step8",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "seventhtour",
    steps: [
      {
        icon: <>💬</>,
        title: "Créer une discussion",
        content: (
          <>
            Ceci vous sert à lancer une conversation avec l&apos;assistant IA.
          </>
        ),
        selector: "#tour7-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🤖</>,
        title: "Agents d'assistance",
        content: (
          <>
            Ici s&apos;affiche la liste des agents d&apos;assistance, ils
            s&apos;afficheront quand vous aurez commencé des discussions avec
            des assistants IA.
          </>
        ),
        selector: "#tour7-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🗂️</>,
        title: "Liste des conversations",
        content: (
          <>
            Ici s&apos;affiche la liste des conversations effectuées avec des
            agents.
          </>
        ),
        selector: "#tour7-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📥</>,
        title: "Télécharger la conversation",
        content: (
          <>
            Vous pouvez télécharger en audio les discussions que vous avez eues
            avec les agents IA.
          </>
        ),
        selector: "#tour7-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔍</>,
        title: "Sélection d'agents IA",
        content: (
          <>
            Vous avez plusieurs choix d&apos;agents avec qui vous pouvez
            discuter.
          </>
        ),
        selector: "#tour7-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌐</>,
        title: "Langue de la discussion",
        content: <>Vous pouvez choisir la langue de discussion.</>,
        selector: "#tour7-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Démarrer la conversation",
        content: <>Ici pour lancer la conversation.</>,
        selector: "#tour7-step7",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "eighthtour",
    steps: [
      {
        icon: <>✏️</>,
        title: "Texte prompt pour la génération de vidéo",
        content: (
          <>
            Le texte prompt décrit la vidéo qui va être générée. S&apos;il
            n&apos;y a pas de texte prompt, l&apos;image entrée sera juste
            transformée en vidéo. Et s&apos;il n&apos;y a pas d&apos;image, le
            texte décrira la vidéo qui sera générée.
          </>
        ),
        selector: "#tour8-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>⏱️</>,
        title: "Durée",
        content: <>C&apos;est la durée de la vidéo.</>,
        selector: "#tour8-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📏</>,
        title: "Ratio",
        content: (
          <>
            C&apos;est la résolution de la vidéo, soit en &quot;1280:768&quot;
            pour un &quot;Paysage&quot; ou en &quot;768:1280&quot; pour un
            &quot;Portrait&quot;.
          </>
        ),
        selector: "#tour8-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📤</>,
        title: "Importer une image",
        content: <>Sert à importer une image pour la génération de vidéo.</>,
        selector: "#tour8-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Bouton de génération",
        content: <>Bouton qui lance la génération de la vidéo.</>,
        selector: "#tour8-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎥</>,
        title: "Vidéos générées",
        content: <>Ici s&apos;affichera la liste des vidéos générées.</>,
        selector: "#tour8-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "ninthtour",
    steps: [
      {
        icon: <>🎵</>,
        title: "Génération d'effets audio",
        content: (
          <>
            Cette section contient la génération d&apos;effets audio que vous
            voulez avoir, comme le son d&apos;une voiture.
          </>
        ),
        selector: "#tour9-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🗣️</>,
        title: "Texte en parole",
        content: (
          <>
            Cette section contient la génération audio à partir de textes
            prompts.
          </>
        ),
        selector: "#tour9-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔊</>,
        title: "Changeur de voix",
        content: (
          <>
            Ici vous pouvez changer une voix entrée en sélectionnant un agent
            pour prendre son timbre vocal.
          </>
        ),
        selector: "#tour9-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎙️</>,
        title: "Doublage",
        content: <>La section doublage consiste à créer un doublage audio.</>,
        selector: "#tour9-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>✏️</>,
        title: "Texte prompt",
        content: (
          <>
            Entrez ici le texte en prompt pour générer le son que vous voulez.
          </>
        ),
        selector: "#tour9-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>⚙️</>,
        title: "Paramètres",
        content: (
          <>
            Ceci ouvre un menu pour ajouter quelques options spécifiques à la
            génération de son audio.
          </>
        ),
        selector: "#tour9-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Lancer la génération",
        content: (
          <>
            Ici pour lancer la génération après avoir bien complété les options
            de génération.
          </>
        ),
        selector: "#tour9-step7",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📋</>,
        title: "Exemple de texte",
        content: <>Vous pouvez choisir des exemples de texte.</>,
        selector: "#tour9-step8",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎵</>,
        title: "Audios générés",
        content: <>Ici c&apos;est la section des générations effectuées.</>,
        selector: "#tour9-step9",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "tenthtour",
    steps: [
      {
        icon: <>✏️</>,
        title: "Texte prompt",
        content: (
          <>
            Entrez ici le texte en prompt pour générer le son que vous voulez.
          </>
        ),
        selector: "#tour10-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔍</>,
        title: "Sélection d'agent",
        content: (
          <>Sélectionnez un agent pour la génération de texte en parole.</>
        ),
        selector: "#tour10-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌐</>,
        title: "Langue",
        content: <>Sélectionnez une langue.</>,
        selector: "#tour10-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Lancer la génération",
        content: <>Ici pour lancer la génération.</>,
        selector: "#tour10-step4",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📋</>,
        title: "Exemple de texte prompt",
        content: (
          <>Sélectionnez des textes prompts prédéfinis pour la génération.</>
        ),
        selector: "#tour10-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📑</>,
        title: "Résultats",
        content: <>Ici s&apos;afficheront les résultats.</>,
        selector: "#tour10-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "eleventhtour",
    steps: [
      {
        icon: <>🔍</>,
        title: "Sélection de voix",
        content: (
          <>
            Sélectionnez un agent, la voix en entrée sera remplacée par la voix
            de cet agent.
          </>
        ),
        selector: "#tour11-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎙️</>,
        title: "Enregistrement de voix",
        content: <>Enregistrez une voix en entrée.</>,
        selector: "#tour11-step2",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📤</>,
        title: "Upload de voix existante",
        content: (
          <>Uploader un fichier audio qui contient la voix à modifier.</>
        ),
        selector: "#tour11-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📑</>,
        title: "Résultats",
        content: <>Ici s&apos;afficheront les résultats.</>,
        selector: "#tour11-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "twelfthtour",
    steps: [
      {
        icon: <>✏️</>,
        title: "Nom de projet",
        content: <>Entrez le nom du projet pour le doublage.</>,
        selector: "#tour12-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌐</>,
        title: "Langue source",
        content: <>Sélectionnez la langue source pour faire la doublure.</>,
        selector: "#tour12-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌐</>,
        title: "Langue cible",
        content: <>Sélectionnez la langue cible.</>,
        selector: "#tour12-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📤</>,
        title: "Importation",
        content: <>Importez ici le son ou la vidéo pour la doublure.</>,
        selector: "#tour12-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔢</>,
        title: "Nombre d'intervenants",
        content: <>Choisissez le nombre d&apos;intervenants.</>,
        selector: "#tour12-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>⏱️</>,
        title: "Plage de temps à doubler",
        content: <>Sélectionnez la plage de temps à doubler.</>,
        selector: "#tour12-step6",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Lancer l'opération",
        content: <>Lancer l&apos;opération de doublage.</>,
        selector: "#tour12-step7",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
  {
    tour: "thirteenthtour",
    steps: [
      {
        icon: <>💰</>,
        title: "Compte accumulé",
        content: (
          <>
            Ceci est la somme d&apos;argent accumulée pendant tout votre temps
            de connexion sur la plateforme depuis le début.
          </>
        ),
        selector: "#tour13-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>💰</>,
        title: "Compte actuel",
        content: (
          <>
            Ceci est la somme d&apos;argent actuelle sur votre compte sur la
            plateforme.
          </>
        ),
        selector: "#tour13-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>⚠️</>,
        title: "Condition de retrait d&apos;argent",
        content: (
          <>
            Vous devez effectuer cette action pour pouvoir effectuer un retrait
            d&apos;argent sur la plateforme.
          </>
        ),
        selector: "#tour13-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>💸</>,
        title: "Retrait d&apos;argent",
        content: <>Entrez la somme que vous voulez retirer.</>,
        selector: "#tour13-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔗</>,
        title: "Parrainage",
        content: (
          <>
            Copiez le lien et partagez-le pour que de nouveaux utilisateurs
            puissent s&apos;y connecter et vous aurez des bénéfices de
            parrainage.
          </>
        ),
        selector: "#tour13-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
]
