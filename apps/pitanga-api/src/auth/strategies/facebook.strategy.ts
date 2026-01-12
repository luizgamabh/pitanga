import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { IOAuthProfile } from '@pitanga/auth-types';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      scope: ['email'],
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: Error | null, user?: IOAuthProfile) => void,
  ): Promise<void> {
    const { id, emails, displayName, photos } = profile;

    const oauthProfile: IOAuthProfile = {
      id,
      email: emails?.[0]?.value || '',
      name: displayName,
      picture: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    done(null, oauthProfile);
  }
}
