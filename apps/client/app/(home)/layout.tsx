import { mainNavigation } from '../../config/main-navigation';
import MainNav from '../../components/main-nav';
import React from 'react';
import IconNav from '../../components/icon-nav';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="z-40 bg-background sm:container px-4">
          <div className="flex items-center justify-between py-4">
            <MainNav navItems={mainNavigation} isAdmin={false} />
            <IconNav />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default HomeLayout;
