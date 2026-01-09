import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import NeonPreviewCanvas, { type NeonPreviewHandle } from '../components/builder/NeonPreviewCanvas'
import NeonButton from '../components/common/NeonButton'
import { neonColorOptions, sizeOptions, defaultTemplates, sizeMaxLetters, getDefaultFont } from '../data/builderOptions'
import FontDropdown from '../components/builder/FontDropdown'
import type { BuilderConfig, CustomerDetails, NameSignConfig, LogoSignConfig } from '../types/neon'
import { generatePDF, generateInvoicePDF, downloadPDFFromBase64 } from '../utils/pdfGenerator'
import api from '../services/api'

const BuilderPage = () => {
  const [searchParams] = useSearchParams()
  const initialTabParam = searchParams.get('tab') as 'name' | 'logo' | 'template' | null
  const presetParam = searchParams.get('preset')

  const initialTab: 'name' | 'logo' | 'template' = initialTabParam ?? 'name'
  const [activeTab, setActiveTab] = useState<'name' | 'logo' | 'template'>(initialTab)
  const previewRef = useRef<NeonPreviewHandle>(null)
  const previewElementRef = useRef<HTMLDivElement>(null)
  const customerSectionRef = useRef<HTMLDivElement>(null)
  // Name Sign Config
  const [nameConfig, setNameConfig] = useState<NameSignConfig>({
    category: 'name',
    text: 'Your Name',
    font: getDefaultFont(), // Barcelona as default
    color: neonColorOptions[0].value,
    size: 'medium',
  })

  // Logo Sign Config
  const [logoConfig, setLogoConfig] = useState<LogoSignConfig>({
    category: 'logo',
    color: neonColorOptions[0].value,
    frameShape: 'circle',
    size: 'medium',
  })

  // Customer Details
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    customerName: '',
    email: '',
    phone: '',
    notes: '',
  })

  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  })
  const [isSending, setIsSending] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    phone?: string
  }>({})
  const [generatedPdfBase64, setGeneratedPdfBase64] = useState<string | null>(null)
  const [generatedInvoicePdfBase64, setGeneratedInvoicePdfBase64] = useState<string | null>(null)
  const [templateModalPdfBase64, setTemplateModalPdfBase64] = useState<string | null>(null)
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<typeof defaultTemplates[0] | null>(null)
  const [templateModalConfig, setTemplateModalConfig] = useState<{
    text: string
    color: string
    size: 'small' | 'medium' | 'large'
  }>({
    text: '',
    color: neonColorOptions[0].value,
    size: 'medium',
  })

  const getCurrentConfig = (): BuilderConfig => {
    if (activeTab === 'name') return nameConfig
    if (activeTab === 'logo') return logoConfig
    return nameConfig
  }

  const handleNameConfigChange = <K extends keyof NameSignConfig>(
    field: K,
    value: NameSignConfig[K]
  ) => {
    setNameConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoConfigChange = <K extends keyof LogoSignConfig>(
    field: K,
    value: LogoSignConfig[K]
  ) => {
    setLogoConfig((prev) => ({ ...prev, [field]: value }))
  }

  // If coming from a preset (template), set the name text and store selected template
  useEffect(() => {
    if (presetParam) {
      const tpl = defaultTemplates.find((t) => t.value === presetParam)
      if (tpl) {
        setNameConfig((prev) => ({
          ...prev,
          text: tpl.text || tpl.label,
          selectedTemplate: tpl.value,
        }))
        setActiveTab('name')
      }
    }
  }, [presetParam])

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.'
    }
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return undefined // Phone is optional
    // Remove all non-digit characters to count digits
    const digitsOnly = phone.replace(/\D/g, '')
    // Must have exactly 10 digits
    if (digitsOnly.length !== 10) {
      return 'Phone number must contain exactly 10 digits.'
    }
    return undefined
  }

  // Compress image to reduce payload size
  const compressImage = (dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Scale down if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const compressed = canvas.toDataURL('image/jpeg', quality)
          resolve(compressed)
        } else {
          resolve(dataUrl) // Fallback to original
        }
      }
      img.onerror = () => resolve(dataUrl) // Fallback to original on error
      img.src = dataUrl
    })
  }

  const handleCustomerChange =
    <K extends keyof CustomerDetails>(field: K) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value = event.target.value

        // Restrict phone input to numbers only
        if (field === 'phone') {
          value = value.replace(/\D/g, '') // Remove all non-digits
        }

        setCustomerDetails((prev) => ({ ...prev, [field]: value }))

        // Validate on change
        if (field === 'email') {
          const error = validateEmail(value)
          setValidationErrors((prev) => ({ ...prev, email: error }))
        } else if (field === 'phone') {
          const error = validatePhone(value)
          setValidationErrors((prev) => ({ ...prev, phone: error }))
        }
      }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setLogoConfig((prev) => ({ ...prev, imageData }))
      }
      reader.readAsDataURL(file)
    }
  }


  const validateCustomerDetails = (): boolean => {
    // Validate required fields
    if (!customerDetails.customerName || !customerDetails.email) {
      setStatus({ type: 'error', message: 'Name and email are required.' })
      return false
    }

    // Validate email format
    const emailError = validateEmail(customerDetails.email)
    if (emailError) {
      setValidationErrors((prev) => ({ ...prev, email: emailError }))
      setStatus({ type: 'error', message: emailError })
      return false
    }

    // Validate phone format if provided
    if (customerDetails.phone) {
      const phoneError = validatePhone(customerDetails.phone)
      if (phoneError) {
        setValidationErrors((prev) => ({ ...prev, phone: phoneError }))
        setStatus({ type: 'error', message: phoneError })
        return false
      }
    }

    // Clear validation errors if all valid
    setValidationErrors({})
    return true
  }

  const handleDownloadPDF = async () => {
    if (!validateCustomerDetails()) return

    const config = getCurrentConfig()
    // For default and logo designs, skip live preview capture (they use uploaded/selected images)
    const previewNode = activeTab === 'name' ? previewElementRef.current : null
    const pdfBase64 = await generatePDF(config, customerDetails, previewNode)
    // Store the generated PDF so it can be used when sending email
    setGeneratedPdfBase64(pdfBase64)
  }

  const handleSendToDesigner = async () => {
    if (!validateCustomerDetails()) return

    // Preflight: check backend health to avoid silent network errors (connection refused / CORS)
    try {
      await api.get('/health')
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          'Cannot reach API server. Please check your network connection and try again.',
      })
      return
    }

    setIsSending(true)
    setStatus({ type: 'idle', message: '' })

    try {
      const config = getCurrentConfig()
      // For logo, use uploaded image; for name, capture canvas
      let imagePreview = activeTab === 'logo' ? (config as LogoSignConfig).imageData : previewRef.current?.getImage()

      // Compress image preview to reduce payload size (Vercel has 4.5MB limit)
      if (imagePreview && imagePreview.startsWith('data:image')) {
        try {
          imagePreview = await compressImage(imagePreview, 800, 0.7)
          console.log('Image compressed for upload')
        } catch (compressError) {
          console.warn('Failed to compress image, using original:', compressError)
        }
      }

      // Use stored PDF if available, otherwise generate a new one
      let pdfBase64 = generatedPdfBase64
      if (!pdfBase64) {
        // Generate PDF and get base64 representation (also triggers download)
        const previewNode = activeTab === 'name' ? previewElementRef.current : null
        pdfBase64 = await generatePDF(config, customerDetails, previewNode)
        setGeneratedPdfBase64(pdfBase64)
      } else {
        // PDF already generated, trigger download manually
        const timestamp = new Date().toISOString().split('T')[0]
        downloadPDFFromBase64(pdfBase64, `MasterNeon-Design-${timestamp}.pdf`)
        // Small delay to avoid browser blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Generate invoice PDF
      let invoicePdfBase64 = generatedInvoicePdfBase64
      if (!invoicePdfBase64) {
        invoicePdfBase64 = await generateInvoicePDF(config, customerDetails)
        setGeneratedInvoicePdfBase64(invoicePdfBase64)
      } else {
        // Invoice PDF already generated, trigger download manually
        const timestamp = new Date().toISOString().split('T')[0]
        downloadPDFFromBase64(invoicePdfBase64, `MasterNeon-Invoice-${timestamp}.pdf`)
      }

      // Estimate payload size and skip PDFs if too large (Vercel limit is ~4.5MB)
      const payloadSize = JSON.stringify({
        ...customerDetails,
        config,
        imagePreview,
        pdfBase64,
        invoicePdfBase64,
      }).length

      // If payload is approaching limit (3.5MB), skip PDF attachments
      const maxPayloadSize = 3.5 * 1024 * 1024 // 3.5MB to leave buffer
      if (payloadSize > maxPayloadSize) {
        console.warn('Payload too large, skipping PDF attachments to prevent 413 error')
        if (pdfBase64) {
          pdfBase64 = null
        }
        if (invoicePdfBase64) {
          invoicePdfBase64 = null
        }
      }

      const requestPayload = {
        ...customerDetails,
        config,
        imagePreview,
        pdfBase64,
        invoicePdfBase64,
        timestamp: new Date().toISOString(),
      }
      
      console.log('📤 Sending design request with attachments:')
      console.log('- Design PDF:', pdfBase64 ? `Yes (${Math.round(pdfBase64.length / 1024)}KB)` : 'No')
      console.log('- Invoice PDF:', invoicePdfBase64 ? `Yes (${Math.round(invoicePdfBase64.length / 1024)}KB)` : 'No')
      console.log('- Image Preview:', imagePreview ? `Yes (${Math.round(imagePreview.length / 1024)}KB)` : 'No')
      
      const response = await api.post('/neon-request', requestPayload)

      const responseData = response?.data || {}
      setStatus({
        type: 'success',
        message: responseData.message || 'Sent! A Master Neon designer will reply with proofs within 1 business day.',
      })
      setCustomerDetails({ customerName: '', email: '', phone: '', notes: '' })
      // Clear stored PDFs after successful send
      setGeneratedPdfBase64(null)
      setGeneratedInvoicePdfBase64(null)
    } catch (error: any) {
      // Handle 413 Payload Too Large error specifically
      if (error?.response?.status === 413) {
        setStatus({
          type: 'error',
          message: 'Request too large. Please try again - the image has been compressed. If this persists, try with a smaller image.',
        })
        return
      }

      // Provide a clearer message for network errors (backend not running / CORS / unreachable)
      const isNetworkError = error?.code === 'ERR_NETWORK' || (error?.message && error.message.toLowerCase().includes('network'))
      const errorMessage = isNetworkError
        ? 'Cannot reach API server. Please check your network connection and try again.'
        : error?.response?.data?.message || error?.message || 'We could not submit the request. Check your connection or try again shortly.'

      setStatus({ type: 'error', message: errorMessage })
      console.error('Error sending request:', error)
    } finally {
      setIsSending(false)
    }
  }

  const currentConfig = getCurrentConfig()

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Custom Neon Builder</p>
        <h2 className="mt-2 text-4xl font-semibold">Design your perfect neon sign</h2>
        <p className="mt-3 text-white/70">
          Choose from three design options: custom name signs, logo signs, or ready-made templates. Preview in real-time
          and download your design as a PDF.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {(['name', 'logo', 'template'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm uppercase tracking-[0.3em] transition ${activeTab === tab
              ? 'border-b-2 border-pink-400 text-pink-300'
              : 'text-white/60 hover:text-white'
              }`}
          >
            {tab === 'name' && 'Name Sign'}
            {tab === 'logo' && 'Logo Sign'}
            {tab === 'template' && 'Templates'}
          </button>
        ))}
      </div>

      <div className={`grid gap-8 ${activeTab === 'name' ? 'lg:grid-cols-[1.3fr_0.7fr]' : ''}`}>
        {/* Preview Panel (only shown for name signs) */}
        {activeTab === 'name' && (
          <motion.div
            layout
            className="glass-panel flex flex-col gap-4 border border-white/10 p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div ref={previewElementRef} className="rounded-[2rem] border border-white/5 p-4 shadow-neon">
              <div className="aspect-[9/4]">
                <NeonPreviewCanvas ref={previewRef} {...currentConfig} />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60">
              <p>Live neon preview</p>
              {activeTab === 'name' && <p>{nameConfig.text.length}/{sizeMaxLetters[nameConfig.size]} characters</p>}
            </div>
          </motion.div>
        )}

        {/* Controls Panel */}
        <div className="glass-panel border border-white/10 p-4 md:p-6">
          <div className="space-y-5">
            {activeTab === 'name' && (
              <>
                <label className="block text-sm uppercase tracking-[0.3em] text-white/50">
                  Neon Text
                  <input
                    maxLength={sizeMaxLetters[nameConfig.size]}
                    value={nameConfig.text}
                    onChange={(e) => {
                      const newText = e.target.value.slice(0, sizeMaxLetters[nameConfig.size])
                      handleNameConfigChange('text', newText)
                    }}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-pink-400 focus:outline-none"
                    placeholder={`Enter your text (max ${sizeMaxLetters[nameConfig.size]} letters)`}
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Maximum {sizeMaxLetters[nameConfig.size]} letters for {nameConfig.size} size
                  </p>
                </label>

                <FontDropdown
                  selectedFont={nameConfig.font}
                  onFontChange={(font) => handleNameConfigChange('font', font)}
                  previewText={nameConfig.text || 'Sample'}
                  onPreviewTextChange={(text) => handleNameConfigChange('text', text)}
                />
              </>
            )}

            {activeTab === 'logo' && (
              <>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-2">Upload Logo Image</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30"
                  />
                  {logoConfig.imageData && (
                    <div
                      className={`mt-3 mx-auto max-w-[200px] overflow-hidden border border-white/10 transition-all duration-300 ${logoConfig.frameShape === 'circle' ? 'rounded-full aspect-square bg-black/40' : 'rounded-xl'
                        }`}
                      style={{
                        boxShadow: `0 0 10px ${logoConfig.color}, 0 0 20px ${logoConfig.color}, inset 0 0 10px ${logoConfig.color}40`,
                      }}
                    >
                      <img
                        src={logoConfig.imageData}
                        alt="Uploaded logo"
                        className="w-full h-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-2">Backboard Shape</p>
                    <div className="flex gap-3">
                      {['circle', 'square'].map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => handleLogoConfigChange('frameShape', shape as 'circle' | 'square')}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm transition ${logoConfig.frameShape === shape
                            ? 'border-pink-400/70 bg-pink-500/10 text-white shadow-neon'
                            : 'border-white/10 bg-black/40 text-white/60 hover:border-pink-400/40'
                            }`}
                        >
                          {shape.charAt(0).toUpperCase() + shape.slice(1)} Cut
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <label className="block text-sm uppercase tracking-[0.3em] text-white/50">
                  Add Name/Text
                  <input
                    maxLength={sizeMaxLetters[logoConfig.size]}
                    value={logoConfig.text || ''}
                    onChange={(e) => {
                      const newText = e.target.value.slice(0, sizeMaxLetters[logoConfig.size])
                      handleLogoConfigChange('text', newText)
                    }}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-pink-400 focus:outline-none"
                    placeholder={`Enter name or text (max ${sizeMaxLetters[logoConfig.size]} letters)`}
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Maximum {sizeMaxLetters[logoConfig.size]} letters for {logoConfig.size} size
                  </p>
                </label>
              </>
            )}

            {/* Default designs handled via Showcase; gallery removed from builder */}

            {activeTab === 'template' && (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50">Template gallery</p>
                    <p className="text-white/70">Pick a design and click customize to add name, color, and size.</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {defaultTemplates.map((template) => (
                    <div
                      key={template.value}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40 text-left transition hover:border-pink-400/50"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={template.imageUrl}
                          alt={template.label}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          loading="eager"
                          fetchPriority="high"
                          decoding="sync"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Preset</p>
                          <p className="text-lg font-semibold text-white drop-shadow-neon">{template.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3 text-sm text-white/80">
                        <button
                          type="button"
                          className="rounded-full border border-pink-400/70 bg-pink-500/20 px-3 py-2 text-xs uppercase tracking-[0.3em] text-pink-100 shadow-neon transition hover:-translate-y-0.5"
                          onClick={() => {
                            setSelectedTemplateForModal(template)
                            setTemplateModalConfig({
                              text: template.text || template.label,
                              color: neonColorOptions[0].value,
                              size: 'medium',
                            })
                          }}
                        >
                          Customize
                        </button>
                        <span className="text-xs text-white/60">Tap customize to add name, color, size</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {activeTab === 'name' || activeTab === 'logo' ? (
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Color</p>
                <div className="mt-3 grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {neonColorOptions.map((color) => (
                    <div key={color.value} className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (activeTab === 'name') handleNameConfigChange('color', color.value)
                          if (activeTab === 'logo') handleLogoConfigChange('color', color.value)
                        }}
                        className={`h-10 w-10 rounded-full border-2 transition ${currentConfig.color === color.value ? 'border-white ring-2 ring-pink-500 ring-offset-2 ring-offset-black' : 'border-white/20'
                          }`}
                        style={{ backgroundColor: color.value }}
                        aria-label={color.label}
                      />
                      <span className="text-[10px] text-center text-white/60 leading-tight w-full truncate px-1">
                        {color.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Size Selector */}
            {activeTab === 'name' || activeTab === 'logo' ? (
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Size</p>
                <p className="mt-2 text-xs text-white/60">
                  Name sign starting price: {sizeOptions.map((s, i) => (
                    <span key={s.value}>
                      {s.label} {s.price.toLocaleString()} /=
                      {i < sizeOptions.length - 1 && ' | '}
                    </span>
                  ))}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => {
                        if (activeTab === 'name') handleNameConfigChange('size', size.value)
                        if (activeTab === 'logo') handleLogoConfigChange('size', size.value)
                      }}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${currentConfig.size === size.value
                        ? 'border-pink-400/70 bg-pink-500/10 text-white'
                        : 'border-white/10 text-white/70'
                        }`}
                    >
                      <p className="text-base font-semibold">{size.label}</p>
                      <p className="text-xs text-white/60">{size.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {activeTab !== 'template' && (
        <>
          {/* Customer Details & Actions */}
          <div ref={customerSectionRef} className="grid gap-8 lg:grid-cols-2">
            <form
              className="glass-panel space-y-4 border border-white/10 p-4 md:p-6"
              onSubmit={(e: FormEvent) => {
                e.preventDefault()
                void handleSendToDesigner()
              }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">Customer Details</p>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none"
                placeholder="Full name *"
                value={customerDetails.customerName}
                onChange={handleCustomerChange('customerName')}
                required
              />
              <div>
                <input
                  type="email"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none bg-black/40 ${validationErrors.email
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-white/10 focus:border-pink-400'
                    }`}
                  placeholder="Email *"
                  value={customerDetails.email}
                  onChange={handleCustomerChange('email')}
                  required
                />
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none bg-black/40 ${validationErrors.phone
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-white/10 focus:border-pink-400'
                    }`}
                  placeholder="Phone (optional)"
                  value={customerDetails.phone}
                  onChange={handleCustomerChange('phone')}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.phone}</p>
                )}
              </div>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none"
                placeholder="Preference message for the designer (optional)"
                value={customerDetails.notes}
                onChange={handleCustomerChange('notes')}
              />

              {status.type !== 'idle' && (
                <div className="space-y-2">
                  <p className={`text-sm ${status.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {status.message}
                  </p>
                  {status.type === 'error' && (
                    <div className="flex items-center gap-3">
                      <NeonButton
                        type="button"
                        variant="secondary"
                        disabled={isSending}
                        onClick={() => {
                          // Retry sending the same request
                          void handleSendToDesigner()
                        }}
                      >
                        Retry
                      </NeonButton>
                      <p className="text-xs text-white/60">
                        If this persists, please check your network connection and try again later.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <NeonButton type="button" onClick={handleDownloadPDF} variant="secondary" className="flex-1">
                  Download PDF
                </NeonButton>
                <NeonButton type="submit" disabled={isSending} className="flex-1">
                  {isSending ? 'Sending...' : 'Send to Designer'}
                </NeonButton>
              </div>
            </form>

            <div className="glass-panel border border-white/10 p-4 md:p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">What happens next?</p>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <p>• Download your PDF to save your design locally</p>
                <p>• Send to Designer to submit your request</p>
                <p>• Our designer will review and contact you within 1 business day</p>
                <p>• You&apos;ll receive design proofs and pricing information</p>
                <p>• Once approved, production begins (7-day average build time)</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Template Customize Modal */}
      <AnimatePresence>
        {selectedTemplateForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedTemplateForModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/10 p-4 shadow-2xl md:p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Customize Design</h2>
                <button
                  type="button"
                  onClick={() => setSelectedTemplateForModal(null)}
                  className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Left: Selected Design Preview */}
                <div className="glass-panel flex flex-col gap-4 border border-white/10 p-4 md:p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50">Selected Design</p>
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-black/60">
                    <img
                      src={selectedTemplateForModal.imageUrl}
                      alt={selectedTemplateForModal.label}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-center text-lg font-semibold text-white">{selectedTemplateForModal.label}</p>
                </div>

                {/* Top Right: Design Customization */}
                <div className="glass-panel space-y-5 border border-white/10 p-4 md:p-6">


                  <label className="block text-sm uppercase tracking-[0.3em] text-white/50">
                    Add Name/Text
                    <input
                      maxLength={30}
                      value={templateModalConfig.text}
                      onChange={(e) => setTemplateModalConfig((prev) => ({ ...prev, text: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-pink-400 focus:outline-none"
                      placeholder="Enter name or text"
                    />
                  </label>

                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50">Color</p>
                    <div className="mt-3 grid grid-cols-4 gap-4 sm:grid-cols-6">
                      {neonColorOptions.map((color) => (
                        <div key={color.value} className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTemplateModalConfig((prev) => ({ ...prev, color: color.value }))}
                            className={`h-10 w-10 rounded-full border-2 transition ${templateModalConfig.color === color.value ? 'border-white ring-2 ring-pink-500 ring-offset-2 ring-offset-black' : 'border-white/20'
                              }`}
                            style={{ backgroundColor: color.value }}
                            aria-label={color.label}
                          />
                          <span className="text-[10px] text-center text-white/60 leading-tight w-full truncate px-1">
                            {color.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50">Size</p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {sizeOptions.map((size) => (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => setTemplateModalConfig((prev) => ({ ...prev, size: size.value }))}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${templateModalConfig.size === size.value
                            ? 'border-pink-400/70 bg-pink-500/10 text-white'
                            : 'border-white/10 text-white/70'
                            }`}
                        >
                          <p className="text-base font-semibold">{size.label}</p>
                          <p className="text-xs text-white/60">{size.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


              {/* Bottom: Customer Details or Success View */}
              <div className="mt-6">
                {status.type === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel flex flex-col items-center justify-center border border-white/10 p-8 text-center md:p-12"
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 ring-1 ring-green-500/50">
                      <svg
                        className="h-10 w-10 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white">Request Sent Successfully!</h3>
                    <p className="mb-8 max-w-md text-white/70">
                      Our designers have received your request and will create a custom proof for you. Keep an eye on your email inbox!
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <NeonButton
                        variant="secondary"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = templateModalPdfBase64 || '';
                          link.download = `MasterNeon_${selectedTemplateForModal.value}_${new Date().toISOString().split('T')[0]}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        Download PDF Again
                      </NeonButton>
                      <NeonButton
                        onClick={() => {
                          setStatus({ type: 'idle', message: '' })
                          setCustomerDetails({ customerName: '', email: '', phone: '', notes: '' })
                          setTemplateModalPdfBase64(null)
                        }}
                      >
                        Create Another Design
                      </NeonButton>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2">
                    <form
                      className="glass-panel space-y-4 border border-white/10 p-4 md:p-6"
                      onSubmit={async (e: FormEvent) => {
                        e.preventDefault()
                        if (!customerDetails.customerName || !customerDetails.email) {
                          setStatus({ type: 'error', message: 'Name and email are required.' })
                          return
                        }
                        const emailError = validateEmail(customerDetails.email)
                        if (emailError) {
                          setValidationErrors((prev) => ({ ...prev, email: emailError }))
                          setStatus({ type: 'error', message: emailError })
                          return
                        }
                        if (customerDetails.phone) {
                          const phoneError = validatePhone(customerDetails.phone)
                          if (phoneError) {
                            setValidationErrors((prev) => ({ ...prev, phone: phoneError }))
                            setStatus({ type: 'error', message: phoneError })
                            return
                          }
                        }
                        setValidationErrors({})
                        setIsSending(true)
                        setStatus({ type: 'idle', message: '' })
                        try {
                          const config: NameSignConfig = {
                            category: 'name',
                            text: templateModalConfig.text,
                            font: getDefaultFont(),
                            color: templateModalConfig.color,
                            size: templateModalConfig.size,
                            selectedTemplate: selectedTemplateForModal.value,
                          }
                          const imagePreview = selectedTemplateForModal.imageUrl
                          // Use stored PDF if available, otherwise generate a new one
                          let pdfBase64 = templateModalPdfBase64
                          if (!pdfBase64) {
                            // generate PDF for template config
                            pdfBase64 = await generatePDF(config, customerDetails, null)
                            setTemplateModalPdfBase64(pdfBase64)
                          }
                          const response = await api.post('/neon-request', {
                            ...customerDetails,
                            config,
                            imagePreview,
                            pdfBase64,
                            timestamp: new Date().toISOString(),
                          })
                          const responseData = response?.data || {}
                          setStatus({
                            type: 'success',
                            message: responseData.message || 'Sent! A Master Neon designer will reply with proofs within 1 business day.',
                          })
                          // Do NOT clear PDF immediately so they can download it again
                          // Do NOT close modal immediately
                        } catch (error: any) {
                          const errorMessage = error?.response?.data?.message || error?.message || 'We could not submit the request. Check your connection or try again shortly.'
                          setStatus({
                            type: 'error',
                            message: errorMessage,
                          })
                          console.error('Error sending request:', error)
                        } finally {
                          setIsSending(false)
                        }
                      }}
                    >
                      <p className="text-sm uppercase tracking-[0.3em] text-white/40">Customer Details</p>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none"
                        placeholder="Full name *"
                        value={customerDetails.customerName}
                        onChange={handleCustomerChange('customerName')}
                        required
                      />
                      <div>
                        <input
                          type="email"
                          className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none bg-black/40 ${validationErrors.email
                            ? 'border-red-400 focus:border-red-400'
                            : 'border-white/10 focus:border-pink-400'
                            }`}
                          placeholder="Email *"
                          value={customerDetails.email}
                          onChange={handleCustomerChange('email')}
                          required
                        />
                        {validationErrors.email && <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none bg-black/40 ${validationErrors.phone
                            ? 'border-red-400 focus:border-red-400'
                            : 'border-white/10 focus:border-pink-400'
                            }`}
                          placeholder="Phone (optional)"
                          value={customerDetails.phone}
                          onChange={handleCustomerChange('phone')}
                        />
                        {validationErrors.phone && <p className="mt-1 text-xs text-red-400">{validationErrors.phone}</p>}
                      </div>
                      <textarea
                        className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none"
                        placeholder="Preference message for the designer (optional)"
                        value={customerDetails.notes}
                        onChange={handleCustomerChange('notes')}
                      />
                      {status.type === 'error' && (
                        <p className="text-sm text-red-400">
                          {status.message}
                        </p>
                      )}
                      <div className="flex gap-4">
                        <NeonButton
                          type="button"
                          variant="secondary"
                          className="flex-1"
                          onClick={async () => {
                            if (!customerDetails.customerName || !customerDetails.email) {
                              setStatus({ type: 'error', message: 'Name and email are required.' })
                              return
                            }
                            const emailError = validateEmail(customerDetails.email)
                            if (emailError) {
                              setValidationErrors((prev) => ({ ...prev, email: emailError }))
                              setStatus({ type: 'error', message: emailError })
                              return
                            }
                            if (customerDetails.phone) {
                              const phoneError = validatePhone(customerDetails.phone)
                              if (phoneError) {
                                setValidationErrors((prev) => ({ ...prev, phone: phoneError }))
                                setStatus({ type: 'error', message: phoneError })
                                return
                              }
                            }
                            setValidationErrors({})
                            const config: NameSignConfig = {
                              category: 'name',
                              text: templateModalConfig.text,
                              font: getDefaultFont(),
                              color: templateModalConfig.color,
                              size: templateModalConfig.size,
                              selectedTemplate: selectedTemplateForModal.value,
                            }
                            const pdfBase64 = await generatePDF(config, customerDetails, null)
                            setTemplateModalPdfBase64(pdfBase64)
                            // Trigger download immediately
                            const link = document.createElement('a');
                            link.href = pdfBase64;
                            link.download = `MasterNeon_${selectedTemplateForModal.value}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          Download PDF
                        </NeonButton>
                        <NeonButton type="submit" disabled={isSending} className="flex-1">
                          {isSending ? 'Sending...' : 'Send to Designer'}
                        </NeonButton>
                      </div>
                    </form>

                    <div className="glass-panel border border-white/10 p-6">
                      <p className="text-sm uppercase tracking-[0.3em] text-white/40">What happens next?</p>
                      <div className="mt-4 space-y-3 text-sm text-white/70">
                        <p>• Download your PDF to save your design locally</p>
                        <p>• Send to Designer to submit your request</p>
                        <p>• Our designer will review and contact you within 1 business day</p>
                        <p>• You&apos;ll receive design proofs and pricing information</p>
                        <p>• Once approved, production begins (7-day average build time)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BuilderPage
