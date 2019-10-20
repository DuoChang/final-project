const mysql=require("../util/mysqlcon.js");
const create_token=require("../util/createtoken.js");
const create_password_token=require("../util/createpasswordtoken.js");
const express = require('express');
const express_router = express.Router();

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

express_router.post('/checktype/api/user/signin',(req,res)=>{

	if( req.body.provider == "customer" ){		

					/*--確認註冊過--*/

		let password_token = create_password_token(req.body.password) ;

		mysql.con.query( 'SELECT phone,password FROM user WHERE phone=\"' + req.body.phone + '\" AND password = \"' + password_token + '\"' ,(err,result)=>{

			if( err || result.length ===0 ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else{

				let customer_token_save = create_token(req.body.phone);

				mysql.con.query( 'Update user SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + password_token + '\"' , customer_token_save , (err,result)=>{

					if( err || result.length ===0 ){

						res.send("{\"error\": \"Invalid token.\"}");

					}else{

						let user_data = {};
						user_data.access_token = customer_token_save.access_token;
						user_data.access_expired = customer_token_save.access_expired;
						user_data.provider = 'customer';


						let user_total_res = {};
						user_total_res.data = user_data;
						res.json(user_total_res);

					}

				})
			
			}
		
		});

	}else if( req.body.provider == "master" ){

		let password_token = create_password_token( req.body.password ) ;

					/*--確認註冊過--*/
		
		mysql.con.query( 'SELECT masterid,email,phone,password FROM master WHERE phone=\"' + req.body.phone + '\" AND password = \"' + password_token + '\"' ,(err,result)=>{

			if( err || result.length ===0 ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else{

				/*--確認帳號已啟用--*/

				let query_check_mail = "SELECT status FROM mailstatus WHERE email=\"" + result[0].email + "\"";

				mysql.con.query(query_check_mail,(err,result)=>{

					if( err || result.length ===0 ){

						res.send("{\"error\": \"Invalid token.\"}");

					}else if( result[0].status == 'active'){

						let master_token_save = create_token(req.body.phone);

						mysql.con.query('Update master SET ? WHERE phone =\"' + req.body.phone + '\" AND password = \"' + password_token + '\"' , master_token_save , (err,result)=>{

							if( err || result.length ===0 ){

								res.send("{\"error\": \"Invalid token.\"}");

							}else{

								let master_data = {};
								master_data.access_token = master_token_save.access_token;
								master_data.access_expired = master_token_save.access_expired;
								master_data.provider = 'master';

								let master_total_res = {};
								master_total_res.data = master_data;
								res.json(master_total_res);

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

module.exports = express_router;