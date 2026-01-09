import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import type { BuilderConfig, CustomerDetails, NameSignConfig } from '../types/neon'
import { defaultTemplates, neonFonts } from '../data/builderOptions'

const BRAND_LOGO_URL = '/pdf/master-neon-logo.png'

// Helper to convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [255, 77, 240]
}

// Draw decorative circuit board pattern
const drawCircuitPattern = (doc: jsPDF, x: number, y: number, height: number, isLeft: boolean) => {
  const startX = isLeft ? x : x
  const direction = isLeft ? 1 : -1
  
  // Cyan for left, purple for right
  const [r, g, b] = isLeft ? [0, 255, 255] : [200, 100, 255]
  doc.setDrawColor(r, g, b)
  doc.setLineWidth(0.8)
  
  let currentY = y
  const segments = 8
  const segmentHeight = height / segments
  
  for (let i = 0; i < segments; i++) {
    // Vertical line
    doc.line(startX, currentY, startX, currentY + segmentHeight * 0.4)
    currentY += segmentHeight * 0.4
    
    // Horizontal line
    const horizontalLength = 3 + Math.random() * 2
    doc.line(startX, currentY, startX + (horizontalLength * direction), currentY)
    
    // Node circle
    doc.setFillColor(r, g, b)
    doc.circle(startX + (horizontalLength * direction), currentY, 1, 'F')
    
    // Diagonal line
    doc.line(startX + (horizontalLength * direction), currentY, startX, currentY + segmentHeight * 0.3)
    currentY += segmentHeight * 0.3
    
    // Small node
    doc.circle(startX, currentY, 0.8, 'F')
    currentY += segmentHeight * 0.3
  }
  
  // Final circle at bottom
  doc.circle(startX, currentY, 1.5, 'F')
}

// Draw wave pattern background
const drawWavePattern = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  const waves = 50
  
  for (let i = 0; i < waves; i++) {
    const alpha = i / waves
    const y = pageHeight * 0.3 + Math.sin(i * 0.5) * 20
    const endY = pageHeight * 0.8 + Math.cos(i * 0.3) * 30
    
    // Create gradient effect with varying line weights and colors
    const gray = 30 + alpha * 20
    doc.setDrawColor(gray, gray, gray)
    doc.setLineWidth(0.1 + alpha * 0.3)
    
    // Draw curved lines
    const startX = i * (pageWidth / waves)
    
    // Simple curve simulation with lines
    const steps = 20
    for (let j = 0; j < steps; j++) {
      const t1 = j / steps
      const t2 = (j + 1) / steps
      
      const x1 = startX + t1 * (pageWidth - startX)
      const y1 = y + t1 * (endY - y) + Math.sin(t1 * Math.PI * 3) * 15
      
      const x2 = startX + t2 * (pageWidth - startX)
      const y2 = y + t2 * (endY - y) + Math.sin(t2 * Math.PI * 3) * 15
      
      doc.line(x1, y1, x2, y2)
    }
  }
}

// Draw neon glow effect around text (simulated)
const drawNeonText = (doc: jsPDF, text: string, x: number, y: number, color: [number, number, number], size: number) => {
  // Outer glow
  doc.setTextColor(color[0] * 0.3, color[1] * 0.3, color[2] * 0.3)
  doc.setFontSize(size + 0.5)
  doc.text(text, x + 0.2, y + 0.2)
  
  // Main text
  doc.setTextColor(color[0], color[1], color[2])
  doc.setFontSize(size)
  doc.text(text, x, y)
}

