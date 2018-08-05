export class CameraController
{

	constructor(videoEl)
	{

		this._videoEl = videoEl;

		// pedindo permissão ao user para usar a cam
		navigator.mediaDevices.getUserMedia({

			video: true

		}).then(stream=>{

			// criando var pra usar no método stop
			this._stream = stream;

			// fonte do vídeo criando obj tipo arqv com createObjectURL
			this._videoEl.src = URL.createObjectURL(stream);

			// colocando o vídeo na tela
			this._videoEl.play();

		}).catch(err=>{

			console.error(err);

		});

	}

	stop()
	{

		this._stream.getTracks().forEach(track=> {
			
			track.stop();

		});

	}

	takePicture(mimeType = 'image/png')
	{

		// criando o canvas para capturar a ft
		let canvas = document.createElement('canvas');

		// setando os atributos do canvas de acordo com a img do vídeo
		canvas.setAttribute('height', this._videoEl.videoHeight);
		canvas.setAttribute('width', this._videoEl.videoWidth);

		// colocando o contexto do canvas para tratar de imgs 2D
		let context = canvas.getContext('2d');

		// desenhando a img(qual img, posições iniciais, posições finais)
		context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

		// retornando um base64 da img com toDataURL
		return canvas.toDataURL(mimeType);

	}

}