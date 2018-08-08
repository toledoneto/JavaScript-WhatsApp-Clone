import {ClassEvent} from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent
{

	constructor()
	{

		// executa o contrutor da classe pai
		super();

		// formato básico de audio
		this._mimeType = 'audio/webm';

		// var para verificar se o user autorizou o uso do microfone para gravação
		this._available = false;

		// pedindo permissão ao user para usar a cam
		navigator.mediaDevices.getUserMedia({

			audio: true

		}).then(stream=>{

			// após autorizado o uso do microfone
			this._available = true;

			// criando var pra usar no método stop
			this._stream = stream;

			this.trigger('ready', this._stream);

		}).catch(err=>{

			console.error(err);

		});

	}

	isAvailable()
	{

		return this._available;

	}

	stop()
	{

		this._stream.getTracks().forEach(track=> {
			
			track.stop();

		});

	}

	startRecorder()
	{

		// verificando se está autorizado
		if (this.isAvailable) 
		{

			// gravando a media
			this._mediaRecorder = new MediaRecorder(this._stream, {
				mimeType: this._mimeType
			});

			// o modo de gravação se inicia com a disponibilidade de dados já recebidos
			// Esses dados são separados em 'pacotes' de dados já salvos, então criamos um array
			this._recordedChunks = [];

			this._mediaRecorder.addEventListener('dataavailable', e => {

				if (e.data.size > 0) this._recordedChunks.push(e.data);

			});

			this._mediaRecorder.addEventListener('stop', e => {

				let blob = new Blob(this._recordedChunks, {
					type: this._mimeType
				});

				let filename = `rec${Date.now()}.webm`;

				// após parar a gavação, gravamos tds os pedaços em um único array
				let file = new File([blob], filename, {
					type: this._mimeType,
					lastModified: Date.now()
				});

				console.log('file', file);

				let reader = new FileReader();

				reader.onload = e =>{

					let audio = new Audio(reader.result);

					audio.play();

				}

				reader.readAsDataURL(file);

			});

			this._mediaRecorder.start();

			// começa o timer de gravação
			this.startTimer();

		}

	}

	stopRecorder()
	{

		// verificando se está autorizado
		if (this.isAvailable) 
		{

			this._mediaRecorder.stop();
			this.stop();
			this.stopTimer();
			
		}

	}

	startTimer()
	{

		let start = Date.now();

		this._recordMicrophoneInterval = setInterval(() =>{

			this.trigger('recordtimer', (Date.now() - start));

		}, 100);

	}

	stopTimer()
	{

		clearInterval(this._recordMicrophoneInterval);


	}

}
