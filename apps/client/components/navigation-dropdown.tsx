'use client';

import * as React from 'react';

import { cn } from '@e-commerce-monorepo/ui';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@e-commerce-monorepo/ui';
import { ProductNavItem } from '../types';
import Image from 'next/image';

type NavigationDropdownProps = {
  item: ProductNavItem;
};

export default function NavigationDropdown({ item }: NavigationDropdownProps) {
  const { categories, title } = item;
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-1">
              {categories.map((category) => (
                <ListItem
                  key={category.title}
                  title={category.title}
                  href={category.href}
                  src={category.image}
                  alt={category.alt}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { src: string; alt: string }
>(({ className, title, children, src, alt, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'flex gap-4 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground/80 focus:bg-accent focus:text-accent-foreground/80 items-center',
            className
          )}
          {...props}
        >
          <Image
            src={src}
            alt={alt}
            height={65}
            width={100}
            className="rounded-md"
          />

          <div className="h-full space-y-1">
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
