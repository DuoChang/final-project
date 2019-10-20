const mysql=require("../util/mysqlcon.js");
const create_token=require("../util/createtoken.js");
const create_password_token=require("../util/createpasswordtoken.js");
const express = require('express');
const express_router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

const nodemailer = require('nodemailer');
require('dotenv').config();
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASS
  }
});

express_router.post('/checktype/api/user/signup',(req,res)=>{

	if( req.body.provider == "customer" ){

					/*--確認未註冊過--*/
		
		mysql.con.query( 'SELECT phone FROM user WHERE phone=\"' + req.body.phone + '\"' ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else if( result.length == 0 ){

				let token = create_token(req.body.phone);
				let password_token = create_password_token(req.body.password) ;

				/*--資料送入DB--*/

				let user_signup_data={
					access_token:token.access_token,
					access_expired:token.access_expired,
					name:req.body.name,
					phone:req.body.phone,
					password:password_token,
					address:req.body.address,
				};

				mysql.con.query( 'INSERT INTO user SET ?' , user_signup_data , (err,result)=>{

					if( err ){

						res.send("{\"error\": \"error\"}");

					}else{

						/*--選取資料送出--*/

						let query_user_data = "SELECT * FROM user WHERE phone=\"" + req.body.phone + "\"";

						mysql.con.query( query_user_data ,(err,result)=>{

							if( err ){

								res.send("{\"error\": \"error\"}");

							}else{

								let user_res = {};
								 user_res.userid = result[0].userid;
								 user_res.name = result[0].name;
								 user_res.phone = result[0].phone;
								 user_res.address = result[0].address;

								let user_data = {};
								user_data.access_token = result[0].access_token;
								user_data.access_expired = result[0].access_expired;
								user_data.user = user_res;

								let user_total_res = {};
								user_total_res.data = user_data;
								res.json(user_total_res);

							}

						})

					}

				});				

			}else{

				res.send("{\"error\": \"error\"}");

			}
		
		});

	}else if( req.body.provider == "master" ){

					/*--確認未註冊過--*/
		
		mysql.con.query( 'SELECT phone FROM master WHERE phone=\"' + req.body.phone + '\"' ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"error\"}");

			}else if( result.length == 0 ){

				/*--新增 Stripe 帳戶--*/

				stripe.accounts.create({
				  country: 'US',
				  type: 'custom',
				  requested_capabilities: ['card_payments', 'transfers']
				}).then(function(acct) {

				  	// asynchronously called

				  	/*--存 master 基本資料--*/

				  	let password_token = create_password_token(req.body.password) ;

					let master_signup_data = {

						access_token:'wait for verify',
						access_expired:'wait for verify',
						name:req.body.name,
						phone:req.body.phone,
						email:req.body.email,
						password:password_token,
						account:acct.id
					
					};

					mysql.con.query( 'INSERT INTO master SET ?' , master_signup_data , (err,result)=>{

						if( err ){

							res.send("{\"error\": \"error\"}");

						}else{

							mysql.con.query('SELECT masterid FROM master WHERE phone=\"' + req.body.phone + '\"',(err,result)=>{

								if( err ){

									res.send("{\"error\": \"error\"}");

								}else{

									/*--存 master skill 資料--*/

									let insert_master_skill = {
									
										masterid : result[0].masterid
									
									}

									let skill_size = req.body.skill.length;

									let skill_array = [];

									for( let i = 0 ; i < skill_size ; i += 1){

										insert_master_skill[req.body.skill[i]] = 1 ;

									}

									mysql.con.query( 'INSERT INTO masterskill SET ?', insert_master_skill ,(err,result)=>{

										if( err ){

											res.send("{\"error\": \"error\"}");

										}

									})

									/*--存 master area 資料--*/

									let area_size = req.body.area.length;

									let area_array = [];

									for( let i = 0 ; i < area_size ; i += 1){

										area_array[i] = '(' + result[0].masterid + ',\"' + req.body.area[i] + '\")' ;

									}

									mysql.con.query( 'INSERT INTO masterarea(masterid,area) VALUES ' + area_array.toString(), (err,result)=>{

										if( err ){

											res.send("{\"error\": \"error\"}");

										}else{

											/*--存 master 驗證資料--*/

											let mail_verify_token = create_token(req.body.phone);

											let mail_status = {
												email: req.body.email,
												activecode: mail_verify_token.access_token,
												status: 'inactive'
											};

											mysql.con.query( 'INSERT INTO mailstatus SET ?' , mail_status , (err,result)=>{

												if( err ){

													res.send("{\"error\": \"error\"}");

												}else{

													mailTransport.sendMail({
																  
													  from: '<deathscythe.ms98@g2.nctu.edu.tw>',
													  
													  to: req.body.email,
													  
													  subject: '在 Find 師傅驗證您的 email ',
													  
													  html: '<p>您好<br>請點選如下連結驗證您的信箱<br><a href=\"https://g777708.com/api/user/mailverify?startfind=' + mail_verify_token.access_token + '\">驗證信箱</a></p>'


													}, function(err){
													
													  if(err) {
													
													    console.log('Unable to send email: ' + err);
													
													  }
													
													});

													res.send("{\"data\": \"已寄信 & 註冊資料OK\"}");

												}

											});

										}

									})

								}

							})

						}

					});
				
				}).catch(err=>{

					console.log(err);

					return res.send("{\"message\": \"error\"}");

				})

			}else{

				res.send("{\"error\": \"error\"}");
			
			}
		
		});

	}

})

module.exports = express_router;