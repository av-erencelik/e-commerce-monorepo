'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { siteConfig } from '../config/site';
import { NavItem, ProductNavItem } from '../types';
import { cn, navigationMenuTriggerStyle } from '@e-commerce-monorepo/ui';
import { usePathname } from 'next/navigation';
import NavigationDropdown from './navigation-dropdown';
type MainNavProps = {
  navItems: Array<NavItem | ProductNavItem>;
};

const MainNav = ({ navItems }: MainNavProps) => {
  const pathname = usePathname();
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Image
          src={siteConfig.icon}
          alt="logo"
          width={30}
          height={30}
          className="mt-[-5px]"
        />
        <span className="hidden font-bold sm:inline-block text-lg font-heading text-primary">
          {siteConfig.name}
        </span>
      </Link>
      {navItems.length > 0 && (
        <nav className="hidden gap-2 md:flex">
          {navItems.map((navItem, index) => {
            if ('isCategory' in navItem) {
              return <NavigationDropdown key={index} item={navItem} />;
            }
            return (
              <Link
                href={navItem.href}
                key={index}
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname.startsWith(navItem.href)
                    ? 'text-primary bg-accent'
                    : 'text-foreground/80'
                )}
              >
                {navItem.title}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default MainNav;
