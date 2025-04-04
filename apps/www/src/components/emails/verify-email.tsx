import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { LogoIcon } from "~/icons/logo-icon";

export interface VerifyEmailProps {
  verificationLink: string;
}

export function VerifyEmail({ verificationLink }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Please verify your email address</Preview>
      <Section style={main}>
        <Container style={container}>
          <LogoIcon />
          <Text style={heading}>Welcome to Ethern!</Text>
          <Text style={paragraph}>
            Thank you for signing up. To complete your registration, please
            verify your email address by clicking the button below:
          </Text>
          <Button style={button} href={`https://ethern.dev${verificationLink}`}>
            Verify Email Address
          </Button>
          <Text style={paragraph}>
            If you did not sign up for an account, please ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you have any questions, feel free to{" "}
            <Link style={link} href="mailto:support@ethern.dev">
              contact our support team
            </Link>
            .
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#000000",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const logo = {
  margin: "0 auto",
};

const heading = {
  fontSize: "32px",
  fontWeight: "bold",
  lineHeight: "1.3",
  textAlign: "center" as const,
  color: "#ffffff",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#ffffff",
  marginBottom: "30px",
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const hr = {
  borderColor: "#333333",
  margin: "20px 0",
};

const footer = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "1.4",
  textAlign: "center" as const,
};

const link = {
  color: "#6366f1",
  textDecoration: "underline",
};
