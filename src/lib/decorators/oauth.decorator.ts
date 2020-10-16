import { OAUTH_PUBLIC, OAUTH_SCOPE, OAUTH_ACTIONS_SCOPE } from '../meta';
import { SetMetadata, createParamDecorator } from '@nestjs/common';
import { BaseRouteName, CrudActions } from '@nestjsx/crud';
import { ApiOAuth2 } from '@nestjs/swagger';

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
  return target => {
    const handlers: Record<CrudActions, String> = {
      'Create-Many': 'createManyBase',
      'Create-One': 'createOneBase',
      'Delete-One': 'deleteOneBase',
      'Read-All': 'getManyBase',
      'Read-One': 'getOneBase',
      'Replace-One': 'replaceOneBase',
      'Update-One': 'updateOneBase',
      'Delete-All': '',
    };

    for (let scope in methodsScope) {
      const methodName = handlers[scope];
      const handler = target.prototype[methodName];

      if (!handler) {
        continue;
      }

      Reflect.defineMetadata(OAUTH_SCOPE, methodsScope[scope], handler);
      ApiOAuth2(methodsScope[scope])(
        target,
        handler.name,
        Object.getOwnPropertyDescriptor(target.prototype, methodName),
      );
    }
  };
};

export const CurrentUser = createParamDecorator((data, req) => req.user);
