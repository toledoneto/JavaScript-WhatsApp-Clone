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

	get chatId(){ return this._data.chatId; }
	set chatId(value){ this._data.chatId = value; }

	getById(id)
	{

		return new Promise((s, f) => {

			// usando o onSnapshot para manter escutando na espera de alguma att e relfeti-la
			// na tela quando necessário
			User.findByEmail(id).onSnapshot(doc => {
				
				this.fromJSON(doc.data());

				s(doc);

			});

		});

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

	static getContactsRef(id)
	{

		return User.getRef()
			.doc(id)
			.collection('contacts');

	}

	static findByEmail(email)
	{

		// procurar, na coleção users, um id que seja = ao email
		return User.getRef().doc(email);
	}

	addContact(contact)
	{

		// usando btoa para passar o email para base64 e não ter problema com . e @
		return User.getContactsRef(this.email)
			.doc(btoa(contact.email))
			.set(contact.toJSON());

	}

	getContacts(filter = '')
	{

		return new Promise((s,f) => {
			User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs => {

				let contacts = [];

				docs.forEach(doc =>{

					let data = doc.data();
					data.id = doc.id;
					contacts.push(data);
				});

				this.trigger('contactschange', docs);

				s(contacts);

			});
		});

	}

}