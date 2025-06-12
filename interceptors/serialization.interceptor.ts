import {
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import UserDto from 'src/users/dtos/serialize.dto';
import { map } from 'rxjs';

interface ClassConstruct {
  new (...args: any[]): {};
}

export function serialize(dto: ClassConstruct) {
  return UseInterceptors(new SerializeInterceptor(UserDto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) => {
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
