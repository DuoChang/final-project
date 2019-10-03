const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const moment = require('moment');

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/api/order/savecomment',(req,res)=>{

	console.log(req.body);

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{

		console.log(456);

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT name,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				console.log('777');

				let username = result[0].name ;

				if( timenow > result[0].access_expired ){

					console.log('6868');

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					let querytechnicianid = 'SELECT masterid FROM orders WHERE indexid=' + req.body.orderid;

					mysql.con.query( querytechnicianid ,(err,result)=>{

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

				}			

			}

		})
	}	

})

module.exports = expressrouter;