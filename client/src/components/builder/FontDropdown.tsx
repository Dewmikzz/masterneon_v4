import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { neonFonts, type NeonFont } from '../../data/builderOptions'
import { Search, ChevronDown, X, Sparkles } from 'lucide-react'

interface FontDropdownProps {
  selectedFont: string
  onFontChange: (font: string) => void
  previewText?: string
  onPreviewTextChange?: (text: string) => void
}

const FontDropdown = ({ 
  selectedFont, 
  onFontChange, 
  previewText = 'Sample',
  onPreviewTextChange 
}: FontDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredFont, setHoveredFont] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null)

  // Get selected font info
  const selectedFontInfo = neonFonts.find(f => f.value === selectedFont) || neonFonts[0]

  // Filter fonts based on search
  const filteredFonts = neonFonts.filter(font =>
    font.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group fonts by category
  const groupedFonts = {
    script: filteredFonts.filter(f => f.category === 'script'),
    modern: filteredFonts.filter(f => f.category === 'modern'),
    outline: filteredFonts.filter(f => f.category === 'outline'),
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Compute menu position to render in portal and avoid clipping
  useEffect(() => {
    if (!isOpen) return
    const computePos = () => {
      const btn = buttonRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width })
    }

    computePos()
    window.addEventListener('resize', computePos)
    window.addEventListener('scroll', computePos, true)
    return () => {
      window.removeEventListener('resize', computePos)
      window.removeEventListener('scroll', computePos, true)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleFontSelect = (font: NeonFont) => {
    onFontChange(font.value)
    setIsOpen(false)
    setSearchQuery('')
  }

  const renderFontOption = (font: NeonFont, _index: number) => {
    const isSelected = selectedFont === font.value
    const isHovered = hoveredFont === font.value
    const displayText = previewText && previewText !== 'Sample' && previewText.trim() 
      ? previewText.substring(0, 15) 
      : font.label

    return (
      <button
        key={font.value}
        type="button"
        onClick={() => handleFontSelect(font)}
        onMouseEnter={() => setHoveredFont(font.value)}
        onMouseLeave={() => setHoveredFont(null)}
        className={`
          group relative w-full text-left px-4 py-3 rounded-xl transition-all duration-300
          ${isSelected
            ? 'bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-2 border-pink-400/70 shadow-[0_0_20px_rgba(255,77,240,0.4)] scale-[1.02]'
            : 'hover:bg-white/5 border-2 border-transparent hover:border-pink-400/30 hover:shadow-[0_0_15px_rgba(255,77,240,0.2)]'
          }
          ${isHovered && !isSelected ? 'scale-[1.01]' : ''}
        `}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div
              className={`text-lg font-medium text-white truncate transition-all duration-200 ${
                isSelected ? 'drop-shadow-[0_0_8px_rgba(255,77,240,0.6)]' : ''
              }`}
              style={{ fontFamily: font.value }}
              title={font.label}
            >
              {displayText}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-white/50">{font.label}</span>
              {font.isNew && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/40 to-cyan-500/40 text-pink-200 font-semibold border border-pink-400/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  NEW
                </span>
              )}
            </div>
          </div>
          {isSelected && (
            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(255,77,240,0.8)] animate-pulse"></div>
          )}
        </div>
        {/* Neon glow effect on hover */}
        {isHovered && !isSelected && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-cyan-500/10 pointer-events-none"></div>
        )}
      </button>
    )
  }

  return (
    <div className="relative space-y-4" ref={dropdownRef}>
      {/* Live Neon Preview */}
      <div className="space-y-2">
        <label className="block text-sm uppercase tracking-[0.3em] text-white/50">
          Live Neon Preview
        </label>
        <div className="relative rounded-xl border border-white/10 bg-black/60 p-6 overflow-hidden">
          {/* Animated background glow */}
          <div 
            className="absolute inset-0 opacity-30 blur-3xl transition-all duration-500"
            style={{
              background: `radial-gradient(circle, ${selectedFontInfo.value.includes('pink') ? '#ff4df0' : '#00c2ff'}40, transparent 70%)`
            }}
          ></div>
          
          {/* Preview text with neon effect */}
          <div className="relative">
            {onPreviewTextChange ? (
              <input
                type="text"
                value={previewText}
                onChange={(e) => onPreviewTextChange(e.target.value)}
                className="w-full bg-transparent text-center text-4xl font-bold text-white outline-none placeholder:text-white/30"
                style={{ 
                  fontFamily: selectedFont,
                  textShadow: '0 0 20px rgba(255,77,240,0.8), 0 0 40px rgba(0,194,255,0.6), 0 0 60px rgba(255,77,240,0.4)',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                }}
                placeholder="Type to preview..."
                maxLength={20}
              />
            ) : (
              <div
                className="text-center text-4xl font-bold text-white"
                style={{ 
                  fontFamily: selectedFont,
                  textShadow: '0 0 20px rgba(255,77,240,0.8), 0 0 40px rgba(0,194,255,0.6), 0 0 60px rgba(255,77,240,0.4)',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                }}
              >
                {previewText || 'Sample'}
              </div>
            )}
          </div>
          
          {/* Neon tube effect lines */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent blur-sm"></div>
        </div>
      </div>

      {/* Font Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm uppercase tracking-[0.3em] text-white/50">
          Font Style
        </label>
        
        {/* Selected Font Display Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          ref={buttonRef}
          className={`
            w-full rounded-xl border-2 px-4 py-3.5 text-base text-white 
            focus:outline-none transition-all duration-300 flex items-center justify-between
            ${isOpen
              ? 'border-pink-400/70 bg-pink-500/10 shadow-[0_0_20px_rgba(255,77,240,0.4)]'
              : 'border-white/10 bg-black/40 hover:border-pink-400/50 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(255,77,240,0.2)]'
            }
          `}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`text-base text-white truncate flex-1 transition-all duration-200 ${
                isOpen ? 'drop-shadow-[0_0_8px_rgba(255,77,240,0.6)]' : ''
              }`}
              style={{ fontFamily: selectedFont }}
            >
              {previewText && previewText !== 'Sample' && previewText.trim() 
                ? previewText.substring(0, 20) 
                : selectedFontInfo.label}
            </div>
            {selectedFontInfo.isNew && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/40 to-cyan-500/40 text-pink-200 font-semibold border border-pink-400/30 whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5" />
                NEW
              </span>
            )}
          </div>
          <ChevronDown
            className={`ml-2 w-5 h-5 text-white/50 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-pink-400' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu - rendered in portal to avoid being clipped by parent overflow */}
        {isOpen && menuPos && createPortal(
          <div
            ref={dropdownRef}
            style={{ position: 'absolute', top: `${menuPos.top}px`, left: `${menuPos.left}px`, width: `${menuPos.width}px`, zIndex: 9999 }}
          >
            <div className="mt-2 rounded-xl border-2 border-pink-400/30 bg-black/95 backdrop-blur-xl shadow-2xl max-h-[500px] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search Bar */}
            <div className="p-3 border-b border-white/10 bg-gradient-to-r from-pink-500/10 to-cyan-500/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search fonts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-white/10 bg-black/60 text-white placeholder:text-white/30 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-sm transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Font List */}
            <div className="overflow-y-auto neon-scrollbar flex-1 p-2">
              {filteredFonts.length === 0 ? (
                <div className="p-6 text-center text-white/50 text-sm">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No fonts found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Script/Handwritten Styles */}
                  {groupedFonts.script.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/40 font-semibold bg-white/5 rounded-lg mb-2">
                        ✨ Script / Handwritten
                      </div>
                      <div className="space-y-1.5">
                        {groupedFonts.script.map((font, idx) => renderFontOption(font, idx))}
                      </div>
                    </div>
                  )}

                  {/* Modern/Sans-serif Styles */}
                  {groupedFonts.modern.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/40 font-semibold bg-white/5 rounded-lg mb-2">
                        ⚡ Modern / Sans-serif
                      </div>
                      <div className="space-y-1.5">
                        {groupedFonts.modern.map((font, idx) => renderFontOption(font, idx))}
                      </div>
                    </div>
                  )}

                  {/* Outline/Neon Styles */}
                  {groupedFonts.outline.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/40 font-semibold bg-white/5 rounded-lg mb-2">
                        💡 Outline / Neon
                      </div>
                      <div className="space-y-1.5">
                        {groupedFonts.outline.map((font, idx) => renderFontOption(font, idx))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>,
          document.body
        )}
        </div>
    </div>
  )
}

export default FontDropdown
