'use strict';

const h1 = document.createElement('h1');
h1.innerHTML = 'Input fields';
document.body.appendChild(h1);

const buidAPI = methods => {
	const api = {};
	for (const method of methods) {
		api[method] = (...args) => new Promise((resolve, reject) => {
			const url = `/api/${method}`;
			console.log(url, args);
			fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(args),
			}).then(res => {
				const { status } = res;
				if (status !== 200) {
					reject(new Error(`Status Code: ${status}`));
					h1.innerHTML = `Status Code: ${status}`;
					return;
				}
				h1.innerHTML = 'Input fields';
				resolve(res.json());
			}).catch(err => {
				console.log(err);
				h1.innerHTML = `${err}`;
				return null;
			});
		});
	}
	return api;
};

const api = buidAPI(['entity', 'read', 'update']);

const createForm = async (entity, id) => {
	const schema = await api.entity(entity);
	console.log({ schema });
	const instance = await api.read(id);
	const form = document.createElement('div');
	const inputs = {};
	for (const field in schema) {
		const definition = schema[field];
		const input = document.createElement('input');
		input.setAttribute('id', field);
		if (definition.control === 'password') {
			input.setAttribute('type', 'password');
		}
		input.value = instance[field] || 'field is empty';
		inputs[field] = input;
		const label = document.createElement('label');
		label.innerHTML = field;
		label.setAttribute('for', field);
		const br = document.createElement('br');
		form.appendChild(label);
		form.appendChild(input);
		form.appendChild(br);
	}
	const button = document.createElement('button');
	button.innerHTML = 'Save';
	button.onclick = async () => {
		const data = {};
		for (const field in schema) {
			data[field] = inputs[field].value;
		}
		api.update(id, data, entity);
	};
	form.appendChild(button);
	document.body.appendChild(form);
};

// createForm('sensor', 2000);
createForm('user', 1000);
