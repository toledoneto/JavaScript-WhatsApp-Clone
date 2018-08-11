export class Format
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

	static toTime(duration)
	{

		let seconds = parseInt((duration / 1000) % 60);
		let minutes = parseInt((duration / (1000 * 60)) % 60);
		let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

		if (hours > 0) 
		{

			return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

		} else {

			return `${minutes}:${seconds.toString().padStart(2, '0')}`;

		}

	}

	static dateToTime(date, locale = 'pt-BR')
	{

		return date.toLocaleTimeString(locale, {
			hour: '2-digit',
			minute: '2-digit'
		});

	}

	static timeStampToTime(timeStamp)
	{

		return (timeStamp && typeof timeStamp.toDate === 'function') ? 
							Format.dateToTime(timeStamp.toDate()) : '';

	}

}