const mysql=require("../util/mysqlcon.js");
const change_date_type=require("../util/changedatetype.js");
const express = require('express');
const express_router = express.Router();

express_router.get('/checktoken/checkuserexpire/api/getcomment',(req,res)=>{

	if( req.query.masterid ){

		let query_master_comments = "SELECT * FROM comments WHERE masterid=" + req.query.masterid + " ORDER BY commentdate DESC" ;
	
		mysql.con.query( query_master_comments ,(err,result)=>{

			if( err ){

				res.send("{\"message\": \"Invalid query\"}");

			}else{

				result = change_date_type( result );

				let master_comments = {};
				master_comments.data = result;

				res.send(master_comments);


			}									

		})

	}else if( req.query.orderid ){

		let query_order_comment = "SELECT * FROM comments WHERE orderid=" + req.query.orderid ;

		mysql.con.query( query_order_comment ,(err,result)=>{

			if( err ){

				res.send("{\"message\": \"Invalid query\"}");

			}else if( result.length == 0 ){

				res.send("{\"data\": \"empty\"}");

			}else{

				res.send("{\"data\": \"done\"}");

			}									

		})
	
	}else{

		res.send("{\"message\": \"Invalid query\"}");

	}

})

module.exports = express_router;