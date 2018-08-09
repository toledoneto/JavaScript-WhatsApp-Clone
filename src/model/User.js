import {Firebase} from './../util/Firebase';
import {ClassEvent} from '../util/ClassEvent';

export class User extends ClassEvent
{

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