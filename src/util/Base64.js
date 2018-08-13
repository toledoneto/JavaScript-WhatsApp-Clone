export class Base64 
{

	static getMimeType(urlBase64)
	{

		// encontrando o mime type e o base64 da foto da cam com uso de 
		// expressões regulares
		let regex = /^data:(.+);base64,(.*)$/;
		let result = urlBase64.match(regex);
		return result[1];

	}

	static toFile(urlBase64)
	{

		let mimeType = Base64.getMimeType(urlBase64);
		let ext = mimeType.split('/')[1];
		let filename = `file${Date.now()}.${ext}`;

		return fetch(urlBase64)
			.then(res => { return res.arrayBuffer(); })
			.then(buffer =>{ return new File([buffer], filename, { type: mimeType });})
			
	}

}