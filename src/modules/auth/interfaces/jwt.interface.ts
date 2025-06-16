import { UserInterface } from './user.interface';

export interface JwtPayload {
  email: UserInterface['email'];
  sub: UserInterface['id'];
  role: UserInterface['role'];
  name: UserInterface['name'];
  createdAt: UserInterface['createdAt'];
}
