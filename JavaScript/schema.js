'use strict';

const path = require('path');
const fs = require('fs');

const entities = new Map();

const loadEntity = (schemaPath, name) => {
	const filePath = schemaPath + name;
	const key = path.basename(filePath, '.js');
	try {
		const libPath = require.resolve(filePath);
		delete require.cache[libPath];
	} catch (error) {
		return;
	}
	try {
		const entity = require(filePath);
		entities.set(key, entity);
	} catch (error) {
		entities.delete(key);
	}
};

const schema = {};

schema.load = schemaPath => {
	fs.readdir(schemaPath, (err, files) => {
		if (err) return;
		files.forEach(name => {
			loadEntity(schemaPath, name);
		});
	});
	return schema;
};

schema.get = name => entities.get(name);

module.exports = schema;
