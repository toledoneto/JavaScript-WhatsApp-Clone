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

			console.log('photo');

		});

		this.el.btnAttachCamera.on('click', e=>{

			console.log('camera');

		});

		this.el.btnAttachDocument.on('click', e=>{

			console.log('Document');

		});

		this.el.btnAttachContact.on('click', e=>{

			console.log('Contact');

		});

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