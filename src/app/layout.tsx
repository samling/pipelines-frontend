import type { Metadata } from "next";
import { EnvProvider } from '@/providers/env-provider'
import { unstable_noStore as noStore } from 'next/cache'
import "./globals.css";

export const metadata: Metadata = {
  title: "Pipelines Frontend",
  description: "Management interface for Open-WebUI Pipelines",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Opt out of caching for all data requests in this layout
  noStore();
  
  const env = {
    PIPELINES_API_BASE_URL: process.env.PIPELINES_API_BASE_URL || 'http://localhost:8000',
    PIPELINES_API_KEY: process.env.PIPELINES_API_KEY || '',
  }

  return (
    <html lang="en">
      <body>{/*className="dark:bg-gray-900"*/}
        <EnvProvider env={env}>
          {children}
        </EnvProvider>
      </body>
    </html>
  )
}