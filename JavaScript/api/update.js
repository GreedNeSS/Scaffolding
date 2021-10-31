'use strict';

const schema = require('../schema.js');
const fs = require('fs');

module.exports = async (id, instance, entityName) => {
	const fileName = `./data/${parseInt(id)}.json`;
	const data = JSON.parse(JSON.stringify(instance));
	const entity = schema.get(entityName);
	let isValidForm = true;
	for (const field in entity) {
		const value = data[field];
		const fn = entity[field].validate;
		let isValid = true;
		if (fn) {
			isValid = fn(value);
			if (!isValid) {
				isValidForm = false;
			}
		}
		data[field] = value;
	}
	if (isValidForm) {
		await fs.promises.writeFile(fileName, JSON.stringify(data));
		return true;
	}
	return false;
};
