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
import CartStoreInitiliazer from '@client/components/cart-store-initiliazer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.description}`,
  description: 'Developed for learning purposes',
  other: {
    'google-site-verification': 'dXQ55giVy7l2I-W7sVfBXPp4X1go0DwFixGvl4hrgC8',
  },
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <TanstackQueryProvider>
          <AuthStoreInitializer user={user} />
          <CartStoreInitiliazer />
          {children}
        </TanstackQueryProvider>
        <TailwindIndicator />
        <Toaster />
      </body>
    </html>
  );
}
