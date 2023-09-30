import { footerNav, siteConfig } from '@client/config/site';
import { Shell, buttonVariants, cn } from '@e-commerce-monorepo/ui';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SiteFooter = () => {
  return (
    <footer className="w-full border-t bg-background">
      <Shell as="div">
        <section
          id="footer-content"
          aria-labelledby="footer-content-heading"
          className="flex flex-col gap-10 lg:flex-row lg:gap-20"
        >
          <section
            id="footer-branding"
            aria-labelledby="footer-branding-heading"
          >
            <Link href="/" className="items-center space-x-2 flex">
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
          </section>
          <section
            id="footer-links"
            aria-labelledby="footer-links-heading"
            className="grid flex-1 grid-cols-1 gap-10 xxs:grid-cols-2 sm:grid-cols-4"
          >
            {footerNav.map((item) => (
              <div key={item.title} className="space-y-3">
                <h4 className="text-base font-medium">{item.title}</h4>
                <ul className="space-y-3">
                  {item.items.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        target={link?.external ? '_blank' : undefined}
                        rel={link?.external ? 'noreferrer' : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.title}
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </section>
        <section
          id="footer-bottom"
          aria-labelledby="footer-bottom-heading"
          className="flex items-center space-x-4"
        >
          <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
            Built by{' '}
            <Link
              href="https://twitter.com/m_eren_celik"
              target="_blank"
              rel="noreferrer"
              className="font-semibold transition-colors hover:text-primary"
            >
              Eren Çelik
              <span className="sr-only">Twitter</span>
            </Link>
            .
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                }),
                'hover:bg-white'
              )}
            >
              <GitHubLogoIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </section>
      </Shell>
    </footer>
  );
};

export default SiteFooter;
