const mysql=require("../util/mysqlcon.js");
const datetype=require("../util/changedatetype.js");
const express = require('express');
const expressrouter = express.Router();
const crypto = require('crypto');

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));


expressrouter.get('/api/getcomment',(req,res)=>{

	if( !req.header('Authorization') || req.header('Authorization') == '' ){
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{
		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		var checkauthorization = "SELECT access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				if( timenow > result[0].access_expired ){

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					if( req.query.masterid ){

						let querycomments = "SELECT * FROM comments WHERE masterid=" + req.query.masterid + " ORDER BY commentdate DESC" ;
					
						mysql.con.query(querycomments,(err,result)=>{

							if( err ){

								res.send("{\"message\": \"Invalid query\"}");

							}else{

								console.log(result);

								result = datetype.changedatetype(result);

								let mastercomments = {};
								mastercomments.data = result;

								res.send(mastercomments);


							}									

						})

					}else if( req.query.orderid ){

						let querycommentexist = "SELECT * FROM comments WHERE orderid=" + req.query.orderid ;

						mysql.con.query(querycommentexist,(err,result)=>{

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

				}
			}
		})		
	}

})




module.exports = expressrouter;