import { create } from "zustand"
import { persist } from "zustand/middleware"
import { models } from "@/lib/leonardo/presets"
import type { Model } from "@/lib/leonardo/presets"

type GenerationSettings = {
    prompt: string
    activeModel: Model
    presetStyle: string
    contrast: string
    count: number
    id?: string
    height: number
    width: number
}

type GenerationActions = {
    setPrompt: (p: string) => void
    setActiveModel: (m: Model) => void
    setPresetStyle: (s: string) => void
    setContrast: (c: string) => void
    setCount: (n: number) => void
    setSize: (w: number, h: number) => void
    setId: (id?: string) => void
    reset: () => void
}

export const useImageGenerationStore = create<
    GenerationSettings & GenerationActions
>()(
    persist(
        (set, get) => ({
            prompt: "",
            activeModel: (() => {
                try {
                    const stored = localStorage.getItem("activeModel")
                    return stored ? (JSON.parse(stored) as Model) : models[0]
                } catch {
                    return models[0]
                }
            })(),
            presetStyle: (() => {
                try {
                    const stored = localStorage.getItem("presetStyle")
                    return stored ? JSON.parse(stored) : "DYNAMIC"
                } catch {
                    return "DYNAMIC"
                }
            })(),
            contrast: (() => {
                try {
                    const stored = localStorage.getItem("contrast")
                    return stored ? JSON.parse(stored) : "Medium"
                } catch {
                    return "Medium"
                }
            })(),
            count: (() => {
                try {
                    const stored = localStorage.getItem("count")
                    return stored ? parseInt(JSON.parse(stored)) : 2
                } catch {
                    return 2
                }
            })(),
            id: undefined,
            height: (() => {
                try {
                    const stored = localStorage.getItem("height")
                    return stored ? parseInt(JSON.parse(stored)) : 1176
                } catch {
                    return 1176
                }
            })(),
            width: (() => {
                try {
                    const stored = localStorage.getItem("width")
                    return stored ? parseInt(JSON.parse(stored)) : 784
                } catch {
                    return 784
                }
            })(),
            setPrompt: (p) => set({ prompt: p }),
            setActiveModel: (m) => {
                try {
                    localStorage.setItem("activeModel", JSON.stringify(m))
                } catch {}
                set({ activeModel: m })
            },
            setPresetStyle: (s) => {
                try {
                    localStorage.setItem("presetStyle", JSON.stringify(s))
                } catch {}
                set({ presetStyle: s })
            },
            setContrast: (c) => {
                try {
                    localStorage.setItem("contrast", JSON.stringify(c))
                } catch {}
                set({ contrast: c })
            },
            setCount: (n) => {
                try {
                    localStorage.setItem("count", JSON.stringify(n))
                } catch {}
                set({ count: n })
            },
            setSize: (w, h) => {
                try {
                    localStorage.setItem("width", JSON.stringify(w))
                    localStorage.setItem("height", JSON.stringify(h))
                } catch {}
                set({ width: w, height: h })
            },
            setId: (id) => set({ id }),
            reset: () => {
                set({
                    prompt: "",
                    activeModel: models[0],
                    presetStyle: "DYNAMIC",
                    contrast: "Medium",
                    count: 2,
                    id: undefined,
                    height: 1176,
                    width: 784,
                })
                try {
                    localStorage.removeItem("activeModel")
                    localStorage.removeItem("presetStyle")
                    localStorage.removeItem("contrast")
                    localStorage.removeItem("count")
                    localStorage.removeItem("width")
                    localStorage.removeItem("height")
                } catch {}
            },
        }),
        {
            name: "image-generation-store",
            partialize: (state) => ({
                prompt: state.prompt,
                activeModel: state.activeModel,
                presetStyle: state.presetStyle,
                contrast: state.contrast,
                count: state.count,
                height: state.height,
                width: state.width,
            }),
        }
    )
)
