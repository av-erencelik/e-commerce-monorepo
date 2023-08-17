import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  link: string;
}

export const WelcomeEmail = ({ name, link }: WelcomeEmailProps) => {
  const previewText = `Complete your signup to e-commerce-monorepo`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-medium text-center p-0 my-[30px] mx-0">
              Welcome to e-commerce-monorepo!{' '}
              <span role="img" aria-label="emoji">
                🙌
              </span>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello <strong className="text-[#31C48D]">{name}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Warm greetings from E-Commerce Monorepo! Your email verification
              was successful, and we're thrilled to welcome you to our community
              of food enthusiasts who share a passion for exceptional flavors.
              Get ready to embark on a delectable journey filled with the aroma
              of freshly baked sourdough bread and the irresistible allure of
              fine chocolates.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you for choosing E-Commerce Monorepo as your source for
              premium sourdough bread and chocolates. Let's savor every moment
              together!
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={50}
                pY={15}
                className="bg-[#31C48D] rounded text-white text-[14px] font-semibold no-underline text-center"
                href={link}
              >
                Get Started
              </Button>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you did not sign up for e-commerce-monorepo, please ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
