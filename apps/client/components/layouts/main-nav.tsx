'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { siteConfig } from '../../config/site';
import { NavItem } from '../../types';
import { cn, navigationMenuTriggerStyle } from '@e-commerce-monorepo/ui';
import { usePathname } from 'next/navigation';

type MainNavProps = {
  navItems: Array<NavItem>;
  isAdmin: boolean;
};

const MainNav = ({ navItems, isAdmin }: MainNavProps) => {
  const pathname = usePathname();
  return (
    <div className="gap-6 md:gap-10 hidden md:flex">
      <Link href="/" className="items-center space-x-2 flex">
        <Image
          src={siteConfig.icon}
          alt="logo"
          width={30}
          height={30}
          className="mt-[-5px]"
        />
        <span className="hidden font-bold sm:inline-block text-lg font-heading text-primary">
          {isAdmin ? 'Admin' : siteConfig.name}
        </span>
      </Link>
      {navItems.length > 0 && (
        <nav className="hidden gap-2 md:flex">
          {navItems.map((navItem, index) => {
            return (
              <Link
                href={navItem.href}
                key={index}
                className={cn(
                  navigationMenuTriggerStyle(),
                  (
                    navItem.title === 'Home'
                      ? pathname === navItem.href
                      : pathname.startsWith(navItem.href)
                  )
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
