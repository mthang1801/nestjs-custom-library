export class User {
	static data: User[] = [
		{
			id: '1',
			fullname: 'John  Doe',
			dob: null,
			socket_ids: [],
			created_at: new Date(),
			updated_at: new Date(),
		},
		{
			id: '2',
			fullname: 'Brock Lesnar',
			dob: null,
			socket_ids: [],
			created_at: new Date(),
			updated_at: new Date(),
		},
	];
	id: string;
	fullname: string;
	dob: Date;
	created_at = new Date();
	updated_at = new Date();
	socket_ids: string[] = [];
}
