// Required modules
const bluebird			= require('bluebird');
const express				= require('express');
const sql						= require('mssql');
const readlineSync	= require('readline-sync');

// Create our express app
const app = express();
app.use(express.static('./public'));
app.use(express.static('../dist'));

// Configure sql
sql.Promise = bluebird;
const config = {
	server: 'dsql2k12.caesad.uga.edu',
	domain: readlineSync.question('SQL Domain: '),
	user: readlineSync.question('SQL user: '),
	password: readlineSync.question('SQL password: ', {
		hideEchoBack: true
	}),
	parseJSON: true
};
const injectionTest = /^[a-z0-9_]+$/i;

sql.connect(config, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	} else {
		console.log('Connected to mssql server!');
	}
});

const sendFailure = (res) => {
	res.json({ success: false });
};

app.get('/api/:db/:table/:selector?/:value?', (req, res) => {
	console.log(req.url);
	// Get url params
	const db = req.params.db;
	const table = req.params.table;
	const selector = req.params.selector || null;
	const value = req.params.value || null;

	// Test db, table, and selector for SQL injection
	let passedInjectionTest = injectionTest.test(db) && injectionTest.test(table) && injectionTest.test(selector);

	if (passedInjectionTest && (!selector || (selector && value))) {
		const request = new sql.Request();
		let query = 'SELECT * FROM ' + db + '.dbo.' + table;
		if (selector) {
			request.input('input_selector', selector);
			request.input('input_value', value);
			query += ' WHERE ' + selector + ' IN (@input_value)';
		}
		console.log(query);
		request.query(query, (err, result) => {
			if (err) console.error(err);
			if (err && !result) {
				sendFailure(res);
			} else {
				res.json({
					success: true,
					results: result.recordset
				});
			}
		});
	} else {
		sendFailure(res);
	}
});

app.get(/.*/, (req, res) => {
	sendFailure(res);
});

app.listen(3000, () => {
	console.log('listening on 3000');
});

sql.on('error', (err) => {
	console.log(err);
});
