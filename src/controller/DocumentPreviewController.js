export class DocumentPreviewController
{

	constructor(file)
	{

		this._file = file;

	}

	getPreviewData()
	{

		return new Promise((s, f) => {

			switch (this._file.type) 
			{

				case 'image/png':
				case 'image/jpeg':
				case 'image/jpg':
				case 'image/gif':
					let reader = new FileReader();
					
					// caso haja sucesso na promessa
					reader.onload = event => {

						s(reader.result);

					};

					// caso haja erro na promessa
					reader.onerror = event =>{

						f(event);

					};

					reader.readAsDataURL(this._file);
					break;
				case 'application/pdf':
					break;
				default:
					f();

			}

		});

	}

}