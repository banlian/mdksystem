import { CTABanner } from '../cta/CTABanner';
import { Section } from '../layout/Section';
import { scrollToSection } from '../utils/scrollUtils';

const Banner = () => (
  <div className="flex min-h-screen items-center">
    <Section>
      <CTABanner
        title="Ready to Transform Your Industrial Automation?"
        subtitle="Join thousands of developers building the future of manufacturing with MDK System"
        button={
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => scrollToSection('footer')}
              className="btn-primary"
            >
              Download MDK System
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="btn-secondary"
            >
              Contact Sales
            </button>
          </div>
        }
      />
    </Section>
  </div>
);

export { Banner };
