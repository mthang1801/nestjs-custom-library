export type MongodbConfig = {
	host: string;
	port: string | number;
	username?: string;
	password?: string;
	database: string;
};
