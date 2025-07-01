import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { scrollToSection } from '../utils/scrollUtils';
import { Logo } from './Logo';

const Hero = () => (
  <div className="relative flex min-h-screen flex-col">
    {/* Dark overlay for hero section */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-slate-900/90"></div>

    <div className="relative z-10 flex flex-1 flex-col">
      <Section yPadding="py-6">
        <NavbarTwoColumns logo={<Logo xl />}>
          <li>
            <button
              onClick={() => scrollToSection('features')}
              className="cursor-pointer text-gray-300 transition-colors hover:text-white"
            >
              Features
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('technology')}
              className="cursor-pointer text-gray-300 transition-colors hover:text-white"
            >
              Technology
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('cta')}
              className="cursor-pointer text-gray-300 transition-colors hover:text-white"
            >
              Get Started
            </button>
          </li>
        </NavbarTwoColumns>
      </Section>

      <div className="flex flex-1 items-center justify-center">
        <Section yPadding="pt-20 pb-32">
          <HeroOneButton
            title={
              <>
                <span className="text-blue-400">Machine Development Kit</span>
                <br />
                <span className="text-5xl font-bold text-white md:text-6xl">
                  Industrial Automation
                </span>
                <br />
                <span className="text-2xl text-gray-300 md:text-3xl">
                  Made Simple
                </span>
              </>
            }
            description="Build, configure, and deploy industrial automation systems with unprecedented speed and flexibility. MDK provides developers with powerful tools for rapid machine software development."
            button={
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => scrollToSection('features')}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  Get Started
                </button>
                <button
                  onClick={() => scrollToSection('technology')}
                  className="btn-secondary px-8 py-4 text-lg"
                >
                  Learn More
                </button>
              </div>
            }
          />
        </Section>
      </div>
    </div>
  </div>
);

export { Hero };
