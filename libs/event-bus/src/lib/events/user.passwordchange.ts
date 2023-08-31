import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type UserPasswordChangePayload = {
  email: string;
  fullName: string;
};

class UserPasswordChange extends RMQEvent {
  public event = Subjects.userPasswordChange;

  public async publish(message: UserPasswordChangePayload): Promise<void> {
    return this.send(message);
  }
}

export { UserPasswordChange, UserPasswordChangePayload };
