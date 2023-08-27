import { Injectable, Scope } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalStrategy } from '../strategies/local.strategy';

@Injectable({ scope: Scope.REQUEST })
export class LocalAuthGuard extends AuthGuard('local') {
	constructor(private readonly localStrategy: LocalStrategy) {
		super();
	}
}
