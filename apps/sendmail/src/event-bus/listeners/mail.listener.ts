import {
  RMQListener,
  RMQMessage,
  Subjects,
  UserCreatedPayload,
  UserResendPayload,
  UserVerifiedPayload,
  UserResetPasswordPayload,
  UserPasswordChangePayload,
} from '@e-commerce-monorepo/event-bus';
import { ConsumeMessage } from 'amqplib';
import queueName from '../queue-name';
import { logger } from '@e-commerce-monorepo/configs';
import resend from '../../mail/resend';
import config from '../../config/config';
import { render } from '@react-email/components';
import {
  PasswordChanged,
  PasswordReset,
  VerifyEmail,
  WelcomeEmail,
} from '@e-commerce-monorepo/react-emails';

export class MailListener extends RMQListener {
  public queue = queueName;
  public events = [
    Subjects.userCreated,
    Subjects.userVerified,
    Subjects.userResend,
    Subjects.userResetPassword,
    Subjects.userPasswordChange,
  ];

  public async consume() {
    const channel = await this.getChannel();

    channel.consume(async (consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);
      const event = messageReceived.event();
      logger.info(`Received event ${event}`);
      if (event === Subjects.userCreated) {
        const payload = messageReceived.payload() as UserCreatedPayload;
        logger.info(`Sending verification email to ${payload.email}`);
        await resend.emails.send({
          to: payload.email,
          from: config.email,
          subject: 'Please verify your email',
          tags: [
            {
              name: 'category',
              value: 'confirm_email',
            },
          ],
          html: render(
            VerifyEmail({
              name: payload.fullName,
              link: `${config.client.url}verify-email?token=${payload.verificationToken}`,
            })
          ),
        });
      } else if (event === Subjects.userVerified) {
        const payload = messageReceived.payload() as UserVerifiedPayload;
        logger.info(`Sending welcome email to ${payload.email}`);
        await resend.emails.send({
          to: payload.email,
          from: config.email,
          subject: 'Welcome to our e-commerce-microservices app',
          tags: [
            {
              name: 'category',
              value: 'welcome_email',
            },
          ],
          html: render(
            WelcomeEmail({
              name: payload.fullName,
              link: `${config.client.url}login`,
            })
          ),
        });
      } else if (event === Subjects.userResend) {
        const payload = messageReceived.payload() as UserResendPayload;
        logger.info(`Sending verification email to ${payload.email}`);
        await resend.emails.send({
          to: payload.email,
          from: config.email,
          subject: 'Please verify your email',
          tags: [
            {
              name: 'category',
              value: 'confirm_email',
            },
          ],
          html: render(
            VerifyEmail({
              name: payload.fullName,
              link: `${config.client.url}verify-email?token=${payload.verificationToken}`,
            })
          ),
        });
      } else if (event === Subjects.userResetPassword) {
        const payload = messageReceived.payload() as UserResetPasswordPayload;
        logger.info(`Sending reset password email to ${payload.email}`);
        await resend.emails.send({
          to: payload.email,
          from: config.email,
          subject: 'Reset password',
          tags: [
            {
              name: 'category',
              value: 'reset_password',
            },
          ],
          html: render(
            PasswordReset({
              name: payload.fullName,
              link: payload.url,
            })
          ),
        });
      } else if (event === Subjects.userPasswordChange) {
        const payload = messageReceived.payload() as UserPasswordChangePayload;
        logger.info(`Sending password changed email to ${payload.email}`);
        await resend.emails.send({
          to: payload.email,
          from: config.email,
          subject: 'Password changed',
          tags: [
            {
              name: 'category',
              value: 'password_change',
            },
          ],
          html: render(
            PasswordChanged({
              name: payload.fullName,
            })
          ),
        });
      }
      channel.ack(consumeMessage);
    });
  }
}
