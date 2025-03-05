import type { TaskPriority, TaskType } from "@prisma/client";

export const typeColors: Record<TaskType, string> = {
  BUG: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100", // Rouge pour les bugs - indique un problème
  FEATURE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100", // Bleu pour les nouvelles fonctionnalités
  IMPROVEMENT:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100", // Vert pour les améliorations - positif
  SUGGESTION:
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100", // Ambre/Orange pour les suggestions - attire l'attention sans urgence
  FEEDBACK:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100", // Vert émeraude pour les retours positifs - distinction du vert standard
};

export const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-slate-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-amber-500",
  CRITICAL: "bg-red-500",
};
