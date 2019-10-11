const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const moment = require('moment');

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/checktoken/checkuserexpire/api/order/savecomment',(req,res)=>{

	let querymasterid = 'SELECT masterid FROM orders WHERE indexid=' + req.body.orderid;

	mysql.con.query( querymasterid ,(err,result)=>{

		if( err || result.length == 0 ){

			res.send("{\"message\": \"no result\"}");

		}else{

			let commentdate = moment().format('YYYY-MM-DD');

			let insertnewcomment = 'INSERT INTO comments SET ?';

			let commentdetails = {
				content:req.body.content,
				orderid:req.body.orderid,
				heartrate:req.body.heartrate,
				commentdate:commentdate,
				username:username,
				masterid:result[0].masterid
			}

			mysql.con.query( insertnewcomment , commentdetails ,(err,result)=>{

				if( err ){

					res.send("{\"message\": \"no result\"}");

				}else{

					res.send("{\"data\": \"Update success\"}");

				}

			})

		}

	})

})

module.exports = expressrouter;