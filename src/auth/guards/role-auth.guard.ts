import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../model/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      Array<Role | string>
    >('role', [context.getHandler(), context.getClass()]);

    console.log('requiredRoles', requiredRoles);

    if (!requiredRoles) {
      return true;
    }
    const res = context.switchToHttp().getRequest();
    console.log('user from request', res);
    // return requiredRoles.some((role) => user?.role?.includes(role as Role));
  }
}
