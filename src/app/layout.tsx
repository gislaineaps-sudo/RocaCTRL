import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/app-sidebar';
import {Toaster} from '@/components/ui/toaster';
import {AccessibilityProvider} from '@/contexts/accessibility-context';
import {PreferencesProvider} from '@/contexts/preferences-context';

export const metadata: Metadata = {
  title: 'RoçaCtrl - Gestão de Sítios e Agricultura Familiar',
  description: 'Sistema inteligente para gestão de hortas, pomares e pequenos rebanhos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AccessibilityProvider>
          <PreferencesProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-8">
                  {children}
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
          </PreferencesProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
