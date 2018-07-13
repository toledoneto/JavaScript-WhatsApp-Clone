export class CameraController
{

	constructor(videoEl)
	{

		this._videoEl = videoEl;

		// pedindo permissão ao user para usar a cam
		navigator.mediaDevices.getUserMedia({

			video: true

		}).then(stream=>{

			// fonte do vídeo criando obj tipo arqv com createObjectURL
			this._videoEl.src = URL.createObjectURL(stream);

			// colocando o vídeo na tela
			this._videoEl.play();

		}).catch(err=>{

			console.error(err);

		});

	}

}