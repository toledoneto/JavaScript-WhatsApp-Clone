class Format
{

	static getCamelCase(text)
	{

		// é necessário ter uma div só pra gerar o DataSet
		let div = document.createElement('div');

		// criando a div que carregará o dataSet
		div.innerHTML = `<div data-${text}="id"></div>`;

		// retorna um array com tds as chaves que encontra dentro do obj
		return Object.keys(div.firstChild.dataset)[0];

	}

}