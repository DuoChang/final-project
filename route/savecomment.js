const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();
const moment = require('moment');

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

express_router.post('/checktype/checktoken/checkuserexpire/api/order/savecomment',(req,res)=>{

	let query_masterid = 'SELECT masterid FROM orders WHERE indexid=' + req.body.orderid;

	mysql.con.query( query_masterid ,(err,result)=>{

		if( err || result.length == 0 ){

			res.send("{\"message\": \"no result\"}");

		}else{

			let commentdate = moment().format('YYYY-MM-DD');

			let insert_new_comment = 'INSERT INTO comments SET ?';

			let comment_details = {
				content:req.body.content,
				orderid:req.body.orderid,
				heartrate:req.body.heartrate,
				commentdate:commentdate,
				username:req.username,
				masterid:result[0].masterid
			}

			mysql.con.query( insert_new_comment , comment_details ,(err,result)=>{

				if( err ){

					res.send("{\"message\": \"no result\"}");

				}else{

					res.send("{\"data\": \"Update success\"}");

				}

			})

		}

	})

})

module.exports = express_router;