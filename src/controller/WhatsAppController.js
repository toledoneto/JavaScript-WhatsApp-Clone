import {Format} from './../util/Format';
import {CameraController} from './CameraController';
import {MicrophoneController} from './MicrophoneController';
import {DocumentPreviewController} from './DocumentPreviewController';
import {Firebase} from './../util/Firebase';
import {User} from './../model/User';

export class WhatsAppController
{

	constructor()
	{

		// criando obj Firebase
		this._firebase = new Firebase();

		// método de autenticação de user
		this.initAuth();

		this.elementsPrototype();

		// metodo para carregar os 75 ids principais do projeto
		// e transformar em camelCase cada um deles para uso posterior
		this.loadElements();

		// método para inciar todos os eventos criados
		this.initEvents();

	}

	initAuth()
	{

		this._firebase.initAuth().then(response => {
			
			this._user = new User();

			let userRef = User.findByEmail(response.user.email);

			// set é um método do firebase
			userRef.set({
				name: response.user.displayName,
				email: response.user.email,
				photo: response.user.photoURL
			}).then(() => {

				// a tela de conversa do app só volta a aprecer após estar no firebase
				this.el.appContent.css({
				display:'flex'

				});
			});

		}).catch(err => {
			console.log('err', err);
		});

	}

	initEvents()
	{

		this.el.myPhoto.on('click', e=>{

			this.closeAllLeftPanel();
			this.el.panelEditProfile.show();
			setTimeout(()=>{
				this.el.panelEditProfile.addClass('open');
			}, 300);
	
		});

		this.el.btnNewContact.on('click', e=>{

			this.closeAllLeftPanel();
			this.el.panelAddContact.show();
			setTimeout(()=>{	
				this.el.panelAddContact.addClass('open');
			}, 300);	

		});

		this.el.btnClosePanelEditProfile.on('click', e=>{

			this.el.panelEditProfile.removeClass('open');

		});

		this.el.btnClosePanelAddContact.on('click', e=>{

			this.el.panelAddContact.removeClass('open');

		});

		this.el.photoContainerEditProfile.on('click', e=>{

			this.el.inputProfilePhoto.click();

		});

		this.el.inputNamePanelEditProfile.on('keypress', e=>{

			if (e.key === 'Enter') 
			{

				// previne que o Enter add uma nova linha
				e.preventDefault();
				this.el.btnSavePanelEditProfile.click();

			}


		});

		this.el.btnSavePanelEditProfile.on('click', e=>{

			console.log(this.el.inputNamePanelEditProfile.innerHTML);

		});

		this.el.formPanelAddContact.on('submit', e=>{

			e.preventDefault();

			let formData = new FormData(this.el.formPanelAddContact);

		});

		// faz uma leitura de cada conversa do lado esq do app
		this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item =>{

			item.on('click', e=>{

				this.el.home.hide();
				this.el.main.css({

					display: 'flex'

				});

			});

		});

		this.el.btnAttach.on('click', e=>{

			e.stopPropagation();
			this.el.menuAttach.addClass('open');
			// como o menu tem que fechar caso haja um click em qquer lugar fora do menu
			// aplicamos um event no document como um todo. O bind ao fim da intrução
			// serve para manipular o escopo da função que será chamada ao fim mantendo
			// o escopo no whatsapp controller
			document.addEventListener('click', this.closeMenuAttach.bind(this));

		});

		this.el.btnAttachPhoto.on('click', e=>{

			this.el.inputPhoto.click();

		});

		this.el.inputPhoto.on('change', e=>{

			console.log(this.el.inputPhoto.files);

			// como temos uma coleção, precisamos usar o spread para transformar em array
			[...this.el.inputPhoto.files].forEach(file=>{

				console.log(file);

			});

		});

		this.el.btnAttachCamera.on('click', e=>{

			this.closeAllMainPanel();
			this.el.panelCamera.addClass('open');
			this.el.panelCamera.css({

				'height':'calc(100% - 120px)'

			});

			// renderiza a câmera "ao vivo" na tela do app antes de tirar uma ft
			this._camera = new CameraController(this.el.videoCamera);

		});

		this.el.btnClosePanelCamera.on('click', e=>{

			this.el.panelCamera.removeClass('open');
			this.el.panelMessagesContainer.show();
			this._camera.stop();

		});

