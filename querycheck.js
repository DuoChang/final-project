const express = require('express');
const app = express();
const mysql=require("./util/mysqlcon.js");

app.use(express.static( __dirname + '/pages' ));
app.use(express.static( __dirname + '/uploads' ));

let query = 'SELECT ? FROM ? WHERE ? = ?';

let insert = ['phone','user','phone','09112233'];

mysql.con.query( query , insert ,(err,result)=>{

	if( err || result.length ===0 ){

		console.log("{\"error\": \"Invalid token.\"}");

	}else{

		console.log(result);

	}

})




app.listen(3000);