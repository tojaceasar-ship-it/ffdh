'use client'

import { ReactNode } from 'react'
import EmotiLayer from './EmotiLayer'

/**
 * Wrapper dla EmotiLayer - użyty w layout.tsx
 * Client component który owija children w EmotiLayer
 */
export default function EmotiWrapper({ children }: { children: ReactNode }) {
  return <EmotiLayer>{children}</EmotiLayer>
}

