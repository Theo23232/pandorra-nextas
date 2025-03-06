import { Tour } from "onborda/dist/types"

export const tours: Tour[] = [
  {
    tour: "firsttour",
    steps: [
      {
        icon: <>📂</>,
        title: "Explorer le menu de la barre latérale",
        content: (
          <>{`Dans la barre latérale, vous pouvez accéder à la section Explorer pour voir le flux de l'application et toutes les publications d'images et de vidéos, ainsi que les types de générations que vous pouvez effectuer.`}</>
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
          <>{`La section Profil vous redirigera vers votre profil utilisateur.`}</>
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
          <>{`Dans la section Affiliation, vous pouvez créer un lien d'affiliation avec de nouveaux utilisateurs et gagner des bonus.`}</>
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
          <>{`Dans la section Classement, vous pouvez voir les classements par popularité des utilisateurs actifs sur la plateforme. Soyez le premier et gagnez 1.800$`}</>
        ),
        selector: "#tour1-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔄</>,
        title: "Mettre à niveau",
        content: (
          <>{`Par ici pour souscrire à un abonnement, que ce soit par semaine, par mois ou par année.`}</>
        ),
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
          <>{`Ici, vous pouvez acheter plus de jetons pour les générations.`}</>
        ),
        selector: "#tour1-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🖼️</>,
        title: "Discutez avec notre IA",
        content: (
          <>{`Vous pourez discuter avec notre IA texte avancé. De manière totalement gratuite.`}</>
        ),
        selector: "#tour1-step7",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🖼️</>,
        title: "Génération d'images IA",
        content: (
          <>{`La section IA IMAGE est dédiée à la génération d'images.`}</>
        ),
        selector: "#tour1-step8",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🤖</>,
        title: "Assistant IA",
        content: (
          <>{`L'assistant IA est une section où vous pouvez discuter avec une IA pour obtenir de l'aide ou des suggestions.`}</>
        ),
        selector: "#tour1-step9",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎥</>,
        title: "Génération de vidéos",
        content: (
          <>{`Ici, vous pouvez générer des vidéos à partir de textes comme prompt et également avec des images pour les dynamiser.`}</>
        ),
        selector: "#tour1-step10",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎵</>,
        title: "Génération audio IA",
        content: (
          <>{`Avec l'IA Audio, vous pouvez générer des sons audios à partir de textes en prompt.`}</>
        ),
        selector: "#tour1-step11",
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
          <>{`Vous serez redirigé vers une page où vous pourrez discuter avec une intelligence artificielle pour obtenir des réponses à vos questions ou des suggestions.`}</>
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
          <>{`Vous serez redirigé vers une page de génération d'images où vous pouvez créer des images à partir de textes ou d'autres images.`}</>
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
          <>{`Vous serez redirigé vers une page de génération de vidéos à partir d'une image, où vous pouvez transformer des images en vidéos.`}</>
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
          <>{`Vous serez redirigé vers une page d'assistance gérée par une intelligence artificielle pour obtenir de l'aide ou des suggestions.`}</>
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
          <>{`Vous serez redirigé vers une page de génération de sons audios où vous pouvez créer des sons à partir de textes ou d'autres audios.`}</>
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
          <>{`Ce composant sert à montrer ou à cacher le menu latéral pour plus d'espace pendant la navigation si besoin.`}</>
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
          <>{`Cette section sur la barre de navigation vous montre le nombre actuel de jetons en votre possession, que vous pouvez utiliser pour différentes générations.`}</>
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
          <>{`Ici, vous pouvez améliorer votre plan d'abonnement pour obtenir plus de fonctionnalités et de jetons.`}</>
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
          <>{`En l'ouvrant, vous pouvez voir les menus suivants : Paramètres, Thèmes, Classement, Facturation et Déconnexion.`}</>
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
          <>{`Dans le flux, vous pouvez voir toutes les images et vidéos générées et postées par leurs créateurs. Vous pouvez également interagir avec ces publications en les aimant, les commentant ou les partageant.`}</>
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
          <>{`Vous pouvez sélectionner différents modèles pour la génération d'images, le modèle influencera le type d'image que vous allez générer.`}</>
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
        content: <>{`Le style prédéfini définira le style de l'image.`}</>,
        selector: "#tour5-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌈</>,
        title: "Contraste",
        content: <>{`C'est l'option de contraste sur l'image générée.`}</>,
        selector: "#tour5-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔢</>,
        title: "Nombre d'images",
        content: <>{`Le nombre d'images générées par la génération.`}</>,
        selector: "#tour5-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📏</>,
        title: "Dimensions de l'image",
        content: <>{`Ceci va définir le ratio de l'image générée.`}</>,
        selector: "#tour5-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📐</>,
        title: "Résolution de l'image",
        content: <>{`Ceci va définir la résolution de l'image générée.`}</>,
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
          <>{`Entrez ici un texte comme description de l'image que vous voulez générer.`}</>
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
          <>{`Générez ou améliorez votre texte prompt avec une intelligence artificielle.`}</>
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
        content: <>{`Bouton pour lancer la génération d'image`}</>,
        selector: "#tour6-step3",
        side: "bottom-right",
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
          <>{`Ceci vous sert à lancer une conversation avec l'assistant IA.`}</>
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
          <>{`Ici s'affiche la liste des agents d'assistance, ils s'afficheront quand vous aurez commencé des discussions avec des assistants IA.`}</>
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
          <>{`Ici s'affiche la liste des conversations effectuées avec des agents.`}</>
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
          <>{`Vous pouvez télécharger en audio les discussions que vous avez eues avec les agents IA.`}</>
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
          <>{`Vous avez plusieurs choix d'agents avec qui vous pouvez discuter.`}</>
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
        content: <>{`Vous pouvez choisir la langue de discussion.`}</>,
        selector: "#tour7-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Démarrer la conversation",
        content: <>{`Ici pour lancer la conversation.`}</>,
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
          <>{`Le texte prompt décrit la vidéo qui va être générée. S'il n'y a pas de texte prompt, l'image entrée sera juste transformée en vidéo. Et s'il n'y a pas d'image, le texte décrira la vidéo qui sera générée.`}</>
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
        content: <>{`C'est la durée de la vidéo.`}</>,
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
          <>{`C'est la résolution de la vidéo, soit en 1280:768 pour un Paysage ou en 768:1280 pour un Portrait.`}</>
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
        content: (
          <>{`Sert à importer une image pour la génération de vidéo.`}</>
        ),
        selector: "#tour8-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Bouton de génération",
        content: <>{`Bouton qui lance la génération de la vidéo.`}</>,
        selector: "#tour8-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎥</>,
        title: "Vidéos générées",
        content: <>{`Ici s'affichera la liste des vidéos générées.`}</>,
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
          <>{`Cette section contient la génération d'effets audio que vous voulez avoir, comme le son d'une voiture.`}</>
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
          <>{`Cette section contient la génération audio à partir de textes prompts.`}</>
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
          <>{`Ici vous pouvez changer une voix entrée en sélectionnant un agent pour prendre son timbre vocal.`}</>
        ),
        selector: "#tour9-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎵</>,
        title: "Audios générés",
        content: <>{`Ici c'est la section des générations effectuées.`}</>,
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
          <>{`Entrez ici le texte en prompt pour générer le son que vous voulez.`}</>
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
          <>{`Ceci ouvre un menu pour ajouter quelques options spécifiques à la génération de son audio.`}</>
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
          <>{`Ici pour lancer la génération après avoir bien complété les options de génération.`}</>
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
        content: <>{`Vous pouvez choisir des exemples de texte.`}</>,
        selector: "#tour9-step8",
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
          <>{`Entrez ici le texte en prompt pour générer le son que vous voulez.`}</>
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
          <>{`Sélectionnez un agent pour la génération de texte en parole.`}</>
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
        content: <>{`Sélectionnez une langue.`}</>,
        selector: "#tour10-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Lancer la génération",
        content: <>{`Ici pour lancer la génération.`}</>,
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
          <>{`Sélectionnez des textes prompts prédéfinis pour la génération.`}</>
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
        content: <>{`Ici s'afficheront les résultats.`}</>,
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
          <>{`Sélectionnez un agent, la voix en entrée sera remplacée par la voix de cet agent.`}</>
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
        content: <>{`Enregistrez une voix en entrée.`}</>,
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
          <>{`Uploader un fichier audio qui contient la voix à modifier.`}</>
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
        content: <>{`Ici s'afficheront les résultats.`}</>,
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
        content: <>{`Entrez le nom du projet pour le doublage.`}</>,
        selector: "#tour12-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌐</>,
        title: "Langue source",
        content: <>{`Sélectionnez la langue source pour faire la doublure.`}</>,
        selector: "#tour12-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🌐</>,
        title: "Langue cible",
        content: <>{`Sélectionnez la langue cible.`}</>,
        selector: "#tour12-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>📤</>,
        title: "Importation",
        content: <>{`Importez ici le son ou la vidéo pour la doublure.`}</>,
        selector: "#tour12-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🔢</>,
        title: "Nombre d'intervenants",
        content: <>{`Choisissez le nombre d'intervenants.`}</>,
        selector: "#tour12-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>⏱️</>,
        title: "Plage de temps à doubler",
        content: <>{`Sélectionnez la plage de temps à doubler.`}</>,
        selector: "#tour12-step6",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Lancer l'opération",
        content: <>{`Lancer l'opération de doublage.`}</>,
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
          <>{`Ceci est la somme d'argent accumulée pendant tout votre temps de connexion sur la plateforme depuis le début.`}</>
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
          <>{`Ceci est la somme d'argent actuelle sur votre compte sur la plateforme.`}</>
        ),
        selector: "#tour13-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>⚠️</>,
        title: "Condition de retrait d'argent",
        content: (
          <>{`Vous devez effectuer cette action pour pouvoir effectuer un retrait d'argent sur la plateforme.`}</>
        ),
        selector: "#tour13-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>💸</>,
        title: "Retrait d'argent",
        content: <>{`Entrez la somme que vous voulez retirer.`}</>,
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
          <>{`Copiez le lien et partagez-le pour que de nouveaux utilisateurs puissent s'y connecter et vous aurez des bénéfices de parrainage.`}</>
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
