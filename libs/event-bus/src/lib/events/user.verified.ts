import { RMQEvent } from '../base.event';
import { Subjects } from '../subjects';

type UserVerifiedPayload = {
  userId: string;
  email: string;
  fullName: string;
  verificated: boolean;
  version: number;
};

class UserVerified extends RMQEvent {
  public event = Subjects.userVerified;

  public async publish(message: UserVerifiedPayload): Promise<void> {
    return this.send(message);
  }
}

export { UserVerified, UserVerifiedPayload };
