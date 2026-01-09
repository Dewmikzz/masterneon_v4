import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type NeonButtonProps = HTMLMotionProps<'button'> & {
  variant?: ButtonVariant
}

const baseStyles =
  'relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white shadow-[0_0_15px_rgba(255,77,240,0.65)]',
  secondary: 'bg-transparent border border-white/30 text-white hover:border-pink-400/90',
  ghost: 'bg-transparent text-white/70 hover:text-white',
}

export const NeonButton = ({
  children,
  variant = 'primary',
  className,
  ...props
}: PropsWithChildren<NeonButtonProps>) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className={clsx(baseStyles, variantStyles[variant], className)}
    {...props}
  >
    <span className="drop-shadow-neon">{children}</span>
  </motion.button>
)

export default NeonButton

