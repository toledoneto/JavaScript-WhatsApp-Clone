import {ClassEvent} from '../util/ClassEvent';

export class Model extends ClassEvent
{

	constructor()
	{

		super();
		
		this._data = {};

	}

	// lê algo recebido em JSON
	fromJSON(json)
	{

		// Object.assign mescla os obj existentes com os novos, ou seja, casa algum
		// dos obj esteja em compelto em relação ao outro, preenche-se os espaços
		// com o mais completo e atualiza os dados com o mais novo
		this._data = Object.assign(this._data, json);

		// avisa a app que existe uma mudança e envia os dados atuais
		this.trigger('datachange', this.toJSON());

	}

	// escreve algo em JSON
	toJSON(json)
	{

		return this._data;

	}

}