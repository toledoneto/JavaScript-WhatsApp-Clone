import {Format} from './../util/Format';
import {CameraController} from './CameraController';
import {MicrophoneController} from './MicrophoneController';
import {DocumentPreviewController} from './DocumentPreviewController';
import {Firebase} from './../util/Firebase';
import {User} from './../model/User';
import {Chat} from './../model/Chat';
import {Message} from './../model/Message';

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
			
			this._user = new User(response.user.email);

			this._user.on('datachange', data => {

				// colocando o nome do User na aba
				document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';

				// verificando se o user tem nome para colocá-lo na tela
				this.el.inputNamePanelEditProfile.innerHTML = data.name;

				// verificando se o user tem uma foto para colocá-la na tela
				if (data.photo) 
				{

					// foto grande no perfil
					let photo = this.el.imgPanelEditProfile;
					photo.src = data.photo;
					photo.show();
					// apaga a foto padrão de user sem foto
					this.el.imgDefaultPanelEditProfile.hide();

					// foto pequena no topo da tela
					let photo2 = this.el.myPhoto.querySelector('img');
					photo2.src = data.photo;
					photo2.show();

				}

				this.initContacts();

			});

			// recebendo os dados da solução da promessa acima caso bem sucedida
			this._user.name = response.user.displayName;
			this._user.email = response.user.email;
			this._user.photo = response.user.photoURL;

			// salvando no BD
			this._user.save().then(() => {

				// a tela de conversa do app só volta a aprecer após estar no firebase
				this.el.appContent.css({
					display:'flex'

				});

			});
			// .catch(err => {


			// });

			

		}).catch(err => {
			console.log('err', err);
		});

	}

	initContacts()
	{

		this._user.on('contactschange', docs => {

			// zera a lista de contatos
			this.el.contactsMessagesList.innerHTML = '';

			docs.forEach(doc => {

				// extrai os dados do doc
				let contact = doc.data();
				
				let div = document.createElement('div');

				div.className = 'contact-item';

				div.innerHTML = `
		            <div class="dIyEr">
		                <div class="_1WliW" style="height: 49px; width: 49px;">
		                    <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
		                    <div class="_3ZW2E">
		                        <span data-icon="default-user" class="">
		                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
		                                <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
		                                <g fill="#FFF">
		                                    <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
		                                </g>
		                            </svg>
		                        </span>
		                    </div>
		                </div>
		            </div>
		            <div class="_3j7s9">
		                <div class="_2FBdJ">
		                    <div class="_25Ooe">
		                        <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
		                    </div>
		                    <div class="_3Bxar">
		                        <span class="_3T2VG">${contact.lastMessageTime}</span>
		                    </div>
		                </div>
		                <div class="_1AwDx">
		                    <div class="_itDl">
		                        <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>

		                        <span class="_2_LEW last-message">
		                            <div class="_1VfKB">
		                                <span data-icon="status-dblcheck" class="">
		                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
		                                        <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
		                                    </svg>
		                                </span>
		                            </div>
		                            <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
		                            <div class="_3Bxar">
		                                <span>
		                                    <div class="_15G96">
		                                        <span class="OUeyt messages-count-new" style="display:none;">1</span>
		                                    </div>
		                            </span></div>
		                            </span>
		                    </div>
		                </div>
		            </div>
				`;

				// verificando se o contato tem username e foto disponível
				if (contact.photo) 
				{

					let img = div.querySelector('.photo');
					img.src = contact.photo;
					img.show();

				}

				// ao clicar numa conversa, abre-se a tela de bate-papo
				div.on('click', e =>{

					this.setActiveChat(contact);

				});

				// coloca o elemento na tela
				this.el.contactsMessagesList.appendChild(div);

			});

		});

		this._user.getContacts();

	}

	// ativa o painel de contato para o user
	setActiveChat(contact)	
	{

		// fecha todos os listeners que não forem da coversa ativa na tela no momento
		if (this._contactActive) 
		{

			Message.getRef(this._contactActive.chatId).onSnapshot(() => {});

		}

		// verificando qual contato está na conversa ativa naquele momento
		this._contactActive = contact;

		this.el.activeName.innerHTML = contact.name;
		this.el.activeStatus.innerHTML = contact.status;

		if(contact.photo)
		{
			let img = this.el.activePhoto
			img.src = contact.photo;
			img.show();
		}

		this.el.home.hide();
		this.el.main.css({
			display: 'flex'
		});

		this.el.panelMessagesContainer.innerHTML = '';

		Message.getRef(this._contactActive.chatId).orderBy('timeStamp')
		.onSnapshot(docs => {

			// var para ver se o scroll está no topo
			let scrollTop = this.el.panelMessagesContainer.scrollTop;

			// limite que o scroll pode atingir
			let scrollTopMax = (this.el.panelMessagesContainer.scrollHeight -
							    this.el.panelMessagesContainer.offsetHeight);

			// var boleana que indica true se o scroll estiver na posição
			// mais baixa da tela, sendo assim ela tem que descer com nova msg
			let autoScroll = (scrollTop >= scrollTopMax);

			docs.forEach(doc => {
				
				let data = doc.data();
				data.id = doc.id;

				// se o primeiro índice do id for um número, colocamos em UNICODE
				// if (typeof parseInt(data.id[0]) === 'number') 
				// {

				// 	data.id = '\\3'+data.id;

				// }
				
				let message = new Message();

				message.fromJSON(data);

				// verifica se a msg com o id abaixo já não está na tela para não
				// fica apagando tds as msg e colocando-as novamente
				if (!this.el.panelMessagesContainer.querySelector('#_' + data.id)) 
				{

					// descobrir se a msg foi enviada ou recbida por mim
					let me = (data.from === this._user.email);

					let view = message.getViewElement(me);

					// coloca a msg na tela de conversa
					this.el.panelMessagesContainer.appendChild(view);

				} else {
					// caso a msg já esteja na tela mas houme mudança de status

					let msgEl = this.el.panelMessagesContainer.querySelector('#_' + data.id);

					msgEl.querySelector('.message-status').innerHTML = message.getStatusViewElement()
					.outerHTML;

				}

			});

			// precisa descer a tela? Ou seja, o scroll está 100% em baixo?
			if (autoScroll) 
			{
				
				this.el.panelMessagesContainer.scrollTop =
				(this.el.panelMessagesContainer.scrollHeight -
							    this.el.panelMessagesContainer.offsetHeight);

			} else {

				this.el.panelMessagesContainer.scrollTop = scrollTop;

			}

		});

	}

	initEvents()
	{

		this.el.inputSearchContacts.on('keyup', e => {

			if (this.el.inputSearchContacts.value.length > 0) 
			{
				this.el.inputSearchContactsPlaceholder.hide();
			} else {
				this.el.inputSearchContactsPlaceholder.show();
			}

			this._user.getContacts(this.el.inputSearchContacts.value);

		});

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

			this.el.btnSavePanelEditProfile.disabled = true;

			this._user.name = this.el.inputNamePanelEditProfile.innerHTML;

			this._user.save().then(() => {

				this.el.btnSavePanelEditProfile.disabled = false;

			});

		});

		this.el.formPanelAddContact.on('submit', e=>{

			e.preventDefault();

			// recebendo os dados do formulário de inserção de contato
			let formData = new FormData(this.el.formPanelAddContact);

			// novo contato que será add
			let contact = new User(formData.get('email'));

			contact.on('datachange', data => {

				// se o user existe
				if (data.name) 
				{

					// ao add uma conversa, cria o chat se ele n existe ainda
					Chat.createIfNotExists(this._user.email, contact.email).then(chat => {

						// cria o id da conversa
						contact.chatId = chat.id;

						// coloca o id da conversa no seu user
						this._user.chatId = chat.id;

						// coloca o id da conversa no user do outro através
						// do merge JSON de addContact
						contact.addContact(this._user)
						
						this._user.addContact(contact).then(() => {

						this.el.btnClosePanelAddContact.click();
						console.log('Contato foi adicionado com sucesso!');

						});

					});

					
				} else {
					console.error("Usuário não encontrado")
				}
			});

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

			// enviando a msg ao clicar no btn de envio
			Message.send(this._contactActive.chatId,
						 this._user.email,
						 'text',
						 this.el.inputText.innerHTML);

			// limpando o input text de msg
			this.el.inputText.innerHTML = '';
			// fecha o painel de emojis caso esteja aberto
			this.el.panelEmojis.removeClass('open');

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