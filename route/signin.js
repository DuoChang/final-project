const mysql=require("../util/mysqlcon.js");
const createtoken=require("../util/createtoken.js");
const createpasswordtoken=require("../util/createpasswordtoken.js");
const express = require('express');
const expressrouter = express.Router();

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

expressrouter.post('/checktype/api/user/signin',(req,res)=>{

	if( req.body.provider == "customer" ){

		let passwordtoken = createpasswordtoken(req.body.phone) ;

					/*--確認註冊過--*/
		
		mysql.con.query( 'SELECT phone,password FROM user WHERE phone=\"' + req.body.phone + '\" AND password = \"' + passwordtoken + '\"' ,(err,result)=>{

			if( err || result.length ===0 ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else{

				let customertokentosave = createtoken(req.body.phone);

				mysql.con.query( 'Update user SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + passwordtoken + '\"' , customertokentosave , (err,result)=>{

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

		let passwordtoken = createpasswordtoken(req.body.phone) ;

					/*--確認註冊過--*/
		
		mysql.con.query( 'SELECT masterid,email,phone,password FROM master WHERE phone=\"' + req.body.phone + '\" AND password = \"' + passwordtoken + '\"' ,(err,result)=>{

			if( err || result.length ===0 ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else{

				/*--確認帳號已啟用--*/

				let querycheckmail = "SELECT status FROM mailstatus WHERE email=\"" + result[0].email + "\"";

				mysql.con.query(querycheckmail,(err,result)=>{

					if( err || result.length ===0 ){

						res.send("{\"error\": \"Invalid token.\"}");

					}else if( result[0].status == 'active'){

						let mastertokentosave = createtoken(req.body.phone);

						mysql.con.query('Update master SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + passwordtoken + '\"' , mastertokentosave , (err,result)=>{

							if( err || result.length ===0 ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								let masterdata = {};
								masterdata.access_token = mastertokentosave.access_token;
								masterdata.access_expired = mastertokentosave.access_expired;
								masterdata.provider = 'master';

								let mastertotalres = {};
								mastertotalres.data = masterdata;
								res.json(mastertotalres);

							}

						})
															

					}else{

						res.send("{\"message\": \"Account not active\"}");

					}

				})
			
			}
		
		});

	}

})

module.exports = expressrouter;