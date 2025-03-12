import { VerticalFeatureRow } from '../feature/VerticalFeatureRow';
import { Section } from '../layout/Section';

const VerticalFeatures = () => (
  <Section
    title="MDK SYSTEM TOOLKIT"
    description="BUILD YOUR SYSTEM CONTROL SOFTWARE IN ONE DAY"
  >
    <VerticalFeatureRow
      title="CONFIGRABLE SYSTEM"
      description="BUILD YOUR SYSTEM CONTROL SOFTWARE BY CONFIGS"
      image="/assets/images/feature.svg"
      imageAlt=""
    />
  </Section>
);

export { VerticalFeatures };
