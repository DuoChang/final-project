const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

expressrouter.get('/api/user/mailverify',(req,res)=>{

	let queryactivateemail = "UPDATE mailstatus SET status = \"active\" WHERE activecode =\"" + req.query.startfind + "\"";

	mysql.con.query( queryactivateemail ,(err,result)=>{

		if( err ){

			res.redirect( 'mailverifyfail.html' );

		}else{
							
			res.redirect( 'mailverify.html' );

		}
		
	})

})

module.exports = expressrouter;