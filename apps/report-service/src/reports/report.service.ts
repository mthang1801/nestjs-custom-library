import { ENUM_REPORT_TEMPLATES } from '@app/shared';
import { ENUM_DATA_TYPE, ENUM_FORMAT_TYPE } from '@app/shared/constants/enum';
import * as Client from '@jsreport/nodejs-client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ReportService implements OnModuleInit {
	client: Client;
	constructor(private readonly configService: ConfigService) {}

	onModuleInit(): void {
		const serverUrl = process.env.JSREPORT_BASE_URL;
		const username = this.configService.get('JSREPORT_USERNAME');
		const password = this.configService.get('JSREPORT_PASSWORD');
		this.client = Client(serverUrl, username, password);
	}

	async reportSales() {
		const data = {
			customer: 'Walker Group',
			month: 'April',
			taxPercentage: 0.2,
			detail: [
				{
					date: '2019-04-03',
					product: 'Vitamin C',
					category: 'Health',
					unitPrice: 25,
					quantity: 1,
					discountPercentage: 0,
				},
				{
					date: '2019-04-03',
					product: 'Vitamin C',
					category: 'Health',
					unitPrice: 25,
					quantity: 1,
					discountPercentage: 0,
				},
				{
					date: '2019-04-03',
					product: 'Probiotics',
					category: 'Health',
					unitPrice: 83,
					quantity: 1,
					discountPercentage: 0.25,
				},
				{
					date: '2019-04-04',
					product: 'Mild Bubble Cleanser',
					category: 'Cleansing',
					unitPrice: 13,
					quantity: 2,
					discountPercentage: 0,
				},
				{
					date: '2019-04-04',
					product: 'Deep Cleanser',
					category: 'Cleansing',
					unitPrice: 12,
					quantity: 3,
					discountPercentage: 0,
				},
				{
					date: '2019-04-03',
					product: 'Probiotics',
					category: 'Health',
					unitPrice: 83,
					quantity: 1,
					discountPercentage: 0.25,
				},
				{
					date: '2019-04-04',
					product: 'Mild Bubble Cleanser',
					category: 'Cleansing',
					unitPrice: 13,
					quantity: 2,
					discountPercentage: 0,
				},
				{
					date: '2019-04-04',
					product: 'Deep Cleanser',
					category: 'Cleansing',
					unitPrice: 12,
					quantity: 3,
					discountPercentage: 0,
				},
				{
					date: '2019-04-04',
					product: 'Atomy Men Set',
					category: 'Men Skin Care',
					unitPrice: 54,
					quantity: 1,
					discountPercentage: 0.35,
				},
				{
					date: '2019-04-09',
					product: 'BB Cream',
					category: 'Make-Up',
					unitPrice: 12,
					quantity: 3,
					discountPercentage: 0,
				},
				{
					date: '2019-04-15',
					product: 'Lipstick Poppy',
					category: 'Make-Up',
					unitPrice: 22,
					quantity: 1,
					discountPercentage: 0,
				},
				{
					date: '2019-04-15',
					product: 'Healthy Glow Base',
					category: 'Make-Up',
					unitPrice: 18,
					quantity: 2,
					discountPercentage: 0.12,
				},
				{
					date: '2019-04-26',
					product: 'Lotion',
					category: 'Skin Care',
					unitPrice: 23,
					quantity: 1,
					discountPercentage: 0,
				},
			],
		};

		const response = await this.client.render({
			template: {
				name: ENUM_REPORT_TEMPLATES.SALES,
			},
			data,
			options: {
				format: ENUM_FORMAT_TYPE.XLSX,
			},
		});

		const buffer = await response.body();
		const headers = response.headers;
		const result = {
			headers,
			buffer,
		};
		return this.response(ENUM_DATA_TYPE.BUFFER, result);
	}

	private response(dataType: ENUM_DATA_TYPE, result) {
		return {
			dataType,
			result,
		};
	}
}
