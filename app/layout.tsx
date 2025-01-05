import { Inter } from 'next/font/google'
import { Toaster } from "sonner"
import { PlayerProvider } from "../context/player-context"
import "./globals.css"
import { Metadata } from 'next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Musico - Your Music Hub',
  description: 'Discover and listen to a wide variety of music tracks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PlayerProvider>
          {children}
          <Toaster />
        </PlayerProvider>
      </body>
    </html>
  )
}

