import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthWrapper } from '@/components/auth-wrapper'
import { EmployeeProvider } from '@/components/employee-context'
import { Toaster } from '@/components/ui/toaster'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ShiftFlow - Workforce Scheduling Platform',
  description: 'Streamline your workforce scheduling with intelligent shift management, real-time updates, and comprehensive analytics.',
  keywords: 'shift scheduling, workforce management, employee scheduling, time tracking',
  authors: [{ name: 'ShiftFlow Team' }],
  generator: 'ShiftFlow Platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthWrapper>
          <EmployeeProvider>
            {children}
          </EmployeeProvider>
        </AuthWrapper>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
