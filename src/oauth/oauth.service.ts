import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as OAuth2Server from 'oauth2-server';
import * as uuid from 'uuid';
import { UserService } from '../user/user.service';
import { OAuthClientService } from './oauth-client.service';
import { RevokedService } from './revoked.service';
import { OAuthCodeService } from './oauth-code.service';

export interface JwtToken {
  iss?: string;
  sub: string;
  aud: string;
  scope: string | string[];
  exp?: number;
}

@Injectable()
export class OAuthService
  implements
    OAuth2Server.PasswordModel,
    OAuth2Server.RefreshTokenModel,
    OAuth2Server.AuthorizationCodeModel {
  public readonly oauth: OAuth2Server = new OAuth2Server({
    model: this,
    allowBearerTokensInQueryString: true,
  });

  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly oAuthClientService: OAuthClientService,
    private readonly revokedService: RevokedService,
    private readonly codeService: OAuthCodeService,
  ) {}

  async generateAuthorizationCode() {
    return uuid.v4();
  }

  async getAuthorizationCode(
    code: string,
  ): Promise<OAuth2Server.AuthorizationCode | null> {
    const authorizationCode = await this.codeService.findAndDelete(code);

    return (
      authorizationCode && {
        authorizationCode: code,
        expiresAt: authorizationCode.expiresAt,
        client: authorizationCode.client,
        user: authorizationCode.user,
        scope: authorizationCode.scope,
        redirectUri: null,
      }
    );
  }

  async saveAuthorizationCode(
    authorizationCode: OAuth2Server.AuthorizationCode,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.AuthorizationCode | null> {
    return this.codeService.save({
      ...authorizationCode,
      client,
      user,
    });
  }

  async revokeAuthorizationCode(
    code: OAuth2Server.AuthorizationCode,
  ): Promise<boolean> {
    return true;
  }

  // TODO: Limitar scopos de clientes e liberar scopos sensíveis somente após análise do aplicativo.
  // async validateScope(
  //   user: OAuth2Server.User,
  //   client: OAuthClient,
  //   scope: string | string[],
  // ) {

  //   console.log('validate', scope)
  //   return scope
  //   // return ;
  // }

  async generateRefreshToken?(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    scope: string | string[],
  ): Promise<string> {
    if (typeof scope == 'string') scope = scope.split(',');

    return this.jwt.sign(
      <JwtToken>{
        sub: user.id,
        aud: client.id,
        scope,
      },
      {
        expiresIn: +client.refreshTokenLifetime,
        jwtid: uuid.v4(),
      },
    );
  }
  getUser(
    username: string,
    password: string,
  ): Promise<OAuth2Server.User | null> {
    return this.userService.getByUsernameAndPassword(username, password);
  }

  async generateAccessToken(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    scope: string | string[],
  ): Promise<string> {
    if (typeof scope == 'string') scope = scope.split(',');

    return this.jwt.sign(
      <JwtToken>{
        sub: user.id,
        aud: client.id,
        scope,
      },
      {
        expiresIn: +client.accessTokenLifetime,
        jwtid: uuid.v4(),
      },
    );
  }

  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<OAuth2Server.Client | null> {
    return this.oAuthClientService.getClientByIdAndSecret(
      clientId,
      clientSecret,
    );
  }

  async saveToken(
    token: OAuth2Server.Token,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.Token | null> {
    return { ...token, client, user };
  }

  async getAccessToken(
    accessToken: string,
  ): Promise<OAuth2Server.Token | null> {
    const payload: JwtToken = this.jwt.verify(accessToken);

    return {
      accessToken: accessToken,
      accessTokenExpiresAt: new Date(payload.exp * 1000),
      client: await this.oAuthClientService.findOne(payload.aud),
      user: await this.userService.findOne(payload.sub),
    };
  }

  async verifyScope(
    token: OAuth2Server.Token,
    scope: string | string[],
  ): Promise<boolean> {
    const payload = this.jwt.verify(token.accessToken);
    const tokenScope = payload.scope || ['public'];

    if (typeof scope == 'string') scope = scope.split(',');
    if (scope.length == 0) return true;

    return scope.some(item => tokenScope.includes(item));
  }

  async getRefreshToken(
    refreshToken: string,
  ): Promise<OAuth2Server.RefreshToken | null> {
    const payload = this.jwt.verify(refreshToken);

    return {
      refreshToken: refreshToken,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
      client: await this.oAuthClientService.findOne(payload.aud),
      user: await this.userService.findOne(payload.sub),
    };
  }

  async revokeToken(
    token: OAuth2Server.Token | OAuth2Server.RefreshToken,
  ): Promise<boolean> {
    const payload = this.jwt.verify(token.refreshToken);

    return this.revokedService.revokedTokens(
      payload.jti,
      new Date(payload.exp * 1000),
    );
  }
}
