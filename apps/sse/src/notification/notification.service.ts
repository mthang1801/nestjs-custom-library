import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import * as _ from 'lodash';

@Injectable()
export class NotificationService {
	logger = new Logger(NotificationService.name);
	@Timeout(Date.now().toString(), 500)
	async test() {
    const users = [
      { 'user': 'barney',  'active': true },
      { 'user': 'fred',    'active': false },
      { 'user': 'pebbles', 'active': false }
    ];

    console.log(_.dropWhile(users, "active"))
	}
}
