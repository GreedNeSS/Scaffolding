'use strict';

const fs = require('fs');

module.exports = async id => {
	const fileName = `./data/${parseInt(id)}.json`;
	try {
		const data = await fs.promises.readFile(fileName, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		return { error: 'file is not found' };
	}
};
