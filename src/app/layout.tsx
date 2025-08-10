import LightRays from "@/components/ui/LightRays";
import "@/styles/globals.css"
import { Geist } from 'next/font/google'
import Link from "next/link";
import { Suspense } from "react";
import { Toaster } from "sonner";
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"

export const dynamic = 'force-dynamic';


const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Kira Blog',
  description: 'Kira Blog Website',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.className}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className="h-[100svh] w-full">
        <Suspense fallback={<div className="h-full w-full overflow-hidden">
          <div className="-z-50 fixed opacity-60 h-full w-full">
            <LightRays
              raysOrigin="top-center"
              raysColor="#4300FF"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
              className="custom-rays"
            />
          </div>
          <Link href={"/"} className="w-full flex items-center justify-center mt-10 text-5xl font-comic">
            Kira Blog
          </Link>
          <div className="lg:max-w-[80%] w-full p-3 bg-foreground/5 animate-pulse border-y border-foreground/10 mx-auto my-10 overflow-auto tag-scroller">
            <div className="flex flex-row mx-auto w-max gap-6 h-10 ">

            </div>
          </div>
          <div className="w-full h-[60svh] flex items-center justify-center">
            <span className="loader"></span>
          </div>
        </div>}>
          {children}
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}