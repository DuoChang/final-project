const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

expressrouter.get('/checktoken/checkuserexpire/api/quote/reject' ,(req,res)=>{

	if( req.query.orderid ){

		let rejectorderquery = 'UPDATE orders SET status=\"rejected\" WHERE indexid=' + req.query.orderid ;

		mysql.con.query( rejectorderquery , (err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else{

				res.send("{\"data\": \"okay\"}");
			}

		} )

	}else{

		res.send("{\"error\": \"Invalid request query.\"}");
	
	}

})

module.exports = expressrouter;