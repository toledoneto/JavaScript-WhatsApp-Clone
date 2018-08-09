const firebase = require('firebase');
require('firebase/firestore');

export class Firebase
{

	constructor()
	{

		this._config = {'your data from firebase'};

		this.init();

	}

	init()
	{

		// veririfcando se o Firebase já está inicializado para evitar que se tente
		// inicializar duas vezes
		if (!this._initialized) 
		{

			firebase.initializeApp(this._config);

			// como o Firebase ficará em constante uso, precisamos ativar essa opção
			firebase.firestore().settings({
				timestampsInSnapshots: true
			});

			this._initialized = true;

		}

	}

	// para db na nuvem
	static db()
	{

		return firebase.firestore();

	}

	// para hd na nuvem
	static hd()
	{

		return firebase.storage();

	}

}