import { Role } from '@prisma/client';

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}
