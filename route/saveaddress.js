const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/api/order/saveaddress',(req,res)=>{

	console.log(req.header('Authorization'));

	console.log(req.body);

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{

		console.log(456);

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if( err || result.length===0 || tokensplit[0] !="Bearer" ){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				console.log('777');

				if( timenow > result[0].access_expired ){

					console.log('6868');

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					let saveorderaddressquery = 'UPDATE orders SET address=\"' + req.body.address + '\" WHERE indexid=' + req.body.ordernumber;

					mysql.con.query( saveorderaddressquery ,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

							res.send("{\"data\": \"Update success\"}");

						}

					})

				}			

			}

		})
	}	

})

module.exports = expressrouter;