// MySQL Initialization
const mysql=require("mysql");
require('dotenv').config();
const assignmentsql = mysql.createPool({

	connectionlimit:10,
	host:process.env.DB_HOST,
	user:process.env.DB_USER,
	password:process.env.DB_PASS,
	database:'ppj',
	waitForConnections:true

});

module.exports={
	core:mysql,
	con:assignmentsql
};