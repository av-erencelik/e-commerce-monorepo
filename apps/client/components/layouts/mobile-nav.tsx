'use client';
import { NavItem } from '@client/types';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetTrigger,
  cn,
} from '@e-commerce-monorepo/ui';
import { Menu } from 'lucide-react';
import { siteConfig } from '@client/config/site';
import Link from 'next/link';
import Image from 'next/image';

type MobileNavProps = {
  mobileNavItems: Array<NavItem>;
  isAdmin: boolean;
};

const MobileNav = ({ mobileNavItems, isAdmin }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Link href="/" className="items-center space-x-2 flex">
            <Image
              src={siteConfig.icon}
              alt="logo"
              width={30}
              height={30}
              className="mt-[-5px]"
            />
            <span className="font-bold inline-block text-lg font-heading text-primary">
              {isAdmin ? 'Admin' : siteConfig.name}
            </span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            {mobileNavItems.map((navItem, index) => {
              const isActive =
                navItem.title === 'Home'
                  ? pathname === navItem.href
                  : pathname.startsWith(navItem.href);
              return (
                <Link
                  href={navItem.href}
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className={cn(
                    'block w-full py-2 rounded-sm text-base font-medium transition-colors hover:text-foreground focus-visible:bg-accent focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary hover:underline underline-offset-1',
                    isActive
                      ? 'text-primary hover:text-primary hover:no-underline'
                      : 'text-foreground/80'
                  )}
                >
                  {navItem.title}
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
