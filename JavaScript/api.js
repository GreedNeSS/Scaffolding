'use strict';

const path = require('path');
const fs = require('fs');

const methods = new Map();

const loadMethod = (apiPath, name) => {
	const filePath = apiPath + name;
	const key = path.basename(filePath, '.js');
	try {
		const libPath = require.resolve(filePath);
		delete require.cache[libPath];
	} catch (error) {
		return;
	}
	try {
		const method = require(filePath);
		methods.set(key, method);
	} catch (error) {
		methods.delete(key);
	}
};

const api = {};

api.load = apiPath => {
	fs.readdir(apiPath, (err, files) => {
		if (err) return;
		files.forEach(name => {
			loadMethod(apiPath, name);
		});
	});
	return api;
};

api.get = name => methods.get(name);

module.exports = api;
