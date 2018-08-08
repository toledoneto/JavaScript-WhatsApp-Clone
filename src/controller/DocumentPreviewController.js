// lib para leitura de pdf
const pdfjsLib = require('pdfjs-dist');
const path = require('path');

// web-worker: js que fica fora da app e consegue trabalhar em loop
// para que seu app não trave ou se negue a executar o cmd
// configurando o web-worker:
// 1. apontando o path para o Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');
// 2. 

export class DocumentPreviewController
{

	constructor(file)
	{

		this._file = file;

	}

	getPreviewData()
	{

		return new Promise((s, f) => {

			let reader = new FileReader();


			switch (this._file.type) 
			{

				case 'image/png':
				case 'image/jpeg':
				case 'image/jpg':
				case 'image/gif':
					
					// caso haja sucesso na promessa
					reader.onload = e => {

						s({
							src: reader.result,
							info: this._file.name
						});

					}

					// caso haja erro na promessa
					reader.onerror = e =>{

						f(e);

					}

					reader.readAsDataURL(this._file);
					break;

				case 'application/pdf':

					reader.onload = e =>{

						//
						pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf => {

							// usando a tag canvas do HTML5 para colcoar a 1º pág na tela
							pdf.getPage(1).then(page => {

								let viewport = page.getViewport(1);

								let canvas = document.createElement('canvas');
								let canvasContext = canvas.getContext('2d');

								canvas.width = viewport.width;
								canvas.height = viewport.height;

								page.render({
									canvasContext,
									viewport
								}).then(() => {

									// var para decidir se a palavra vai ou não
									// para o plural
									let _s = (pdf.numPages > 1) ? 's' : '';

									s({
										src: canvas.toDataURL('image/png'),
										info: `${pdf.numPages} página${_s}`
									});

								}).catch(err => {
									f(err);
								});

							}).catch(err => {
								f(err);
							});

						}).catch(err => {

							// como já estamos dentro de uma Promise,
							// podemos retornar a rejeição geral
							f(err);

						});

					};

					reader.readAsArrayBuffer(this._file);

					break;

				default:
					f();

			}

		});

	}

}