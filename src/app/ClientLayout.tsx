'use client'

import { AptosWalletProvider } from '@razorlabs/wallet-kit'
import '@razorlabs/wallet-kit/style.css'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AptosWalletProvider>
      {children}
    </AptosWalletProvider>
  )
}