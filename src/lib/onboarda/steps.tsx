import { Tour } from "onborda/dist/types"

export const tours: Tour[] = [
  {
    tour: "firsttour",
    steps: [
      {
        icon: <>👋</>,
        title: "Sidebar menu: Explorer",
        content: (
          <>
            Sur le sidebar, vous pouvez accéder à la section explorer pour voir
            le feed de l&apos;application et toutes les publications images et
            vidéos, ainsi que les types de générations que vous pouvez faire.
          </>
        ),
        selector: "#tour1-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄</>,
        title: "Sidebar menu: Profil",
        content: (
          <>
            La section profil vous redirigera vers votre profile
            d&apos;utilisateur.
          </>
        ),
        selector: "#tour1-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Sidebar menu: Affiliation",
        content: (
          <>
            Sur la section affiliation vous pourrez créer un lien
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
        icon: <>🚀</>,
        title: "Sidebar menu: Classement",
        content: (
          <>
            Dans le classement, vous pourrez voir les classements par rang de
            popularité des users actifs sur le platform
          </>
        ),
        selector: "#tour1-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Sidebar menu: Mettre à jour",
        content: <>First tour, fifth step</>,
        selector: "#tour1-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Sidebar menu: Ajouter plus de jetons",
        content: (
          <>
            Ici, vous pourrez vous acheter plus de jetons pour les générations.
            Vous pourrez aussi créer un abonnement pour l&apos;ajout des jetons,
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
        icon: <>🚀</>,
        title: "Sidebar menu: AI Image",
        content: <>La section IA IMAGE est pour la generation d&apos;image.</>,
        selector: "#tour1-step7",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Sidebar menu: Assistant IA",
        content: (
          <>
            L&apos;assistant IA est une séction où pourrez discuter avec un IA.
          </>
        ),
        selector: "#tour1-step8",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Sidebar menu: Génération de vidéos",
        content: (
          <>
            Ici, vous pourrez générez des vidéos à partir des textes comme
            prompt et aussi avec des images pour les dynamiser.
          </>
        ),
        selector: "#tour1-step9",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Sidebar menu: IA Audio",
        content: (
          <>
            Avec l&apos;IA Audio vous aurez la possiblité de générer des sons
            audios à partir des textes en prompt.
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
        icon: <>👋👋</>,
        title: "Feed menu: Chat with AI",
        content: (
          <>
            Vous serez rediriger vers une page où vous pourrez discuter avec une
            intelligence artificielle.
          </>
        ),
        selector: "#tour2-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄🪄</>,
        title: "Feed menu: Image generation",
        content: (
          <>Vous serez rediriger vers une page de generation d&apos;image.</>
        ),
        selector: "#tour2-step2",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩🎩</>,
        title: "Feed menu: Image to video",
        content: (
          <>
            Vous serez rediriger vers une page de generation de vidéo à partir
            d&apos;une image.
          </>
        ),
        selector: "#tour2-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀🚀</>,
        title: "Feed menu: AI assistant",
        content: (
          <>
            Vous serez rediriger vers une page d&apos;assistance gérer par une
            intelligence artificielle
          </>
        ),
        selector: "#tour2-step4",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀🚀</>,
        title: "Feed menu: Audio generation",
        content: (
          <>Vous serez rediriger vers une page de génération de son audio.</>
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
        icon: <>🪄🪄🪄</>,
        title: "Navigation bar: Cacher le sidebar",
        content: (
          <>
            Ce composant sert à montrer ou à cacher le sidebar pour plus
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
        icon: <>👋👋👋</>,
        title: "Navigation bar: Jeton",
        content: (
          <>
            Cette section sur la navigation bar vous montre le nombre actuel de
            jeton à votre possession.
          </>
        ),
        selector: "#tour3-step2",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄🪄🪄</>,
        title: "Navigation bar: upgrade subscription",
        content: <>Ici, vous pourrez améliorer votre plan d&apos;abonnement.</>,
        selector: "#tour3-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄🪄🪄</>,
        title: "Navigation bar: Menu de connexion",
        content: (
          <>
            En l&apos;ouvrant, vous pourrez voir les menus suivants: Settings,
            Thèmes, Ranking, Billing et la déconnexion .
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
        icon: <>🪄</>,
        title: "Feed",
        content: (
          <>
            Dans le feed, il y a toutes les images et vidéos générées et postées
            par leurs créateurs.
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
        icon: <>👋</>,
        title: "Model de generation",
        content: (
          <>
            Vous pouvez selectionner différentes model pour la génération
            d&apos;image, le model aura un influence sur le genre d&apos;image
            que vous allez générer.
          </>
        ),
        selector: "#tour5-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄</>,
        title: "Preset style",
        content: <>Le preset style définiera le style de l&apos;image.</>,
        selector: "#tour5-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Contrast",
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
        icon: <>🚀</>,
        title: "Nombre d'image",
        content: <>Le nombred&apos;image sortie par la génération.</>,
        selector: "#tour5-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Dimensions d'image",
        content: <>Ceci va définir le ratio de l&apos;image générée.</>,
        selector: "#tour5-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀🚀🚀🚀🚀</>,
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
        icon: <>👋</>,
        title: "Text prompt",
        content: (
          <>
            Entrez ici une text comme déscription de l&apos;image que vous
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
        icon: <>🪄</>,
        title: "Text IA",
        content: (
          <>
            Générez ou améliorez votre text prompt avec une intelligence
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
        icon: <>🎩</>,
        title: "Boutton de génération",
        content: <>Boutton pour lancer la génération d&apos;image</>,
        selector: "#tour6-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Réutilisation du text prompt",
        content: (
          <>Ceci sert à réutiliser le prompt de l&apos;image déjà générée. </>
        ),
        selector: "#tour6-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀Réutilisation du text prompt</>,
        title: "Sixth tour, Step 5",
        content: <>Copier le prompt de l&apos;image déja générée.</>,
        selector: "#tour6-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Détails de l'image",
        content: (
          <>
            Ce sont les détails de l&apos;image générée: model, preset style,
            contrast.
          </>
        ),
        selector: "#tour6-step6",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Menu",
        content: (
          <>
            Ceci contient les actions possible sur l&apos;image générée comme la
            suppression de l&apos;image.
          </>
        ),
        selector: "#tour6-step7",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Image générée",
        content: (
          <>
            Ici se place les images que avez généré, survolez l&apos;image pour
            voir les options: download, publier.{" "}
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
        icon: <>👋</>,
        title: "Create discussion",
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
        icon: <>🪄</>,
        title: "Agents d'assistance",
        content: (
          <>
            Ici s&apos;affiche la liste des agents d&apos;assistance, ils
            s&apos;afficheront quand vous aurez commencer des discussions avec
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
        icon: <>🎩</>,
        title: "Listes des conversations",
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
        icon: <>🚀</>,
        title: "Donwload conversation",
        content: (
          <>
            Vous pouvez télécharger en audio les discussions que vous avez eu
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
        icon: <>🚀</>,
        title: "Séléction d'agents IA",
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
        icon: <>🎩</>,
        title: "Language de la discussion",
        content: <>Vous pouvez choisir la language de discussion.</>,
        selector: "#tour7-step6",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Start conversation",
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
        icon: <>👋</>,
        title: "Text prompt, génération de vidéo",
        content: (
          <>
            Le text prompt décrit la vidéo qui va être générée. S&apos;il
            n&apos;y a pas de text prompt, l&apos;image entrée sera juste
            transformée en vidéo. Et s&apos;il n&apos;y a pas d&apos;image, le
            text décrira la vidéo qui sera générée.
          </>
        ),
        selector: "#tour8-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄</>,
        title: "Duration",
        content: <>C&apos;est la duration de la vidéo.</>,
        selector: "#tour8-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Ratio",
        content: (
          <>
            C&apos;est la résolution de la vidéo, soit en &quot;1280:768&quot;
            pour un &quot;Landscape&quot; ou en &quot;768:1280&quot; pour un
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
        icon: <>🚀</>,
        title: "Upload image",
        content: <>Sert à importer unne image pour la génération de vidéo.</>,
        selector: "#tour8-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Boutton de génération",
        content: <>Boutton qui lance la génération de la vidéo.</>,
        selector: "#tour8-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Vidéos",
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
        icon: <>👋</>,
        title: "FX Generation",
        content: (
          <>
            Cette section contient la génération de son audio que vous voulez
            avoir, comme le son d&apos;une voiture.
          </>
        ),
        selector: "#tour9-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄</>,
        title: "Text to Speech",
        content: (
          <>
            Cette section contient la génération audio à partir des texts
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
        icon: <>🎩</>,
        title: "Voice changer",
        content: (
          <>
            Ici vous pouvez changer uen voix entrée en séléctionnant un agent
            pour prendre son timbre vocale.
          </>
        ),
        selector: "#tour9-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Dubbing",
        content: <>La section dubbing consiste à créer un doublage audio.</>,
        selector: "#tour9-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Prompt text",
        content: (
          <>Entrez ici le text en prompt pour générer le son que vous voulez.</>
        ),
        selector: "#tour9-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Settings",
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
            Ici pour lancer la génération après avoir bien compléter les options
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
        icon: <>🚀</>,
        title: "Exemple de text",
        content: <>Vous pouvez choisir des exemples de texte.</>,
        selector: "#tour9-step8",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Audio",
        content: <>Voici l&apos;audio généré.</>,
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
        icon: <>👋</>,
        title: "Prompt text",
        content: (
          <>Entrez ici le text en prompt pour générer le son que vous voulez.</>
        ),
        selector: "#tour10-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄</>,
        title: "Séléction d'agent",
        content: (
          <>Séléctionnez un agent pour la génération de text-to-speech.</>
        ),
        selector: "#tour10-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Language",
        content: <>Séléctionnez une langue.</>,
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
        icon: <>🚀</>,
        title: "Exemple de text prompt",
        content: (
          <>Séléctionnez des texts prompts prédéfinis pour la génération.</>
        ),
        selector: "#tour10-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Résultats",
        content: <>Ici s&apos;affichera les résultas.</>,
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
        icon: <>👋</>,
        title: "Séléction de voix",
        content: (
          <>
            Séléctionner un agent, la voix en entrée sera remplacer par la voix
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
        icon: <>🪄</>,
        title: "Enregistrement de voix",
        content: <>Enregistrer une voix en entrée.</>,
        selector: "#tour11-step2",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
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
        icon: <>🚀</>,
        title: "Résultats",
        content: <>Ici s&apos;affichera les résultats.</>,
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
        icon: <>👋</>,
        title: "Welcome",
        content: (
          <>
            Welcome to the twelfth tour! This step will introduce you to the
            main features.
          </>
        ),
        selector: "#tour12-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄</>,
        title: "Feature One",
        content: <>This is the first feature of the twelfth tour.</>,
        selector: "#tour12-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Feature Two",
        content: <>This is the second feature of the twelfth tour.</>,
        selector: "#tour12-step3",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Feature Three",
        content: <>This is the third feature of the twelfth tour.</>,
        selector: "#tour12-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Feature Four",
        content: <>This is the fourth feature of the twelfth tour.</>,
        selector: "#tour12-step5",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Feature Five",
        content: <>This is the fifth feature of the twelfth tour.</>,
        selector: "#tour12-step6",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Feature Six",
        content: <>This is the sixth feature of the twelfth tour.</>,
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
        icon: <>👋</>,
        title: "Introduction",
        content: (
          <>
            Welcome to the thirteenth tour! This step will introduce you to the
            main features.
          </>
        ),
        selector: "#tour13-step1",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🪄</>,
        title: "Feature One",
        content: <>This is the first feature of the thirteenth tour.</>,
        selector: "#tour13-step2",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🎩</>,
        title: "Feature Two",
        content: <>This is the second feature of the thirteenth tour.</>,
        selector: "#tour13-step3",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Feature Three",
        content: <>This is the third feature of the thirteenth tour.</>,
        selector: "#tour13-step4",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
      {
        icon: <>🚀</>,
        title: "Conclusion",
        content: <>This is the final step of the thirteenth tour.</>,
        selector: "#tour13-step5",
        side: "bottom-left",
        showControls: true,
        pointerPadding: 12,
        pointerRadius: 12,
      },
    ],
  },
]
