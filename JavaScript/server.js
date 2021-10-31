'use strict';

const http = require('http');
const fs = require('fs');

require('./schema.js').load('./schema/');
const api = require('./api.js').load('./api/');

const receiveArgs = async req => {
	const buffer = [];
	for await (const chunk of req) buffer.push(chunk);
	const data = Buffer.concat(buffer).toString();
	return JSON.parse(data);
};

const httpError = (res, status, message) => {
	res.statusCode = status;
	res.end(`"${message}"`);
};

http.createServer(async (req, res) => {
	const url = req.url === '/' ? '/index.html' : req.url;
	const [first, second] = url.substring(1).split('/');
	if (first === 'api') {
		const method = api.get(second);
		const args = await receiveArgs(req);
		try {
			const result = await method(...args);
			if (!result) {
				httpError(res, 500, 'Server error');
				return;
			}
			res.end(JSON.stringify(result));
		} catch (error) {
			console.dir({ error });
			httpError(res, 500, 'Server error');
		}
	} else {
		const path = `./static/${first}`;
		try {
			const data = await fs.promises.readFile(path, 'utf8');
			res.end(data);
		} catch (error) {
			httpError(res, 404, 'File is not found');
		}
	}
}).listen(8000);
