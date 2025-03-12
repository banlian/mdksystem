import Image from 'next/image';

import { Section } from '@/layout/Section';

const Sponsors = () => (
  <Section
    title="Sponsors"
    description="Our sponsors' exceptional support has made this project possible."
  >
    <table className="mx-auto border-collapse">
      <tbody>
        <tr className="h-56">
          <td className="border-2 border-gray-300 p-3">
            <a
              href="https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo"
              target="_blank"
            >
              <Image
                src="/assets/images/sentry-dark.png"
                alt="MDK SYSTEM TOOLKIT"
                width={260}
                height={224}
              />
            </a>
          </td>
          
        </tr>
      </tbody>
    </table>
  </Section>
);

export { Sponsors };
