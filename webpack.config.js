const path = require('path');

module.exports = 
{

	// arquivo de entrada
	entry: './src/app.js',

	// arquivo criado com o bundle necessário
	output: 
	{

		filename: 'bundle.js',
		path: path.resolve(__dirname, '/dist'),
		publicPath: 'dist'

	}

}