		this.el.btnTakePicture.on('click', e=>{

			let dataURL = this._camera.takePicture();

			// coloca no id da câmera a img obtida
			this.el.pictureCamera.src = dataURL;
			// mostra essa img na tela
			this.el.pictureCamera.show();
			// esconde o vídeo que estava a tela
			this.el.videoCamera.hide();
			// botão de retirar a ft
			this.el.btnReshootPanelCamera.show();
			// retira o botão de tirar a ft
			this.el.containerTakePicture.hide();
			// mostra o botão de enviar a ft
			this.el.containerSendPicture.show();

		});

		this.el.btnReshootPanelCamera.on('click', e=>{

			this.el.pictureCamera.hide();
			this.el.videoCamera.show();
			this.el.btnReshootPanelCamera.hide();
			this.el.containerTakePicture.show();
			this.el.containerSendPicture.hide();

		});

		this.el.btnSendPicture.on('click', e=>{

			

		});

		this.el.btnAttachDocument.on('click', e=>{

			this.closeAllMainPanel();
			this.el.panelDocumentPreview.addClass('open');
			this.el.panelDocumentPreview.css({
				'height':'calc(100% - 120px)'
			});
			// habilita a abertura de janela para selecionar itens do SO
			this.el.inputDocument.click();

		});

		this.el.inputDocument.on('change', e=>{

			// se houver algo selecionado para envio, envia o 1º apenas
			if (this.el.inputDocument.files.length) 
			{

				this.el.panelDocumentPreview.css({
					'height':'1%'
				});

				let file = this.el.inputDocument.files[0];

				this._documentPreviewController = new DocumentPreviewController(file);

				// se o arqv for uma img, entrará nesse then...
				this._documentPreviewController.getPreviewData().then(result => {

					this.el.imgPanelDocumentPreview.src = result.src;
					this.el.infoPanelDocumentPreview.innerHTML = result.info;
					this.el.imagePanelDocumentPreview.show();
					this.el.filePanelDocumentPreview.hide();

					this.el.panelDocumentPreview.css({
						'height':'calc(100% - 120px)'
					});

				// ... senão, será pego pelo catch abaixo
				}).catch(err=>{

					this.el.panelDocumentPreview.css({
						'height':'calc(100% - 120px)'
					});

					// para ver o tipo do arqv e colocar no switch abaixo
					console.log(file);

					switch (file.type) 
					{
						case 'application/vnd.ms-excel':
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
							break;

						case 'application/vnd.ms-powerpoint':
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
							break;

						case 'application/vnd.msword':
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
							break;

						default:
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
							break;
					}

					this.el.filenamePanelDocumentPreview.innerHTML = file.name;
					this.el.imagePanelDocumentPreview.hide();
					this.el.filePanelDocumentPreview.show();

				});
			}

		});

		this.el.btnClosePanelDocumentPreview.on('click', e=>{

			this.closeAllMainPanel();
			this.el.panelMessagesContainer.show();

		});

		this.el.btnSendDocument.on('click', e=>{

			console.log('send document');

		});

		this.el.btnAttachContact.on('click', e=>{

			this.el.modalContacts.show();

		});

		this.el.btnCloseModalContacts.on('click', e=>{

			this.el.modalContacts.hide();

		});

