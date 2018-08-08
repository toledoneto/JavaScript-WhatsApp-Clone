import {ClassEvent} from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent
{

	constructor()
	{

		// executa o contrutor da classe pai
		super();

		// pedindo permissão ao user para usar a cam
		navigator.mediaDevices.getUserMedia({

			audio: true

		}).then(stream=>{

			// criando var pra usar no método stop
			this._stream = stream;

			let audio =  new Audio();

			audio.src = URL.createObjectURL(stream);

			audio.play();

			this.trigger('play', audio);

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
