import type { Metadata, Viewport } from "next"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { PreferencesProvider } from "@/contexts/preferences-context"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "RoçaCtrl - Gestão de Sítios e Agricultura Familiar",
  description:
    "Sistema inteligente para gestão de hortas, pomares, pequenos rebanhos e finanças do produtor rural.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RoçaCtrl",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#166534",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AccessibilityProvider>
            <PreferencesProvider>
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background flex flex-col min-h-screen">
                    <MobileHeader />
                    <div className="p-4 md:p-8 flex-1 pb-24 md:pb-8">{children}</div>
                  </main>
                </div>
              </SidebarProvider>
              <MobileNav />
              <PWAInstallPrompt />
              <Toaster />
            </PreferencesProvider>
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
