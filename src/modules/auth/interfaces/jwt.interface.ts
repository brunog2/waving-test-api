import { UserInterface } from './user.interface';

export interface JwtPayload {
  sub: string;
  user: {
    email: UserInterface['email'];
    id: UserInterface['id'];
    role: UserInterface['role'];
    name: UserInterface['name'];
    createdAt: UserInterface['createdAt'];
    iat: number;
    exp: number;
  };
}
