const mysql=require("../util/mysqlcon.js");
const createtoken=require("../util/createtoken.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/api/user/signin',(req,res)=>{

	console.log(req.body);

			/*--Check if http header content is correct--*/

	if( req.header('Content-Type') != "application/json" ){

		res.send("{\"error\": \"Invalid request body.\"}");	

	}else{

		if( req.body.provider == "customer" ){

						/*--確認註冊過--*/
			
			mysql.con.query( 'SELECT phone,password FROM user WHERE phone=\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' ,(err,result)=>{

				if( err || result.length ===0 ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let customertokentosave = createtoken(req.body.phone);

					mysql.con.query( 'Update user SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' , customertokentosave , (err,result)=>{

						if( err || result.length ===0 ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

							let userdata = {};
							userdata.access_token = customertokentosave.access_token;
							userdata.access_expired = customertokentosave.access_expired;
							userdata.provider = 'customer';


							let usertotalres = {};
							usertotalres.data = userdata;
							res.json(usertotalres);

						}

					})
				
				}
			
			});

		}else if( req.body.provider == "master" ){

						/*--確認註冊過--*/
			
			mysql.con.query( 'SELECT masterid,email,phone,password FROM master WHERE phone=\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' ,(err,result)=>{

				if( err || result.length ===0 ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					/*--確認帳號已啟用--*/

					let querycheckmail = "SELECT status FROM mailstatus WHERE email=\"" + result[0].email + "\"";

					console.log(querycheckmail);

					mysql.con.query(querycheckmail,(err,result)=>{

						if( err || result.length ===0 ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else if( result[0].status == 'active'){

							let techniciantokentosave = createtoken(req.body.phone);

							mysql.con.query('Update master SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + req.body.password + '\"' , techniciantokentosave , (err,result)=>{

								if( err || result.length ===0 ){

									res.send("{\"error\": \"Invalid token.\"}");

								}else{

									let techniciandata = {};
									techniciandata.access_token = techniciantokentosave.access_token;
									techniciandata.access_expired = techniciantokentosave.access_expired;
									techniciandata.provider = 'master';

									let techniciantotalres = {};
									techniciantotalres.data = techniciandata;
									res.json(techniciantotalres);

								}

							})
																

						}else{

							res.send("{\"message\": \"Account not active\"}");

						}

					})
				
				}
			
			});

		}

	}

})

module.exports = expressrouter;