		this.el.btnSendMicrophone.on('click', e=>{

			this.el.recordMicrophone.show();
			this.el.btnSendMicrophone.hide();

			this._microphoneController = new MicrophoneController();

			this._microphoneController.on('ready', music=>{
				
				this._microphoneController.startRecorder();
			
			});

			this._microphoneController.on('recordtimer', timer => {

				this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);

			});

		});

		this.el.btnCancelMicrophone.on('click', e=>{

			this._microphoneController.stopRecorder();
			this.closeRecordMicrophone();

		});

		this.el.btnFinishMicrophone.on('click', e=>{

			this._microphoneController.stopRecorder();
			this.closeRecordMicrophone();

		});

		this.el.inputText.on('keypress', e=>{

			if (e.key === 'Enter' && !e.ctrlKey) 
			{

				e.preventDefault();
				this.el.btnSend.click();

			}

		});

		this.el.inputText.on('keyup', e=>{

			// verifica se existe algo escrito para esconder o placeholder
			if (this.el.inputText.innerHTML.length) 
			{

				// esconde o placeholder
				this.el.inputPlaceholder.hide();
				// esconde btn do microfone
				this.el.btnSendMicrophone.hide();
				// mostra o btn e enviar
				this.el.btnSend.show();

			} else {

				this.el.inputPlaceholder.show();
				this.el.btnSendMicrophone.show();
				this.el.btnSend.hide();
			}

		});

		this.el.btnSend.on('click', e=>{

			console.log(this.el.inputText.innerHTML);

		});

		this.el.btnEmojis.on('click', e=>{

			this.el.panelEmojis.toggleClass('open');

		});

		this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
			
			emoji.on('click', e=>{

				// clona tudo que estiver no método nativo do JS
				let img = this.el.imgEmojiDefault.cloneNode();

				img.style.cssText = emoji.style.cssText;
				img.dataset.unicode = emoji.dataset.unicode;
				img.alt = emoji.dataset.unicode;

				// colocando tds as classe do emoji na cópia
				emoji.classList.forEach(name=>{

					img.classList.add(name);

				});

				let cursor = window.getSelection();

				// verifica se o cursor n está focado em algum lugar ou n está sobre
				// o campo de escrita de msg
				if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') 
				{

					this.el.inputText.focus();
					cursor = window.getSelection();

				}

				// método que cria intervalos de seleção do cursor=>seleção de vários
				// caracters com mouse
				let range = document.createRange();

				range = cursor.getRangeAt(0);

				// se o user selecionar um range de char e clicar num emoji,
				// deletamos o conteúdo e trocamos os chars selecionados pelo emoji
				range.deleteContents();

				let frag = document.createDocumentFragment();

				frag.appendChild(img);

				range.insertNode(frag);

				// volta o cursor pro final da sentença
				range.setStartAfter(img);

				// dispatchEvent força um evento a acontecer de forma artificial
				this.el.inputText.dispatchEvent(new Event('keyup'));

			});

		});


	}

	closeRecordMicrophone()
	{

		this.el.recordMicrophone.hide();
		this.el.btnSendMicrophone.show();

	}

	closeAllMainPanel()
	{

		this.el.panelMessagesContainer.hide();
		this.el.panelDocumentPreview.removeClass('open');
		this.el.panelCamera.removeClass('open');

	}

	closeMenuAttach(event)
	{

		document.removeEventListener('click', this.closeMenuAttach);
		this.el.menuAttach.removeClass('open');

	}

	// método para esconder os paines que estejam acima do escolhido atualmente
	// ,ou seja, modificar o css z-index do elemento HTML
	closeAllLeftPanel() 
	{

		this.el.panelAddContact.hide();
		this.el.panelEditProfile.hide();

	};

	loadElements()
	{

		// recebe os elementos
		this.el = {};

		document.querySelectorAll('[id]').forEach(element => {

			// recebe os id's e coloca o nome em camelCase criando atributos para cada um deles
			this.el[Format.getCamelCase(element.id)] = element;

		});

	}

	elementsPrototype()
	{

		// não se usa uma arrow function para fechar o escopo da função
		// qquer elemento que tiver o '.hide' será ocultado
		Element.prototype.hide = function(argument)
		{
			this.style.display = 'none';
			return this;
		};

		Element.prototype.show = function(argument)
		{
			this.style.display = 'block';
			return this;
		};

		Element.prototype.toggle = function(argument)
		{
			this.style.display = (this.style.display === 'none') ? 'block' : 'none';
			return this;
		};

		// função para múltiplos eventos. Eles serão enviados no events como string separados por ' '...
		Element.prototype.on = function(events, fn)
		{
			// ...serapamos por esse ' ', transformando num array, e aplicamos um forEach para cada
			// evento encontrado
			events.split(' ').forEach(event => {
				
				// arrow func não muda escopo, ou seja, o this aqui se refere ao elemento do prototype
				this.addEventListener(event, fn);
			});

			return this;

		};

		Element.prototype.css = function(styles)
		{
			
			for (let name in styles) 
			{
				
				this.style[name] = styles[name];

			}

			return this;

		};

		Element.prototype.addClass = function(name)
		{
			this.classList.add(name);
			return this;
		};

		Element.prototype.removeClass = function(name)
		{
			this.classList.remove(name);
			return this;
		};

		Element.prototype.toggleClass = function(name)
		{
			this.classList.toggle(name);
			return this;
		};

		Element.prototype.hasClass = function(name)
		{
			return this.classList.contains(name);
		};

		HTMLFormElement.prototype.getForm = function()
		{
			return new FormData(this);
		};

		HTMLFormElement.prototype.toJSON = function()
		{
			let json = {};

			this.getForm().forEach((value, key)=>{

				json[key] = key;

			});

			return json;
		};

	}

}