import { Separator, Shell } from '@e-commerce-monorepo/ui';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@client/components/page-header';
import React from 'react';
import Link from 'next/link';

const ContactPage = () => {
  return (
    <Shell className="max-w-3xl">
      <PageHeader
        id="about-page-header"
        aria-labelledby="about-page-header-heading"
      >
        <PageHeaderHeading size="sm">Contact</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Contact the creator of the project for any questions or suggestions
        </PageHeaderDescription>
      </PageHeader>
      <Separator />
      <section>
        <div>
          <ul className="my-2 ml-6 list-disc">
            <li className="mt-2">
              <span className="font-semibold">Email: </span>
              <Link
                href="mailto:av.erencelik@gmail.com"
                className="font-medium underline underline-offset-4"
              >
                av.erencelik@gmail.com
              </Link>
            </li>
            <li className="mt-2">
              <span className="font-semibold">Twitter: </span>
              <Link
                href="https://twitter.com/m_eren_celik"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                m_eren_celik
              </Link>
            </li>
            <li className="mt-2">
              <span className="font-semibold">Discord: </span>
              <Link
                href="https://discord.com/users/497375000492507136"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                mehmeterencelik
              </Link>
            </li>
            <li className="mt-2">
              <span className="font-semibold">LinkedIn: </span>
              <Link
                href="https://www.linkedin.com/in/av-erencelik/"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Mehmet Eren Çelik
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </Shell>
  );
};

export default ContactPage;
