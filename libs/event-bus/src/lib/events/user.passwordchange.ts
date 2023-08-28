import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type UserPassowrdChangePayload = {
  email: string;
  fullName: string;
};

class UserPasswordChange extends RMQEvent {
  public event = Subjects.userPasswordChange;

  public async publish(message: UserPassowrdChangePayload): Promise<void> {
    return this.send(message);
  }
}

export { UserPasswordChange, UserPassowrdChangePayload };
