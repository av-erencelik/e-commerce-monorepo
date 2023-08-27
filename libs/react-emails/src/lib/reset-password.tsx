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

const PasswordReset = ({ name, link }: UserEmailProps) => {
  const previewText = `Complete your signup to sourdough`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-medium text-center p-0 my-[30px] mx-0">
              Reset your password
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello <strong className="text-[#E0AC29]">{name}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              You are receiving this email because we received a password reset
              request for your account.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#E0AC29] rounded text-white text-[14px] font-semibold no-underline text-center"
                href={link}
              >
                Reset Password
              </Button>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you did not request a password reset, no further action is
              required.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export { PasswordReset };
