export type NeonSize = 'small' | 'medium' | 'large'
export type BuilderCategory = 'name' | 'logo' | 'default'

export interface NameSignConfig {
  category: 'name'
  text: string
  font: string
  color: string
  size: NeonSize
  selectedTemplate?: string
}

export interface LogoSignConfig {
  category: 'logo'
  imageData?: string // base64 image
  text?: string // name/text to add to logo
  color: string
<<<<<<< HEAD
  frameShape: 'circle' | 'square' // frame shape for logo
=======
  brightness: number // 0-100
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
  size: NeonSize
}

export interface DefaultDesignConfig {
  category: 'default'
  template: string // template name
  customText: string // user-entered text overlay
  color: string
  size: NeonSize
}

export type BuilderConfig = NameSignConfig | LogoSignConfig | DefaultDesignConfig

export interface CustomerDetails {
  customerName: string
  email: string
  phone: string
  notes?: string
}

export interface DesignRequest extends CustomerDetails {
  config: BuilderConfig
  imagePreview: string // base64
  timestamp: string
}
