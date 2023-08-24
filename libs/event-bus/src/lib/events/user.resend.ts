import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type UserResendPayload = {
  userId: string;
  fullName: string;
  email: string;
  verificated: boolean;
  verificationToken: string;
};

class UserResend extends RMQEvent {
  public event = Subjects.userCreated;

  public async publish(message: UserResendPayload): Promise<void> {
    return this.send(message);
  }
}

export { UserResend, UserResendPayload };
