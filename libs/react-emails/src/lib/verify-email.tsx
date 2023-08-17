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

interface UserEmailProps {
  name: string;
  link: string;
}

const VerifyEmail = ({ name, link }: UserEmailProps) => {
  const previewText = `Complete your signup to e-commerce-monorepo`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-medium text-center p-0 my-[30px] mx-0">
              Verify your email address
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello <strong className="text-[#31C48D]">{name}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thanks for signing up for e-commerce-monorepo! We're excited to
              have you on board. Before we get started, we just need to confirm
              that this is you.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#31C48D] rounded text-white text-[14px] font-semibold no-underline text-center"
                href={link}
              >
                Verify Your Email
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

export { VerifyEmail };
