import type {Metadata, Viewport} from 'next';
import './globals.css';
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/app-sidebar';
import {MobileNav} from '@/components/layout/mobile-nav';
import {PWAInstallPrompt} from '@/components/pwa-install-prompt';
import {Toaster} from '@/components/ui/toaster';
import {AccessibilityProvider} from '@/contexts/accessibility-context';
import {PreferencesProvider} from '@/contexts/preferences-context';

export const metadata: Metadata = {
  title: 'RoçaCtrl - Gestão de Sítios e Agricultura Familiar',
  description: 'Sistema inteligente para gestão de hortas, pomares, pequenos rebanhos e finanças do produtor rural.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RoçaCtrl',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: '#51A329',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
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
        <AccessibilityProvider>
          <PreferencesProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background flex flex-col min-h-screen">
                  <header className="flex h-14 md:hidden items-center justify-between border-b px-4 shrink-0 bg-white sticky top-0 z-40">
                    <div className="flex items-center">
                      <SidebarTrigger className="-ml-1 text-primary focus:ring-primary" />
                      <span className="font-headline font-bold text-lg text-primary ml-3">RoçaCtrl</span>
                    </div>
                  </header>
                  <div className="p-4 md:p-8 flex-1 pb-24 md:pb-8">
                    {children}
                  </div>
                </main>
              </div>
            </SidebarProvider>
            <MobileNav />
            <PWAInstallPrompt />
            <Toaster />
          </PreferencesProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