export async function generatePDF(
  config: BuilderConfig,
  customerDetails: CustomerDetails,
  previewElement: HTMLElement | null
): Promise<string> {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = margin

  // Black background for entire page
  doc.setFillColor(0, 0, 0)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Draw wave pattern background
  drawWavePattern(doc, pageWidth, pageHeight)

  // Header section with gradient effect
  const headerHeight = 70
  doc.setFillColor(10, 10, 15)
  doc.rect(0, 0, pageWidth, headerHeight, 'F')

  // Add subtle gradient bars
  for (let i = 0; i < 5; i++) {
    const alpha = i / 5
    doc.setDrawColor(0, 255, 255, alpha * 50)
    doc.setLineWidth(0.5)
    const waveY = 10 + Math.sin(i) * 5
    for (let x = 0; x < pageWidth; x += 2) {
      const y = waveY + Math.sin(x * 0.1 + i) * 3
      doc.line(x, y, x + 1, y)
    }
  }

  // Logo in top right
  try {
    const logoImg = new Image()
    logoImg.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      logoImg.onload = () => resolve()
      logoImg.onerror = () => reject(new Error('Failed to load brand logo'))
      logoImg.src = BRAND_LOGO_URL
    })

    const logoSize = 28
    const logoX = pageWidth - margin - logoSize
    const logoY = 15
    doc.addImage(logoImg, 'PNG', logoX, logoY, logoSize, logoSize)
  } catch {
    // Fail silently
  }

  // "MASTER" in cyan
  doc.setFont('helvetica', 'bold')
  drawNeonText(doc, 'MASTER', margin, 35, [0, 255, 255], 32)
  
  // "NEON" in pink
  const masterWidth = doc.getTextWidth('MASTER ')
  doc.setFontSize(32)
  drawNeonText(doc, 'NEON', margin + masterWidth + 5, 35, [255, 20, 147], 32)

  // Subtitle
  doc.setFontSize(11)
  doc.setTextColor(180, 180, 180)
  doc.setFont('helvetica', 'normal')
  doc.text('Custom Design Specification', margin, 50)

  yPos = 85

  // Draw circuit board decorations on sides
  drawCircuitPattern(doc, margin - 5, yPos, 180, true)
  drawCircuitPattern(doc, pageWidth - margin + 5, yPos, 180, false)

  // -------------------- CUSTOMER INFORMATION --------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0, 255, 255)
  doc.text('CUSTOMER INFORMATION', margin + 10, yPos)
  
  yPos += 12

  // Customer details with clean layout
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text('Full Name:', margin + 10, yPos)
  doc.setTextColor(255, 255, 255)
  doc.text(customerDetails.customerName || 'Not provided', margin + 70, yPos)
  yPos += 10

  doc.setTextColor(200, 200, 200)
  doc.text('Email:', margin + 10, yPos)
  doc.setTextColor(255, 255, 255)
  doc.text(customerDetails.email || 'Not provided', margin + 70, yPos)
  yPos += 10

  doc.setTextColor(200, 200, 200)
  doc.text('Phone:', margin + 10, yPos)
  doc.setTextColor(255, 255, 255)
  doc.text(customerDetails.phone || 'Not provided', margin + 70, yPos)
  yPos += 15

  // -------------------- DESIGN CONFIGURATION --------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0, 255, 255)
  doc.text('DESIGN CONFIGURATION', margin + 10, yPos)
  
  yPos += 12

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  
  if (config.category === 'name') {
    const nameConfig = config as typeof config & { category: 'name' }
    
    const designFields = [
      { label: 'Category  :', value: 'Name Sign' },
      { label: 'Text Content  :', value: nameConfig.text || 'Not specified' },
      { label: 'Font Family  :', value: neonFonts.find(f => f.value === nameConfig.font)?.label || nameConfig.font },
      { label: 'Neon Color  :', value: nameConfig.color },
      { label: 'Size  :', value: nameConfig.size.charAt(0).toUpperCase() + nameConfig.size.slice(1) },
    ]
    
    designFields.forEach((field) => {
      doc.setTextColor(200, 200, 200)
      doc.text(field.label, margin + 10, yPos)
      doc.setTextColor(255, 255, 255)
      doc.text(field.value, margin + 70, yPos)
      yPos += 10
    })
  } else if (config.category === 'logo') {
    const logoConfig = config as typeof config & { category: 'logo' }
    
    const designFields = [
      { label: 'Category  :', value: 'Logo Sign' },
      { label: 'Image Uploaded  :', value: logoConfig.imageData ? 'Yes' : 'No' },
    ]
    
    if (logoConfig.text) {
      designFields.push({ label: 'Additional Text  :', value: logoConfig.text })
    }
    
    designFields.push(
      { label: 'Neon Color  :', value: logoConfig.color },
      { label: 'Frame Shape  :', value: logoConfig.frameShape.charAt(0).toUpperCase() + logoConfig.frameShape.slice(1) },
      { label: 'Size  :', value: logoConfig.size.charAt(0).toUpperCase() + logoConfig.size.slice(1) },
    )
    
    designFields.forEach((field) => {
      doc.setTextColor(200, 200, 200)
      doc.text(field.label, margin + 10, yPos)
      doc.setTextColor(255, 255, 255)
      doc.text(field.value, margin + 70, yPos)
      yPos += 10
    })
  } else if (config.category === 'default') {
    const defaultConfig = config as typeof config & { category: 'default' }
    const template = defaultTemplates.find(t => t.value === defaultConfig.template)
    
    const designFields = [
      { label: 'Category  :', value: 'Default Design Template' },
      { label: 'Template Name  :', value: template?.label || defaultConfig.template },
      { label: 'Custom Text  :', value: defaultConfig.customText || 'Not provided' },
      { label: 'Neon Color  :', value: defaultConfig.color },
      { label: 'Size  :', value: defaultConfig.size.charAt(0).toUpperCase() + defaultConfig.size.slice(1) },
    ]
    
    designFields.forEach((field) => {
      doc.setTextColor(200, 200, 200)
      doc.text(field.label, margin + 10, yPos)
      doc.setTextColor(255, 255, 255)
      doc.text(field.value, margin + 70, yPos)
      yPos += 10
    })
  }

  yPos += 10

  // -------------------- SELECTED DESIGN TEMPLATE --------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0, 255, 255)
  doc.text('SELECTED DESIGN TEMPLATE', margin + 10, yPos)
  
  yPos += 12

  // Handle different image sources based on design type
  if (config.category === 'logo' && (config as typeof config & { category: 'logo' }).imageData) {
    try {
      const logoConfig = config as typeof config & { category: 'logo' }
      const imgData = logoConfig.imageData!
      const imgWidth = pageWidth - 2 * margin - 20
      
      const img = new Image()
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = imgData
      })
      
      const imgHeight = (img.height * imgWidth) / img.width
      const maxHeight = pageHeight - yPos - 35
      const finalHeight = imgHeight > maxHeight ? maxHeight : imgHeight
      const finalWidth = (img.width * finalHeight) / img.height
      
      const imgX = margin + 10 + (imgWidth - finalWidth) / 2
      
      // Add neon border
      const [r, g, b] = hexToRgb(config.color)
      doc.setDrawColor(r, g, b)
      doc.setLineWidth(1.5)
      doc.roundedRect(imgX - 3, yPos - 3, finalWidth + 6, finalHeight + 6, 3, 3, 'S')
      
      // Inner shadow effect
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(0.5)
      doc.roundedRect(imgX - 1, yPos - 1, finalWidth + 2, finalHeight + 2, 2, 2, 'S')
      
      doc.addImage(imgData, 'PNG', imgX, yPos, finalWidth, finalHeight)
      yPos += finalHeight + 10
    } catch (error) {
      console.error('Error adding logo image to PDF:', error)
      doc.setFontSize(10)
      doc.setTextColor(255, 100, 100)
      doc.text('Logo image could not be added to PDF', margin + 10, yPos)
      yPos += 10
    }
  } else if (previewElement || 
             (config.category === 'name' && (config as NameSignConfig & { selectedTemplate?: string }).selectedTemplate) ||
             config.category === 'default') {
    try {
      let imgData: string | null = null
      let img: HTMLImageElement | null = null
      
      // Try to get template image first
      if (config.category === 'name') {
        const nameConfig = config as NameSignConfig & { selectedTemplate?: string }
        const template = defaultTemplates.find(t => t.value === nameConfig.selectedTemplate)
        if (template?.imageUrl) {
          img = new Image()
          img.crossOrigin = 'anonymous'
          try {
            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error('Timeout')), 5000)
              img!.onload = () => { clearTimeout(timeout); resolve() }
              img!.onerror = () => { clearTimeout(timeout); reject() }
              img!.src = template.imageUrl
            })
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0)
              imgData = canvas.toDataURL('image/png')
            }
          } catch {
            img = null
          }
        }
      } else if (config.category === 'default') {
        const defaultConfig = config as typeof config & { category: 'default' }
        const template = defaultTemplates.find(t => t.value === defaultConfig.template)
        if (template?.imageUrl) {
          img = new Image()
          img.crossOrigin = 'anonymous'
          try {
            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error('Timeout')), 5000)
              img!.onload = () => { clearTimeout(timeout); resolve() }
              img!.onerror = () => { clearTimeout(timeout); reject() }
              img!.src = template.imageUrl
            })
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0)
              imgData = canvas.toDataURL('image/png')
            }
          } catch {
            img = null
          }
        }
      }
      
      // Fallback to canvas preview
      if (!imgData && previewElement) {
        const canvas = await html2canvas(previewElement, {
          backgroundColor: '#040507',
          scale: 2.5,
          logging: false,
          useCORS: true,
        })
        imgData = canvas.toDataURL('image/png')
        img = new Image()
        img.src = imgData
        await new Promise<void>((resolve) => {
          img!.onload = () => resolve()
        })
      }
      
      if (imgData && img) {
        const imgWidth = pageWidth - 2 * margin - 20
        const imgHeight = (img.height * imgWidth) / img.width
        const maxHeight = pageHeight - yPos - 35
        const finalHeight = imgHeight > maxHeight ? maxHeight : imgHeight
        const finalWidth = (img.width * finalHeight) / img.height
        
        const imgX = margin + 10 + (imgWidth - finalWidth) / 2
        
        // Add neon border
        const [r, g, b] = hexToRgb(config.color)
        doc.setDrawColor(r, g, b)
        doc.setLineWidth(1.5)
        doc.roundedRect(imgX - 3, yPos - 3, finalWidth + 6, finalHeight + 6, 3, 3, 'S')
        
        // Inner shadow
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        doc.roundedRect(imgX - 1, yPos - 1, finalWidth + 2, finalHeight + 2, 2, 2, 'S')
        
        doc.addImage(imgData, 'PNG', imgX, yPos, finalWidth, finalHeight)
        yPos += finalHeight + 10
      }
    } catch (error) {
      console.error('Error generating preview image:', error)
    }
  }

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.setFont('helvetica', 'normal')
  const footerText = 'Master Neon – Custom Neon Sign Design | This document contains your complete design specification'
  doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Output PDF as ArrayBuffer and base64 string
  const arrayBuffer = doc.output('arraybuffer') as ArrayBuffer

  // convert to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const base64 = arrayBufferToBase64(arrayBuffer)

  // Trigger download for users
  const timestamp = new Date().toISOString().split('T')[0]
  doc.save(`MasterNeon-Design-${timestamp}.pdf`)

  return base64
}