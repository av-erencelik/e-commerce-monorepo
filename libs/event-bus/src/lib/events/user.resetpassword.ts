import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type UserResetPasswordPayload = {
  email: string;
  url: string;
  fullName: string;
};

class UserResetPassword extends RMQEvent {
  public event = Subjects.userResetPassword;

  public async publish(message: UserResetPasswordPayload): Promise<void> {
    return this.send(message);
  }
}

export { UserResetPassword, UserResetPasswordPayload };
