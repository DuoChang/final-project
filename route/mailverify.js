const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

expressrouter.get('/api/user/mailverify',(req,res)=>{

	let queryactivateemail = "UPDATE mailstatus SET status = \"active\" WHERE activecode =\"" + req.query.startfind + "\"";

	mysql.con.query( queryactivateemail ,(err,result)=>{

		if( err ){

			res.redirect( '/user/verify/fail' );

		}else{
							
			res.redirect( '/user/verify' );

		}
		
	})

})

module.exports = expressrouter;