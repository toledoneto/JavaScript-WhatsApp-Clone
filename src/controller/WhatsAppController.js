class WhatsAppController
{

	constructor()
	{

		this.elementsPrototype();

		// metodo para carregar os 75 ids principais do projeto
		// e transformar em camelCase cada um deles para uso posterior
		this.loadElements();

		// método para inciar todos os eventos criados
		this.initEvents();

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

		});

		this.el.btnClosePanelCamera.on('click', e=>{

			this.el.panelCamera.removeClass('open');
			this.el.panelMessagesContainer.show();

		});

		this.el.btnTakePicture.on('click', e=>{

			console.log('take picture');

		});

		this.el.btnAttachDocument.on('click', e=>{

			this.closeAllMainPanel();
			this.el.panelDocumentPreview.addClass('open');
			this.el.panelDocumentPreview.css({

				'height':'calc(100% - 120px)'

			});

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
			this.startRecordMicrophoneTime();

		});

		this.el.btnCancelMicrophone.on('click', e=>{

			this.closeRecordMicrophone();

		});

		this.el.btnFinishMicrophone.on('click', e=>{

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

				// colocando no lugar de entrada de mgs
				this.el.inputText.appendChild(img);

				// dispatchEvent força um evento a acontecer de forma artificial
				this.el.inputText.dispatchEvent(new Event('keyup'));

			});

		});


	}

	startRecordMicrophoneTime()
	{

		let start = Date.now();

		this._recordMicrophoneInterval = setInterval(() =>{

			this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);

		}, 100);

	}

	closeRecordMicrophone()
	{

		this.el.recordMicrophone.hide();
		this.el.btnSendMicrophone.show();
		clearInterval(this._recordMicrophoneInterval);

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