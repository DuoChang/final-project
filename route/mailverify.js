const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const crypto = require('crypto');

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.get('/api/user/mailverify',(req,res)=>{

	let queryactivate = "UPDATE mailstatus SET status = \"active\" WHERE activecode =\"" + req.query.startfind + "\"";

	mysql.con.query(queryactivate,(err,result)=>{

		if( err ){

			res.send("{\"error\": \"帳號啟動失敗\"}");

		}else{

			let querymasteremail = 'SELECT email FROM mailstatus WHERE activecode =\"' + req.query.startfind + '\"';

			mysql.con.query(querymasteremail,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"帳號啟動失敗\"}");

				}else{

					var masteremail = result[0].email;

					let tokenstring = req.body.phone + Date.now() + 'aaa';

					let hash = crypto.createHash('sha256');

					let usertoken = hash.update(tokenstring);

					let expiredtime = Date.now()+ 7.2e+6 ;

					let querytosavetoken = {access_token:hash.digest('hex'),access_expired:expiredtime};

					mysql.con.query("UPDATE master SET ? WHERE email=\"" + masteremail + "\"",querytosavetoken,(err,result)=>{

						if( err ){

							res.redirect( '/user/verify/fail' );

						}else{

							let querytoken = "SELECT access_token FROM master WHERE email =\"" + masteremail + "\"";

							mysql.con.query(querytoken,(err,result)=>{

								if( err ){

									res.send("{\"error\": \"帳號啟動失敗\"}");

								}else{
									
									res.redirect( '/user/verify' );

								}
							
							})

						}

					})

				}

			})

		}
		
	})

})

module.exports = expressrouter;