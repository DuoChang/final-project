const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const crypto = require('crypto');

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));


expressrouter.get('/api/quote/reject' ,(req,res)=>{

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid Token.\"}");
	}else{

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid Token.\"}");
			
			}else{

				let userid = result[0].userid ;

				if( timenow > result[0].access_expired ){

					res.send("{\"error\": \"Invalid token.\"}");
				
				}else{

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

				}

			}

		})

	}

})

module.exports = expressrouter;