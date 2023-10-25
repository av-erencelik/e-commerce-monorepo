import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@client/components/page-header';
import {
  backendTechnos,
  credits,
  devopsTechnos,
  frontendTechnos,
  socials,
} from '@client/config/about-config';
import { siteConfig } from '@client/config/site';
import { Separator, Shell } from '@e-commerce-monorepo/ui';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: `${siteConfig.name} - About`,
  description: 'About the purpose and creator of the project',
};

const AboutPage = () => {
  return (
    <Shell className="max-w-3xl">
      <PageHeader
        id="about-page-header"
        aria-labelledby="about-page-header-heading"
      >
        <PageHeaderHeading size="sm">About</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          About the purpose and creator of the project
        </PageHeaderDescription>
      </PageHeader>
      <Separator />
      <article className="space-y-6">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          This is a open source e-commerce project that was created with the
          purpose of learning and practicing the technologies used in it.
        </p>
        <div>
          <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Technologies used
          </h2>
          <Separator />
          <h4 className="mt-6 scroll-m-20 pb-1 text-lg font-semibold tracking-tight first:mt-0">
            Frontend:
          </h4>
          <ul className="my-2 ml-6 list-disc">
            {frontendTechnos.map((techno) => (
              <AboutPageLink
                key={techno.title}
                title={techno.title}
                href={techno.href}
              />
            ))}
          </ul>
          <h4 className="mt-6 scroll-m-20 pb-1 text-lg font-semibold tracking-tight first:mt-0">
            Backend:
          </h4>
          <ul className="my-2 ml-6 list-disc">
            {backendTechnos.map((techno) => (
              <AboutPageLink
                key={techno.title}
                title={techno.title}
                href={techno.href}
              />
            ))}
          </ul>
          <h4 className="mt-6 scroll-m-20 pb-1 text-lg font-semibold tracking-tight first:mt-0">
            Devops:
          </h4>
          <ul className="my-2 ml-6 list-disc">
            {devopsTechnos.map((techno) => (
              <AboutPageLink
                key={techno.title}
                title={techno.title}
                href={techno.href}
              />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Credits
          </h2>
          <ul className="my-2 ml-6 list-disc">
            {credits.map((credit) => (
              <AboutPageCredit
                key={credit.title}
                title={credit.title}
                href={credit.href}
                description={credit.description}
              />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            About the creator
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Hi, I&apos;m{' '}
            <Link
              href="https://github.com/av-erencelik"
              className="font-medium underline underline-offset-4"
            >
              av-erencelik
            </Link>
            . I am a self-taught software developer who is passionate about
            learning new technologies and building things with them.
          </p>
          <ul className="my-2 ml-6 list-disc">
            {socials.map((social) => (
              <AboutPageLink
                key={social.title}
                title={social.title}
                href={social.href}
              />
            ))}
          </ul>
        </div>
      </article>
    </Shell>
  );
};

type AboutPageLinkProps = {
  title: string;
  href: string;
};

const AboutPageLink = ({ title, href }: AboutPageLinkProps) => {
  return (
    <li className="mt-2">
      <Link
        href={href}
        className="font-medium underline underline-offset-4"
        target="_blank"
        rel="noreferrer"
      >
        {title}
      </Link>
    </li>
  );
};

type AboutPageCreditProps = {
  title: string;
  href: string;
  description: string;
};

const AboutPageCredit = ({
  title,
  href,
  description,
}: AboutPageCreditProps) => {
  return (
    <li className="mt-2">
      <Link href={href} target="_blank" rel="noreferrer">
        <span className="font-medium underline underline-offset-4">
          {title}
        </span>{' '}
        - <span className="italic font-normal no-underline">{description}</span>
      </Link>
    </li>
  );
};

export default AboutPage;
