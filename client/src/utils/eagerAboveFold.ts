// Runtime helper: make above-the-fold images and iframes load eagerly
// This mitigates browser interventions that replace lazy images with placeholders
export default function initEagerAboveFold() {
  if (typeof window === 'undefined') return
  try {
    // Run on next animation frame to allow initial paint
    requestAnimationFrame(() => {
      const threshold = (window.innerHeight || 800) * 1.25
      const els = Array.from(document.querySelectorAll('img, iframe')) as HTMLElement[]
      els.forEach((el) => {
        try {
          const rect = el.getBoundingClientRect()
          if (rect.top <= threshold) {
            // Only change if currently lazy or missing attribute
            if (el.getAttribute('loading') !== 'eager') el.setAttribute('loading', 'eager')
            // Suggest browser prioritize
            try { el.setAttribute('fetchPriority', 'high') } catch (e) {}
            try { el.setAttribute('decoding', 'sync') } catch (e) {}
          }
        } catch (e) {
          // ignore per-element errors
        }
      })
    })
  } catch (err) {
    // fail silently
    // console.warn('eagerAboveFold init failed', err)
  }
}
