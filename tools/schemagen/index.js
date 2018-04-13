// Required modules
const bluebird			= require('bluebird');
const fs						= require('fs');
const path					= require('path');
const readlineSync	= require('readline-sync');
const sql						= require('mssql');

// Global vars
const outputPath = path.join(__dirname, 'schemas');

const config = require('./config.js');

if (!config) {
	console.log('No config found!');
	process.exit(1);
}

const getData = () => {
	if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

	config.forEach((item, i) => {
		let dbPath = path.join(outputPath, item.database.toLowerCase());
		if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);
		item.tables.forEach((table, j) => {
			const request = new sql.Request();
			request.input('table_name', table);
			let query = `
			SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
			FROM ` + item.database + `.INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_NAME = @table_name
			ORDER BY ORDINAL_POSITION
			`;
			request.query(query, (err, result) => {
				if (err) console.error(err);
				if (result) {
					const schemaPath = path.join(dbPath, table.toLowerCase() + '.js');
					const columns = [];
					result.recordset.forEach((record, k) => {
						const column = {
							columnName: record.COLUMN_NAME,
							type: record.DATA_TYPE
						};
						if (record.IS_NULLABLE === 'NO') column.required = true;
						columns.push(column);
						if (k === result.recordset.length - 1) {
							console.log('Writing ' + item.database + '.dbo.' + table + ' schema');
							const schema = {
								database: item.database,
								table,
								columns
							};
							let schemaString = JSON.stringify(schema, null, 2);
							schemaString = schemaString.replace(/"/g, '\'').replace(/'([^']+)':/g, '$1:').replace(/ {2}/g, '\t');
							schemaString = 'const schema = ' + schemaString + ';\n\nexport default schema;\n';
							fs.writeFileSync(schemaPath, schemaString);
						}
						if (i === config.length - 1 && j === item.tables.length - 1 && k === result.recordset.length - 1) {
							console.log('Done!');
							sql.close();
						}
					});
				}
			});
		});
	});
};

sql.Promise = bluebird;
const sqlConfig = {
	server: 'dsql2k12.caesad.uga.edu',
	domain: readlineSync.question('SQL Domain: '),
	user: readlineSync.question('SQL User: '),
	password: readlineSync.question('SQL Password: ', {
		hideEchoBack: true
	}),
	parseJSON: true
};
sql.connect(sqlConfig, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	} else {
		console.log('Connected to mssql server!');
		getData();
	}
});
