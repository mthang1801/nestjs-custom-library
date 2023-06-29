import * as crypto from 'crypto';

export class Cryptography {
	private _encoding = 'base64';
	private _algorithm = 'aes-256-cbc';
	private _secretKey = Buffer.from(process.env.CLIENT_PRIVATE_KEY, 'base64');
	private _ivKey = crypto.randomBytes(16).fill(0);
	constructor() {}

	//Encrypting text
	public encrypt(text) {
		const cipher = crypto.createCipheriv(
			this._algorithm,
			this._secretKey,
			this._ivKey,
		);
		const buffer = Buffer.concat([cipher.update(text), cipher.final()]);
		return this.encodeBase64(buffer);
	}

	// Decrypting text
	public decrypt(encryptedData: string) {
		const decipher = crypto.createDecipheriv(
			this._algorithm,
			this._secretKey,
			this._ivKey,
		);
		const buffer = Buffer.concat([
			decipher.update(Buffer.from(encryptedData, 'base64')),
			decipher.final(),
		]);
		return buffer.toString();
	}

	public generateSHA512(str, secretKey: string = null) {
		if (secretKey) {
			return crypto.createHmac('sha256', secretKey).update(str).digest('hex');
		}
		return crypto.createHash('sha512').update(str).digest('hex');
	}

	public uuid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			},
		);
	}

	public genRandomString(length): string {
		return crypto
			.randomBytes(Math.ceil(+length / 2))
			.toString('hex')
			.slice(0, length);
	}

	public encodeBase64(str) {
		return Buffer.from(str, 'utf8').toString('base64');
	}

	public decodeBase64(buffer) {
		return Buffer.from(buffer, 'base64').toString('utf8');
	}

	static EncodeBase64(str) {
		return Buffer.from(str, 'utf8').toString('base64');
	}

	static DecodeBase64(buffer) {
		return Buffer.from(buffer, 'base64').toString('utf8');
	}

	private getStringValue(data) {
		if (typeof data === 'number' || data instanceof Number) {
			return data.toString();
		}
		if (!Buffer.isBuffer(data) && typeof data !== 'string') {
			throw new TypeError(
				'Data for password or salt must be a string or a buffer',
			);
		}

		return data;
	}

	public saltHashPassword(password) {
		const salt = this.genRandomString(32);
		return this.sha512(this.getStringValue(password), salt);
	}

	public desaltHashPassword(password, salt): string {
		const hash = crypto.createHmac(
			'sha512',
			this.getStringValue(this.decodeBase64(salt)),
		);
		hash.update(this.getStringValue(password));
		return this.encodeBase64(hash.digest('hex'));
	}

	public sha512(str, _secretKey) {
		const hash = crypto.createHmac('sha512', this.getStringValue(_secretKey));
		hash.update(this.getStringValue(str));
		const hashedData = hash.digest('hex');

		return {
			secretKey: this.encodeBase64(_secretKey),
			hashedData: this.encodeBase64(hashedData),
		};
	}

	public isMatchingPublicKey(publicKey): boolean {
		const privateKey = process.env.CLIENT_PRIVATE_KEY;
		const secretKey = process.env.CLIENT_SECRET_KEY;
		const hashedPublicKey = this.desaltHashPassword(publicKey, privateKey);
		if (secretKey === hashedPublicKey) return true;
		return false;
	}

	public generateMD5(str) {
		const hash = crypto.createHash('md5').update(str).digest('hex');
		return hash;
	}

	public uniqueId(id = 0, prefix = '', len = 10) {
		len = Math.min(len, 15);

		const length = len - id.toString().length;
		const max = Math.pow(10, length);
		const min = max / 10;
		const num = Math.floor(Math.random() * (max - min)) + min;

		return `${prefix}${num}${id}`;
	}

	static genPrivateKey() {
		return crypto.randomBytes(32).toString('base64');
	}

	/**
	 * based on my jsperf tests, the accepted answer is actually faster: http://jsperf.com/hashcodelordvlad
	 * @param {string} str
	 * @returns {string}
	 */
	hashCode(str: string) {
		return str.split('').reduce((a, b) => {
			a = (a << 5) - a + b.charCodeAt(0);
			return a & a;
		}, 0);
	}

	/**
	 * cyrb53, a simple but high quality 53-bit hash. It's quite fast, provides very good* hash distribution,
	 * and because it outputs 53 bits, has significantly lower collision rates compared to any 32-bit hash.
	 * Also, you can ignore SA's CC license as it's https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
	 * @param {string} str
	 * @param {number} seed
	 * @returns {string}
	 */
	cyrb53(str: string, seed = 0) {
		let h1 = 0xdeadbeef ^ seed,
			h2 = 0x41c6ce57 ^ seed;
		for (let i = 0, ch; i < str.length; i++) {
			ch = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
		h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
		h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
		h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

		return 4294967296 * (2097151 & h2) + (h1 >>> 0);
	}

	/**
	 * Calculate a 32 bit FNV-1a hash
	 * Found here: https://gist.github.com/vaiorabbit/5657561
	 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
	 *
	 * @param {string} str the input value
	 * @param {integer} [seed] optionally pass the hash of the previous chunk
	 * @param {boolean} [asString=false] set to true to return the hash value as
	 * 8-digit hex string instead of an integer
	 * @returns {integer | string}
	 */
	hashFnv32a(str: string, seed = 0x811c9dc5, asString = true) {
		/*jshint bitwise:false */
		let i, l;
		let hval = seed;

		for (i = 0, l = str.length; i < l; i++) {
			hval ^= str.charCodeAt(i);
			hval +=
				(hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}
		if (asString) {
			// Convert to 8 digit hex string
			return ('0000000' + (hval >>> 0).toString(16)).substr(-8);
		}

		return hval >>> 0;
	}
}
