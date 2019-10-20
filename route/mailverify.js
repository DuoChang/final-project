const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();

express_router.get('/api/user/mailverify',(req,res)=>{

	let query_activate_email = "UPDATE mailstatus SET status = \"active\" WHERE activecode =\"" + req.query.startfind + "\"";

	mysql.con.query( query_activate_email ,(err,result)=>{

		if( err ){

			res.redirect( '../../mailverifyfail.html' );

		}else{
							
			res.redirect( '../../mailverify.html' );

		}
		
	})

})

module.exports = express_router;