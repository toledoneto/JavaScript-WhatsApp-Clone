import {Firebase} from './../util/Firebase';
import {Model} from './Model';

export class User extends Model
{

	constructor(id)
	{

		super();

		if (id) this.getById(id);

	}

	get name(){ return this._data.name; }
	set name(value){ this._data.name = value; }

	get email(){ return this._data.email; }
	set email(value){ this._data.email = value; }

	get photo(){ return this._data.photo; }
	set photo(value){ this._data.photo = value; }

	getById(id)
	{

		return new Promise((s, f) => {

			// a Promise vai retornar o documento salvo no firebase
			User.findByEmail(id).get().then(doc => {

				this.fromJSON(doc.data());

			})
			.catch(err => {
				f(err);
			});

		})

	}

	// salva no BD
	save()
	{

		return User.findByEmail(this.email).set(this.toJSON());

	}

	// pegando a referência do DB
	static getRef()
	{

		// referência para a coleção Users
		return Firebase.db().collection('/users');

	}

	static findByEmail(email)
	{

		// procurar, na coleção users, um id que seja = ao email
		return User.getRef().doc(email);
	}

}