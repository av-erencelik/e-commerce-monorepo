import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

interface UserEmailProps {
  name: string;
}

const PasswordChanged = ({ name }: UserEmailProps) => {
  const previewText = `Your password has been changed`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-medium text-center p-0 my-[30px] mx-0">
              Your password has been changed
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello <strong className="text-[#E0AC29]">{name}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              You are receiving this email because your password has been
              changed.
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you did not change your password, please contact us
              immediately.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export { PasswordChanged };
