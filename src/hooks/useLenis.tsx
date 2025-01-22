import { useEffect, useRef } from "react";

import Lenis from "@studio-freight/lenis";

interface UseLenisOptions {
  lerp?: number;
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal";
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

const useLenis = (options: UseLenisOptions = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Création de l'instance Lenis avec les options par défaut
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      ...options,
    });

    // Fonction de mise à jour pour l'animation
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Démarrage de la boucle d'animation
    requestAnimationFrame(raf);

    // Stockage de la référence
    lenisRef.current = lenis;

    // Nettoyage
    return () => {
      lenis.destroy();
    };
  }, [options]);

  return lenisRef.current;
};

export default useLenis;
