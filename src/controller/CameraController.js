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

}