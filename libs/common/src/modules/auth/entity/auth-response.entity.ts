import { ApiPropertyOptional } from '@nestjs/swagger';

export class AuthResponseEntity {
	@ApiPropertyOptional({
		type: String,
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Yjk1YzZlMmJmMTE5ZmNiZTY5ZTJiNyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjg5OTkwNjM5LCJleHAiOjE2ODk5OTA2OTl9.-Y8OqhlHNrEAs7auE6TbhdFKHRKwUvzSZsrCkbcqKyQ',
	})
	accessToken: string;

	@ApiPropertyOptional({
		type: String,
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Yjk1YzZlMmJmMTE5ZmNiZTY5ZTJiNyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjg5OTkwNjM5LCJleHAiOjE2OTA1OTU0Mzl9.rRibM51pKB4kTQwwLshdu9CbB3Gopy1AK9OqfjAd3Rk',
	})
	refreshToken: string;
}
