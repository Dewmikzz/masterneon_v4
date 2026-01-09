import { sizePrices } from '../data/builderOptions'
import type { NeonSize } from '../types/neon'

export const calculateNeonPrice = (_text: string, size: NeonSize): number => {
  return sizePrices[size]
}

export const formatCurrency = (value: number): string => {
  return `${value.toLocaleString()}/=`
}

export const describePrice = (_text: string, size: NeonSize): string => {
  return `${sizePrices[size].toLocaleString()}/=`
}

