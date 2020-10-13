import { NestInterceptor, ExecutionContext, CallHandler, Injectable, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import * as OAuth2Server from 'oauth2-server'
import { OAuthService } from "./oauth.service";

@Injectable()
export class OAuthInterceptor implements NestInterceptor {
    @Inject(OAuthService)
    public readonly oauthService: OAuthService

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const http = context.switchToHttp()
        const req = http.getRequest()
        const res = http.getResponse()

        req.oauth = await this.oauthService.oauth.authenticate(
            new OAuth2Server.Request(req),
            new OAuth2Server.Response(res)
        ).catch(() => ({}))

        return next.handle()
    }
}