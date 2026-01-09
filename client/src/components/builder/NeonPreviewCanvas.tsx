import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { BuilderConfig } from '../../types/neon'
import { defaultTemplates } from '../../data/builderOptions'
import { neonFonts } from '../../data/builderOptions'

export interface NeonPreviewHandle {
  getImage: () => string | undefined
  spark: () => void
  toggleAnimation: () => void
}

const sizeScaleMap: Record<'small' | 'medium' | 'large', number> = {
  small: 0.8,
  medium: 1,
  large: 1.2,
}

const NeonPreviewCanvas = forwardRef<NeonPreviewHandle, BuilderConfig>((config, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sparkIndex, setSparkIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useImperativeHandle(ref, () => ({
    getImage: () => canvasRef.current?.toDataURL('image/png') ?? undefined,
    spark: () => setSparkIndex((prev) => prev + 1),
    toggleAnimation: () => setIsAnimating((prev) => !prev),
  }))

  // Animation loop for pulsing effect
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setSparkIndex((prev) => (prev + 0.1) % 10)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isAnimating])

  // Helper function to draw logo text
  const drawLogoText = (
    ctx: CanvasRenderingContext2D,
    logoConfig: BuilderConfig & { category: 'logo' },
    width: number,
    height: number,
    scale: number,
    sparkIdx: number,
    _imgX: number,
    imgY: number,
    _imgWidth: number,
    imgHeight: number
  ) => {
    const textFontSize = 50 * scale

    // Draw text/name if exists
    if (logoConfig.text && logoConfig.text.trim()) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${textFontSize}px ${neonFonts[0].value}`
      ctx.shadowColor = logoConfig.color
      ctx.shadowBlur = 30 + sparkIdx * 2
      ctx.fillStyle = logoConfig.color
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      
      // Position text below image if image exists, otherwise center
      const textY = logoConfig.imageData ? imgY + imgHeight + 60 : height / 2
      ctx.fillText(logoConfig.text.trim(), width / 2, textY)
      ctx.shadowBlur = 0
      ctx.strokeText(logoConfig.text.trim(), width / 2, textY)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#040507'
    ctx.fillRect(0, 0, width, height)

    const gradient = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 260)
    gradient.addColorStop(0, `${config.color}33`)
    gradient.addColorStop(1, '#05060a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    const scale = sizeScaleMap[config.size]
    const baseFontSize = 70

    if (config.category === 'name') {
      // Name Sign Designer
      const safeText = config.text.trim() || 'YOUR NEON'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${baseFontSize * scale}px ${config.font}`
      // Pulsing glow effect
      const glowIntensity = 40 + Math.sin(sparkIndex) * 15
      ctx.shadowColor = config.color
      ctx.shadowBlur = glowIntensity
      ctx.fillStyle = config.color
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.2 + Math.sin(sparkIndex * 2) * 0.3
      ctx.fillText(safeText, width / 2, height / 2)
      ctx.shadowBlur = 0
      ctx.strokeText(safeText, width / 2, height / 2)
      
      // Add sparkle effect
      if (isAnimating && Math.random() > 0.95) {
        const sparkX = width / 2 + (Math.random() - 0.5) * 200
        const sparkY = height / 2 + (Math.random() - 0.5) * 50
        ctx.fillStyle = config.color
        ctx.shadowColor = config.color
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (config.category === 'logo') {
      // Logo Sign Designer - Enhanced with image and text
      let imageX = width / 2
      let imageY = height / 2
      let imageWidth = 0
      let imageHeight = 0

      // Draw uploaded image if exists
      if (config.imageData) {
        const img = new Image()
        img.onload = () => {
          // Redraw everything
          ctx.clearRect(0, 0, width, height)
          ctx.fillStyle = '#040507'
          ctx.fillRect(0, 0, width, height)
          
          const gradient = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 260)
          gradient.addColorStop(0, `${config.color}33`)
          gradient.addColorStop(1, '#05060a')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)

          const maxWidth = width * 0.5
          const maxHeight = height * 0.5
          let imgW = img.width * scale
          let imgH = img.height * scale
          
          if (imgW > maxWidth) {
            imgH = (imgH * maxWidth) / imgW
            imgW = maxWidth
          }
          if (imgH > maxHeight) {
            imgW = (imgW * maxHeight) / imgH
            imgH = maxHeight
          }

          imageX = (width - imgW) / 2
          imageY = (height - imgH) / 2
          imageWidth = imgW
          imageHeight = imgH

          // Draw neon outline effect with pulsing
          const glowIntensity = 30 + Math.sin(sparkIndex) * 10
          ctx.shadowColor = config.color
          ctx.shadowBlur = glowIntensity
          ctx.globalAlpha = 0.9 + Math.sin(sparkIndex * 1.5) * 0.1
          ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)
          
          // Draw outline with pulsing
          ctx.globalAlpha = 1
          ctx.strokeStyle = config.color
          ctx.lineWidth = 3 + Math.sin(sparkIndex * 2) * 0.5
          ctx.shadowBlur = 20 + Math.sin(sparkIndex) * 5
          ctx.strokeRect(imageX - 5, imageY - 5, imageWidth + 10, imageHeight + 10)

          // Draw text on top
          drawLogoText(ctx, config, width, height, scale, sparkIndex, imageX, imageY, imageWidth, imageHeight)
          setImageLoaded(true)
        }
        img.onerror = () => {
          // If image fails to load, just draw text
          drawLogoText(ctx, config, width, height, scale, sparkIndex, imageX, imageY, imageWidth, imageHeight)
        }
        img.src = config.imageData
      } else {
        // No image - draw text centered
        drawLogoText(ctx, config, width, height, scale, sparkIndex, imageX, imageY, imageWidth, imageHeight)
      }
    } else if (config.category === 'default') {
      // Default Neon Designs - Show actual neon sign images
      const template = defaultTemplates.find(t => t.value === config.template)
      if (template?.imageUrl) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          // Redraw background
          ctx.clearRect(0, 0, width, height)
          ctx.fillStyle = '#040507'
          ctx.fillRect(0, 0, width, height)
          
          const gradient = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 260)
          gradient.addColorStop(0, `${config.color}33`)
          gradient.addColorStop(1, '#05060a')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)

          // Calculate image dimensions
          const maxWidth = width * 0.8
          const maxHeight = height * 0.8
          let imgW = img.width * scale
          let imgH = img.height * scale
          
          if (imgW > maxWidth) {
            imgH = (imgH * maxWidth) / imgW
            imgW = maxWidth
          }
          if (imgH > maxHeight) {
            imgW = (imgW * maxHeight) / imgH
            imgH = maxHeight
          }

          const imgX = (width - imgW) / 2
          const imgY = (height - imgH) / 2

          // Apply neon glow effect with selected color and pulsing
          const glowIntensity = 40 + Math.sin(sparkIndex) * 15
          ctx.shadowColor = config.color
          ctx.shadowBlur = glowIntensity
          ctx.globalCompositeOperation = 'source-over'
          
          // Draw image with color overlay and pulsing brightness
          ctx.globalAlpha = 0.9 + Math.sin(sparkIndex * 1.5) * 0.1
          ctx.drawImage(img, imgX, imgY, imgW, imgH)
          
          // Apply color tint with pulsing
          ctx.globalAlpha = 0.3 + Math.sin(sparkIndex) * 0.1
          ctx.fillStyle = config.color
          ctx.fillRect(imgX, imgY, imgW, imgH)
          
          // Draw neon outline with pulsing
          ctx.globalAlpha = 1
          ctx.strokeStyle = config.color
          ctx.lineWidth = 3 + Math.sin(sparkIndex * 2) * 0.5
          ctx.shadowBlur = 25 + Math.sin(sparkIndex) * 8
          ctx.strokeRect(imgX - 5, imgY - 5, imgW + 10, imgH + 10)

          // Overlay custom text
          const overlayText = (config.customText || template?.text || 'Your Neon').trim()
          if (overlayText) {
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = `${baseFontSize * 0.65 * scale}px ${neonFonts[0].value}`
            ctx.shadowColor = config.color
            ctx.shadowBlur = 35 + Math.sin(sparkIndex) * 8
            ctx.fillStyle = config.color
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 1.2
            ctx.fillText(overlayText, width / 2, imgY + imgH + 50)
            ctx.shadowBlur = 0
            ctx.strokeText(overlayText, width / 2, imgY + imgH + 50)
          }
        }
        img.onerror = () => {
          // Fallback to text if image fails to load
          const text = (config.customText || template?.text || 'Welcome').trim()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = `${baseFontSize * scale}px "Monoton", cursive`
          ctx.shadowColor = config.color
          ctx.shadowBlur = 40 + sparkIndex * 2
          ctx.fillStyle = config.color
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.2
          ctx.fillText(text, width / 2, height / 2)
          ctx.shadowBlur = 0
          ctx.strokeText(text, width / 2, height / 2)
        }
        img.src = template.imageUrl
      } else {
        // Fallback to text if no image URL
        const text = template?.text || 'Welcome'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `${baseFontSize * scale}px "Monoton", cursive`
        ctx.shadowColor = config.color
        ctx.shadowBlur = 40 + sparkIndex * 2
        ctx.fillStyle = config.color
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1.2
        ctx.fillText(text, width / 2, height / 2)
        ctx.shadowBlur = 0
        ctx.strokeText(text, width / 2, height / 2)
      }
    }
  }, [config, sparkIndex, imageLoaded])

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="h-full w-full rounded-3xl border border-white/10 bg-black/70 cursor-pointer transition-all hover:border-pink-400/50"
        width={900}
        height={420}
        onClick={() => setIsAnimating((prev) => !prev)}
        title="Click to toggle animation"
      />
      {!isAnimating && (
        <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white/70">
          Paused
        </div>
      )}
    </div>
  )
})

NeonPreviewCanvas.displayName = 'NeonPreviewCanvas'

export default NeonPreviewCanvas
