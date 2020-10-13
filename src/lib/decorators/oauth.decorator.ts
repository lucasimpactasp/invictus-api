import { OAUTH_PUBLIC, OAUTH_SCOPE, OAUTH_ACTIONS_SCOPE } from '../meta';
import { SetMetadata, createParamDecorator } from '@nestjs/common';
import { BaseRouteName, CrudActions } from '@nestjsx/crud';

/**
 * Remove a autenticação de um controlador ou um método dele
 */
export const OAuthPublic = () => SetMetadata(OAUTH_PUBLIC, true);

/**
 * Define o escopo requirido para acessar um controlador ou método dele
 * @param scopes Escopos requiridos
 */
export const OAuthScope = (scopes: string[]) =>
  SetMetadata(OAUTH_SCOPE, scopes);

/**
 * Define o escopo para métodos Crud
 * @param scopes Escopos requiridos
 */
export const OAuthActionsScope = (
  methodsScope: { [key in CrudActions]?: string[] },
): ClassDecorator => {
  return SetMetadata(OAUTH_ACTIONS_SCOPE, methodsScope);
};

export const CurrentUser = createParamDecorator((data, req) => req.user);
