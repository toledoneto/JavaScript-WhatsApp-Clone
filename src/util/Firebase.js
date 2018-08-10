const firebase = require('firebase');
require('firebase/firestore');

export class Firebase
{

	constructor()
	{

		
		this._config = {' your Firebase data '};


		this.init();

	}

	init()
	{

		// veririfcando se o Firebase já está inicializado para evitar que se tente
		// inicializar duas vezes. Colocamos na var window para que seja global
		// e, assim, poder ser acessada e ter o mesmo valor em outras chamadas
		if (!window._initializedFirebase) 
		{

			firebase.initializeApp(this._config);

			// como o Firebase ficará em constante uso, precisamos ativar essa opção
			firebase.firestore().settings({
				timestampsInSnapshots: true
			});

			window._initializedFirebase = true;

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

	initAuth()
	{

		return new Promise((s,f) => {

			// add o provedor de acesso, no caso será o Google. Pode ser feito com linkedin,
			// FB etc, porém o programador de criar uma ligação com esses outros provedores
			let provider = new firebase.auth.GoogleAuthProvider();

			firebase.auth().signInWithPopup(provider).then(result => {

				let token = result.credential.accessToken;
				let user = result.user;

				s({
					user, 
					token
				});

			}).catch(err => {
				f(err);
			});

		});

	}

}