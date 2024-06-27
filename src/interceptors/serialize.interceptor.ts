import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

//this is a type definition for a class constructor
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //run something before a request is handled by the request handler
    console.log(`1 run before handler`, context);

    return handler.handle().pipe(
      map((userEntity: any) => {
        //run something before the response is sent out
        console.log(`3 run before response is sent out`, userEntity);

        return plainToClass(this.dto, userEntity, {
          //excludeExtraneousValues: true will remove any properties that are not defined in the UserDto class
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
