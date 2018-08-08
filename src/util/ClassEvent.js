export class ClassEvent
{

	contructor()
	{

		this._events = {};

	}

	// evento on
	on(eventName, fn)
	{

		// verificando se o obj já tem um evento com msm nome para que todos possam
		// ser executados, mas não sobrescritos. Para tal, colocaremos tds as ocorrências
		// em um Array
		if (!this._events[eventName]) this._events[eventName] = new Array();

		this._events[eventName].push(fn);

	}

	trigger()
	{

		// arguments é nativo do JS e funciona como o args de Python, ou seja, recebendo
		// qualquer qdade de param na chamada da função
		let args = [...arguments];
		// shift retira o elemento na 1ª posição do array removendo-o
		let eventName = args.shift();

		//criando novo evento
		args.push(new Event(eventName));

		// se existe algum evento ouvindo a chamada
		if (this._events[eventName] instanceof Array)
		{

			this._events[eventName].forEach(fn => {

				// cmd JS para executar o código escrito dentro do apply
				fn.apply(null, args);

			});

		}
	}

}