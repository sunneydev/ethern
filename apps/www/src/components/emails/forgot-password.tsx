import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { LogoIcon } from "~/components/icons/logo-icon";

export function ForgotPasswordEmail() {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Section style={main}>
        <Container style={container}>
          <LogoIcon />
          <Text style={heading}>Reset your password</Text>
          <Text style={paragraph}>
            You recently requested to reset your password. Click the button
            below to reset it.
          </Text>
          <Button style={button} href="https://ethern.dev/reset-password">
            Reset Password
          </Button>
          <Text style={paragraph}>
            If you did not request a password reset, please ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you have any questions, feel free to{" "}
            <Link style={link} href="mailto:contact@ethern.dev">
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
