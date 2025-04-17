import Link from 'next/link';

import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => (
  <Background color="bg-gray-100">
    <Section yPadding="py-6">
      <NavbarTwoColumns logo={<Logo xl />}>
        <li>
          <Link href="">
            MDK SYSTEM TOOLKIT
          </Link>
        </li>
      </NavbarTwoColumns>
    </Section>

    <Section yPadding="pt-20 pb-32">
      <HeroOneButton
        title={
          <>
            <span className="text-primary-500">MDK SYSTEM TOOLKIT</span>
          </>
        }
        description="BUILD YOUR SYSTEM TOOLKIT"
        button={
          <Link href="https://creativedesignsguru.com/category/nextjs/">
            <Button xl>MDK SYSTEM TOOLKIT</Button>
          </Link>
        }
      />
    </Section>
  </Background>
);

export { Hero };
