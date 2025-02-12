"use client"
import { motion, useAnimation, Variants } from "framer-motion"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  id?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const Bounce: React.FC<FadeInProps> = ({
  children,
  delay = 0.2,
  duration = 1,
  className = "",
  once = false,
  id = "",
  onMouseEnter,
  onMouseLeave,
}) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [controls, inView, once])

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  )
}

export default Bounce
