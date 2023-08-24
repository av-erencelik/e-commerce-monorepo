import { siteConfig } from '../../config/site';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <header className="z-40 bg-background sm:container px-4">
          <nav className="py-4">
            <Link
              href="/"
              className="items-center space-x-2 flex mx-auto justify-center h-full"
            >
              <Image
                src={siteConfig.icon}
                alt="logo"
                width={30}
                height={30}
                className="mt-[-5px]"
              />
              <span className="font-bold inline-block text-lg font-heading text-primary">
                {siteConfig.name}
              </span>
            </Link>
          </nav>
        </header>
      </div>

      <main className="flex-1 flex justify-center items-center">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
