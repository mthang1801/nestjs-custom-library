import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../schemas';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendMailExample(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.mailerService.sendMail({
					to: 'maivthang95@gmail.com',
					subject: 'test Email',
					template: 'example',
					context: {
						name: 'Mai Van Thang',
						header: 'Header',
						body: 'Body',
						footer: 'Footer',
					},
				});
				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}

	async sendUserPasscode(user: User): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.mailerService.sendMail({
					to: user.email,
					subject: 'Xác thực tài khoản',
					template: 'send-user-passcode',
					context: {
						greeting: `Xin chào ${user.first_name}`,
						body: '',
						footer: '',
					},
				});
				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}
}
