const prepareForCf = require('./src/modules/prepareForCf');

const myObj = {
	report: {
		main: {
			one: null,
			two: 'three',
			four: 5,
			six: [
				7,
				8,
				9
			]
		},
		other: [
			{
				value: null,
				types: [
					'one',
					'two'
				]
			}
		]
	},
	sub: {
		contacts: [
			{
				typeID: null,
				name: null
			}
		]
	}
};

console.log(JSON.stringify(prepareForCf(myObj), null, 4));
