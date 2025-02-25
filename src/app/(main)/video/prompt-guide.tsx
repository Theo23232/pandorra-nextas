"use client"
import { AlertCircle, Info } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tremor/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PromptGuide() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-center p-4">
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded p-2 hover:bg-accent hover:text-accent-foreground"
      >
        <Info size={20} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t(`Guide de Prompting Pandorra video`)}
            </DialogTitle>
            <DialogDescription>
              {t(
                `Conseils pour obtenir des résultats optimaux avec Pandorra video`,
              )}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(80vh-10rem)] pr-4">
            <div className="space-y-6 p-1">
              <p className="text-base text-gray-700 dark:text-gray-300">
                {t(
                  `Pandorra video a un potentiel illimité pour donner vie à votre vision artistique pour une grande variété d'utilisations. Créer un prompt efficace qui communique clairement la scène est la clé pour générer une vidéo alignée avec votre concept.`,
                )}
              </p>

              <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle size={18} />
                    {t(`Points importants`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    {t(
                      `• Évitez les formulations négatives dans vos prompts (ex: la caméra ne bouge pas)`,
                    )}
                  </p>
                  <p>
                    {t(
                      `• Utilisez un prompt simple et direct qui décrit le mouvement souhaité avec une image d'entrée`,
                    )}
                  </p>
                  <p>
                    {t(
                      `• Vous n'avez pas besoin de décrire votre image d'entrée dans un prompt textuel`,
                    )}
                  </p>
                </CardContent>
              </Card>

              <Tabs defaultValue="basics">
                <TabsList>
                  <TabsTrigger value="basics">{t(`Les bases`)}</TabsTrigger>
                  <TabsTrigger value="prompting">
                    {t(`Types de prompts`)}
                  </TabsTrigger>
                  <TabsTrigger value="examples">{t(`Exemples`)}</TabsTrigger>
                  <TabsTrigger value="keywords">{t(`Mots-clés`)}</TabsTrigger>
                </TabsList>

                <TabsContent value="basics" className="mt-4 space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Prompts directs et facilement compris`)}
                    </h3>
                    <p className="mb-2">
                      {t(
                        `Lorsque vous rédigez un prompt, imaginez que vous décrivez une scène à un nouveau collaborateur qui ne connaît pas votre travail antérieur et votre esthétique préférée.`,
                      )}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                        <div className="mb-1 font-semibold text-red-600 dark:text-red-400">
                          {t(`❌ À éviter`)}
                        </div>
                        <p>{t(`un homme qui pirate le système principal.`)}</p>
                      </div>
                      <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-900/20">
                        <div className="mb-1 font-semibold text-green-600 dark:text-green-400">
                          {t(`✅ Préférable`)}
                        </div>
                        <p>
                          {t(`un homme tapant vigoureusement sur un clavier.`)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Prompts descriptifs, non conversationnels`)}
                    </h3>
                    <p className="mb-2">
                      {t(
                        `Alors que les LLM externes prospèrent sur la conversation naturelle, nos modèles sont conçus pour exceller dans les détails visuels.`,
                      )}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                        <div className="mb-1 font-semibold text-red-600 dark:text-red-400">
                          {t(`❌ À éviter`)}
                        </div>
                        <p>
                          {`pouvez-vous me faire une vidéo de deux amis mangeant un gâteau d'anniversaire ?`}
                        </p>
                      </div>
                      <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-900/20">
                        <div className="mb-1 font-semibold text-green-600 dark:text-green-400">
                          {t(`✅ Préférable`)}
                        </div>
                        <p>
                          {t(`deux amis mangent un gâteau d'anniversaire.`)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Formulations positives`)}
                    </h3>
                    <p className="mb-2">
                      {t(
                        `Les prompts négatifs ne sont pas pris en charge dans les modèles de vidéo générative et peuvent produire l'effet inverse.`,
                      )}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                        <div className="mb-1 font-semibold text-red-600 dark:text-red-400">
                          {t(`❌ À éviter`)}
                        </div>
                        <p>
                          {t(
                            `la caméra ne bouge pas. pas de mouvement. pas de nuages dans le ciel.`,
                          )}
                        </p>
                      </div>
                      <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-900/20">
                        <div className="mb-1 font-semibold text-green-600 dark:text-green-400">
                          {t(`✅ Préférable`)}
                        </div>
                        <p>
                          {t(
                            `caméra statique. la caméra reste immobile. un ciel bleu clair`,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="prompting" className="mt-4 space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Prompts textuels uniquement`)}
                    </h3>
                    <p className="mb-4">
                      {t(
                        `Les prompts textuels sont plus efficaces lorsqu'ils suivent une structure claire qui divise les détails sur la scène, le sujet et le mouvement de la caméra en sections distinctes.`,
                      )}
                    </p>

                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="mb-2 font-medium">
                        {t(`Structure recommandée :`)}
                      </p>
                      <p className="font-mono text-gray-700 dark:text-gray-300">
                        {t(
                          `[mouvement de caméra] : [scène principale]. [détails supplémentaires].`,
                        )}
                      </p>

                      <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
                        <p className="text-sm italic">
                          {t(
                            `Exemple : Plan statique en contre-plongée : La caméra est orientée vers une femme vêtue de orange alors qu'elle se tient dans une forêt tropicale avec une flore colorée. Le ciel dramatique est couvert et gris.`,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Image + Texte`)}
                    </h3>
                    <p className="mb-2">
                      {t(
                        `Lors de l'utilisation d'images d'entrée, utilisez un prompt textuel simple et direct qui décrit le mouvement souhaité. Vous n'avez pas besoin de décrire le contenu de l'image.`,
                      )}
                    </p>

                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="mb-2 font-medium">{t(`Exemple :`)}</p>
                      <p className="italic">
                        {t(
                          `Le sujet pose joyeusement, ses mains formant un signe de paix.`,
                        )}
                      </p>
                    </div>

                    <p className="mt-3 text-amber-600 dark:text-amber-400">
                      {t(
                        `Attention : Utiliser un prompt qui diffère significativement de l'image d'entrée peut conduire à des résultats inattendus.`,
                      )}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="mt-4 space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Transitions fluides`)}
                    </h3>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="italic">
                        {t(
                          `Séquence FPV continue en vitesse accélérée : La caméra vole de façon fluide à travers un canyon glaciaire vers un paysage nuageux de rêve.`,
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Mouvement de caméra`)}
                    </h3>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="italic">
                        {t(
                          `Un océan lumineux la nuit avec des créatures bioluminescentes sous l'eau. La caméra commence par un gros plan macro d'une méduse brillante puis s'élargit pour révéler l'océan entier éclairé avec diverses couleurs brillantes sous un ciel étoilé. Mouvement de caméra : Commencer par un plan macro de la méduse, puis reculer doucement et monter pour montrer l'océan lumineux.`,
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`Cartes de titre`)}
                    </h3>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="italic">
                        {t(
                          `Un écran de titre avec un mouvement dynamique. La scène commence sur un mur coloré couvert de peinture. Soudain, de la peinture noire se déverse sur le mur pour former le mot Pandorra. La peinture qui dégouline est détaillée et texturée, centrée, avec un éclairage cinématographique superbe.`,
                        )}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="keywords" className="mt-4">
                  <p className="mb-4">
                    {t(
                      `Les mots-clés peuvent être bénéfiques pour obtenir des styles spécifiques. Assurez-vous que les mots-clés sont cohérents avec l'ensemble de votre prompt.`,
                    )}
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t(`Styles de caméra`)}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-2 text-sm">
                        <p>{t(`• Contre-plongée (Low angle)`)}</p>
                        <p>{t(`• Plongée (High angle)`)}</p>
                        <p>{t(`• Vue aérienne (Overhead)`)}</p>
                        <p>{t(`• FPV`)}</p>
                        <p>{t(`• Caméra à l'épaule (Hand held)`)}</p>
                        <p>{t(`• Grand angle (Wide angle)`)}</p>
                        <p>{t(`• Gros plan (Close up)`)}</p>
                        <p>{t(`• Macro cinematography`)}</p>
                        <p>{t(`• Over the shoulder`)}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{`Styles d'éclairage`}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-2 text-sm">
                        <p>{t(`• Éclairage diffus (Diffused lighting)`)}</p>
                        <p>{t(`• Silhouette`)}</p>
                        <p></p>
                        <p>{t(`• Contre-jour (Back lit)`)}</p>
                        <p>{t(`• Éclairage latéral (Side lit)`)}</p>
                        <p>
                          {t(
                            `• Éclairage gélatine [couleur] ([color] gel lighting)`,
                          )}
                        </p>
                        <p>{t(`• Éclairage vénitien (Venetian lighting)`)}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t(`Types de mouvements`)}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-2 text-sm">
                        <p>{t(`• Croît (Grows)`)}</p>
                        <p>{t(`• Émerge (Emerges)`)}</p>
                        <p>{t(`• Explose (Explodes)`)}</p>
                        <p>{t(`• Monte (Ascends)`)}</p>
                        <p>{t(`• Ondule (Undulates)`)}</p>
                        <p>{t(`• Se déforme (Warps)`)}</p>
                        <p>{t(`• Se transforme (Transforms)`)}</p>
                        <p>{t(`• Ondule (Ripples)`)}</p>
                        <p>{t(`• Se brise (Shatters)`)}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t(`Style et esthétique`)}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-2 text-sm">
                        <p>{t(`• Atmosphérique (Moody)`)}</p>
                        <p>{t(`• Cinématique (Cinematic)`)}</p>
                        <p>{t(`• Iridescent`)}</p>
                        <p>{t(`• Home video VHS`)}</p>
                        <p>{t(`• Glitchcore`)}</p>
                        <p>{t(`• Gras (Bold)`)}</p>
                        <p>{t(`• Graffiti`)}</p>
                        <p>{t(`• Néon (Neon)`)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-2 font-semibold">
                      {t(`Placeholders entre crochets`)}
                    </h3>
                    <p className="mb-2">
                      {t(
                        `Pour créer des préréglages personnalisés faciles à réutiliser, vous pouvez également mettre une partie de votre prompt entre crochets pour remplacer le texte en 1 clic. Par exemple :`,
                      )}
                    </p>
                    <p className="italic">
                      {t(
                        `La caméra vole de façon fluide à travers un [emplacement du sujet]`,
                      )}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
