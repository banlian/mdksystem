import Link from 'next/link';

import { Button } from '../button/Button';
import { CTABanner } from '../cta/CTABanner';
import { Section } from '../layout/Section';

const Banner = () => (
  <Section>
    <CTABanner
      title="MDK SYSTEM TOOLKIT"
      subtitle="BUILD YOUR SYSTEM CONTROL SOFTWARE IN ONE DAY"
      button={
        <Link href="">
          <Button>DOWNLOAD NOW</Button>
        </Link>
      }
    />
  </Section>
);

export { Banner };
