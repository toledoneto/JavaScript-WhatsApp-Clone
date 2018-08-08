const path = require('path');

module.exports = 
{

	// arquivo de entrada
	entry: {
		// aplicação real
		app: './src/app.js',
		// configurando o path do worker
		'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
	},

	// arquivo criado com o bundle necessário
	output: 
	{

		// o [name] cria 2 budles na memória, cada um apontando para as entries
		// existentes no projeto. No caso serão app e pdf.worker, como podemos ver
		// plas entries acima
		filename: '[name].bundle.js',
		path: path.join(__dirname, 'dist'),
		publicPath: 'dist'

	}

}