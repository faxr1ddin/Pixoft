import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ADMIN_CREDENTIALS } from '../auth/credentials';

/**
 * Protects write endpoints with HTTP Basic auth using the shared
 * admin credentials. Pair with @ApiBasicAuth() so Swagger shows the
 * "Authorize" lock on guarded routes.
 */
@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization ?? '';

    if (!header.startsWith('Basic ')) {
      throw new UnauthorizedException();
    }

    const [username, password] = Buffer.from(header.slice(6), 'base64')
      .toString()
      .split(':');

    if (
      username !== ADMIN_CREDENTIALS.username ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
