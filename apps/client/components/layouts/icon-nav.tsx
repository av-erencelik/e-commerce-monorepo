'use client';
import React from 'react';
import { Avatar, AvatarFallback } from '@e-commerce-monorepo/ui';
import { Button } from '@e-commerce-monorepo/ui/server';
import Link from 'next/link';
import { useAuthStore } from '../../stores/auth-state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@e-commerce-monorepo/ui';
import { ExitIcon, GearIcon, PersonIcon } from '@radix-ui/react-icons';
import CartSheet from './cart-sheet';

const IconNav = () => {
  const { user } = useAuthStore();
  return (
    <nav className="flex box-border gap-3">
      <CartSheet />
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.fullName[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground font-normal">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account" className="cursor-pointer">
                <PersonIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Account
              </Link>
            </DropdownMenuItem>
            {user.isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <GearIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/logout" className="cursor-pointer">
                <ExitIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild size="default" variant="default">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </nav>
  );
};

export default IconNav;
