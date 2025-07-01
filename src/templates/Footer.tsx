import Link from 'next/link';

import { CenteredFooter } from '../footer/CenteredFooter';
import { Section } from '../layout/Section';
import { scrollToSection } from '../utils/scrollUtils';
import { Logo } from './Logo';

const Footer = () => (
  <div className="relative flex min-h-screen items-center">
    {/* Dark overlay for footer section */}
    <div className="absolute inset-0 bg-slate-900/95"></div>

    <div className="relative z-10 w-full">
      <Section>
        <CenteredFooter
          logo={<Logo />}
          iconList={
            <>
              <Link
                href="https://github.com/your-org/mdksystem"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                >
                  <path
                    fill="currentColor"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
              </Link>
              <Link
                href="https://docs.mdksystem.com"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <svg
                  className="size-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="mailto:support@mdksystem.com"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <svg
                  className="size-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </Link>
            </>
          }
        >
          <li>
            <button
              onClick={() => scrollToSection('features')}
              className="cursor-pointer text-gray-400 transition-colors hover:text-white"
            >
              Features
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('technology')}
              className="cursor-pointer text-gray-400 transition-colors hover:text-white"
            >
              Technology
            </button>
          </li>
          <li>
            <Link
              href="https://github.com/your-org/mdksystem/issues"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Support
            </Link>
          </li>
          <li>
            <Link
              href="mailto:support@mdksystem.com"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </li>
        </CenteredFooter>
      </Section>
    </div>
  </div>
);

export { Footer };
