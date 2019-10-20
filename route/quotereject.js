const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();

express_router.get('/checktoken/checkuserexpire/api/quote/reject' ,(req,res)=>{

	if( req.query.orderid ){

		let reject_order_query = 'UPDATE orders SET status=\"rejected\" WHERE indexid=' + req.query.orderid ;

		mysql.con.query( reject_order_query , (err,result)=>{

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

module.exports = express_router;