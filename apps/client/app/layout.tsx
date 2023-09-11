import './global.css';
import { Inter as FontSans, Raleway as FontHeading } from 'next/font/google';
import TanstackQueryProvider from '../providers/TanstackQueryProvider';
import AuthStoreInitializer from '../components/auth-store-initializer';
import { headers } from 'next/headers';
import { UserPayload } from '@e-commerce-monorepo/global-types';
import { Toaster, cn } from '@e-commerce-monorepo/ui';
import { TailwindIndicator } from '../components/tailwind-indicator';
import { siteConfig } from '../config/site';
import { env } from '../env.mjs';

export const metadata = {
  title: `${siteConfig.name} - ${siteConfig.description}`,
  description: 'Developed for learning purposes',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = FontHeading({
  subsets: ['latin'],
  variable: '--font-heading',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function getCurrentUser() {
    const cookies = headers().get('cookie');
    if (!cookies) {
      return null;
    }
    try {
      const response = await fetch(`${env.NX_API_URL}/auth/current-user`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookies,
        },
      });
      const { user } = (await response.json()) as { user: UserPayload };
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  const user = await getCurrentUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <AuthStoreInitializer user={user} />
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <TailwindIndicator />
        <Toaster />
      </body>
    </html>
  );
}
