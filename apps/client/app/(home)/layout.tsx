import { mainNavigation } from '../../config/main-navigation';
import MainNav from '../../components/layouts/main-nav';
import React from 'react';
import IconNav from '../../components/layouts/icon-nav';
import MobileNav from '@client/components/layouts/mobile-nav';
import SiteFooter from '@client/components/layouts/site-footer';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="z-40 bg-background sm:container px-4">
          <div className="flex items-center justify-between py-4">
            <MobileNav mobileNavItems={mainNavigation} isAdmin={false} />
            <MainNav navItems={mainNavigation} isAdmin={false} />
            <IconNav />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default HomeLayout;
