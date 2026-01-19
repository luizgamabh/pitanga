import {
  Injectable,
  ExecutionContext,
  ServiceUnavailableException,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  OAUTH_PROVIDERS_CONFIG,
  OAuthProviderConfig,
} from '../config';

@Injectable()
export class FacebookOAuthGuard extends AuthGuard('facebook') {
  constructor(
    @Inject(OAUTH_PROVIDERS_CONFIG)
    private readonly oauthConfig: OAuthProviderConfig,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (!this.oauthConfig.facebook) {
      throw new ServiceUnavailableException(
        'Facebook OAuth is not configured on this server',
      );
    }
    return super.canActivate(context);
  }
}
