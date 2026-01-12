import { Role } from '../enums/role.enum';

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface IAuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}
