import { useEffect } from "react"
import { create } from "zustand"

type Cost = {
  imageCost: number
  setImageCost: (cost: number) => void
}

export const useImageCost = create<Cost>((set) => ({
  imageCost: 4,

  setImageCost: (cost: number) =>
    set(() => ({
      imageCost: cost,
    })),
}))

export const useImageCostUpdater = () => {
  const setImageCost = useImageCost((state) => state.setImageCost)

  useEffect(() => {
    const interval = setInterval(() => {
      const activeModel = JSON.parse(
        localStorage.getItem("activeModel") || "null",
      )

      if (activeModel?.id === "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3") {
        setImageCost(5)
      } else {
        setImageCost(4)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [setImageCost])
}
