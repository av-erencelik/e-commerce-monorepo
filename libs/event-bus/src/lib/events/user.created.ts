import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type UserCreatedPayload = {
  userId: string;
  fullName: string;
  email: string;
  verificated: boolean;
  version: number;
  verificationToken: string;
};

class UserCreated extends RMQEvent {
  public event = Subjects.userCreated;

  public async publish(message: UserCreatedPayload): Promise<void> {
    return this.send(message);
  }
}

export { UserCreated, UserCreatedPayload };
