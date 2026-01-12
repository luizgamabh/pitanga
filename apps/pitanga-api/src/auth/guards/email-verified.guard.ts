import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IAuthUser } from '@pitanga/auth-types';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user: IAuthUser }>();

    if (!user) {
      return false;
    }

    if (!user.emailVerified) {
      throw new ForbiddenException('Email verification required');
    }

    return true;
  }
}
